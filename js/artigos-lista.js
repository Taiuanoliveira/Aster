// Projeto Aster – lista pública de artigos: categorias, tags e destaques vindos do painel
import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ms = v => { try { return v && v.toMillis ? v.toMillis() : (new Date(v).getTime() || 0); } catch (e) { return 0; } };
const slugDe = nome => String(nome || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
const corOk = c => /^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#0C3B5C';
const lerOpcional = async nome => { try { return (await getDocs(collection(db, nome))).docs.map(d => d.data()); } catch (e) { return []; } };

export function dataCurta(v) {
  try { const d = v && v.toDate ? v.toDate() : new Date(v); return isNaN(d) ? '' : d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; }
}

export async function carregarTaxonomia() {
  const [cs, ts, ds] = await Promise.all([lerOpcional('categorias'), lerOpcional('tags'), lerOpcional('destaques')]);
  const cats = {}, tags = {}, dest = {};
  cs.sort((a, b) => (a.ordem || 0) - (b.ordem || 0)).forEach(c => { cats[c.slug || slugDe(c.nome)] = { nome: c.nome, emoji: c.emoji || '' }; });
  ts.forEach(t => { tags[t.slug || slugDe(t.nome)] = { nome: t.nome }; });
  ds.forEach(d => { dest[d.nome] = { emoji: d.emoji || '', cor: corOk(d.cor) }; });
  return { cats, tags, dest };
}

// Artigos visíveis: publicados + os indexados em edições já publicadas
export async function carregarArtigos() {
  const [pub, idx, eds, tx] = await Promise.all([
    getDocs(query(collection(db, 'noticias'), where('status', '==', 'publicado'))),
    getDocs(query(collection(db, 'noticias'), where('status', '==', 'indexado'))),
    getDocs(query(collection(db, 'edicoes'), where('status', '==', 'publicada'))),
    carregarTaxonomia()
  ]);
  const nomesEd = new Set(eds.docs.map(d => d.data().nome));
  const artigos = [...pub.docs.filter(d => !d.data().edicao || nomesEd.has(d.data().edicao)), ...idx.docs.filter(d => nomesEd.has(d.data().edicao))]
    .map(d => ({ id: d.id, ...d.data() })).sort((a, b) => ms(b.criadoEm) - ms(a.criadoEm));
  if (!artigos.length) {
    try { const dm = await (await import('./demo.js')).carregarDemo(); if (dm) return { artigos: dm.artigos, ...dm.tx }; } catch (e) {}
  }
  return { artigos, ...tx };
}

export function injetarEstilos() {
  if (document.getElementById('aa-estilos')) return;
  const s = document.createElement('style'); s.id = 'aa-estilos';
  s.textContent = `.aa-grade{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px}
.aa-card{display:flex;flex-direction:column;background:#fff;border:1px solid #e6e2d8;border-radius:12px;overflow:hidden;text-decoration:none;color:#1a1a1a}
.aa-card:hover{border-color:#E8A33D}
.aa-img{aspect-ratio:16/9;background:#0C3B5C center/cover;display:flex;align-items:center;justify-content:center;color:#E8A33D;font-size:28px}
.aa-corpo{padding:14px 16px 16px;display:flex;flex-direction:column;gap:6px}
.aa-cat{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#1F5A82}
.aa-card h3{font-family:'Playfair Display',serif;font-size:19px;line-height:1.3;color:#0C3B5C;margin:0}
.aa-card p{font-size:14px;color:#666;margin:0}
.aa-meta{font-size:12px;color:#888}
.aa-badge{display:inline-block;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;margin-right:6px}
.aa-chips{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 22px}
.aa-chip{padding:6px 14px;border-radius:999px;border:1px solid #d8d3c4;background:#fff;font-size:13px;color:#0C3B5C;text-decoration:none;cursor:pointer}
.aa-chip.on{background:#0C3B5C;color:#fff;border-color:#0C3B5C}
.aa-busca{width:100%;padding:11px 14px;border:1px solid #d8d3c4;border-radius:10px;font:inherit;margin-bottom:16px;background:#fff}
.aa-tags{margin-top:28px;display:flex;gap:8px;flex-wrap:wrap}
.aa-tags a{font-size:13px;color:#1F5A82;background:#eef6fb;padding:4px 10px;border-radius:999px;text-decoration:none}`;
  document.head.appendChild(s);
}

export function cartaoHTML(a, tx) {
  const slug = (a.categorias && a.categorias[0]) || a.categoria || '';
  const c = tx.cats[slug];
  const d = a.destaque && tx.dest[a.destaque];
  const img = a.imagemUrl && /^https:\/\//i.test(a.imagemUrl) ? ' style="background-image:url(\'' + esc(a.imagemUrl) + '\')"' : '';
  return '<a class="aa-card" href="noticia.html?id=' + encodeURIComponent(a.id) + '"><div class="aa-img"' + img + '>' + (img ? '' : '✦') + '</div><div class="aa-corpo">' +
    '<span class="aa-cat">' + esc(c ? (c.emoji ? c.emoji + ' ' : '') + c.nome : slug) + '</span>' +
    (d ? '<div><span class="aa-badge" style="background:' + d.cor + '">' + esc((d.emoji ? d.emoji + ' ' : '') + a.destaque) + '</span></div>' : '') +
    '<h3>' + esc(a.titulo) + '</h3>' + (a.resumo ? '<p>' + esc(a.resumo) + '</p>' : '') +
    '<span class="aa-meta">' + esc(a.autorNome || '') + (a.autorNome ? ' · ' : '') + esc(dataCurta(a.criadoEm)) + '</span></div></a>';
}
