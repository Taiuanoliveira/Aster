import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View, Pressable, RefreshControl } from 'react-native';
import { useTema } from '../../lib/tema';
import { useDados } from '../../lib/useDados';
import { listarColecao } from '../../lib/api';
import { abrirLink } from '../../lib/redes';
import { Cartao, Botao, Carregando, Aviso, estilos } from '../../components/ui';

const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Biblioteca() {
  const t = useTema();
  const d = useDados('biblioteca', () => listarColecao('biblioteca'));
  const [q, setQ] = useState('');
  const [trad, setTrad] = useState('');
  const [atualizando, setAtualizando] = useState(false);

  const livros = useMemo(() => (d.dados || []).filter(l => l.status === 'publicado').map(l => ({ ...l, temas: Array.isArray(l.temas) ? l.temas : [] })), [d.dados]);
  const tradicoes = useMemo(() => { const m = {}; livros.forEach(l => { if (l.tradicao) m[l.tradicao] = (m[l.tradicao] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); }, [livros]);
  const achados = livros.filter(l => {
    if (trad && l.tradicao !== trad) return false;
    const palheiro = norm([l.titulo, l.autor, l.resumo, l.tradicao, l.temas.join(' ')].join(' '));
    return norm(q).split(/\s+/).filter(Boolean).every(w => palheiro.includes(w));
  });
  const atualizar = async () => { setAtualizando(true); await d.recarregar(); setAtualizando(false); };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina} keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={t.link} />}>
      <TextInput value={q} onChangeText={setQ} placeholder="Buscar por título, autor, linha ou tema" placeholderTextColor={t.cinza}
        style={{ backgroundColor: t.card, borderColor: t.borda, borderWidth: 1, borderRadius: 12, padding: 12, color: t.texto, fontSize: 16 }} />
      {tradicoes.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {tradicoes.map(([nome, n]) => (
            <Pressable key={nome} onPress={() => setTrad(trad === nome ? '' : nome)}
              style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: trad === nome ? t.azul : t.borda, backgroundColor: trad === nome ? t.azul : t.card }}>
              <Text style={{ color: trad === nome ? '#fff' : t.texto, fontSize: 13, fontWeight: '600' }}>{nome} ({n})</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <Text style={{ color: t.cinza, marginVertical: 12 }}>{achados.length} {achados.length === 1 ? 'livro' : 'livros'}</Text>

      {!d.dados && d.carregando ? <Carregando /> : null}
      {!d.dados && !d.carregando ? <Aviso texto={d.erro || 'Biblioteca indisponível.'} onTentar={d.recarregar} /> : null}
      {d.dados && !livros.length ? <Text style={{ color: t.cinza }}>Os livros aparecerão aqui quando forem publicados.</Text> : null}

      {achados.map(l => {
        const ok = /^https:\/\//i.test(String(l.arquivo || ''));
        return (
          <Cartao key={l.id}>
            <Text style={{ color: t.texto, fontSize: 18, fontWeight: '700' }}>{l.titulo}</Text>
            {l.autor ? <Text style={{ color: t.link, fontSize: 14, marginTop: 2 }}>{l.autor}</Text> : null}
            {l.resumo ? <Text style={{ color: t.cinza, fontSize: 14, lineHeight: 20, marginTop: 6 }}>{l.resumo}</Text> : null}
            {(l.tradicao || l.temas.length) ? <Text style={{ color: t.cinza, fontSize: 12, marginTop: 8 }}>{[l.tradicao].concat(l.temas).filter(Boolean).join(' · ')}</Text> : null}
            {ok ? <Botao titulo="Abrir / baixar" onPress={() => abrirLink(l.arquivo.trim())} style={{ marginTop: 12 }} /> : <Text style={{ color: t.cinza, marginTop: 10 }}>Link ainda não disponível.</Text>}
          </Cartao>
        );
      })}
    </ScrollView>
  );
}
