/* Projeto Aster - baixar uma edicao da Biblia para ler sem internet */
(function () {
  var ref = document.querySelector('.ctl2');
  if (!ref || !window.caches) return;
  var box = document.createElement('div'); box.className = 'off';
  box.innerHTML = '<span class="off-t" id="off-t"></span><button type="button" id="off-b"></button>';
  box.style.display = 'none';
  ref.parentNode.insertBefore(box, ref);
  var t = document.getElementById('off-t'), b = document.getElementById('off-b'), ocupado = false;
  var url = function (vid, l) { return new URL('data/biblia/' + vid + '/' + ('0' + l).slice(-2) + '.json', location.href).href; };
  function livros(ed) { var r = []; for (var i = 0; i < 66; i++) if (tem(ed, i)) r.push(i); return r; }
  async function quantos(ed) {
    var c = await caches.open('aster-biblia-v1'), n = 0, ls = livros(ed);
    for (var i = 0; i < ls.length; i++) if (await c.match(url(ed.id, ls[i]))) n++;
    return [n, ls.length];
  }
  async function estado() {
    if (ocupado || typeof X === 'undefined' || !X || !ver(P.v)) return;
    var ed = ver(P.v), q = await quantos(ed);
    if (q[0] === q[1] && q[1] > 0) { t.textContent = ed.nome + ': disponível sem internet.'; b.textContent = 'Remover do aparelho'; b.dataset.m = 'rm'; }
    else { t.textContent = 'Ler sem internet: ' + ed.nome + (q[0] ? ' (' + q[0] + ' de ' + q[1] + ' livros baixados)' : ''); b.textContent = 'Baixar esta edição'; b.dataset.m = 'dl'; }
    b.disabled = false; box.style.display = '';
  }
  async function baixar() {
    var ed = ver(P.v), ls = livros(ed), c = await caches.open('aster-biblia-v1'), feitos = 0, falhas = 0;
    ocupado = true; b.disabled = true;
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    for (var i = 0; i < ls.length; i += 4) {
      await Promise.all(ls.slice(i, i + 4).map(async function (l) {
        try { var u = url(ed.id, l); if (!(await c.match(u))) { var r = await fetch(u); if (!r.ok) throw 0; await c.put(u, r); } } catch (e) { falhas++; }
        feitos++; t.textContent = 'Baixando ' + ed.nome + '… ' + feitos + ' de ' + ls.length;
      }));
    }
    ocupado = false;
    await estado();
    if (falhas) t.textContent = 'Alguns livros não baixaram (' + falhas + '). Toque em Baixar de novo com internet.';
  }
  async function remover() {
    var ed = ver(P.v), c = await caches.open('aster-biblia-v1'), ls = livros(ed);
    await Promise.all(ls.map(function (l) { return c.delete(url(ed.id, l)); }));
    await estado();
  }
  b.onclick = function () { if (b.dataset.m === 'rm') remover(); else baixar(); };
  document.getElementById('ver').addEventListener('change', function () { setTimeout(estado, 50); });
  var n = 0, espera = setInterval(function () { if ((typeof X !== 'undefined' && X) || ++n > 100) { clearInterval(espera); estado(); } }, 100);
})();
