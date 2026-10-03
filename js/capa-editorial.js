import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
try {
  const s = await getDocs(collection(db, 'edicoes'));
  const l = s.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.status === 'publicada')
    .sort((a, b) => String(b.criadoEm || '').localeCompare(String(a.criadoEm || '')));
  if (l[0]) {
    const e = l[0], $ = id => document.getElementById(id);
    $('edNome').textContent = e.nome || '';
    $('edTema').textContent = 'Edição' + (e.numero ? ' nº ' + e.numero : ' atual') + (e.especial ? ' · Especial' : '') + (e.tema ? ' · ' + e.tema : '');
    if (e.descricao) $('edDesc').textContent = e.descricao;
    if (e.capaUrl) {
      const c = $('edCapa');
      c.style.backgroundImage = 'url("' + String(e.capaUrl).replace(/["\\()]/g, '') + '")';
      c.style.backgroundSize = 'cover'; c.style.backgroundPosition = 'center';
      c.textContent = '';
    }
    $('edLink').href = 'edicao.html?id=' + encodeURIComponent(e.id);
    $('edLink').textContent = 'Ler a edição';
  }
} catch (err) { console.error(err); }
