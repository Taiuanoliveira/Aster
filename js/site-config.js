// Projeto Aster – aplica no site o que o administrador configurou no painel:
// logo, rodapé, contatos, redes sociais, links institucionais e a lista "Em alta".
// Se o banco falhar ou estiver vazio, o site continua com os textos padrão.
import { db } from './firebase-config.js';
import { iconesSite } from './redes.js';
import { doc, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const limite = (p, ms = 4000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('tempo esgotado')), ms))]);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const https = u => typeof u === 'string' && /^https:\/\//i.test(u.trim());
const linkOk = u => typeof u === 'string' && (/^https?:\/\//i.test(u.trim()) || /^[\w\-./]+\.html$/i.test(u.trim()));

async function lerGeral() {
  try { const s = await limite(getDoc(doc(db, 'configuracoes', 'geral'))); return s.exists() ? s.data() : null; }
  catch (e) { return null; }
}
async function lerLista(nome) {
  try {
    const s = await limite(getDocs(collection(db, nome)));
    return s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  } catch (e) { return []; }
}

export async function aplicarConfigSite() {
  const [c, inst] = await Promise.all([lerGeral(), lerLista('institucional')]);
  const nome = c && c.logoTexto ? String(c.logoTexto).trim() : '';

  if (c) {
    document.querySelectorAll('.logo-aster').forEach(a => {
      if (https(c.logoUrl)) a.innerHTML = '<img src="' + esc(c.logoUrl) + '" alt="" style="height:30px;width:auto;border-radius:4px"> ' + esc(nome || 'Projeto Aster');
      else if (nome) a.innerHTML = '<img class="logo-img" src="img/logo.svg" alt="" width="32" height="32"> ' + esc(nome);
    });
  }

  const rod = document.querySelector('body > footer');
  if (!rod || (!c && !inst.length)) return;
  const p = 'style="margin:0"';
  const partes = [];
  if (c && c.footerDescricao) partes.push('<p style="margin:0;max-width:560px;line-height:1.6">' + esc(c.footerDescricao) + '</p>');
    const redesHTML = c ? iconesSite(c) : '';
    if (redesHTML) partes.push('<div class="redes-rodape">' + redesHTML + '</div>');
  const contato = [];
  if (c && c.emailContato) contato.push('<a href="mailto:' + esc(c.emailContato) + '">' + esc(c.emailContato) + '</a>');
  if (c && c.telefoneContato) contato.push(esc(c.telefoneContato));
  if (c && c.enderecoContato) contato.push(esc(c.enderecoContato));
  if (contato.length) partes.push('<p ' + p + '>' + contato.join(' · ') + '</p>');
  const links = ['<a href="termos.html">Termos de uso</a>', '<a href="privacidade.html">Privacidade</a>']
    .concat(inst.filter(i => linkOk(i.link)).map(i => '<a href="' + esc(i.link) + '"' + (/^https?:/i.test(i.link) ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(i.titulo) + '</a>'));
  partes.push('<p ' + p + '><img class="logo-rodape" src="img/logo.svg" alt="" width="18" height="18" style="vertical-align:middle;margin-right:6px">' + esc(nome || 'Projeto Aster') + ' · ' + links.join(' · ') + '</p>');
  rod.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:8px">' + partes.join('') + '</div>';
}

export async function montarEmAlta() {
  const secao = document.getElementById('em-alta-secao'), lista = document.getElementById('emAltaLista');
  if (!secao || !lista) return;
  const itens = await lerLista('emAlta');
  if (!itens.length) return;
  lista.innerHTML = itens.map(i => '<li>' + (linkOk(i.link)
    ? '<a href="' + esc(i.link) + '"' + (/^https?:/i.test(i.link) ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(i.titulo) + '</a>'
    : esc(i.titulo)) + '</li>').join('');
  secao.style.display = 'block';
}
