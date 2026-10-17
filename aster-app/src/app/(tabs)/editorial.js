import React, { useState } from 'react';
import { ScrollView, Text, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTema } from '../../lib/tema';
import { useDados } from '../../lib/useDados';
import { edicoesPublicadas, artigosPublicos } from '../../lib/api';
import { Cartao, Titulo, Selo, CartaoArtigo, Carregando, Aviso, estilos } from '../../components/ui';

export default function Editorial() {
  const t = useTema();
  const router = useRouter();
  const [atualizando, setAtualizando] = useState(false);
  const d = useDados('editorial', async () => {
    const edicoes = await edicoesPublicadas();
    const artigos = await artigosPublicos(edicoes);
    return { edicoes, artigos };
  });
  const atualizar = async () => { setAtualizando(true); await d.recarregar(); setAtualizando(false); };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={t.link} />}>
      {!d.dados ? (d.carregando ? <Carregando /> : <Aviso texto={d.erro || 'Nada por aqui ainda.'} onTentar={d.recarregar} />) : (
        <>
          <Titulo style={{ marginTop: 4 }}>Edições</Titulo>
          {d.dados.edicoes.length ? d.dados.edicoes.map(e => (
            <Cartao key={e.id} onPress={() => router.push('/edicao/' + e.id)}>
              <Selo>{(e.numero ? 'Edição nº ' + e.numero : 'Edição') + (e.especial ? ' · Especial' : '')}</Selo>
              <Text style={{ color: t.texto, fontSize: 19, fontWeight: '700', marginTop: 4 }}>{e.nome}</Text>
              {e.descricao ? <Text style={{ color: t.cinza, fontSize: 14, lineHeight: 20, marginTop: 6 }} numberOfLines={3}>{e.descricao}</Text> : null}
            </Cartao>
          )) : <Text style={{ color: t.cinza }}>As edições aparecerão aqui quando forem publicadas.</Text>}

          <Titulo>Todos os artigos</Titulo>
          {d.dados.artigos.length ? d.dados.artigos.map(n => <CartaoArtigo key={n.id} n={n} onPress={() => router.push('/artigo/' + n.id)} />)
            : <Text style={{ color: t.cinza }}>Ainda não há artigos publicados.</Text>}
          {d.erro ? <Text style={{ color: t.cinza, marginTop: 8 }}>{d.erro}</Text> : null}
        </>
      )}
    </ScrollView>
  );
}
