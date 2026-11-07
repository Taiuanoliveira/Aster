/* Projeto Aster - busca na Biblia: por palavra (na edicao aberta) ou por referencia (ex.: Salmos 23, Jo 3:16) */
(function () {
  var q = document.getElementById('q'), esc = document.getElementById('qesc'), bt = document.getElementById('qbt'), res = document.getElementById('res');
  if (!q || !bt || !res) return;
  var livros = AsterBiblia.livros, dados = {}, tarefa = 0;

  function limpo(s) {
    return Array.from(String(s)).map(function (ch) {
      var x = ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      return x.length === ch.length ? x : ch;
    }).join('');
  }
  var nomes = livros.map(function (b) { return [limpo(b[0]).replace(/\s+/g, ' '), limpo(b[1]).replace(/\s+/g, ' ')]; });
  var ABREV = { jo: 42, mt: 39, mc: 40, lc: 41, at: 43, rm: 44, ap: 65, sl: 18, pv: 19, gn: 0, ex: 1, is: 21, jr: 23, dn: 26, hb: 57, tg: 58, fp: 49, ef: 48, gl: 47, cl: 50, tt: 55 };

  function achaLivro(tok, bruto) {
    var t = limpo(tok).replace(/\./g, '').replace(/\s+/g, ' ').trim(), i;
    if (!t) return -1;
    if (/^j[oó]$/i.test(bruto.trim()) && /ó/i.test(bruto)) return 17;
    if (ABREV[t] != null) return ABREV[t];
    for (i = 0; i < nomes.length; i++) if (nomes[i][0] === t || nomes[i][1] === t) return i;
    for (i = 0; i < nomes.length; i++) if (nomes[i][0].indexOf(t) === 0 || nomes[i][1].indexOf(t) === 0) return i;
    return -1;
  }
  function referencia(txt) {
    var m = /^\s*((?:[1-3]\s*)?[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ. ]*?)\s*(\d{1,3})(?:\s*[:.,]\s*(\d{1,3}))?\s*$/.exec(txt);
    if (!m) return null;
    var l = achaLivro(m[1].replace(/^([1-3])\s*/, '$1 '), m[1]);
    return l < 0 ? null : { l: l, c: +m[2], v: m[3] ? +m[3] : 0 };
  }

  function mostrar(html) { res.hidden = false; res.innerHTML = html; }
  function fechar() { res.hidden = true; res.innerHTML = ''; }
  function texto(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  async function ir(l, c, v) {
    var ed = ver(P.v);
    if (!tem(ed, l)) { mostrar('<p class="rs-vazio">Este livro não existe na edição escolhida.</p>'); return; }
    c = Math.min(Math.max(1, c), ed.livros[l]);
    P.l = l; P.c = c; sync(); fechar();
    await carregar();
    var el = v && document.querySelector('#txt .ver[data-v="' + v + '"]');
    if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('rs-flash'); setTimeout(function () { el.classList.remove('rs-flash'); }, 2200); }
    else window.scrollTo(0, 0);
  }

  async function carregarEdicao(vid, meu) {
    if (dados[vid]) return dados[vid];
    var ed = ver(vid), fila = [], out = [], feitos = 0, total = 0, i;
    for (i = 0; i < 66; i++) if (tem(ed, i)) { fila.push(i); total++; }
    async function um(l) {
      var r = await fetch('data/biblia/' + vid + '/' + ('0' + l).slice(-2) + '.json');
      if (!r.ok) throw new Error(r.status);
      var caps = await r.json();
      caps.forEach(function (vs, ci) { (vs || []).forEach(function (t, vi) { if (t) out.push({ l: l, c: ci + 1, v: vi + 1, t: t, n: limpo(t) }); }); });
      feitos++;
      if (meu === tarefa) mostrar('<p class="rs-vazio">Preparando a busca… ' + feitos + ' de ' + total + ' livros</p>');
    }
    for (i = 0; i < fila.length; i += 6) { await Promise.all(fila.slice(i, i + 6).map(um)); if (meu !== tarefa) return null; }
    out.sort(function (a, b) { return a.l - b.l || a.c - b.c || a.v - b.v; });
    dados[vid] = out; return out;
  }

  function marcar(t, termos) {
    var n = limpo(t), marc = new Array(t.length + 1).join('0').split(''), ok = n.length === t.length;
    if (!ok) return texto(t);
    termos.forEach(function (w) { var p = n.indexOf(w); while (p >= 0) { for (var k = 0; k < w.length; k++) marc[p + k] = '1'; p = n.indexOf(w, p + w.length); } });
    var h = '', i = 0;
    while (i < t.length) {
      var j = i; while (j < t.length && marc[j] === marc[i]) j++;
      var pedaco = texto(t.slice(i, j)); h += marc[i] === '1' ? '<mark>' + pedaco + '</mark>' : pedaco; i = j;
    }
    return h;
  }

  async function palavra(txt) {
    var termos = limpo(txt).split(/[^\p{L}\p{N}]+/u).filter(function (w) { return w.length >= 2; });
    if (!termos.length) { mostrar('<p class="rs-vazio">Digite uma palavra com pelo menos 2 letras.</p>'); return; }
    var meu = ++tarefa, vid = P.v, lista;
    mostrar('<p class="rs-vazio">Preparando a busca…</p>');
    try { lista = await carregarEdicao(vid, meu); } catch (e) { mostrar('<p class="rs-vazio">Não foi possível preparar a busca agora. Tente de novo.</p>'); return; }
    if (!lista || meu !== tarefa) return;
    var lim = esc.value === 'at' ? [0, 38] : esc.value === 'nt' ? [39, 65] : [0, 65];
    var achados = lista.filter(function (x) { return x.l >= lim[0] && x.l <= lim[1] && termos.every(function (w) { return x.n.indexOf(w) >= 0; }); });
    var ed = ver(vid), cab = '<div class="rs-topo"><b>' + achados.length + (achados.length === 1 ? ' resultado' : ' resultados') + '</b> em ' + texto(ed.nome || ed.longo) + '<button type="button" class="rs-x" aria-label="Fechar resultados">Fechar</button></div>';
    if (!achados.length) { mostrar(cab + '<p class="rs-vazio">Nada encontrado. Confira a escrita ou escolha uma edição no seu idioma.</p>'); return; }
    mostrar(cab + '<ol class="rs-lista">' + achados.slice(0, 60).map(function (x) {
      return '<li><button type="button" class="rs-it" data-l="' + x.l + '" data-c="' + x.c + '" data-v="' + x.v + '"><span class="rs-ref">' + texto(livros[x.l][0]) + ' ' + x.c + ':' + x.v + '</span><span class="rs-tx">' + marcar(x.t, termos) + '</span></button></li>';
    }).join('') + '</ol>' + (achados.length > 60 ? '<p class="rs-vazio">Mostrando os 60 primeiros. Use mais palavras para refinar.</p>' : ''));
  }

  function buscar() {
    var txt = q.value.trim();
    if (!txt) { fechar(); return; }
    var r = referencia(txt);
    if (r) { tarefa++; ir(r.l, r.c, r.v); return; }
    palavra(txt);
  }
  bt.onclick = buscar;
  q.addEventListener('keydown', function (e) { if (e.key === 'Enter') buscar(); });
  esc.onchange = function () { if (q.value.trim() && !res.hidden) buscar(); };
  res.addEventListener('click', function (e) {
    if (e.target.closest('.rs-x')) { tarefa++; fechar(); return; }
    var b = e.target.closest('.rs-it'); if (b) ir(+b.dataset.l, +b.dataset.c, +b.dataset.v);
  });
})();
