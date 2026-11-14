// Conta do leitor no app: entrar com e-mail e senha (mesma conta do site) e continuar conectado.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const CHAVE_API = 'AIzaSyBUi483K7vRuzFW8pKJdxp7K5j7pqTWfrA';
const AUTH = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const TOKEN = 'https://securetoken.googleapis.com/v1/token?key=' + CHAVE_API;
const FS = 'https://firestore.googleapis.com/v1/projects/aster-9adab/databases/(default)/documents';
const CAB = { 'Content-Type': 'application/json', Referer: 'https://projetoaster.com.br/' };
const GUARDA = 'aster:conta';

let atual = null;
let carregou = false;
const ouvintes = new Set();
const avisar = () => ouvintes.forEach(f => { try { f(atual); } catch (e) {} });

const MSG = {
  EMAIL_NOT_FOUND: 'Não existe conta com este e-mail.',
  INVALID_PASSWORD: 'Senha incorreta.',
  INVALID_LOGIN_CREDENTIALS: 'E-mail ou senha incorretos.',
  EMAIL_EXISTS: 'Este e-mail já tem cadastro. Use "Entrar".',
  WEAK_PASSWORD: 'A senha precisa ter pelo menos 6 caracteres.',
  INVALID_EMAIL: 'E-mail inválido.',
  USER_DISABLED: 'Esta conta foi desativada.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'Muitas tentativas. Espere um pouco e tente de novo.'
};
function erro(r) {
  const c = String((r && r.error && r.error.message) || '').split(' ')[0];
  return new Error(MSG[c] || 'Não foi possível concluir. Verifique a internet e tente de novo.');
}
async function post(url, corpo) {
  let r;
  try { r = await fetch(url, { method: 'POST', headers: CAB, body: JSON.stringify(corpo) }); }
  catch (e) { throw new Error('Sem conexão com a internet.'); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw erro(j);
  return j;
}
async function guardar() {
  try { if (atual) await AsyncStorage.setItem(GUARDA, JSON.stringify(atual)); else await AsyncStorage.removeItem(GUARDA); } catch (e) {}
}

export async function iniciarConta() {
  if (carregou) return atual;
  try { const s = await AsyncStorage.getItem(GUARDA); atual = s ? JSON.parse(s) : null; } catch (e) { atual = null; }
  carregou = true; avisar();
  return atual;
}

// Token válido (renova sozinho quando vence) — por isso a pessoa não precisa entrar de novo.
export async function tokenValido() {
  await iniciarConta();
  if (!atual) return null;
  if (Date.now() < (atual.expira || 0) - 60000) return atual.idToken;
  try {
    const r = await fetch(TOKEN, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Referer: CAB.Referer }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(atual.refreshToken) });
    const j = await r.json();
    if (!r.ok) { if (j && j.error && /TOKEN|USER/.test(String(j.error.message))) { atual = null; await guardar(); avisar(); } return null; }
    atual = { ...atual, idToken: j.id_token, refreshToken: j.refresh_token, expira: Date.now() + Number(j.expires_in) * 1000 };
    await guardar();
    return atual.idToken;
  } catch (e) { return atual.idToken; } // sem internet: mantém a pessoa conectada
}

async function nomeDoPerfil(uid, idToken) {
  try {
    const r = await fetch(FS + '/usuarios/' + uid, { headers: { ...CAB, Authorization: 'Bearer ' + idToken } });
    if (!r.ok) return null;
    const d = await r.json();
    const f = d.fields || {};
    return { nome: f.nome && f.nome.stringValue, cargo: f.cargo && f.cargo.stringValue };
  } catch (e) { return null; }
}

function montar(j, extra) {
  return { uid: j.localId, email: j.email, nome: (extra && extra.nome) || j.displayName || '', cargo: (extra && extra.cargo) || 'leitor', idToken: j.idToken, refreshToken: j.refreshToken, expira: Date.now() + Number(j.expiresIn || 3600) * 1000 };
}

export async function entrar(email, senha) {
  const j = await post(AUTH + 'signInWithPassword?key=' + CHAVE_API, { email: String(email).trim(), password: senha, returnSecureToken: true });
  const p = await nomeDoPerfil(j.localId, j.idToken);
  atual = montar(j, p || {}); await guardar(); avisar();
  return atual;
}

export async function cadastrar(nome, email, senha) {
  const j = await post(AUTH + 'signUp?key=' + CHAVE_API, { email: String(email).trim(), password: senha, returnSecureToken: true });
  try {
    await fetch(FS + '/usuarios/' + j.localId, {
      method: 'PATCH', headers: { ...CAB, Authorization: 'Bearer ' + j.idToken },
      body: JSON.stringify({ fields: { nome: { stringValue: nome }, email: { stringValue: String(email).trim() }, cargo: { stringValue: 'leitor' }, criadoEm: { timestampValue: new Date().toISOString() } } })
    });
  } catch (e) {}
  atual = montar(j, { nome, cargo: 'leitor' }); await guardar(); avisar();
  return atual;
}

export async function recuperarSenha(email) {
  await post(AUTH + 'sendOobCode?key=' + CHAVE_API, { requestType: 'PASSWORD_RESET', email: String(email).trim() });
}

export async function sair() { atual = null; await guardar(); avisar(); }

export function useConta() {
  const [c, setC] = useState(atual);
  const [pronto, setPronto] = useState(carregou);
  useEffect(() => {
    const f = v => { setC(v); setPronto(true); };
    ouvintes.add(f);
    iniciarConta().then(v => { setC(v); setPronto(true); });
    return () => { ouvintes.delete(f); };
  }, []);
  return { conta: c, pronto };
}
