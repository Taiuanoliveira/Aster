/* Projeto Aster - imagem do versiculo para compartilhar (Instagram, WhatsApp, Stories) */
(function () {
  var W = 1080, H = 1350;
  var ESTILOS = {
    escuro: { bg: ['#3d3d3d', '#141414'], txt: '#f5f5f5', sub: '#bdbdbd', marca: 'rgba(255,255,255,.045)', linha: 'rgba(255,255,255,.28)' },
    claro: { bg: ['#ffffff', '#e8e8e6'], txt: '#111111', sub: '#555555', marca: 'rgba(0,0,0,.04)', linha: 'rgba(0,0,0,.25)' }
  };
  var RAIOS = [[359.0, 221.8], [471.0, 277.2], [499.2, 400.5], [421.5, 498.6], [297.6, 499.2], [220.1, 400.5], [247.6, 276.4]];
  var CENTRO = [358.4, 367.0];

  function asterisco(ctx, cx, cy, raio, cor) {
    var e = raio / 150;
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = cor; ctx.lineWidth = 53 * e;
    RAIOS.forEach(function (p) {
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + (p[0] - CENTRO[0]) * e, cy + (p[1] - CENTRO[1]) * e); ctx.stroke();
    });
    ctx.restore();
  }

  function quebrar(ctx, texto, largura) {
    var palavras = texto.split(' '), linhas = [], atual = '';
    palavras.forEach(function (p) {
      var teste = atual ? atual + ' ' + p : p;
      if (ctx.measureText(teste).width > largura && atual) { linhas.push(atual); atual = p; } else atual = teste;
    });
    if (atual) linhas.push(atual);
    return linhas;
  }

  function fonte(tam) { return '600 ' + tam + 'px "Cormorant Garamond", Georgia, serif'; }

  async function gerar(o) {
    var e = ESTILOS[o.estilo] || ESTILOS.escuro;
    try {
      await Promise.all([document.fonts.load(fonte(60)), document.fonts.load('700 30px Manrope')]);
    } catch (x) {}
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var ctx = c.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, W * 0.35, H);
    g.addColorStop(0, e.bg[0]); g.addColorStop(1, e.bg[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    asterisco(ctx, W - 90, H - 120, 520, e.marca);

    // marca no topo
    asterisco(ctx, 120, 118, 34, e.txt);
    ctx.fillStyle = e.txt; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.font = '700 40px Manrope, Arial, sans-serif'; ctx.fillText('aster', 168, 120);

    // texto do versiculo, ajustado ao espaco
    var texto = String(o.texto || '').replace(/\s+/g, ' ').trim().replace(/^[“"']+|[”"']+$/g, '');
    var largura = W - 2 * 120, altura = 640, tam = 76, linhas, lh;
    for (; tam >= 34; tam -= 2) {
      ctx.font = fonte(tam); linhas = quebrar(ctx, '“' + texto + '”', largura); lh = tam * 1.3;
      if (linhas.length * lh <= altura) break;
    }
    if (linhas.length * lh > altura) {
      var pal = texto.split(' ');
      while (pal.length > 5) {
        pal.pop(); ctx.font = fonte(34);
        linhas = quebrar(ctx, '“' + pal.join(' ') + '…”', largura); lh = 34 * 1.3;
        if (linhas.length * lh <= altura) break;
      }
    }
    var y0 = 250 + (altura - linhas.length * lh) / 2 + lh / 2;
    ctx.fillStyle = e.txt; ctx.textAlign = 'center'; ctx.font = fonte(Math.min(tam, 76));
    linhas.forEach(function (l, i) { ctx.fillText(l, W / 2, y0 + i * lh); });

    // linha, referencia, edicao e endereco
    ctx.strokeStyle = e.linha; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 40, 1030); ctx.lineTo(W / 2 + 40, 1030); ctx.stroke();
    ctx.fillStyle = e.txt; ctx.font = '700 34px Manrope, Arial, sans-serif';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '4px';
    ctx.fillText(String(o.ref || '').toUpperCase(), W / 2, 1090);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    if (o.edicao) { ctx.fillStyle = e.sub; ctx.font = '500 25px Manrope, Arial, sans-serif'; ctx.fillText(o.edicao, W / 2, 1140); }
    ctx.fillStyle = e.sub; ctx.font = '600 24px Manrope, Arial, sans-serif'; ctx.fillText('projeto-aster.vercel.app', W / 2, 1255);
    return c;
  }

  function blobDe(c) { return new Promise(function (ok) { c.toBlob(ok, 'image/png'); }); }

  var CSS = '.ai-fundo{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:9999;display:flex;align-items:center;justify-content:center;padding:14px;font-family:Manrope,Arial,sans-serif}' +
    '.ai-card{background:#fff;color:#111;border-radius:18px;padding:16px;max-width:460px;width:100%;max-height:96vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.5)}' +
    '.ai-card canvas{width:100%;height:auto;max-height:58vh;object-fit:contain;border-radius:10px;border:1px solid #ddd;display:block;margin:0 auto 12px}' +
    '.ai-linha{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:8px}' +
    '.ai-card button{padding:10px 16px;border-radius:999px;border:1px solid #000;background:#fff;color:#000;font:600 13px Manrope,Arial,sans-serif;cursor:pointer}' +
    '.ai-card button.on,.ai-card button.pri{background:#000;color:#fff}';

  async function abrir(o) {
    if (!document.getElementById('ai-css')) { var s = document.createElement('style'); s.id = 'ai-css'; s.textContent = CSS; document.head.appendChild(s); }
    var estilo = 'escuro', canvas = null, blob = null;
    var fundo = document.createElement('div'); fundo.className = 'ai-fundo';
    fundo.innerHTML = '<div class="ai-card" role="dialog" aria-label="Imagem do versículo"><div class="ai-prev"></div>' +
      '<div class="ai-linha"><button data-e="escuro" class="on">Escuro</button><button data-e="claro">Claro</button></div>' +
      '<div class="ai-linha"><button class="pri" data-a="comp">Compartilhar</button><button data-a="baixar">Baixar imagem</button><button data-a="fechar">Fechar</button></div></div>';
    document.body.appendChild(fundo);
    var prev = fundo.querySelector('.ai-prev');
    function fechar() { fundo.remove(); document.removeEventListener('keydown', tecla); }
    function tecla(ev) { if (ev.key === 'Escape') fechar(); }
    document.addEventListener('keydown', tecla);
    fundo.addEventListener('click', function (ev) { if (ev.target === fundo) fechar(); });
    async function desenhar() {
      canvas = await gerar({ texto: o.texto, ref: o.ref, edicao: o.edicao, estilo: estilo });
      blob = await blobDe(canvas); prev.innerHTML = ''; prev.appendChild(canvas);
    }
    fundo.querySelectorAll('[data-e]').forEach(function (b) {
      b.onclick = function () {
        estilo = b.dataset.e; fundo.querySelectorAll('[data-e]').forEach(function (x) { x.classList.toggle('on', x === b); }); desenhar();
      };
    });
    var arq = function () { return new File([blob], 'versiculo-aster.png', { type: 'image/png' }); };
    fundo.querySelector('[data-a="baixar"]').onclick = function () {
      if (!blob) return; var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'versiculo-aster.png';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    };
    fundo.querySelector('[data-a="fechar"]').onclick = fechar;
    var bc = fundo.querySelector('[data-a="comp"]');
    bc.onclick = function () {
      if (!blob) return;
      if (navigator.canShare && navigator.canShare({ files: [arq()] })) navigator.share({ files: [arq()], text: o.ref + ' · Projeto Aster' }).catch(function () {});
      else fundo.querySelector('[data-a="baixar"]').click();
    };
    await desenhar();
  }

  window.AsterImagem = { gerar: gerar, abrir: abrir };
})();
