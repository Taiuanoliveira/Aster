import { Linking } from 'react-native';

const https = u => typeof u === 'string' && /^https:\/\//i.test(u.trim());
export const ROTULOS = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok', x: 'X', telegram: 'Telegram', whatsapp: 'WhatsApp', email: 'E-mail', site: 'Site' };
export const ICONES = { instagram: 'logo-instagram', facebook: 'logo-facebook', youtube: 'logo-youtube', tiktok: 'logo-tiktok', x: 'logo-twitter', telegram: 'paper-plane-outline', whatsapp: 'logo-whatsapp', email: 'mail-outline', site: 'globe-outline' };

export function redesDoSite(c) {
  return ['instagram', 'facebook', 'youtube', 'tiktok', 'x', 'telegram', 'whatsapp']
    .filter(t => c && https(c[t])).map(t => ({ tipo: t, url: c[t].trim() }));
}
export function redesDaPessoa(c) {
  c = c || {}; const o = [];
  if (c.instagram) { const u = String(c.instagram).trim(); o.push({ tipo: 'instagram', url: https(u) ? u : 'https://instagram.com/' + encodeURIComponent(u.replace(/^@/, '')) }); }
  if (c.whatsapp && /\d/.test(c.whatsapp)) o.push({ tipo: 'whatsapp', url: 'https://wa.me/' + encodeURIComponent(String(c.whatsapp).replace(/\D/g, '')) });
  if (c.email && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(c.email)) o.push({ tipo: 'email', url: 'mailto:' + String(c.email).trim() });
  if (https(c.site)) o.push({ tipo: 'site', url: c.site.trim() });
  return o;
}
export function abrirLink(url) { Linking.openURL(url).catch(() => {}); }
