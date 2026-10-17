import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { referenciaDe } from './versiculos';
import { DEVOCIONAIS_PADRAO } from './devocionais_padrao';
import { diaDoAno } from './datas';

const NATIVO = Platform.OS !== 'web';
const DIAS_A_FRENTE = 28; // 2 tipos x 28 = 56 agendadas (o iPhone aceita até 64)
let N = null;
function mod() { if (!NATIVO) return null; if (!N) N = require('expo-notifications'); return N; }

export function configurarNotificacoes() {
  const n = mod(); if (!n) return;
  n.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false })
  });
  if (Platform.OS === 'android') {
    n.setNotificationChannelAsync('aster', { name: 'Lembretes do Aster', importance: n.AndroidImportance.DEFAULT, lightColor: '#3056FF' }).catch(() => {});
  }
}

export async function temPermissao() {
  const n = mod(); if (!n) return false;
  try { return !!(await n.getPermissionsAsync()).granted; } catch (e) { return false; }
}
export async function pedirPermissao() {
  const n = mod(); if (!n) return false;
  try {
    const atual = await n.getPermissionsAsync();
    if (atual.granted) return true;
    return !!(await n.requestPermissionsAsync()).granted;
  } catch (e) { return false; }
}

async function devocionaisAtuais() {
  try {
    const c = await AsyncStorage.getItem('aster:cache:devocionais');
    const l = c ? JSON.parse(c) : null;
    if (Array.isArray(l) && l.length) return l;
  } catch (e) {}
  return DEVOCIONAIS_PADRAO;
}

// Monta a lista do que será agendado (separado para poder testar).
export function montarAgenda(prefs, lista, agora) {
  const itens = [];
  for (let k = 0; k < DIAS_A_FRENTE; k++) {
    const base = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + k);
    if (prefs.verso.ligado) {
      const quando = new Date(base.getFullYear(), base.getMonth(), base.getDate(), prefs.verso.h, prefs.verso.m, 0);
      if (quando > agora) {
        // o versículo do dia só troca às 6h; avisos antes das 6h mostram o do dia anterior
        const { ref } = referenciaDe(quando);
        itens.push({ quando, titulo: 'Versículo do dia', corpo: ref + ' — toque para ler', rota: '/' });
      }
    }
    if (prefs.devocional.ligado) {
      const quando = new Date(base.getFullYear(), base.getMonth(), base.getDate(), prefs.devocional.h, prefs.devocional.m, 0);
      if (quando > agora) {
        const dev = lista[diaDoAno(quando) % lista.length];
        itens.push({ quando, titulo: 'Devocional de hoje', corpo: dev.titulo + ' — ' + dev.ref, rota: '/devocional' });
      }
    }
  }
  return itens;
}

export async function reagendar(prefs) {
  const n = mod(); if (!n) return 0;
  try {
    await n.cancelAllScheduledNotificationsAsync();
    if (!prefs.verso.ligado && !prefs.devocional.ligado) return 0;
    if (!(await temPermissao())) return 0;
    const itens = montarAgenda(prefs, await devocionaisAtuais(), new Date());
    for (const it of itens) {
      await n.scheduleNotificationAsync({
        content: { title: it.titulo, body: it.corpo, data: { rota: it.rota } },
        trigger: { type: n.SchedulableTriggerInputTypes.DATE, date: it.quando, channelId: 'aster' }
      });
    }
    return itens.length;
  } catch (e) { return 0; }
}

// Para testar: dispara um aviso em 5 segundos.
export async function avisoDeTeste() {
  const n = mod(); if (!n) return false;
  try {
    if (!(await pedirPermissao())) return false;
    await n.scheduleNotificationAsync({
      content: { title: 'Projeto Aster', body: 'Pronto! Os lembretes estão funcionando.', data: { rota: '/devocional' } },
      trigger: { type: n.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5, channelId: 'aster' }
    });
    return true;
  } catch (e) { return false; }
}
