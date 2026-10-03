// Projeto Aster – modo claro/escuro escolhido pelo leitor.
// Primeira visita: segue o tema do aparelho. Depois que a pessoa clica no botão, a escolha fica salva.
(function () {
  var CHAVE = 'aster_tema';
  var raiz = document.documentElement;

  function salvo() {
    try { var v = localStorage.getItem(CHAVE); return (v === 'claro' || v === 'escuro') ? v : null; }
    catch (e) { return null; }
  }
  function sistema() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'escuro' : 'claro';
  }
  function atual() { return raiz.getAttribute('data-tema') || 'claro'; }
  function aplicar(t) { raiz.setAttribute('data-tema', t); }

  aplicar(salvo() || sistema());

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tema-toggle';

    function atualizar() {
      var escuro = atual() === 'escuro';
      btn.textContent = escuro ? '☀️' : '🌙';
      var txt = escuro ? 'Mudar para o modo claro' : 'Mudar para o modo escuro';
      btn.title = txt;
      btn.setAttribute('aria-label', txt);
    }
    btn.addEventListener('click', function () {
      var novo = atual() === 'escuro' ? 'claro' : 'escuro';
      try { localStorage.setItem(CHAVE, novo); } catch (e) {}
      aplicar(novo);
      atualizar();
    });
    atualizar();

    var nav = document.querySelector('nav.nav-topo');
    var header = document.querySelector('header');
    if (nav) {
      nav.appendChild(btn);
    } else if (header) {
      var volta = header.querySelector('a.volta');
      if (volta) {
        var caixa = document.createElement('div');
        caixa.style.cssText = 'display:flex;align-items:center;gap:6px';
        volta.parentNode.replaceChild(caixa, volta);
        caixa.appendChild(volta);
        caixa.appendChild(btn);
      } else {
        btn.style.marginLeft = 'auto';
        header.appendChild(btn);
      }
    } else {
      btn.className += ' flutuante';
      document.body.appendChild(btn);
    }
  });

  // Se a pessoa mudar o tema em outra aba, esta aba acompanha.
  window.addEventListener('storage', function (e) {
    if (e.key === CHAVE && (e.newValue === 'claro' || e.newValue === 'escuro')) aplicar(e.newValue);
  });
})();
