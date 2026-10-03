// Projeto Aster – referências bíblicas: negrito automático no editor e popup de leitura no site
const LIVROS = [
['Gênesis','Genesis'],['Êxodo','Exodus'],['Levítico','Leviticus'],['Números','Numbers'],['Deuteronômio','Deuteronomy'],['Josué','Joshua'],['Juízes','Judges'],['Rute','Ruth'],
['1 Samuel','1 Samuel'],['2 Samuel','2 Samuel'],['1 Reis','1 Kings'],['2 Reis','2 Kings'],['1 Crônicas','1 Chronicles'],['2 Crônicas','2 Chronicles'],['Esdras','Ezra'],['Neemias','Nehemiah'],['Ester','Esther'],['Jó','Job'],
['Salmos','Psalms'],['Salmo','Psalms'],['Provérbios','Proverbs'],['Eclesiastes','Ecclesiastes'],['Cantares','Song of Solomon'],['Cântico dos Cânticos','Song of Solomon'],['Isaías','Isaiah'],['Jeremias','Jeremiah'],['Lamentações','Lamentations'],['Ezequiel','Ezekiel'],['Daniel','Daniel'],
['Oseias','Hosea'],['Joel','Joel'],['Amós','Amos'],['Obadias','Obadiah',1],['Jonas','Jonah'],['Miqueias','Micah'],['Naum','Nahum'],['Habacuque','Habakkuk'],['Sofonias','Zephaniah'],['Ageu','Haggai'],['Zacarias','Zechariah'],['Malaquias','Malachi'],
['Mateus','Matthew'],['Marcos','Mark'],['Lucas','Luke'],['João','John'],['Atos dos Apóstolos','Acts'],['Atos','Acts'],['Romanos','Romans'],['1 Coríntios','1 Corinthians'],['2 Coríntios','2 Corinthians'],['Gálatas','Galatians'],['Efésios','Ephesians'],['Filipenses','Philippians'],['Colossenses','Colossians'],
['1 Tessalonicenses','1 Thessalonians'],['2 Tessalonicenses','2 Thessalonians'],['1 Timóteo','1 Timothy'],['2 Timóteo','2 Timothy'],['Tito','Titus'],['Filemom','Philemon',1],['Hebreus','Hebrews'],['Tiago','James'],
['1 Pedro','1 Peter'],['2 Pedro','2 Peter'],['1 João','1 John'],['2 João','2 John',1],['3 João','3 John',1],['Judas','Jude',1],['Apocalipse','Revelation']
];
const sem = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const POR_NOME = {};
LIVROS.forEach(b => { POR_NOME[sem(b[0]).replace(/\s+/g,' ')] = b; });

function padraoNome(n) {
  const m = n.match(/^([123]) (.*)$/);
  const letras = s => sem(s).replace(/ /g, '\\s+')
    .replace(/a/g, '[aáàâã]').replace(/e/g, '[eéê]').replace(/i/g, '[ií]')
    .replace(/o/g, '[oóôõ]').replace(/u/g, '[uú]').replace(/c/g, '[cç]');
  return m ? m[1] + '\\s?[º°]?\\s?' + letras(m[2]) : letras(n);
}
const NOMES = LIVROS.map(b => b[0]).sort((a, b) => b.length - a.length).map(padraoNome).join('|');
export const REGEX_REF = () => new RegExp('(?<![\\p{L}\\d])(' + NOMES + ')\\s+(\\d{1,3})(?:\\s*[:.]\\s*(\\d{1,3})(?:\\s*[-–]\\s*(\\d{1,3}))?)?(?![\\p{L}\\d])', 'giu');

export const REGEX_EDICAO = () => new RegExp('(?<![\\p{L}\\d])edi[cç][aã]o\\s+(?:n[ºo°.]?\\s*)?(\\d{1,3})(?:\\.0)?(?![\\d]|\\.\\d)', 'giu');

export function interpretar(m) {
  const chave = sem(m[1]).replace(/^([123])\s?[ºo°]?\s?/, '$1 ').replace(/\s+/g, ' ');
  const livro = POR_NOME[chave];
  if (!livro) return null;
  let cap = +m[2], v1 = m[3] ? +m[3] : null, v2 = m[4] ? +m[4] : null;
  if (livro[2] && v1 == null) { v1 = cap; cap = 1; }
  const consulta = livro[1] + ' ' + cap + (v1 ? ':' + v1 + (v2 ? '-' + v2 : '') : '');
  const bonito = livro[0] + ' ' + cap + (v1 ? ':' + v1 + (v2 ? '-' + v2 : '') : '');
  return { consulta, bonito };
}

