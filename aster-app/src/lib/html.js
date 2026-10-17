// Converte o HTML dos artigos (editor Quill) em blocos simples que o app sabe desenhar.
// Bloco: { t: 'p'|'h2'|'h3'|'quote'|'li'|'img', runs: [{ s, b, i, u, href }], n?: número, src?: url }
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’' };
export function decodificarEntidades(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try { return String.fromCodePoint(n); } catch (x) { return m; }
    }
    const v = ENT[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}
const BLOCOS = { p: 'p', div: 'p', h1: 'h2', h2: 'h2', h3: 'h3', h4: 'h3', h5: 'h3', h6: 'h3', blockquote: 'quote', li: 'li' };
const atributo = (attrs, nome) => {
  const m = new RegExp('\\b' + nome + '\\s*=\\s*("([^"]*)"|\'([^\']*)\')', 'i').exec(attrs || '');
  return m ? decodificarEntidades(m[2] !== undefined ? m[2] : m[3]) : '';
};

export function htmlParaBlocos(html) {
  const blocos = [];
  let atual = null, b = 0, i = 0, u = 0, hrefs = [], listas = [], tipoBloco = 'p';
  const abrir = t => { fechar(); atual = { t, runs: [] }; tipoBloco = t; };
  function fechar() {
    if (!atual) return;
    const r = atual.runs;
    while (r.length && !r[0].s.trim()) r.shift();
    while (r.length && !r[r.length - 1].s.trim()) r.pop();
    if (r.length) {
      r[0].s = r[0].s.replace(/^\s+/, ''); r[r.length - 1].s = r[r.length - 1].s.replace(/\s+$/, '');
      blocos.push(atual);
    }
    atual = null;
  }
  const texto = s => {
    s = decodificarEntidades(s).replace(/\s+/g, ' ');
    if (!s || (!s.trim() && !atual)) return;
    if (!atual) abrir('p');
    atual.runs.push({ s, b: b > 0, i: i > 0, u: u > 0, href: hrefs.length ? hrefs[hrefs.length - 1] : '' });
  };
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>|([^<]+)/g;
  let m;
  html = String(html || '').replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/gi, '');
  while ((m = re.exec(html))) {
    if (m[4] !== undefined) { texto(m[4]); continue; }
    const fecha = m[1] === '/', tag = m[2].toLowerCase(), attrs = m[3];
    if (tag === 'br') { if (atual) atual.runs.push({ s: '\n' }); continue; }
    if (tag === 'img') {
      const src = atributo(attrs, 'src');
      if (/^https:\/\//i.test(src)) { fechar(); blocos.push({ t: 'img', src, runs: [] }); }
      continue;
    }
    if (tag === 'ul' || tag === 'ol') {
      fechar();
      if (fecha) listas.pop(); else listas.push({ ordenada: tag === 'ol', n: 0 });
      continue;
    }
    if (BLOCOS[tag]) {
      if (fecha) { fechar(); continue; }
      let t = BLOCOS[tag];
      if (t === 'li') {
        const l = listas[listas.length - 1] || { ordenada: false, n: 0 };
        l.n++;
        abrir('li'); atual.n = l.ordenada ? l.n : 0; atual.nivel = Math.max(0, listas.length - 1);
      } else abrir(t);
      continue;
    }
    if (tag === 'strong' || tag === 'b') b += fecha ? -1 : 1;
    else if (tag === 'em' || tag === 'i') i += fecha ? -1 : 1;
    else if (tag === 'u') u += fecha ? -1 : 1;
    else if (tag === 'a') {
      if (fecha) hrefs.pop();
      else { const h = atributo(attrs, 'href'); hrefs.push(/^(https?:|mailto:)/i.test(h) ? h : ''); }
    }
    if (b < 0) b = 0; if (i < 0) i = 0; if (u < 0) u = 0;
  }
  fechar();
  return blocos;
}

export function textoSimples(html) {
  return decodificarEntidades(String(html || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}
export function minutosDeLeitura(html) {
  const palavras = textoSimples(html).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}
