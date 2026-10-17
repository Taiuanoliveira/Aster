import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { configurarNotificacoes, reagendar } from '../lib/notificacoes';
import { lerPrefs } from '../lib/prefs';

configurarNotificacoes();

let usarResposta = () => null;
let ACAO_PADRAO = '';
if (Platform.OS !== 'web') {
  try {
    const N = require('expo-notifications');
    usarResposta = N.useLastNotificationResponse || usarResposta;
    ACAO_PADRAO = N.DEFAULT_ACTION_IDENTIFIER;
  } catch (e) {}
}

export default function Raiz() {
  const router = useRouter();
  const tratada = useRef('');
  const resposta = usarResposta();

  useEffect(() => { lerPrefs().then(reagendar).catch(() => {}); }, []);

  useEffect(() => {
    if (!resposta || resposta.actionIdentifier !== ACAO_PADRAO) return;
    const id = resposta.notification.request.identifier;
    if (tratada.current === id) return;
    tratada.current = id;
    const rota = resposta.notification.request.content.data && resposta.notification.request.content.data.rota;
    if (rota && rota !== '/') setTimeout(() => router.push(rota), 300);
  }, [resposta]);

  const cab = { headerStyle: { backgroundColor: '#3056FF' }, headerTintColor: '#FFFFFF', headerTitleStyle: { fontWeight: '700' }, headerBackTitle: 'Voltar' };
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={cab}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="devocional" options={{ title: 'Devocional' }} />
        <Stack.Screen name="edicao/[id]" options={{ title: 'Edição' }} />
        <Stack.Screen name="artigo/[id]" options={{ title: 'Artigo' }} />
        <Stack.Screen name="equipe" options={{ title: 'Nossa Equipe' }} />
      </Stack>
    </>
  );
}
