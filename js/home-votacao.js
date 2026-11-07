// Projeto Aster - melhor texto da semana: cada leitor logado vota uma vez por semana.
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc, getDocs, collection, writeBatch, increment, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { listarPublicadas } from './noticias.js';

const sec = document.getElementById('melhor-semana'), corpo = document.getElementById('mv-corpo');
if (sec && corpo) iniciar();

function iniciar() {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const semanaChave = (d) => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), dia = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dia);
    const n = Math.ceil(((t - new Date(Date.UTC(t.getUTCFullYear(), 0, 1))) / 86400000 + 1) / 7);
    return t.getUTCFullYear() + '-W' + String(n).padStart(2, '0');
  };
  const ms = (t) => (t && t.seconds ? t.seconds * 1000 : 0);
  const agora = new Date(), semana = semanaChave(agora), passada = semanaChave(new Date(agora.getTime() - 7 * 86400000));
  let usuario = null, artigos = [], votos = {}, passadoTop = null, meuVoto = '', aviso = '', pronto = false;

  async function votosDe(s) {
    const r = {};
    try { (await getDocs(collection(db, 'votos_semana', s, 'artigos'))).forEach((d) => { r[d.id] = d.data().votos || 0; }); } catch (e) { console.warn('votos', e); }
    return r;
  }
  async function carregar() {
    try {
      const todos = await listarPublicadas(40);
      const corte = Date.now() - 14 * 86400000;
      artigos = todos.filter((a) => ms(a.criadoEm) >= corte).slice(0, 6);
      votos = await votosDe(semana);
      const vp = await votosDe(passada), melhor = Object.keys(vp).sort((a, b) => vp[b] - vp[a])[0];
      passadoTop = melhor ? todos.find((a) => a.id === melhor) || null : null;
    } catch (e) { console.warn('votacao', e); artigos = []; }
    pronto = true;
  }
  async function meu() {
    meuVoto = '';
    if (!usuario) return;
    try { const s = await getDoc(doc(db, 'votos_semana', semana, 'eleitores', usuario.uid)); if (s.exists()) meuVoto = s.data().noticiaId || ''; } catch (e) {}
  }
  async function votar(id) {
    if (!usuario || meuVoto) return;
    try {
      const b = writeBatch(db);
      b.set(doc(db, 'votos_semana', semana, 'eleitores', usuario.uid), { noticiaId: id, em: serverTimestamp() });
      b.set(doc(db, 'votos_semana', semana, 'artigos', id), { votos: increment(1) }, { merge: true });
      await b.commit();
      meuVoto = id; votos[id] = (votos[id] || 0) + 1; aviso = 'Voto registrado. Obrigado!';
    } catch (e) { console.warn('votar', e); aviso = 'Não foi possível votar agora. Tente de novo em instantes.'; }
    desenhar();
  }
  function desenhar() {
    if (!pronto || !artigos.length) { sec.style.display = 'none'; return; }
    sec.style.display = '';
    const lista = artigos.slice().sort((a, b) => (votos[b.id] || 0) - (votos[a.id] || 0));
    const lider = (votos[lista[0].id] || 0) > 0 ? lista[0].id : '';
    let h = passadoTop ? '<p class="mv-pass">Melhor texto da semana passada: <a href="noticia.html?id=' + encodeURIComponent(passadoTop.id) + '">' + esc(passadoTop.titulo) + '</a></p>' : '';
    h += '<ol class="mv-lista">' + lista.map((a) => {
      const n = votos[a.id] || 0, meu = meuVoto === a.id;
      const bt = !usuario ? '' : meuVoto ? (meu ? '<span class="mv-ok">Seu voto</span>' : '') : '<button type="button" class="mv-bt" data-id="' + esc(a.id) + '">Votar</button>';
      return '<li class="mv-item' + (a.id === lider ? ' mv-lider' : '') + '"><a class="mv-tit" href="noticia.html?id=' + encodeURIComponent(a.id) + '">' + esc(a.titulo) + '<small>' + esc(a.autorNome || '') + '</small></a><span class="mv-n">' + n + (n === 1 ? ' voto' : ' votos') + '</span>' + bt + '</li>';
    }).join('') + '</ol>';
    h += aviso ? '<p class="mv-aviso">' + esc(aviso) + '</p>' : '';
    h += usuario ? (meuVoto ? '' : '<p class="mv-nota">Um voto por semana, e ele não pode ser trocado.</p>') : '<p class="mv-nota"><a href="login.html">Entre na sua conta</a> para votar.</p>';
    corpo.innerHTML = h;
  }
  corpo.addEventListener('click', (e) => { const b = e.target.closest('.mv-bt'); if (b) votar(b.dataset.id); });
  onAuthStateChanged(auth, async (u) => { usuario = u; await meu(); desenhar(); });
  carregar().then(desenhar);
}
