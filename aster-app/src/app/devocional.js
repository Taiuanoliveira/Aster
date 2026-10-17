import React from 'react';
import { ScrollView, Text, Share } from 'react-native';
import { useTema } from '../lib/tema';
import { useDados } from '../lib/useDados';
import { listarColecao } from '../lib/api';
import { DEVOCIONAIS_PADRAO } from '../lib/devocionais_padrao';
import { dataLonga, dataCurta, diaDoAno } from '../lib/datas';
import { Cartao, Titulo, Selo, Botao, estilos } from '../components/ui';

export default function Devocional() {
  const t = useTema();
  const { dados } = useDados('devocionais', () => listarColecao('devocionais'));
  const lista = dados && dados.length ? dados : DEVOCIONAIS_PADRAO;
  const hoje = new Date();
  const idx = diaDoAno(hoje) % lista.length;
  const dev = lista[idx];
  const anteriores = [1, 2, 3, 4, 5].map(i => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i);
    return { data: d, dev: lista[(idx - i + lista.length * 10) % lista.length] };
  });
  const compartilhar = () => Share.share({ message: dev.titulo + '\n"' + dev.texto + '"\n' + dev.ref + '\nProjeto Aster' }).catch(() => {});

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina}>
      <Text style={{ color: t.cinza, textTransform: 'capitalize' }}>{dataLonga(hoje)}</Text>
      <Cartao style={{ marginTop: 10 }}>
        <Selo>{dev.ref}</Selo>
        <Text style={{ color: t.texto, fontSize: 24, fontWeight: '700', marginTop: 6 }}>{dev.titulo}</Text>
        <Text style={{ color: t.texto, fontSize: 18, lineHeight: 29, marginTop: 12 }}>{dev.texto}</Text>
        <Botao titulo="Compartilhar" onPress={compartilhar} claro style={{ marginTop: 16, alignSelf: 'flex-start' }} />
      </Cartao>
      <Titulo>Dias anteriores</Titulo>
      {anteriores.map((a, k) => (
        <Cartao key={k}>
          <Text style={{ color: t.cinza, fontSize: 12 }}>{dataCurta(a.data)}</Text>
          <Text style={{ color: t.texto, fontSize: 16, fontWeight: '700', marginTop: 2 }}>{a.dev.titulo} — {a.dev.ref}</Text>
        </Cartao>
      ))}
    </ScrollView>
  );
}
