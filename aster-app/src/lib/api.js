// Leitura do banco (Firestore) pelo endereço público REST — as mesmas regras de leitura do site valem aqui.
const PROJETO = 'aster-9adab';
const CHAVE = 'AIzaSyBUi483K7vRuzFW8pKJdxp7K5j7pqTWfrA';
const BASE = 'https://firestore.googleapis.com/v1/projects/' + PROJETO + '/databases/(default)/documents';
const CABECALHO = { 'Content-Type': 'application/json', Referer: 'https://projetoaster.com.br/' };

export function decodificar(v) {
  if (!v || typeof v !== 'object') return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decodificar);
  if ('mapValue' in v) return decodificarCampos(v.mapValue.fields || {});
  return null;
}
export function decodificarCampos(campos) {
  const o = {};
  Object.keys(campos || {}).forEach(k => { o[k] = decodificar(campos[k]); });
  return o;
}
export function decodificarDoc(d) {
  const id = String(d.name || '').split('/').pop();
  return { id, ...decodificarCampos(d.fields || {}) };
}

async function pedir(url, opcoes) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(url, { ...opcoes, headers: CABECALHO, signal: ctl.signal });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error('Erro ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

// consulta simples: where = [[campo, '==', valor], ...]; campos = lista de campos a trazer (opcional)
export async function consultar(colecao, where, campos) {
  const filtros = (where || []).map(([campo, , valor]) => ({
    fieldFilter: { field: { fieldPath: campo }, op: 'EQUAL', value: { stringValue: valor } }
  }));
  const q = { from: [{ collectionId: colecao }] };
  if (filtros.length === 1) q.where = filtros[0];
  else if (filtros.length > 1) q.where = { compositeFilter: { op: 'AND', filters: filtros } };
  if (campos) q.select = { fields: campos.map(f => ({ fieldPath: f })) };
  const r = await pedir(BASE + ':runQuery?key=' + CHAVE, { method: 'POST', body: JSON.stringify({ structuredQuery: q }) });
  return (r || []).filter(x => x.document).map(x => decodificarDoc(x.document));
}

export async function lerDoc(colecao, id) {
  const d = await pedir(BASE + '/' + colecao + '/' + encodeURIComponent(id) + '?key=' + CHAVE, { method: 'GET' });
  return d ? decodificarDoc(d) : null;
}

const porOrdem = (a, b) => (a.ordem || 0) - (b.ordem || 0);
const porData = (a, b) => String(b.publicadaEm || b.criadoEm || '').localeCompare(String(a.publicadaEm || a.criadoEm || ''));
const CAMPOS_LISTA = ['titulo', 'resumo', 'categoria', 'autorNome', 'coautores', 'imagemUrl', 'status', 'edicao', 'ordemEdicao', 'criadoEm', 'publicadoEm'];

export async function listarColecao(nome) { return (await consultar(nome)).sort(porOrdem); }
export async function lerConfig() { try { return await lerDoc('configuracoes', 'geral'); } catch (e) { return null; } }

export async function edicoesPublicadas() {
  return (await consultar('edicoes', [['status', '==', 'publicada']])).sort(porData);
}

// Um artigo é público se publicado (sem edição, ou numa edição já publicada) ou indexado numa edição publicada.
export function artigoVisivel(n, mapaEdicoes) {
  const ed = n.edicao ? mapaEdicoes[n.edicao] : null;
  const edPub = !!(ed && ed.status === 'publicada');
  if (n.status === 'publicado') return !n.edicao || edPub;
  if (n.status === 'indexado') return edPub;
  return false;
}

export async function artigosPublicos(edicoes) {
  const mapa = {};
  (edicoes || await edicoesPublicadas()).forEach(e => { mapa[e.nome] = e; });
  const [a, b] = await Promise.all([
    consultar('noticias', [['status', '==', 'publicado']], CAMPOS_LISTA),
    consultar('noticias', [['status', '==', 'indexado']], CAMPOS_LISTA)
  ]);
  return a.concat(b).filter(n => artigoVisivel(n, mapa))
    .sort((x, y) => String(y.publicadoEm || y.criadoEm || '').localeCompare(String(x.publicadoEm || x.criadoEm || '')));
}

export async function artigosDaEdicao(ed) {
  const [a, b] = await Promise.all([
    consultar('noticias', [['edicao', '==', ed.nome], ['status', '==', 'publicado']], CAMPOS_LISTA),
    consultar('noticias', [['edicao', '==', ed.nome], ['status', '==', 'indexado']], CAMPOS_LISTA)
  ]);
  return a.concat(b).sort((x, y) => (x.ordemEdicao ?? 99) - (y.ordemEdicao ?? 99));
}

export async function lerArtigo(id) {
  const n = await lerDoc('noticias', id);
  if (!n || (n.status !== 'publicado' && n.status !== 'indexado')) return null;
  if (n.edicao) {
    const eds = await edicoesPublicadas();
    if (!eds.some(e => e.nome === n.edicao)) return null;
  }
  return n;
}

export async function lerEdicao(id) {
  const e = await lerDoc('edicoes', id);
  return e && e.status === 'publicada' ? e : null;
}
