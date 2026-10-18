import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTema } from '../lib/tema';
import { useDados } from '../lib/useDados';
import { listarColecao } from '../lib/api';
import { TEMAS_PADRAO } from '../lib/estudos_padrao';
import { LIVROS } from '../lib/livros';
import { refParaPos, destinoBiblia } from '../lib/refs';
import { Cartao, Selo, Botao, estilos } from '../components/ui';

const slug = s => String(s || 'geral').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');

export default function Estudos() {
  const t = useTema();
  const router = useRouter();
  const d = useDados('estudos', () => listarColecao('estudos'));
  const [aba, setAba] = useState('temas');
  const [aberto, setAberto] = useState(null);

  const temas = useMemo(() => {
    const doBanco = d.dados || [];
    if (!doBanco.length) return TEMAS_PADRAO;
    const o = {};
    doBanco.forEach(e => {
      const k = slug(e.tema);
      if (!o[k]) o[k] = { nome: e.tema || 'Geral', desc: e.temaDesc || '', estudos: [] };
      if (!o[k].desc && e.temaDesc) o[k].desc = e.temaDesc;
      o[k].estudos.push(e);
    });
    return o;
  }, [d.dados]);

  const abaBotao = (id, nome) => (
    <Pressable key={id} onPress={() => { setAba(id); setAberto(null); }}
      style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: aba === id ? t.azul : 'transparent' }}>
      <Text style={{ color: aba === id ? t.link : t.cinza, fontWeight: '700' }}>{nome}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina}>
      <View style={{ flexDirection: 'row', marginBottom: 14 }}>{abaBotao('temas', 'Por tema')}{abaBotao('livros', 'Livros da Bíblia')}</View>

      {aba === 'temas' && !aberto ? Object.entries(temas).map(([k, tema]) => (
        <Cartao key={k} onPress={() => setAberto(k)}>
          <Text style={{ color: t.texto, fontSize: 19, fontWeight: '700' }}>{tema.nome}</Text>
          {tema.desc ? <Text style={{ color: t.cinza, fontSize: 14, lineHeight: 20, marginTop: 4 }}>{tema.desc}</Text> : null}
        </Cartao>
      )) : null}

      {aba === 'temas' && aberto && temas[aberto] ? (
        <>
          <Botao titulo="‹ Todos os temas" onPress={() => setAberto(null)} claro style={{ alignSelf: 'flex-start' }} />
          <Text style={{ color: t.texto, fontSize: 26, fontWeight: '700', marginTop: 14 }}>{temas[aberto].nome}</Text>
          {temas[aberto].desc ? <Text style={{ color: t.cinza, fontSize: 15, lineHeight: 22, marginTop: 4, marginBottom: 14 }}>{temas[aberto].desc}</Text> : null}
          {temas[aberto].estudos.map((e, i) => (
            <Cartao key={i}>
              <Selo>{e.ref}</Selo>
              <Text style={{ color: t.texto, fontSize: 19, fontWeight: '700', marginTop: 4 }}>{e.titulo}</Text>
              <Text style={{ color: t.texto, fontSize: 16, lineHeight: 25, marginTop: 8 }}>{e.texto}</Text>
              <Text onPress={() => router.navigate(destinoBiblia(refParaPos(e.ref)))} style={{ color: t.link, fontWeight: '700', marginTop: 12 }}>Ler na Bíblia →</Text>
            </Cartao>
          ))}
        </>
      ) : null}

      {aba === 'livros' ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {LIVROS.map((l, i) => (
            <Pressable key={i} onPress={() => router.navigate(destinoBiblia({ l: i, c: 1 }))}
              style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: t.borda, backgroundColor: t.card }}>
              <Text style={{ color: t.texto, fontSize: 15 }}>{l[0]}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}
