import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTema } from '../../lib/tema';
import { useDados } from '../../lib/useDados';
import { lerEdicao, artigosDaEdicao, edicoesPublicadas } from '../../lib/api';
import Corpo from '../../components/Corpo';
import { Titulo, Selo, CartaoArtigo, Carregando, Aviso, Botao, estilos } from '../../components/ui';

export default function Edicao() {
  const t = useTema();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const d = useDados('edicao:' + id, async () => {
    const e = await lerEdicao(id).catch(() => null);
    if (!e) return { vazio: true };
    const [artigos, todas] = await Promise.all([artigosDaEdicao(e), edicoesPublicadas()]);
    const ord = todas.slice().reverse(); // antigas primeiro
    const i = ord.findIndex(x => x.id === e.id);
    return { e, artigos, ant: ord[i - 1] || null, prox: ord[i + 1] || null };
  });
  const x = d.dados;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina}>
      <Stack.Screen options={{ title: x && x.e ? x.e.nome : 'Edição' }} />
      {!x ? (d.carregando ? <Carregando /> : <Aviso texto={d.erro || 'Não foi possível carregar.'} onTentar={d.recarregar} />)
        : x.vazio ? <Aviso texto="Esta edição não existe ou ainda não foi publicada." />
        : (
          <>
            <Selo>{(x.e.numero ? 'Edição nº ' + x.e.numero : 'Edição') + (x.e.especial ? ' · Especial' : '') + (x.e.tema ? ' · ' + x.e.tema : '')}</Selo>
            <Text style={{ color: t.texto, fontSize: 28, fontWeight: '700', marginTop: 6 }}>{x.e.nome}</Text>
            {x.e.descricao ? <Text style={{ color: t.cinza, fontSize: 16, lineHeight: 24, marginTop: 8 }}>{x.e.descricao}</Text> : null}
            {x.e.cartaLeitor && x.e.cartaLeitor.replace(/<[^>]*>/g, '').trim() ? (
              <View style={{ marginTop: 18 }}>
                <Titulo style={{ marginTop: 0 }}>Carta ao leitor</Titulo>
                <Corpo html={x.e.cartaLeitor} />
              </View>
            ) : null}
            <Titulo>Nesta edição</Titulo>
            {x.artigos.length
              ? x.artigos.map((n, i) => <CartaoArtigo key={n.id} n={n} destaque={i === 0} onPress={() => router.push('/artigo/' + n.id)} />)
              : <Text style={{ color: t.cinza }}>Os artigos desta edição serão publicados em breve.</Text>}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 14 }}>
              {x.ant ? <Botao titulo={'← ' + x.ant.nome} onPress={() => router.replace('/edicao/' + x.ant.id)} claro style={{ flex: 1 }} /> : <View style={{ flex: 1 }} />}
              {x.prox ? <Botao titulo={x.prox.nome + ' →'} onPress={() => router.replace('/edicao/' + x.prox.id)} claro style={{ flex: 1 }} /> : <View style={{ flex: 1 }} />}
            </View>
          </>
        )}
    </ScrollView>
  );
}
