(function () {
  var M = {
    imagem:     { t: 'Tamanho ideal: 1200 × 675 px (horizontal, 16:9)', r: 16 / 9 },
    capaEdicao: { t: 'Tamanho ideal: 900 × 1200 px (vertical, 3:4)', r: 3 / 4 },
    foto:       { t: 'Tamanho ideal: 600 × 600 px (quadrada)', r: 1 },
    modalFoto:  { t: 'Tamanho ideal: 400 × 400 px (quadrada)', r: 1 },
    logoImagem: { t: 'Ideal: PNG com fundo transparente, cerca de 300 × 90 px (horizontal)', r: null }
  };
  function iniciar() {
    Object.keys(M).forEach(function (id) {
      var inp = document.getElementById(id); if (!inp) return;
      var d = document.createElement('small');
      d.style.cssText = 'display:block;margin-top:6px;font-size:12px;color:#1F5A82';
      d.textContent = '📐 ' + M[id].t;
      inp.insertAdjacentElement('afterend', d);
      inp.addEventListener('change', function () {
        var f = inp.files && inp.files[0]; if (!f) { d.textContent = '📐 ' + M[id].t; d.style.color = '#1F5A82'; return; }
        var img = new Image();
        img.onload = function () {
          var r = img.width / img.height, ok = !M[id].r || Math.abs(r - M[id].r) / M[id].r < 0.08;
          d.textContent = (ok ? '✓ ' : '⚠ ') + 'Sua imagem: ' + img.width + ' × ' + img.height + ' px. ' + (ok ? 'Proporção boa.' : M[id].t + ' — fora dessa proporção ela será cortada.');
          d.style.color = ok ? '#1b6b34' : '#b3501a';
          URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(f);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
