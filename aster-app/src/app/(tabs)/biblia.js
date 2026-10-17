import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTema } from '../../lib/tema';
import { useDados } from '../../lib/useDados';
import { LIVROS } from '../../lib/livros';
import { Botao, Carregando, Aviso, Tela } from '../../components/ui';

const TRADUCOES = [['almeida', 'Almeida'], ['kjv', 'KJV'], ['web', 'WEB']];
const CHAVE_POS = 'aster:biblia:pos';

async function buscarCapitulo(livro, cap, trad) {
  const q = (livro[2] === 1 ? livro[1] + ' 1-60' : livro[1] + ' ' + cap).replace(/ /g, '+');
  const r = await fetch('https://bible-api.com/' + q + '?translation=' + trad);
  if (!r.ok) throw new Error('capitulo');
  const d = await r.json();
  return (d.verses || []).map(v => ({ n: v.verse, t: String(v.text || '').replace(/\s+/g, ' ').trim() }));
}

function Leitura({ pos, trad, onMudar, onVoltar }) {
  const t = useTema();
  const livro = LIVROS[pos.l];
  const { dados, carregando, erro, recarregar } = useDados('biblia:' + pos.l + ':' + pos.c + ':' + trad, () => buscarCapitulo(livro, pos.c, trad));
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTo({ y: 0, animated: false }); }, [pos.l, pos.c]);

  const mover = d => {
    let l = pos.l, c = pos.c;
    if (d > 0) { if (c < livro[2]) c++; else if (l < LIVROS.length - 1) { l++; c = 1; } else return; }
    else { if (c > 1) c--; else if (l > 0) { l--; c = LIVROS[l][2]; } else return; }
    onMudar({ l, c });
  };

  return (
    <Tela>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}>
        <Botao titulo="‹ Livros" onPress={onVoltar} claro />
        <Text style={{ flex: 1, textAlign: 'center', color: t.texto, fontWeight: '700', fontSize: 16 }}>{livro[0]} {livro[2] === 1 ? '' : pos.c}</Text>
        <Botao titulo="‹" onPress={() => mover(-1)} claro />
        <Botao titulo="›" onPress={() => mover(1)} claro />
      </View>
      <ScrollView ref={ref} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        {dados ? (
          <Text style={{ color: t.texto, fontSize: 18, lineHeight: 30 }}>
            {dados.map(v => (
              <Text key={v.n}><Text style={{ color: t.link, fontSize: 12, fontWeight: '700' }}>{v.n} </Text>{v.t}{'  '}</Text>
            ))}
          </Text>
        ) : carregando ? <Carregando /> : <Aviso texto={erro || 'Capítulo indisponível.'} onTentar={recarregar} />}
        {dados && erro ? <Text style={{ color: t.cinza, marginTop: 16 }}>{erro}</Text> : null}
      </ScrollView>
    </Tela>
  );
}

export default function Biblia() {
  const t = useTema();
  const [trad, setTrad] = useState('almeida');
  const [pos, setPos] = useState(null);
  const [escolhido, setEscolhido] = useState(null); // livro escolhido, escolhendo capítulo
  const [lendo, setLendo] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_POS).then(s => { if (s) { try { const p = JSON.parse(s); if (LIVROS[p.l]) setPos(p); } catch (e) {} } }).catch(() => {});
  }, []);
  const abrir = p => { setPos(p); setLendo(true); AsyncStorage.setItem(CHAVE_POS, JSON.stringify(p)).catch(() => {}); };

  if (lendo && pos) return <Leitura pos={pos} trad={trad} onMudar={abrir} onVoltar={() => { setLendo(false); setEscolhido(null); }} />;

  if (escolhido !== null) {
    const l = LIVROS[escolhido];
    return (
      <Tela>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Botao titulo="‹ Todos os livros" onPress={() => setEscolhido(null)} claro style={{ alignSelf: 'flex-start' }} />
          <Text style={{ color: t.texto, fontSize: 24, fontWeight: '700', marginVertical: 14 }}>{l[0]}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {Array.from({ length: l[2] }, (_, k) => k + 1).map(c => (
              <Pressable key={c} onPress={() => abrir({ l: escolhido, c })}
                style={{ width: 54, height: 46, borderRadius: 10, borderWidth: 1, borderColor: t.borda, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: t.texto, fontWeight: '700' }}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </Tela>
    );
  }

  return (
    <Tela>
      <View style={{ flexDirection: 'row', gap: 8, padding: 12 }}>
        {TRADUCOES.map(([id, nome]) => (
          <Pressable key={id} onPress={() => setTrad(id)}
            style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: trad === id ? t.azul : t.borda, backgroundColor: trad === id ? t.azul : t.card }}>
            <Text style={{ color: trad === id ? '#fff' : t.texto, fontWeight: '700' }}>{nome}</Text>
          </Pressable>
        ))}
      </View>
      {pos ? <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}><Botao titulo={'Continuar: ' + LIVROS[pos.l][0] + (LIVROS[pos.l][2] === 1 ? '' : ' ' + pos.c)} onPress={() => setLendo(true)} /></View> : null}
      <FlatList
        data={LIVROS} keyExtractor={(x, i) => String(i)}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 40 }}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => (item[2] === 1 ? abrir({ l: index, c: 1 }) : setEscolhido(index))}
            style={{ paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: t.borda, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: t.texto, fontSize: 17 }}>{item[0]}</Text>
            <Text style={{ color: t.cinza }}>{item[2]} cap.</Text>
          </Pressable>
        )}
      />
    </Tela>
  );
}
