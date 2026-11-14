/* Projeto Aster - abre a Biblia direto numa referencia: biblia.html?ref=Salmos+23:1 (usa a ultima edicao da pessoa) */
(function () {
  var ref = '';
  try { ref = new URLSearchParams(location.search).get('ref') || ''; } catch (e) {}
  var q = document.getElementById('q'), bt = document.getElementById('qbt');
  if (!ref || !q || !bt) return;
  var n = 0, espera = setInterval(function () {
    var pronto = typeof X !== 'undefined' && X && document.querySelector('#txt .ver');
    if (pronto || ++n > 150) {
      clearInterval(espera);
      if (pronto) { q.value = ref; bt.click(); }
    }
  }, 100);
})();
