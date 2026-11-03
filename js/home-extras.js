// Projeto Aster - secoes extras da home: girador de versiculo, devocionais por tema, quiz e newsletter
import { DEV, VERS, BANCO } from './home-dados.js';
const $ = (id) => document.getElementById(id);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const emb = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- girador de versiculo ----------
(function () {
  const btn = $('hx-gira'); if (!btn) return;
  let ang = 0, ult = -1, ocupado = false;
  btn.addEventListener('click', () => {
    if (ocupado) return; ocupado = true;
    let i; do { i = Math.floor(Math.random() * VERS.length); } while (i === ult && VERS.length > 1); ult = i;
    ang += 720 + Math.floor(Math.random() * 360);
    btn.style.transform = 'rotate(' + ang + 'deg)';
    $('hx-dica').textContent = 'Girando…'; $('hx-verso').hidden = true;
    setTimeout(() => {
      $('hx-texto').textContent = '“' + VERS[i][0] + '”'; $('hx-ref').textContent = VERS[i][1];
      $('hx-verso').hidden = false; $('hx-dica').textContent = 'Toque no asterisco para girar de novo.'; ocupado = false;
    }, 1300);
  });
})();

// ---------- devocionais por tema ----------
(function () {
  const caixa = $('hx-dev'); if (!caixa) return;
  let atual = 0;
  function abas(g) {
    return DEV.map((d, i) => ({ d, i })).filter((o) => o.d.g === g).map((o) =>
      '<button type="button" class="hx-aba' + (o.i === atual ? ' on' : '') + '" data-i="' + o.i + '">' + esc(o.d.l) + '</button>').join('');
  }
  function pinta() {
    const d = DEV[atual];
    $('hx-abas1').innerHTML = abas(0); $('hx-abas2').innerHTML = abas(1);
    $('hx-dev-ref').textContent = 'LEITURA · ' + d.r.toUpperCase();
    $('hx-dev-tit').textContent = d.t; $('hx-dev-txt').textContent = d.x;
    $('hx-dev-q').textContent = d.q; $('hx-dev-p').textContent = d.p;
    $('hx-dev-pl').textContent = d.g === 1 ? 'UMA ORAÇÃO, SE QUISER' : 'ORAÇÃO';
  }
  caixa.addEventListener('click', (e) => { const b = e.target.closest('.hx-aba'); if (b) { atual = +b.dataset.i; pinta(); } });
  pinta();
})();

// ---------- quiz biblico ----------
(function () {
  const cx = $('hx-quiz'); if (!cx) return;
  let baralho = [], rodada = [], qi = 0, pontos = 0, marcada = -1;
  function nova() {
    if (baralho.length < 10) baralho = emb(BANCO.map((_, i) => i));
    rodada = baralho.splice(0, 10).map((i) => {
      const b = BANCO[i], o = emb([b[2], b[3], b[4]]);
      return { c: b[0], t: b[1], r: b[5], o, a: o.indexOf(b[2]) };
    });
    qi = 0; pontos = 0; marcada = -1;
  }
  function pinta() {
    if (qi >= 10) {
      const msg = pontos >= 8 ? 'Você conhece bem a Palavra!' : pontos >= 5 ? 'Bom começo! Que tal ler mais um devocional?' : 'Toda jornada começa com um primeiro passo. Tente de novo!';
      cx.innerHTML = '<p class="hx-peq">FIM DA RODADA</p><h3 class="hx-qt">Você acertou ' + pontos + ' de 10.</h3><p class="hx-fb">' + msg + ' Na próxima rodada, as perguntas serão novas.</p><button type="button" class="hx-btn" id="hx-de-novo">Jogar de novo</button>';
      return;
    }
    const q = rodada[qi], resp = marcada >= 0;
    cx.innerHTML = '<div class="hx-topo"><span class="hx-peq">PERGUNTA ' + (qi + 1) + ' DE 10 · ' + esc(q.c.toUpperCase()) + '</span><span class="hx-peq">ACERTOS: ' + pontos + '</span></div>' +
      '<h3 class="hx-qt">' + esc(q.t) + '</h3>' +
      q.o.map((t, i) => {
        let cl = 'hx-opt', m = '';
        if (resp && i === q.a) { cl += ' certa'; m = '✓ '; } else if (resp && i === marcada) { cl += ' errada'; m = '✕ '; }
        return '<button type="button" class="' + cl + '" data-i="' + i + '"' + (resp ? ' disabled' : '') + '>' + m + esc(t) + '</button>';
      }).join('') +
      (resp ? '<p class="hx-fb">' + (marcada === q.a ? 'Isso mesmo!' : 'Quase! A resposta certa está marcada.') + ' <span class="hx-ref">' + esc(q.r) + '</span></p><button type="button" class="hx-btn" id="hx-prox">' + (qi === 9 ? 'Ver resultado' : 'Próxima') + '</button>' : '');
  }
  cx.addEventListener('click', (e) => {
    const o = e.target.closest('.hx-opt');
    if (o && marcada < 0) { marcada = +o.dataset.i; if (marcada === rodada[qi].a) pontos++; pinta(); return; }
    if (e.target.id === 'hx-prox') { qi++; marcada = -1; pinta(); }
    if (e.target.id === 'hx-de-novo') { nova(); pinta(); }
  });
  nova(); pinta();
})();

