import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, Text, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTema } from '../../lib/tema';
import { useDados } from '../../lib/useDados';
import { listarColecao, edicoesPublicadas, artigosPublicos } from '../../lib/api';
import { referenciaDe, consultaApi } from '../../lib/versiculos';
import { DEVOCIONAIS_PADRAO } from '../../lib/devocionais_padrao';
import { dataLonga, diaDoAno } from '../../lib/datas';
import { lerPrefs, salvarPrefs } from '../../lib/prefs';
import { pedirPermissao, reagendar } from '../../lib/notificacoes';
import { Cartao, Titulo, Selo, Botao, CartaoArtigo, Carregando, estilos } from '../../components/ui';

async function buscarVerso(ref) {
  const url = consultaApi(ref, 'almeida');
  const r = await fetch(url);
  if (!r.ok) throw new Error('verso');
  const d = await r.json();
  return { ref: d.reference || ref, texto: String(d.text || '').replace(/\s+/g, ' ').trim() };
}

export default function Inicio() {
  const t = useTema();
  const router = useRouter();
  const agora = new Date();
  const { ref, chave } = referenciaDe(agora);
  const verso = useDados('verso:' + chave, () => buscarVerso(ref));
  const devs = useDados('devocionais', () => listarColecao('devocionais'));
  const mat = useDados('inicio:artigos', async () => (await artigosPublicos()).slice(0, 4));
  const [prefs, setPrefs] = useState(null);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => { lerPrefs().then(setPrefs); }, []);

  const lista = devs.dados && devs.dados.length ? devs.dados : DEVOCIONAIS_PADRAO;
  const dev = lista[diaDoAno(agora) % lista.length];

  const ativarLembretes = useCallback(async () => {
    const ok = await pedirPermissao();
    const p = await lerPrefs();
    const novo = { ...p, perguntou: true, verso: { ...p.verso, ligado: ok }, devocional: { ...p.devocional, ligado: ok } };
    await salvarPrefs(novo); setPrefs(novo);
    if (ok) await reagendar(novo);
  }, []);
  const dispensar = useCallback(async () => {
    const p = await lerPrefs(); const novo = { ...p, perguntou: true };
    await salvarPrefs(novo); setPrefs(novo);
  }, []);

  const atualizar = async () => {
    setAtualizando(true);
    await Promise.all([verso.recarregar(), devs.recarregar(), mat.recarregar()]);
    setAtualizando(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={t.link} />}>
      <Text style={{ color: t.cinza, fontSize: 14, textTransform: 'capitalize' }}>{dataLonga(agora)}</Text>

      <Cartao style={{ marginTop: 12, backgroundColor: t.escuro ? t.card : '#3056FF', borderColor: t.escuro ? t.borda : '#3056FF' }}>
        <Text style={{ color: '#FFFD73', fontSize: 12, fontWeight: '700', letterSpacing: 0.6 }}>VERSÍCULO DO DIA</Text>
        {verso.dados
          ? <>
              <Text style={{ color: '#fff', fontSize: 19, lineHeight: 28, marginTop: 8 }}>“{verso.dados.texto}”</Text>
              <Text style={{ color: '#FFFD73', fontSize: 15, fontWeight: '700', marginTop: 10 }}>{verso.dados.ref}</Text>
            </>
          : verso.carregando ? <Carregando />
          : <Text style={{ color: '#fff', fontSize: 17, marginTop: 8 }}>{ref} — conecte-se à internet para ler o texto.</Text>}
      </Cartao>

      {prefs && !prefs.perguntou ? (
        <Cartao>
          <Text style={{ color: t.texto, fontSize: 16, fontWeight: '700' }}>Receber lembretes diários?</Text>
          <Text style={{ color: t.cinza, fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 12 }}>O versículo do dia às 7h e o devocional às 20h. Você muda os horários quando quiser em “Mais”.</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Botao titulo="Ativar lembretes" onPress={ativarLembretes} />
            <Botao titulo="Agora não" onPress={dispensar} claro />
          </View>
        </Cartao>
      ) : null}

      <Titulo>Devocional de hoje</Titulo>
      <Cartao onPress={() => router.push('/devocional')}>
        <Selo>{dev.ref}</Selo>
        <Text style={{ color: t.texto, fontSize: 19, fontWeight: '700', marginTop: 4 }}>{dev.titulo}</Text>
        <Text style={{ color: t.cinza, fontSize: 15, lineHeight: 22, marginTop: 6 }} numberOfLines={3}>{dev.texto}</Text>
        <Text style={{ color: t.link, fontWeight: '700', marginTop: 10 }}>Ler devocional →</Text>
      </Cartao>

      <Titulo>Últimas matérias</Titulo>
      {mat.dados && mat.dados.length
        ? mat.dados.map(n => <CartaoArtigo key={n.id} n={n} onPress={() => router.push('/artigo/' + n.id)} />)
        : mat.carregando ? <Carregando /> : <Text style={{ color: t.cinza }}>As matérias aparecerão aqui assim que forem publicadas.</Text>}
    </ScrollView>
  );
}
