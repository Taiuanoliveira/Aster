// Projeto Aster - o menu mostra "Minha conta" quando a pessoa ja esta logada (o login fica salvo no navegador).
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const CHAVE = 'aster_logado';
let logado = false;
try { logado = localStorage.getItem(CHAVE) === '1'; } catch (e) {}

function aplicar() {
  document.querySelectorAll('a[href="login.html"], a[href="conta.html"][data-aster-menu]').forEach((a) => {
    if (a.closest('.comentario-login, .hr-nota, .mv-nota')) return;
    if (!a.closest('nav, header, .nav-topo')) return;
    if (logado) { if (a.getAttribute('href') !== 'conta.html') a.setAttribute('href', 'conta.html'); a.setAttribute('data-aster-menu', '1'); if (a.textContent !== 'Minha conta') a.textContent = 'Minha conta'; }
  });
  document.querySelectorAll('a[data-aster-menu]').forEach((a) => {
    if (!logado) { a.setAttribute('href', 'login.html'); a.removeAttribute('data-aster-menu'); if (a.textContent !== 'Entrar') a.textContent = 'Entrar'; }
  });
}

aplicar();
document.addEventListener('DOMContentLoaded', aplicar);
let marcado = false;
new MutationObserver(() => { if (marcado) return; marcado = true; setTimeout(() => { marcado = false; aplicar(); }, 50); }).observe(document.documentElement, { childList: true, subtree: true });
onAuthStateChanged(auth, (u) => {
  logado = !!u;
  try { localStorage.setItem(CHAVE, u ? '1' : '0'); } catch (e) {}
  aplicar();
});
