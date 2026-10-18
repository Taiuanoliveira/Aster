import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from '../lib/tema';
import { useDados } from '../lib/useDados';
import { listarColecao } from '../lib/api';
import { LIVROS } from '../lib/livros';
import { refParaPos, destinoBiblia } from '../lib/refs';
import { Botao, Tela } from '../components/ui';

const CAPITULOS = [];
LIVROS.forEach(l => { for (let i = 1; i <= l[2]; i++) CAPITULOS.push(l[0] + ' ' + i); });

export function gerarPlano(dias) {
  const N = CAPITULOS.length, plano = [];
  for (let d = 0; d < dias; d++) {
    const trecho = CAPITULOS.slice(Math.floor(d * N / dias), Math.floor((d + 1) * N / dias));
    if (trecho.length) plano.push(trecho);
  }
  return plano;
}
const ALTURA = 60;

export default function Plano() {
  const t = useTema();
  const router = useRouter();
  const d = useDados('planos', () => listarColecao('planos'));
  const lista = useMemo(() => {
    const db = (d.dados || []).filter(p => +p.dias > 0).map(p => ({ nome: p.nome, dias: +p.dias }));
    return db.length ? db : [{ nome: 'Em 1 ano', dias: 365 }, { nome: 'Em 90 dias', dias: 90 }];
  }, [d.dados]);
  const [dias, setDias] = useState(null);
  const atual = dias || lista[0].dias;
  const plano = useMemo(() => gerarPlano(atual), [atual]);
  const [prog, setProg] = useState({});
  const ref = useRef(null);

  useEffect(() => {
    let vivo = true;
    AsyncStorage.getItem('aster_plano_' + atual).then(s => { if (vivo) setProg(s ? JSON.parse(s) : {}); }).catch(() => { if (vivo) setProg({}); });
    return () => { vivo = false; };
  }, [atual]);

  const marcar = useCallback(dia => {
    setProg(p => {
      const n = { ...p };
      if (n[dia]) delete n[dia]; else n[dia] = true;
      AsyncStorage.setItem('aster_plano_' + atual, JSON.stringify(n)).catch(() => {});
      return n;
    });
  }, [atual]);

  const feitos = Object.keys(prog).filter(k => +k >= 1 && +k <= plano.length).length;
  const pct = plano.length ? Math.round(feitos / plano.length * 100) : 0;
  const proximo = plano.findIndex((_, i) => !prog[i + 1]);

  const cab = (
    <View style={{ padding: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: t.borda }}>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {lista.map(p => (
          <Pressable key={p.dias} onPress={() => setDias(p.dias)}
            style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: atual === p.dias ? t.azul : t.borda, backgroundColor: atual === p.dias ? t.azul : t.card }}>
            <Text style={{ color: atual === p.dias ? '#fff' : t.texto, fontWeight: '700' }}>{p.nome}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <Text style={{ color: t.texto, fontWeight: '600' }}>{feitos} de {plano.length} dias lidos</Text>
        <Text style={{ color: t.texto, fontWeight: '700' }}>{pct}%</Text>
      </View>
      <View style={{ height: 10, borderRadius: 5, backgroundColor: t.borda, marginTop: 6, overflow: 'hidden' }}>
        <View style={{ width: pct + '%', height: 10, backgroundColor: t.azul }} />
      </View>
      {proximo >= 0 ? <Botao titulo={'Ir para o dia ' + (proximo + 1)} claro style={{ marginTop: 12 }}
        onPress={() => ref.current && ref.current.scrollToIndex({ index: proximo, animated: true, viewOffset: 0 })} /> : null}
    </View>
  );

  return (
    <Tela>
      {cab}
      <FlatList
        ref={ref} data={plano} keyExtractor={(_, i) => String(i)}
        getItemLayout={(_, i) => ({ length: ALTURA, offset: ALTURA * i, index: i })}
        onScrollToIndexFailed={() => {}}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item, index }) => {
          const dia = index + 1, ok = !!prog[dia];
          return (
            <View style={{ height: ALTURA, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: t.borda, opacity: ok ? 0.6 : 1 }}>
              <Pressable onPress={() => marcar(dia)} accessibilityRole="checkbox" accessibilityState={{ checked: ok }} hitSlop={10}
                style={{ width: 28, height: 28, borderRadius: 7, borderWidth: 2, borderColor: t.azul, backgroundColor: ok ? t.azul : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                {ok ? <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text> : null}
              </Pressable>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: t.cinza, fontSize: 12 }}>Dia {dia}</Text>
                <Text style={{ color: t.texto, fontSize: 15, fontWeight: '600' }} numberOfLines={1}>{item[0]}{item.length > 1 ? ' – ' + item[item.length - 1] : ''}</Text>
              </View>
              <Text onPress={() => router.navigate(destinoBiblia(refParaPos(item[0])))} style={{ color: t.link, fontWeight: '700', padding: 6 }}>Ler →</Text>
            </View>
          );
        }}
      />
    </Tela>
  );
}