// ---------- newsletter ----------
(function () {
  const form = $('hx-news'); if (!form) return;
  const TIPOS = [['v', 'Versículo diário'], ['d', 'Devocional'], ['m', 'Mensagens personalizadas']];
  const TEMAS = [['esp', 'Esperança'], ['fam', 'Família'], ['ans', 'Ansiedade'], ['grat', 'Gratidão'], ['fe', 'Fé']];
  const sel = { tipos: { v: true }, temas: {} };
  function chips(id, lista, chave) {
    $(id).innerHTML = lista.map(([k, l]) => '<button type="button" class="hx-chip' + (sel[chave][k] ? ' on' : '') + '" data-k="' + k + '" data-c="' + chave + '">' + l + '</button>').join('');
  }
  function pinta() { chips('hx-tipos', TIPOS, 'tipos'); chips('hx-temas', TEMAS, 'temas'); }
  form.addEventListener('click', (e) => {
    const b = e.target.closest('.hx-chip'); if (!b) return;
    sel[b.dataset.c][b.dataset.k] = !sel[b.dataset.c][b.dataset.k]; pinta();
  });
  const msg = (t, ok) => { const m = $('hx-news-msg'); m.textContent = t; m.hidden = !t; m.className = 'hx-msg' + (ok ? ' ok' : ''); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('hx-email').value.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) { msg('Digite um e-mail válido para continuar.', false); return; }
    const tipos = TIPOS.filter(([k]) => sel.tipos[k]).map(([, l]) => l), temas = TEMAS.filter(([k]) => sel.temas[k]).map(([, l]) => l);
    const bt = $('hx-news-bt'); bt.disabled = true; msg('', false);
    try {
      const { db } = await import('./firebase-config.js');
      const fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      await fs.addDoc(fs.collection(db, 'newsletter'), { email, tipos: tipos.length ? tipos : ['Versículo diário'], temas, criadoEm: fs.serverTimestamp() });
    } catch (err) {
      console.error(err);
      msg('Não foi possível assinar agora. Tente de novo em instantes.', false); bt.disabled = false; return;
    }
    msg('Obrigado! Você receberá ' + (tipos.length ? tipos.join(', ').toLowerCase() : 'o versículo diário') + (temas.length ? ', com foco em ' + temas.join(', ').toLowerCase() : '') + ', em ' + email + '.', true);
    form.querySelector('.hx-campos').hidden = true;
  });
  pinta();
})();
