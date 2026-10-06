// Projeto Aster – conteúdo de EXEMPLO para testar o visual do site.
// Aparece SÓ enquanto não existir nenhuma edição publicada nem artigo publicado de verdade.
// Assim que você publicar o primeiro de verdade, todo o conteúdo de exemplo some sozinho.
import { db } from './firebase-config.js';
import { collection, getDocs, query, where, limit } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export const DEMO_ATIVO = true;        // ← troque para false para desligar o conteúdo de exemplo de vez
export const QTD_EDICOES = 10;         // quantas edições de exemplo
export const ARTIGOS_POR_EDICAO = 5;   // quantos artigos em cada edição

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CATS = [['fe', 'Fé'], ['oracao', 'Oração'], ['familia', 'Família'], ['esperanca', 'Esperança'], ['proposito', 'Propósito'], ['perdao', 'Perdão']];
const TEMAS = ['Fé e esperança', 'Família e lar', 'Oração na prática', 'Perdão e recomeço', 'Propósito de vida', 'Gratidão', 'Paz em tempos difíceis', 'Sabedoria', 'Servir ao próximo', 'Confiança em Deus'];
const AUTORES = [['Autor de Exemplo', 'editor-chefe'], ['Autora de Exemplo', 'colunista'], ['Colunista de Exemplo', 'colunista'], ['Revisora de Exemplo', 'colunista']];
const MODELOS = ['{T}: por onde começar', 'O que a Bíblia diz sobre {t}', '{T} no dia a dia', 'Cinco passos para viver {t}', 'Perguntas comuns sobre {t}'];
const REFS = ['Salmos 23:1', 'João 3:16', 'Hebreus 11:1', 'Filipenses 4:6', 'Provérbios 3:5', 'Romanos 8:28', 'Mateus 11:28', 'Isaías 41:10'];
const img = (sem, w, h) => 'https://picsum.photos/seed/' + sem + '/' + w + '/' + h;

function corpo(titulo, tema, k) {
  const r1 = REFS[k % REFS.length], r2 = REFS[(k + 3) % REFS.length];
  return '<p>Este é um texto de exemplo para testar o visual do artigo “' + esc(titulo) + '”. Ele tem parágrafos, subtítulos, citação e referências bíblicas, como ' + r1 + ', que abre o popup de leitura ao clicar.</p>' +
    '<h2>Primeiro ponto</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>' +
    '<blockquote>Uma frase de destaque para ver como a citação aparece no meio do texto.</blockquote>' +
    '<h2>Segundo ponto</h2><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>' +
    '<ul><li>Primeiro item da lista de exemplo</li><li>Segundo item da lista de exemplo</li><li>Terceiro item da lista de exemplo</li></ul>' +
    '<p>Para terminar, releia ' + r2 + ' e converse sobre ' + esc(tema.toLowerCase()) + ' com alguém da sua família ou da sua igreja.</p>';
}

function gerar() {
  const agora = new Date(), edicoes = [], artigos = [];
  for (let i = 0; i < QTD_EDICOES; i++) {
    const n = QTD_EDICOES - i, tema = TEMAS[i % TEMAS.length];
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1, 10, 0, 0);
    const nome = 'Edição ' + n;
    const ed = {
      id: 'demo-e' + n, nome, numero: n, tema, status: 'publicada', criadoEm: d.toISOString(),
      descricao: 'Edição de exemplo sobre “' + tema.toLowerCase() + '”, só para você ver como o editorial fica no site.',
      cartaLeitor: '<p>Querido leitor, esta é uma carta de exemplo da ' + esc(nome) + '. Nela o editor apresenta o tema, como ' + REFS[i % REFS.length] + ', e convida à leitura dos artigos.</p><p>Boa leitura!</p>'
    };
    if (n !== 1) ed.capaUrl = img('aster-edicao-' + n, 600, 800);   // a Edição 1 fica sem capa para você ver a capa padrão
    edicoes.push(ed);
    for (let k = 1; k <= ARTIGOS_POR_EDICAO; k++) {
      const m = MODELOS[(k - 1) % MODELOS.length], tl = tema.toLowerCase();
      const titulo = m.replace('{T}', tema).replace('{t}', tl);
      const cat = CATS[(i + k) % CATS.length], au = AUTORES[(i + k) % AUTORES.length];
      const dt = new Date(d.getTime() + k * 3600 * 1000 * 5);
      artigos.push({
        id: 'demo-a' + n + '-' + k, titulo, resumo: 'Resumo de exemplo do artigo sobre ' + tl + '. Texto curto só para testar o cartão.',
        conteudo: corpo(titulo, tema, i + k), autorNome: au[0], cargoEditorialAutor: au[1], autorUid: null,
        categoria: cat[1], categorias: [cat[0]], tags: [CATS[(i + k + 2) % CATS.length][0]],
        edicao: nome, ordemEdicao: k, status: 'publicado', gratuito: true,
        imagemUrl: img('aster-artigo-' + n + '-' + k, 1200, 675),
        imagemLegenda: k % 2 ? 'Imagem de exemplo' : '',
        destaque: (i === 0 && k === 1) ? 'Destaque' : '', criadoEm: dt.toISOString()
      });
    }
  }
  const cats = {}, tags = {};
  CATS.forEach(c => { cats[c[0]] = { nome: c[1], emoji: '' }; tags[c[0]] = { nome: c[1] }; });
  artigos.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  return {
    edicoes, artigos, tx: { cats, tags, dest: { 'Destaque': { emoji: '⭐', cor: '#E8A33D' } } },
    edicao: id => edicoes.find(e => e.id === id) || null,
    edicaoPorNome: nome => edicoes.find(e => e.nome === nome) || null,
    artigo: id => artigos.find(a => a.id === id) || null,
    artigosDaEdicao: id => { const e = edicoes.find(x => x.id === id); return e ? artigos.filter(a => a.edicao === e.nome).sort((a, b) => a.ordemEdicao - b.ordemEdicao) : []; }
  };
}

function mostrarAviso() {
  if (document.getElementById('aviso-demo')) return;
  const b = document.createElement('div'); b.id = 'aviso-demo';
  b.style.cssText = 'background:#fff3cd;color:#664d03;font:600 13px Inter,sans-serif;text-align:center;padding:8px 14px;border-bottom:1px solid #f0d9a8';
  b.textContent = 'Conteúdo de exemplo: prévia do visual do site. Ele é substituído quando a primeira edição ou o primeiro artigo for publicado.';
  document.body.prepend(b);
}

let cache = null;
async function checar() {
  if (!DEMO_ATIVO) return null;
  try {
    const [a, b, c] = await Promise.all([
      getDocs(query(collection(db, 'edicoes'), where('status', '==', 'publicada'), limit(1))),
      getDocs(query(collection(db, 'noticias'), where('status', '==', 'publicado'), limit(1))),
      getDocs(query(collection(db, 'noticias'), where('status', '==', 'indexado'), limit(1)))
    ]);
    if (!a.empty || !b.empty || !c.empty) return null;   // já existe conteúdo real: o exemplo some
  } catch (e) { return null; }
  mostrarAviso();
  return gerar();
}
export function carregarDemo() { if (!cache) cache = checar(); return cache; }
