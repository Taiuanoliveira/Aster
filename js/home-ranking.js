// Projeto Aster - ranking do quiz (semana, mes e geral). So entra quem estiver logado e quiser aparecer.
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { collection, doc, getDoc, getDocs, query, orderBy, limit, writeBatch, increment, serverTimestamp, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const raiz = document.getElementById('hx-rank');
if (raiz) iniciar();

function iniciar() {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const semanaChave = (d) => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), dia = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dia);
    const n = Math.ceil(((t - new Date(Date.UTC(t.getUTCFullYear(), 0, 1))) / 86400000 + 1) / 7);
    return t.getUTCFullYear() + '-W' + String(n).padStart(2, '0');
  };
  const mesChave = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  const ABAS = [['semana', 'Semana'], ['mes', 'Mês'], ['geral', 'Geral']];
  let aba = 'semana', usuario = null, aviso = '', pendente = 0;

  const chaveOk = (u) => 'aster_rank_' + u.uid;
  const participa = () => { try { return !!usuario && localStorage.getItem(chaveOk(usuario)) === '1'; } catch (e) { return false; } };
  const colecaoDe = (a) => {
    const hoje = new Date();
    if (a === 'geral') return collection(db, 'ranking_geral');
    if (a === 'mes') return collection(db, 'ranking_meses', mesChave(hoje), 'jogadores');
    return collection(db, 'ranking_semanas', semanaChave(hoje), 'jogadores');
  };
  const refsDe = (uid, d) => [doc(db, 'ranking_geral', uid), doc(db, 'ranking_semanas', semanaChave(d), 'jogadores', uid), doc(db, 'ranking_meses', mesChave(d), 'jogadores', uid)];

  async function perfil() {
    let nome = usuario.displayName || '', foto = usuario.photoURL || '';
    try { const s = await getDoc(doc(db, 'usuarios', usuario.uid)); if (s.exists()) { nome = s.data().nome || nome; foto = s.data().fotoUrl || foto; } } catch (e) {}
    const p = nome.trim().split(/\s+/).filter(Boolean);
    nome = p.length > 1 ? p[0] + ' ' + p[p.length - 1][0].toUpperCase() + '.' : (p[0] || 'Leitor');
    return { nome: nome.slice(0, 40), foto: /^https:\/\//.test(foto) && foto.length <= 500 ? foto : '' };
  }

  async function enviar(pontos) {
    if (!usuario || !participa() || pontos < 1) return;
    try {
      const { nome, foto } = await perfil(), b = writeBatch(db);
      refsDe(usuario.uid, new Date()).forEach((r) => b.set(r, { nome, foto, pontos: increment(Math.min(10, pontos)), rodadas: increment(1), atualizado: serverTimestamp() }, { merge: true }));
      await b.commit();
      aviso = '+' + pontos + (pontos === 1 ? ' ponto' : ' pontos') + ' no ranking!';
    } catch (e) {
      console.warn('ranking', e);
      aviso = e && e.code === 'permission-denied' ? 'Espere alguns segundos entre uma rodada e outra para pontuar.' : 'Não foi possível salvar sua pontuação agora.';
    }
    pendente = 0; desenhar();
  }

  async function sair() {
    if (!usuario || !confirm('Sair do ranking? Seus pontos e seu nome serão apagados.')) return;
    const hoje = new Date(), tarefas = [deleteDoc(doc(db, 'ranking_geral', usuario.uid))];
    for (let i = 0; i < 30; i++) { const d = new Date(hoje.getTime() - i * 7 * 86400000); tarefas.push(deleteDoc(doc(db, 'ranking_semanas', semanaChave(d), 'jogadores', usuario.uid))); }
    for (let i = 0; i < 14; i++) { const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1); tarefas.push(deleteDoc(doc(db, 'ranking_meses', mesChave(d), 'jogadores', usuario.uid))); }
    await Promise.allSettled(tarefas);
    try { localStorage.removeItem(chaveOk(usuario)); } catch (e) {}
    aviso = 'Você saiu do ranking.'; desenhar();
  }

  function avatar(j) {
    return j.foto ? '<img class="hr-av" src="' + esc(j.foto) + '" alt="" loading="lazy" referrerpolicy="no-referrer">'
      : '<span class="hr-av hr-ini">' + esc((j.nome || '?')[0].toUpperCase()) + '</span>';
  }

  async function lista() {
    try {
      const s = await getDocs(query(colecaoDe(aba), orderBy('pontos', 'desc'), limit(10)));
      if (s.empty) return '<p class="hr-vazio">Ninguém pontuou ' + (aba === 'geral' ? 'ainda' : aba === 'mes' ? 'neste mês' : 'nesta semana') + '. Seja o primeiro!</p>';
      return '<ol class="hr-lista">' + s.docs.map((d, i) => {
        const j = d.data(), eu = usuario && d.id === usuario.uid;
        return '<li class="hr-item' + (eu ? ' hr-eu' : '') + '"><span class="hr-pos">' + (i + 1) + '</span>' + avatar(j) + '<span class="hr-nome">' + esc(j.nome || 'Leitor') + (eu ? ' <em>(você)</em>' : '') + '</span><span class="hr-pts">' + esc(j.pontos) + ' pts</span></li>';
      }).join('') + '</ol>';
    } catch (e) { console.warn('ranking', e); return '<p class="hr-vazio">Não foi possível carregar o ranking agora.</p>'; }
  }

  async function desenhar() {
    const abas = ABAS.map(([k, l]) => '<button type="button" class="hr-aba' + (k === aba ? ' on' : '') + '" data-a="' + k + '">' + l + '</button>').join('');
    let acao = '';
    if (!usuario) acao = '<p class="hr-nota">Quer aparecer no ranking? <a href="login.html">Entre na sua conta</a> e jogue uma rodada.</p>';
    else if (!participa()) acao = '<div class="hr-nota">Quer aparecer no ranking com seu nome e foto? ' + (pendente ? 'Sua última rodada (' + pendente + ' pontos) será contada. ' : '') + '<button type="button" class="hx-btn hr-entrar" data-x="entrar">Entrar no ranking</button></div>';
    else acao = '<p class="hr-nota">Você está no ranking. <button type="button" class="hr-link" data-x="sair">Sair do ranking</button></p>';
    raiz.innerHTML = '<div class="hr-topo"><h3>Ranking do quiz</h3><p>Quem mais conhece a Palavra. O da semana e o do mês começam do zero.</p></div><div class="hr-abas">' + abas + '</div><div class="hr-corpo">Carregando…</div>' + (aviso ? '<p class="hr-aviso">' + esc(aviso) + '</p>' : '') + acao;
    raiz.querySelector('.hr-corpo').innerHTML = await lista();
  }

  raiz.addEventListener('click', (e) => {
    const a = e.target.closest('.hr-aba'); if (a) { aba = a.dataset.a; aviso = ''; desenhar(); return; }
    const x = e.target.closest('[data-x]'); if (!x) return;
    if (x.dataset.x === 'entrar') { try { localStorage.setItem(chaveOk(usuario), '1'); } catch (er) {} const p = pendente; aviso = ''; if (p) enviar(p); else desenhar(); }
    if (x.dataset.x === 'sair') sair();
  });
  document.addEventListener('hx-fim-rodada', (e) => {
    const p = (e.detail && e.detail.pontos) || 0; pendente = p;
    if (participa()) enviar(p); else desenhar();
  });
  onAuthStateChanged(auth, (u) => { usuario = u; desenhar(); });
  desenhar();
}
