import React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { useTema } from '../lib/tema';
import { useDados } from '../lib/useDados';
import { listarColecao } from '../lib/api';
import { redesDaPessoa } from '../lib/redes';
import { Cartao, Redes, Carregando, Aviso, estilos } from '../components/ui';

const FUNCOES = { administrador: 'Administração', editor: 'Edição', colunista: 'Colunista', revisor: 'Revisão' };

export default function Equipe() {
  const t = useTema();
  const d = useDados('equipe', () => listarColecao('equipe'));
  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina}>
      {!d.dados ? (d.carregando ? <Carregando /> : <Aviso texto={d.erro || 'Não foi possível carregar.'} onTentar={d.recarregar} />)
        : !d.dados.length ? <Text style={{ color: t.cinza }}>A equipe ainda não foi cadastrada.</Text>
        : d.dados.map(m => (
          <Cartao key={m.id}>
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
              {m.fotoUrl && /^https:\/\//i.test(m.fotoUrl)
                ? <Image source={{ uri: m.fotoUrl }} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: t.suave }} />
                : <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: t.suave, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: t.link, fontSize: 26, fontWeight: '700' }}>{String(m.nome || '?').charAt(0).toUpperCase()}</Text></View>}
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.texto, fontSize: 18, fontWeight: '700' }}>{m.nome}</Text>
                {m.cargo ? <Text style={{ color: t.link, fontSize: 14 }}>{m.cargo}</Text> : null}
                {FUNCOES[m.funcao] ? <Text style={{ color: t.cinza, fontSize: 12 }}>{FUNCOES[m.funcao]}</Text> : null}
              </View>
            </View>
            {m.bio ? <Text style={{ color: t.cinza, fontSize: 14, lineHeight: 21, marginTop: 10 }}>{m.bio}</Text> : null}
            <Redes itens={redesDaPessoa(m.contatos)} />
          </Cartao>
        ))}
    </ScrollView>
  );
}
