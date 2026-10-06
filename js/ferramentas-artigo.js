const CH = 'aster_fonte';
function aplicar(n) {
  n = Math.max(0.85, Math.min(1.6, Math.round(n * 100) / 100));
  document.documentElement.style.setProperty('--fonte-corpo', (20 * n) + 'px');
  try { localStorage.setItem(CH, n); } catch (e) {}
  return n;
}
export function montarFerramentas(titulo) {
  let n = 1;
  try { n = parseFloat(localStorage.getItem(CH)) || 1; } catch (e) {}
  n = aplicar(n);
  const url = location.href.split('#')[0], u = encodeURIComponent(url), t = encodeURIComponent(titulo || document.title);
  const redes = [
    ['Fb', 'https://www.facebook.com/sharer/sharer.php?u=' + u, 'Compartilhar no Facebook'],
    ['X', 'https://twitter.com/intent/tweet?text=' + t + '&url=' + u, 'Compartilhar no X'],
    ['In', 'https://www.linkedin.com/sharing/share-offsite/?url=' + u, 'Compartilhar no LinkedIn'],
    ['Wa', 'https://wa.me/?text=' + t + '%20' + u, 'Compartilhar no WhatsApp'],
    ['Tg', 'https://t.me/share/url?url=' + u + '&text=' + t, 'Compartilhar no Telegram']
  ];
  const topo = document.getElementById('toolbarArt');
  if (topo) {
    topo.innerHTML = '<div class="fonte-pill"><button type="button" data-f="-" aria-label="Diminuir texto">A−</button><span>·</span><button type="button" data-f="+" aria-label="Aumentar texto">A+</button></div>' +
      '<div class="redes">' +
      redes.map(r => '<a href="' + r[1] + '" target="_blank" rel="noopener noreferrer" title="' + r[2] + '">' + r[0] + '</a>').join('') +
      '<button type="button" id="btnIg" title="Compartilhar no Instagram">Ig</button>' +
      '<button type="button" id="btnCopiar" title="Copiar link">🔗</button>' +
      '</div>';
    topo.addEventListener('click', e => {
      const bf = e.target.closest('button[data-f]');
      if (bf) { n = aplicar(n + (bf.dataset.f === '+' ? 0.1 : -0.1)); return; }
      if (e.target.closest('#btnIg')) {
        if (navigator.share) { navigator.share({ title: titulo || document.title, url }).catch(() => {}); }
        else { (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => alert('Link copiado! Cole no Instagram.')).catch(() => prompt('Copie o link para colar no Instagram:', url)); }
        return;
      }
      const bc = e.target.closest('#btnCopiar');
      if (bc) {
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
          .then(() => { bc.textContent = '✓'; setTimeout(() => bc.textContent = '🔗', 1500); })
          .catch(() => prompt('Copie o link:', url));
      }
    });
  }
  const base = document.getElementById('acoesArt');
  if (!base) return;
  base.insertAdjacentHTML('afterend', '<aside class="apoie-box"><strong>Gostou do que leu?</strong><span>O Projeto Aster é gratuito para você. Se quiser, apoie o trabalho.</span><a href="apoiar.html">Quero apoiar</a></aside>');
}
