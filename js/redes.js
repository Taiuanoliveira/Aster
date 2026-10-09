// Projeto Aster – ícones de redes sociais (site e pessoas). Só links https são aceitos.
const SVG = d => '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const ROTULOS = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok', x: 'X', telegram: 'Telegram', whatsapp: 'WhatsApp', email: 'E-mail', site: 'Site' };
const ICONES = {
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".7" fill="currentColor"/>',
  facebook: '<path d="M14.5 21v-8h2.7l.5-3.2h-3.2V7.9c0-.9.4-1.6 1.7-1.6h1.6V3.5c-.3 0-1.3-.2-2.4-.2-2.6 0-4.1 1.5-4.1 4.2v2.3H8.6V13h2.7v8z" fill="currentColor" stroke="none"/>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2l4.8 2.8-4.8 2.8z" fill="currentColor" stroke="none"/>',
  tiktok: '<path d="M14 3.5v10.2a3.4 3.4 0 1 1-3.4-3.4"/><path d="M14 3.5c.3 2.4 1.8 3.9 4.2 4.1"/>',
  x: '<path d="M5 4.5l14 15M19 4.5l-14 15"/>',
  telegram: '<path d="M20.5 4.2L3.4 10.8l5.2 2 1.9 5.7 2.8-3.6 4.2 3.1z"/>',
  whatsapp: '<path d="M12 3.2a8.8 8.8 0 0 0-7.5 13.3L3.2 20.8l4.4-1.2A8.8 8.8 0 1 0 12 3.2z"/><path d="M9 8.6c.2 2.9 2.6 5.3 5.6 5.7l1.1-1.4-1.9-1-.9.7c-1-.4-1.8-1.2-2.2-2.2l.7-.9-1-1.9z" fill="currentColor" stroke="none"/>',
  email: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7.5l8 6 8-6"/>',
  site: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.5 3.5 5.3 3.5 8.5s-1.1 6-3.5 8.5c-2.4-2.5-3.5-5.3-3.5-8.5s1.1-6 3.5-8.5z"/>'
};
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const https = u => typeof u === 'string' && /^https:\/\//i.test(u.trim());
export function redeLink(tipo, url) {
  const externo = !/^mailto:/i.test(url);
  return '<a class="rede" href="' + esc(url) + '"' + (externo ? ' target="_blank" rel="noopener noreferrer"' : '') + ' aria-label="' + ROTULOS[tipo] + '" title="' + ROTULOS[tipo] + '">' + SVG(ICONES[tipo]) + '</a>';
}
// redes do site (Configurações do painel)
export function iconesSite(c) {
  return ['instagram', 'facebook', 'youtube', 'tiktok', 'x', 'telegram', 'whatsapp'].filter(t => c && https(c[t])).map(t => redeLink(t, c[t].trim())).join('');
}
// redes de uma pessoa da equipe (contatos: instagram, whatsapp, email, site)
export function iconesPessoa(c) {
  c = c || {}; const o = [];
  if (c.instagram) { const u = String(c.instagram).trim(); o.push(redeLink('instagram', https(u) ? u : 'https://instagram.com/' + encodeURIComponent(u.replace(/^@/, '')))); }
  if (c.whatsapp && /\d/.test(c.whatsapp)) o.push(redeLink('whatsapp', 'https://wa.me/' + encodeURIComponent(String(c.whatsapp).replace(/\D/g, ''))));
  if (c.email && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(c.email)) o.push(redeLink('email', 'mailto:' + c.email.trim()));
  if (https(c.site)) o.push(redeLink('site', c.site.trim()));
  return o.join('');
}
