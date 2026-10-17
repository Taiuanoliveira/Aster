import React from 'react';
import { ScrollView, Text, View, Image, Share } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTema, SITE } from '../../lib/tema';
import { useDados } from '../../lib/useDados';
import { lerArtigo, consultar } from '../../lib/api';
import { minutosDeLeitura } from '../../lib/html';
import { dataBonita } from '../../lib/datas';
import { redesDaPessoa } from '../../lib/redes';
import Corpo from '../../components/Corpo';
import { Selo, Carregando, Aviso, Botao, Redes, estilos } from '../../components/ui';

export default function Artigo() {
  const t = useTema();
  const { id } = useLocalSearchParams();
  const d = useDados('artigo:' + id, async () => {
    const n = await lerArtigo(id).catch(() => null);
    if (!n) return { vazio: true };
    let autor = null;
    try { const l = await consultar('equipe', [['nome', '==', n.autorNome || '']]); autor = l[0] || null; } catch (e) {}
    return { n, autor };
  });
  const x = d.dados;
  const n = x && x.n;
  const autores = n ? [n.autorNome].concat(n.coautores || []).filter(Boolean).join(', ') : '';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina}>
      <Stack.Screen options={{ title: n ? (n.categoria || 'Artigo') : 'Artigo' }} />
      {!x ? (d.carregando ? <Carregando /> : <Aviso texto={d.erro || 'Não foi possível carregar.'} onTentar={d.recarregar} />)
        : x.vazio ? <Aviso texto="Este artigo não está disponível." />
        : (
          <>
            {n.imagemUrl && /^https:\/\//i.test(n.imagemUrl) ? <Image source={{ uri: n.imagemUrl }} style={{ width: '100%', height: 200, borderRadius: 12, backgroundColor: t.suave }} resizeMode="cover" /> : null}
            {n.imagemLegenda ? <Text style={{ color: t.cinza, fontSize: 12, marginTop: 4 }}>{n.imagemLegenda}</Text> : null}
            <View style={{ marginTop: 14 }}><Selo>{n.categoria || 'Artigo'}</Selo></View>
            <Text accessibilityRole="header" style={{ color: t.texto, fontSize: 28, fontWeight: '700', lineHeight: 35, marginTop: 6 }}>{n.titulo}</Text>
            <Text style={{ color: t.cinza, fontSize: 14, marginTop: 10 }}>
              {[autores, dataBonita(n.criadoEm), minutosDeLeitura(n.conteudo) + ' min de leitura'].filter(Boolean).join(' · ')}
            </Text>
            {n.resumo ? <Text style={{ color: t.texto, fontSize: 18, lineHeight: 27, fontStyle: 'italic', marginTop: 14 }}>{n.resumo}</Text> : null}
            <View style={{ height: 1, backgroundColor: t.borda, marginVertical: 18 }} />
            <Corpo html={n.conteudo} />
            <Botao titulo="Compartilhar" claro style={{ alignSelf: 'flex-start', marginTop: 8 }}
              onPress={() => Share.share({ message: n.titulo + '\n' + SITE + '/noticia.html?id=' + encodeURIComponent(n.id) }).catch(() => {})} />
            {x.autor ? (
              <View style={{ marginTop: 26, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: t.borda, backgroundColor: t.card }}>
                <Text style={{ color: t.texto, fontSize: 17, fontWeight: '700' }}>{x.autor.nome}</Text>
                {x.autor.cargo ? <Text style={{ color: t.link, fontSize: 13 }}>{x.autor.cargo}</Text> : null}
                {x.autor.bio ? <Text style={{ color: t.cinza, fontSize: 14, lineHeight: 21, marginTop: 6 }}>{x.autor.bio}</Text> : null}
                <Redes itens={redesDaPessoa(x.autor.contatos)} />
              </View>
            ) : null}
          </>
        )}
    </ScrollView>
  );
}