// ---------- EDITOR (Quill): deixa a referência em negrito ao terminar de digitar ----------
export function ativarAutoNegrito(quill) {
  quill.on('text-change', (delta, antigo, origem) => {
    if (origem !== 'user') return;
    const ultimo = delta.ops[delta.ops.length - 1];
    if (!ultimo || typeof ultimo.insert !== 'string' || !/[\s.,;:!?)\]]$/.test(ultimo.insert)) return;
    const sel = quill.getSelection(); if (!sel) return;
    const [linha, desloc] = quill.getLine(sel.index); if (!linha) return;
    const ini = sel.index - desloc, texto = quill.getText(ini, linha.length());
    const re = REGEX_REF(); let m;
    while ((m = re.exec(texto))) {
      const fim = m.index + m[0].length;
      if (fim >= desloc || !interpretar(m)) continue;
      const f = quill.getFormat(ini + m.index, m[0].length);
      if (!f.bold) quill.formatText(ini + m.index, m[0].length, 'bold', true, 'silent');
    }
    const re2 = REGEX_EDICAO(); let m2;
    while ((m2 = re2.exec(texto))) {
      if (m2.index + m2[0].length >= desloc) continue;
      if (!quill.getFormat(ini + m2.index, m2[0].length).bold) quill.formatText(ini + m2.index, m2[0].length, 'bold', true, 'silent');
    }
  });
}

// ---------- LEITURA: torna as referências clicáveis e mostra o texto ----------
let caixa;
function criarCaixa() {
  caixa = document.createElement('div');
  caixa.className = 'ref-caixa';
  caixa.innerHTML = '<div class="ref-fundo"></div><div class="ref-painel"><button class="ref-fechar" aria-label="Fechar">×</button><h4 class="ref-titulo"></h4><div class="ref-texto"></div><a class="ref-abrir" href="biblia.html">Abrir a Bíblia →</a></div>';
  document.body.append(caixa);
  const fechar = () => caixa.classList.remove('aberta');
  caixa.querySelector('.ref-fundo').onclick = fechar;
  caixa.querySelector('.ref-fechar').onclick = fechar;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fechar(); });
}
async function abrir(ref) {
  if (!caixa) criarCaixa();
  const t = caixa.querySelector('.ref-texto');
  caixa.querySelector('.ref-titulo').textContent = ref.bonito + ' (Almeida)';
  t.textContent = 'Carregando…'; caixa.classList.add('aberta');
  const chave = 'aster_ref_' + ref.consulta;
  try {
    let d = sessionStorage.getItem(chave); d = d ? JSON.parse(d) : null;
    if (!d) {
      const r = await fetch('https://bible-api.com/' + ref.consulta.replace(/ /g, '+') + '?translation=almeida');
      if (!r.ok) throw 0; d = await r.json();
      try { sessionStorage.setItem(chave, JSON.stringify(d)); } catch (e) {}
    }
    t.textContent = '';
    (d.verses || []).forEach(v => {
      const p = document.createElement('p'), s = document.createElement('sup');
      s.textContent = v.verse + ' '; p.append(s, (v.text || '').trim()); t.append(p);
    });
    if (!t.firstChild) throw 0;
  } catch (e) { t.textContent = 'Não foi possível carregar este texto agora.'; }
}
async function abrirEdicao(numero) {
  try {
    const { db } = await import('./firebase-config.js');
    const fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const q = await fs.getDocs(fs.query(fs.collection(db, 'edicoes'), fs.where('numero', '==', numero), fs.where('status', '==', 'publicada')));
    if (q.empty) { alert('Esta edição ainda não está disponível.'); return; }
    location.href = 'edicao.html?id=' + encodeURIComponent(q.docs[0].id);
  } catch (e) { alert('Não foi possível abrir a edição agora.'); }
}
function marcarEdicoes(raiz) {
  const nos = [], w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { if (!w.currentNode.parentElement.closest('a,.ref-biblica,.ref-edicao')) nos.push(w.currentNode); }
  nos.forEach(no => {
    const texto = no.nodeValue, re = REGEX_EDICAO(); let m, ult = 0, frag = null;
    while ((m = re.exec(texto))) {
      frag = frag || document.createDocumentFragment();
      frag.append(texto.slice(ult, m.index));
      const b = document.createElement('strong'); b.className = 'ref-biblica ref-edicao'; b.tabIndex = 0; b.title = 'Abrir esta edição';
      const num = +m[1]; b.textContent = m[0]; b.onclick = () => abrirEdicao(num);
      b.onkeydown = ev => { if (ev.key === 'Enter') abrirEdicao(num); };
      frag.append(b); ult = m.index + m[0].length;
    }
    if (frag) { frag.append(texto.slice(ult)); no.replaceWith(frag); }
  });
}
export function marcarReferencias(raiz) {
  marcarEdicoes(raiz);
  const nos = [], w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { if (!w.currentNode.parentElement.closest('a,.ref-biblica')) nos.push(w.currentNode); }
  nos.forEach(no => {
    const texto = no.nodeValue, re = REGEX_REF(); let m, ult = 0, frag = null;
    while ((m = re.exec(texto))) {
      const ref = interpretar(m); if (!ref) continue;
      frag = frag || document.createDocumentFragment();
      frag.append(texto.slice(ult, m.index));
      const b = document.createElement('strong'); b.className = 'ref-biblica'; b.tabIndex = 0; b.title = 'Ver o texto';
      b.textContent = m[0]; b.onclick = () => abrir(ref);
      b.onkeydown = e => { if (e.key === 'Enter') abrir(ref); };
      frag.append(b); ult = m.index + m[0].length;
    }
    if (frag) { frag.append(texto.slice(ult)); no.replaceWith(frag); }
  });
}
