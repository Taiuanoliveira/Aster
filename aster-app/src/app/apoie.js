import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTema } from '../lib/tema';
import { useDados } from '../lib/useDados';
import { lerDoc } from '../lib/api';
import { abrirLink } from '../lib/redes';
import { Cartao, Titulo, Botao, Carregando, estilos } from '../components/ui';

const okLink = u => { try { const m = /^https:\/\/([^/?#]+)/i.exec(String(u || '').trim()); return !!m && /(^|\.)(mercadopago\.com(\.[a-z]{2})?|mpago\.(la|li))$/i.test(m[1]); } catch (e) { return false; } };

function Copiar({ rotulo, texto }) {
  const t = useTema();
  const [ok, setOk] = useState(false);
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={{ color: t.cinza, fontSize: 12 }}>{rotulo}</Text>
      <Text selectable style={{ color: t.texto, fontSize: 15, marginVertical: 4 }}>{texto}</Text>
      <Botao titulo={ok ? '✓ Copiado' : 'Copiar'} claro onPress={async () => { try { await Clipboard.setStringAsync(String(texto)); setOk(true); setTimeout(() => setOk(false), 2500); } catch (e) {} }} style={{ alignSelf: 'flex-start' }} />
    </View>
  );
}

export default function Apoie() {
  const t = useTema();
  const d = useDados('apoio', async () => (await lerDoc('configuracoes', 'apoio').catch(() => null)) || {});
  const c = d.dados;
  const botoes = (lista, sub) => {
    const l = (lista || []).filter(i => okLink(i.link));
    if (!l.length) return <Text style={{ color: t.cinza, marginTop: 8 }}>Em breve</Text>;
    return l.map((i, k) => (
      <View key={k} style={{ marginTop: 10 }}>
        <Botao titulo={i.valor || 'Apoiar'} onPress={() => abrirLink(i.link.trim())} />
        <Text style={{ color: t.cinza, fontSize: 12, textAlign: 'center', marginTop: 4 }}>{sub}</Text>
      </View>
    ));
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina}>
      {!c ? <Carregando /> : (
        <>
          <Text style={{ color: t.texto, fontSize: 26, fontWeight: '700' }}>{c.titulo || 'Apoie o Projeto Aster'}</Text>
          <Text style={{ color: t.cinza, fontSize: 16, lineHeight: 24, marginTop: 6 }}>{c.texto || 'Todo o conteúdo do Projeto Aster é gratuito. Se ele te ajuda, você pode apoiar de forma voluntária.'}</Text>

          <Titulo>Como funciona</Titulo>
          <Cartao>
            <Text style={{ color: t.texto, fontSize: 15, lineHeight: 23 }}>
              <Text style={{ fontWeight: '700' }}>Apoio mensal:</Text> cobrança automática todo mês no cartão de crédito, até você cancelar.{'\n\n'}
              <Text style={{ fontWeight: '700' }}>Contribuição única:</Text> você escolhe quando e quanto, por Pix, boleto ou cartão, quantas vezes quiser. Não renova sozinha.{'\n\n'}
              O apoio é voluntário: o conteúdo continua gratuito para todos.
            </Text>
          </Cartao>

          <Cartao>
            <Text style={{ color: t.texto, fontSize: 18, fontWeight: '700' }}>Apoio mensal</Text>
            <Text style={{ color: t.cinza, fontSize: 13, lineHeight: 19, marginTop: 4 }}>Cartão de crédito · assinatura. Atenção: o valor escolhido será cobrado todo mês no seu cartão, automaticamente, até você cancelar pelo Mercado Pago.</Text>
            {botoes(c.mensal, 'Cobrado todo mês no cartão até você cancelar')}
          </Cartao>

          <Cartao>
            <Text style={{ color: t.texto, fontSize: 18, fontWeight: '700' }}>Contribuição única</Text>
            <Text style={{ color: t.cinza, fontSize: 13, lineHeight: 19, marginTop: 4 }}>Pix, boleto ou cartão · pagamento avulso, sem renovação. Na tela do Mercado Pago você escolhe a forma de pagar.</Text>
            {botoes(c.unico, 'Pagamento único, sem renovação')}
          </Cartao>

          {c.pixChave || c.pixCopiaCola ? (
            <Cartao>
              <Text style={{ color: t.texto, fontSize: 18, fontWeight: '700' }}>Pix direto</Text>
              <Text style={{ color: t.cinza, fontSize: 13, lineHeight: 19, marginTop: 4 }}>Pague quanto quiser, quantas vezes quiser, pelo app do seu banco. Não tem renovação.</Text>
              {c.pixChave ? <Copiar rotulo="Chave Pix" texto={c.pixChave} /> : null}
              {c.pixChave && c.pixNome ? <Text style={{ color: t.cinza, fontSize: 12 }}>Beneficiário: {c.pixNome}</Text> : null}
              {c.pixCopiaCola ? <Copiar rotulo="Pix copia e cola" texto={c.pixCopiaCola} /> : null}
            </Cartao>
          ) : null}
          <Text style={{ color: t.cinza, textAlign: 'center', marginTop: 8 }}>O conteúdo continua gratuito para todos. Obrigado por caminhar com a gente. ✦</Text>
        </>
      )}
    </ScrollView>
  );
}
