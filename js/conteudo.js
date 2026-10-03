// Projeto Aster – leitura do conteúdo editável (feito no painel). Se algo falhar, as páginas usam o conteúdo padrão.
import { db } from './firebase-config.js';
import { collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const limite = (p, ms = 4000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
export async function lerColecao(nome) {
  try {
    const s = await limite(getDocs(collection(db, nome)));
    return s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  } catch (e) { return []; }
}
export async function lerDoc(col, id) {
  try { const s = await limite(getDoc(doc(db, col, id))); return s.exists() ? s.data() : null; }
  catch (e) { return null; }
}
