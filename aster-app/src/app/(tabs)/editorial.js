import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTema } from '../../lib/tema';
import { useDados } from '../../lib/useDados';
import { edicoesPublicadas, artigosPublicos, listarColecao } from '../../lib/api';
import { Cartao, Titulo, Selo, CartaoArtigo, Carregando, Aviso, estilos } from '../../components/ui';

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const slugDe = nome => norm(nome).replace(/\s+/g, '-');

export default function Editorial() {
  const t = useTema();
  const router = useRouter();
  const [atualizando, setAtualizando] = useState(false);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const cats = useDados('categorias', () => listarColecao('categorias'));
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
          <TextInput value={q} onChangeText={setQ} placeholder="Buscar por título ou assunto" placeholderTextColor={t.cinza}
            style={{ backgroundColor: t.card, borderColor: t.borda, borderWidth: 1, borderRadius: 12, padding: 12, color: t.texto, fontSize: 16, marginBottom: 12 }} />
          {cats.dados && cats.dados.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {[{ nome: 'Todos', slug: '' }].concat(cats.dados).map(c => {
                const id = c.nome === 'Todos' ? '' : (c.slug || slugDe(c.nome)), on = cat === id;
                return (
                  <Pressable key={id || 'todos'} onPress={() => setCat(id)}
                    style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: on ? t.azul : t.borda, backgroundColor: on ? t.azul : t.card }}>
                    <Text style={{ color: on ? '#fff' : t.texto, fontSize: 13, fontWeight: '600' }}>{(c.emoji ? c.emoji + ' ' : '') + c.nome}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
          {(() => {
            const nomeDe = {}; (cats.dados || []).forEach(c => { nomeDe[c.slug || slugDe(c.nome)] = c.nome; });
            const lista = d.dados.artigos.filter(a => {
              const cs = (a.categorias && a.categorias.length ? a.categorias : [a.categoria]).filter(Boolean);
              return (!cat || cs.includes(cat) || cs.includes(nomeDe[cat])) && (!q || norm(a.titulo + ' ' + (a.resumo || '')).includes(norm(q)));
            });
            return lista.length ? lista.map(n => <CartaoArtigo key={n.id} n={n} onPress={() => router.push('/artigo/' + n.id)} />)
              : <Text style={{ color: t.cinza }}>{d.dados.artigos.length ? 'Nenhum artigo encontrado.' : 'Ainda não há artigos publicados.'}</Text>;
          })()}
          {d.erro ? <Text style={{ color: t.cinza, marginTop: 8 }}>{d.erro}</Text> : null}
        </>
      )}
    </ScrollView>
  );
}
