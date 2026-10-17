import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = 'aster:prefs';
export const PADRAO = {
  verso: { ligado: false, h: 7, m: 0 },
  devocional: { ligado: false, h: 20, m: 0 },
  perguntou: false
};

export async function lerPrefs() {
  try {
    const s = await AsyncStorage.getItem(CHAVE);
    const p = s ? JSON.parse(s) : {};
    return { ...PADRAO, ...p, verso: { ...PADRAO.verso, ...(p.verso || {}) }, devocional: { ...PADRAO.devocional, ...(p.devocional || {}) } };
  } catch (e) { return PADRAO; }
}
export async function salvarPrefs(p) {
  try { await AsyncStorage.setItem(CHAVE, JSON.stringify(p)); } catch (e) {}
}
