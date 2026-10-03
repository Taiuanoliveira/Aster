const CH = 'aster_fonte';
function aplicar(n) {
  n = Math.max(0.85, Math.min(1.6, Math.round(n * 100) / 100));
  document.documentElement.style.setProperty('--fonte-corpo', (17 * n) + 'px');
  try { localStorage.setItem(CH, n); } catch (e) {}
  return n;
}
export function montarFerramentas(titulo) {
  let n = 1;
  try { n = parseFloat(localStorage.getItem(CH)) || 1; } catch (e) {}
  n = aplicar(n);
  const topo = document.getElementById('ferrArt');
  if (topo) {
    topo.innerHTML = '<span>Tamanho do texto</span><button type="button" data-f="-" aria-label="Diminuir texto">A−</button><button type="button" data-f="+" aria-label="Aumentar texto">A+</button>';
    topo.onclick = e => { const b = e.target.closest('button'); if (b) n = aplicar(n + (b.dataset.f === '+' ? 0.1 : -0.1)); };
  }
  const base = document.getElementById('acoesArt');
  if (!base) return;
  const url = location.href.split('#')[0], u = encodeURIComponent(url), t = encodeURIComponent(titulo || document.title);
  const redes = [
    ['WhatsApp', 'https://wa.me/?text=' + t + '%20' + u],
    ['Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
    ['X (Twitter)', 'https://twitter.com/intent/tweet?text=' + t + '&url=' + u],
    ['Telegram', 'https://t.me/share/url?url=' + u + '&text=' + t]
  ];
  const box = document.createElement('div');
  box.className = 'share';
  box.innerHTML = '<span>Compartilhar</span>' +
    redes.map(r => '<a class="btn-acao" target="_blank" rel="noopener noreferrer" href="' + r[1] + '">' + r[0] + '</a>').join('') +
    '<button type="button" class="btn-acao" id="btnCopiar">🔗 Copiar link</button>' +
    (navigator.share ? '<button type="button" class="btn-acao" id="btnNativo">📲 Instagram e outros</button>' : '');
  base.after(box);
  box.insertAdjacentHTML('afterend', '<aside class="apoie-box"><strong>Gostou do que leu?</strong><span>O Projeto Aster é gratuito para você. Se quiser, apoie o trabalho.</span><a href="apoiar.html">Quero apoiar</a></aside>');
  box.querySelector('#btnCopiar').onclick = async ev => {
    try { await navigator.clipboard.writeText(url); ev.target.textContent = '✓ Link copiado'; }
    catch (e) { prompt('Copie o link:', url); }
  };
  const nat = box.querySelector('#btnNativo');
  if (nat) nat.onclick = () => navigator.share({ title: titulo || document.title, url }).catch(() => {});
}
