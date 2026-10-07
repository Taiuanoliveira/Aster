// Projeto Aster – "Ouvir este artigo": o próprio navegador lê o texto em voz alta (grátis, sem servidor).
// Funciona no Chrome, Edge, Safari e Firefox. Se o aparelho não tiver leitura de voz, o botão nem aparece.
const VELOCIDADES = [1, 1.25, 1.5, 0.85];
const CHAVE = 'aster_audio_vel';
const MAX = 220;   // o navegador lê em pedaços curtos: evita que a leitura pare no meio de textos longos

function quebrar(txt, max) {
  const r = [];
  while (txt.length > max) {
    let k = txt.lastIndexOf(' ', max);
    if (k < 40) k = max;
    r.push(txt.slice(0, k));
    txt = txt.slice(k + 1);
  }
  if (txt) r.push(txt);
  return r;
}

export function montarAudio({ titulo, autor, resumo, corpo }) {
  const sy = window.speechSynthesis;
  const ancora = document.getElementById('toolbarArt');
  if (!sy || typeof SpeechSynthesisUtterance === 'undefined' || !ancora || !corpo) return;

  let vel = 1;
  try { const v = parseFloat(localStorage.getItem(CHAVE)); if (VELOCIDADES.includes(v)) vel = v; } catch (e) {}
  let partes = [], i = 0, estado = 'parado', geracao = 0;

  const bar = document.createElement('div');
  bar.className = 'ouvir-bar';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Ouvir este artigo');
  bar.innerHTML = '<button type="button" class="ouvir-play">🔊 Ouvir este artigo</button>' +
    '<button type="button" class="ouvir-sec ouvir-stop" hidden>⏹ Parar</button>' +
    '<button type="button" class="ouvir-sec ouvir-vel" title="Velocidade da leitura" aria-label="Velocidade da leitura"></button>' +
    '<span class="ouvir-st" aria-live="polite"></span>';
  ancora.after(bar);
  const bPlay = bar.querySelector('.ouvir-play'), bStop = bar.querySelector('.ouvir-stop'),
        bVel = bar.querySelector('.ouvir-vel'), st = bar.querySelector('.ouvir-st');

  function montarPartes() {
    const blocos = [titulo];
    if (autor) blocos.push('Por ' + autor);
    if (resumo) blocos.push(resumo);
    String(corpo.innerText || corpo.textContent || '').split(/\n+/).forEach(l => {
      l = l.replace(/\s+/g, ' ').trim(); if (l) blocos.push(l);
    });
    const saida = [];
    blocos.forEach(b => {
      b = String(b).replace(/\s+/g, ' ').trim();
      if (!b) return;
      if (!/[.!?…:;]$/.test(b)) b += '.';
      const frases = b.match(/[^.!?…]+[.!?…]+["”’')\]]*\s*|[^.!?…]+$/g) || [b];
      let acc = '';
      frases.forEach(f => {
        if (f.length > MAX) {
          if (acc.trim()) { saida.push(acc.trim()); acc = ''; }
          quebrar(f.trim(), MAX).forEach(p => saida.push(p));
          return;
        }
        if ((acc + f).length > MAX && acc.trim()) { saida.push(acc.trim()); acc = ''; }
        acc += f;
      });
      if (acc.trim()) saida.push(acc.trim());
    });
    return saida;
  }

  function voz() {
    try {
      const vs = sy.getVoices() || [];
      return vs.find(v => /^pt[-_]br$/i.test(v.lang)) || vs.find(v => /^pt/i.test(v.lang)) || null;
    } catch (e) { return null; }
  }

  function mostrar() {
    bPlay.textContent = estado === 'lendo' ? '⏸ Pausar' : estado === 'pausado' ? '▶ Continuar' : '🔊 Ouvir este artigo';
    bStop.hidden = estado === 'parado';
    bVel.textContent = String(vel).replace('.', ',') + '×';
    st.textContent = estado === 'lendo' ? 'Lendo… ' + Math.min(i + 1, partes.length) + ' de ' + partes.length
                   : estado === 'pausado' ? 'Pausado' : '';
  }

  function parar() {
    estado = 'parado'; geracao++; i = 0;
    try { sy.cancel(); } catch (e) {}
    mostrar();
  }

  function falar() {
    if (estado !== 'lendo') return;
    if (i >= partes.length) { parar(); st.textContent = 'Leitura concluída.'; return; }
    const meu = ++geracao;
    const u = new SpeechSynthesisUtterance(partes[i]);
    u.lang = 'pt-BR'; u.rate = vel;
    const v = voz(); if (v) u.voice = v;
    u.onend = () => { if (meu !== geracao || estado !== 'lendo') return; i++; falar(); };
    u.onerror = ev => {
      if (meu !== geracao) return;
      if (ev && (ev.error === 'canceled' || ev.error === 'interrupted')) return;
      parar(); st.textContent = 'Não foi possível ler em voz alta neste aparelho.';
    };
    mostrar();
    sy.speak(u);
  }

  bPlay.addEventListener('click', () => {
    if (estado === 'lendo') { estado = 'pausado'; geracao++; try { sy.cancel(); } catch (e) {} mostrar(); }
    else if (estado === 'pausado') { estado = 'lendo'; try { sy.cancel(); } catch (e) {} falar(); }
    else { partes = montarPartes(); i = 0; estado = 'lendo'; try { sy.cancel(); } catch (e) {} falar(); }
  });
  bStop.addEventListener('click', parar);
  bVel.addEventListener('click', () => {
    vel = VELOCIDADES[(VELOCIDADES.indexOf(vel) + 1) % VELOCIDADES.length];
    try { localStorage.setItem(CHAVE, vel); } catch (e) {}
    if (estado === 'lendo') { geracao++; try { sy.cancel(); } catch (e) {} falar(); } else mostrar();
  });
  window.addEventListener('pagehide', () => { try { sy.cancel(); } catch (e) {} });
  mostrar();
}
