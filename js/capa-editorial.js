import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
try {
  const s = await getDocs(collection(db, 'edicoes'));
  const l = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.status === 'publicada')
    .sort((a, b) => String(b.criadoEm || '').localeCompare(String(a.criadoEm || '')));
  if (l[0]) {
    const e = l[0], $ = id => document.getElementById(id);
    $('edNome').textContent = e.nome || '';
    $('edTema').textContent = 'Edição' + (e.numero ? ' nº ' + e.numero : ' atual') + (e.especial ? ' · Especial' : '') + (e.tema ? ' · ' + e.tema : '');
    if (e.descricao) $('edDesc').textContent = e.descricao;
    const c = $('edCapa');
    if (e.capaUrl) {
      c.style.backgroundImage = 'url("' + String(e.capaUrl).replace(/["\\()]/g, '') + '")';
      c.style.backgroundSize = 'cover'; c.style.backgroundPosition = 'center';
      c.textContent = '';
    } else {
      c.style.cssText += ';display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;padding:14px;background:linear-gradient(160deg,#0C3B5C,#1F5A82)';
      c.innerHTML = '<span style="font-size:26px;color:#E8A33D">✦</span><span style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#E8A33D;font-weight:700">' +
        esc(e.especial ? 'Especial' : (e.numero ? 'Nº ' + e.numero : 'Edição')) + '</span><strong style="font-size:16px;color:#fff;font-weight:600">' + esc(e.nome) + '</strong>';
    }
    $('edLink').href = 'edicao.html?id=' + encodeURIComponent(e.id);
    $('edLink').textContent = 'Ler a edição';
  }
} catch (err) { console.error(err); }
