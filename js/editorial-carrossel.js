// Projeto Aster – Editorial da home: [capa da edição] [artigos dela…] [edição anterior] [artigos…] … [ver todas]
import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { carregarArtigos, esc, dataCurta } from './artigos-lista.js';

const MAX_EDICOES = 3;   // quantas edições entram na fileira (as mais recentes)
const urlOk = u => /^https:\/\//i.test(u || '') ? String(u).replace(/['"\\()\s]/g, '') : '';
const fundo = u => urlOk(u) ? ' style="background-image:url(\'' + urlOk(u) + '\')"' : '';

async function carregarEdicoes() {
  try {
    const s = await getDocs(collection(db, 'edicoes'));
    const l = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.status === 'publicada')
      .sort((a, b) => String(b.criadoEm || '').localeCompare(String(a.criadoEm || '')));
    if (l.length) return l;
  } catch (e) { return []; }
  try { const dm = await (await import('./demo.js')).carregarDemo(); return dm ? dm.edicoes : []; } catch (e) { return []; }
}

try {
  const alvo = document.querySelector('.editorial-card');
  if (alvo) {
    const [eds, dados] = await Promise.all([carregarEdicoes(), carregarArtigos().catch(() => ({ artigos: [], cats: {} }))]);
    if (eds.length) {
      const cats = dados.cats || {};
      const slides = [];
      eds.slice(0, MAX_EDICOES).forEach((e, i) => {
        slides.push('<a class="edc-capa" href="edicao.html?id=' + encodeURIComponent(e.id) + '"' + fundo(e.capaUrl) + '>' +
          (i > 0 ? '<span class="ant">Edição anterior</span>' : '') +
          '<span class="num">' + esc(e.especial ? 'Especial' : (e.numero ? 'Edição nº ' + e.numero : 'Edição')) + '</span>' +
          '<h3>' + esc(e.tema || e.nome) + '</h3>' + (e.descricao ? '<p>' + esc(e.descricao) + '</p>' : '') +
          '<span class="ler">Ler a edição</span></a>');
        dados.artigos.filter(a => a.edicao === e.nome).sort((a, b) => (a.ordemEdicao || 99) - (b.ordemEdicao || 99)).forEach(a => {
          const slug = (a.categorias && a.categorias[0]) || a.categoria || '';
          slides.push('<a class="edc-art" href="noticia.html?id=' + encodeURIComponent(a.id) + '">' +
            '<div class="img"' + fundo(a.imagemUrl) + '>' + (urlOk(a.imagemUrl) ? '' : '✦') + '</div>' +
            '<small>' + esc((cats[slug] && cats[slug].nome) || slug) + '</small><h4>' + esc(a.titulo) + '</h4>' +
            '<span>' + esc(a.autorNome || '') + (a.autorNome ? ' · ' : '') + esc(dataCurta(a.criadoEm)) + '</span></a>');
        });
      });
      slides.push('<a class="edc-fim" href="edicoes.html"><b>✦</b>Ver edições anteriores</a>');

      const bloco = document.createElement('div'); bloco.className = 'edc';
      bloco.innerHTML = '<div class="edc-setas"><button type="button" class="ant" aria-label="Anterior">←</button><button type="button" class="prox" aria-label="Próximo">→</button></div>' +
        '<div class="edc-trilho">' + slides.join('') + '</div><a class="edc-todas" href="edicoes.html">Ver todas as edições →</a>';
      alvo.insertAdjacentElement('beforebegin', bloco);
      alvo.style.display = 'none';

      const tr = bloco.querySelector('.edc-trilho'), ant = bloco.querySelector('.edc-setas .ant'), prox = bloco.querySelector('.edc-setas .prox');
      const passo = () => Math.max(260, tr.clientWidth * 0.8);
      const estado = () => { ant.disabled = tr.scrollLeft <= 4; prox.disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4; };
      ant.addEventListener('click', () => tr.scrollBy({ left: -passo(), behavior: 'smooth' }));
      prox.addEventListener('click', () => tr.scrollBy({ left: passo(), behavior: 'smooth' }));
      tr.addEventListener('scroll', estado, { passive: true }); window.addEventListener('resize', estado); estado();
    }
  }
} catch (e) { console.error(e); }
