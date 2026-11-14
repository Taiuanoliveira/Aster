/* Projeto Aster - registra o service worker e oferece instalar o site como aplicativo */
(function () {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  var pronto = null, ios = /iphone|ipad|ipod/i.test(navigator.userAgent), solto = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (solto) return;
  function link() {
    if (document.getElementById('pwa-bt')) return;
    var f = document.querySelector('footer'); if (!f) return;
    var s = document.createElement('span'); s.innerHTML = ' · <a href="#" id="pwa-bt">Instalar o app</a>'; f.appendChild(s);
    document.getElementById('pwa-bt').onclick = function (e) {
      e.preventDefault();
      if (pronto) { pronto.prompt(); pronto = null; s.remove(); }
      else alert('No iPhone: toque em Compartilhar e depois em "Adicionar à Tela de Início".');
    };
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); pronto = e; link(); });
  window.addEventListener('appinstalled', function () { var b = document.getElementById('pwa-bt'); if (b) b.parentNode.remove(); });
  if (ios) document.addEventListener('DOMContentLoaded', link);
})();
