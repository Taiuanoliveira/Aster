/* Projeto Aster - tocar no versiculo do dia abre a Biblia direto naquele texto, na edicao que a pessoa usa */
(function () {
  var t = document.getElementById('versiculoTexto'), r = document.getElementById('versiculoRef'), b = document.getElementById('btnLerVers');
  if (!t || !r) return;
  function destino() {
    var ref = (r.textContent || '').trim();
    return /\d/.test(ref) ? 'biblia.html?ref=' + encodeURIComponent(ref) : 'biblia.html';
  }
  function atualizar() { if (b) b.setAttribute('href', destino()); }
  [t, r].forEach(function (el) {
    el.style.cursor = 'pointer'; el.setAttribute('title', 'Ler na Bíblia');
    el.addEventListener('click', function () { location.href = destino(); });
  });
  new MutationObserver(atualizar).observe(r, { childList: true, characterData: true, subtree: true });
  atualizar();
})();
