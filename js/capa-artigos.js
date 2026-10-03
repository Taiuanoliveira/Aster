import { carregarArtigos, cartaoHTML, injetarEstilos } from './artigos-lista.js';
try {
  const { artigos, ...tx } = await carregarArtigos();
  if (artigos.length) {
    injetarEstilos();
    document.getElementById('artigosRecentes').innerHTML = artigos.slice(0, 6).map(a => cartaoHTML(a, tx)).join('');
    document.getElementById('artigos-secao').style.display = 'block';
  }
} catch (e) { console.error(e); }
