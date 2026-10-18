import { LIVROS } from './livros';

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

// "Hebreus 11:1" -> { l: índice do livro, c: capítulo } (ou null)
export function refParaPos(ref) {
  const m = /^(.+?)\s+(\d+)(?::.*)?$/.exec(String(ref || '').trim());
  if (!m) return null;
  let nome = norm(m[1]);
  if (nome === 'salmo') nome = 'salmos';
  const l = LIVROS.findIndex(x => norm(x[0]) === nome);
  if (l < 0) return null;
  return { l, c: Math.min(Math.max(1, +m[2]), LIVROS[l][2]) };
}

// destino para abrir a aba Bíblia já no capítulo certo
export function destinoBiblia(pos) {
  if (!pos) return { pathname: '/biblia' };
  return { pathname: '/biblia', params: { l: String(pos.l), c: String(pos.c), t: String(Date.now()) } };
}
