import { useColorScheme } from 'react-native';
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SITE = 'https://projetoaster.com.br';

const claro = { bg: '#FBFAF6', texto: '#000000', cinza: '#5b6770', card: '#FFFFFF', borda: '#E3DDD0', azul: '#3056FF', amarelo: '#FFFD73', link: '#3056FF', suave: '#EEF1FF' };
const escuro = { bg: '#0F1720', texto: '#FFFFFF', cinza: '#9fb0bd', card: '#1B2430', borda: '#2A3442', azul: '#3056FF', amarelo: '#FFFD73', link: '#8CC4EA', suave: '#16233A' };

// preferência de tema: 'auto' (segue o celular), 'claro' ou 'escuro'
let pref = 'auto';
const ouvintes = new Set();
const avisar = () => ouvintes.forEach(f => f());
AsyncStorage.getItem('aster:tema').then(v => { if (v === 'claro' || v === 'escuro' || v === 'auto') { pref = v; avisar(); } }).catch(() => {});

export function definirTema(p) {
  pref = p; avisar();
  AsyncStorage.setItem('aster:tema', p).catch(() => {});
}
function usarPref() {
  return useSyncExternalStore(f => { ouvintes.add(f); return () => ouvintes.delete(f); }, () => pref, () => pref);
}
export function usePrefTema() { return usarPref(); }

export function useTema() {
  const esquema = useColorScheme();
  const p = usarPref();
  const dark = p === 'escuro' || (p === 'auto' && esquema === 'dark');
  return { ...(dark ? escuro : claro), escuro: dark };
}
