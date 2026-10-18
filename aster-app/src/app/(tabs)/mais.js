import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTema, SITE, usePrefTema, definirTema } from '../../lib/tema';
import { useDados } from '../../lib/useDados';
import { lerConfig, listarColecao } from '../../lib/api';
import { lerPrefs, salvarPrefs } from '../../lib/prefs';
import { pedirPermissao, reagendar, avisoDeTeste, notificacoesDisponiveis } from '../../lib/notificacoes';
import { hhmm } from '../../lib/datas';
import { redesDoSite, abrirLink } from '../../lib/redes';
import { Cartao, Titulo, Botao, Redes, estilos } from '../../components/ui';

function Passo({ rotulo, onMais, onMenos }) {
  const t = useTema();
  const b = { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: t.borda, alignItems: 'center', justifyContent: 'center', backgroundColor: t.card };
  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable onPress={onMais} style={b} accessibilityLabel={'Aumentar ' + rotulo}><Text style={{ color: t.link, fontSize: 20, fontWeight: '700' }}>+</Text></Pressable>
      <Text style={{ color: t.cinza, fontSize: 11, marginVertical: 2 }}>{rotulo}</Text>
      <Pressable onPress={onMenos} style={b} accessibilityLabel={'Diminuir ' + rotulo}><Text style={{ color: t.link, fontSize: 20, fontWeight: '700' }}>−</Text></Pressable>
    </View>
  );
}

function Lembrete({ nome, valor, onMudar }) {
  const t = useTema();
  return (
    <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.borda }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: t.texto, fontSize: 16, fontWeight: '600' }}>{nome}</Text>
        <Switch value={valor.ligado} onValueChange={v => onMudar({ ...valor, ligado: v })} trackColor={{ true: '#3056FF' }} />
      </View>
      {valor.ligado ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22, marginTop: 10 }}>
          <Passo rotulo="hora" onMais={() => onMudar({ ...valor, h: (valor.h + 1) % 24 })} onMenos={() => onMudar({ ...valor, h: (valor.h + 23) % 24 })} />
          <Text style={{ color: t.texto, fontSize: 34, fontWeight: '700' }}>{hhmm(valor.h, valor.m)}</Text>
          <Passo rotulo="min" onMais={() => onMudar({ ...valor, m: (valor.m + 15) % 60 })} onMenos={() => onMudar({ ...valor, m: (valor.m + 45) % 60 })} />
        </View>
      ) : null}
    </View>
  );
}

export default function Mais() {
  const t = useTema();
  const router = useRouter();
  const [prefs, setPrefs] = useState(null);
  const [aviso, setAviso] = useState('');
  const cfg = useDados('config', lerConfig);
  const inst = useDados('institucional', () => listarColecao('institucional'));
  const prefTema = usePrefTema();

  useEffect(() => { lerPrefs().then(setPrefs); }, []);

  const mudar = async (chave, valor) => {
    let v = valor;
    if (valor.ligado && !prefs[chave].ligado) {
      const ok = await pedirPermissao();
      if (!ok) { setAviso('As notificações estão bloqueadas. Libere nas configurações do celular para este app.'); v = { ...valor, ligado: false }; }
      else setAviso('');
    }
    const novo = { ...prefs, perguntou: true, [chave]: v };
    setPrefs(novo); await salvarPrefs(novo); await reagendar(novo);
  };
  const testar = async () => { setAviso((await avisoDeTeste()) ? 'Enviado! Em 5 segundos chega um aviso (se estiver no Expo Go, pode deixar o app aberto ou minimizar).' : 'Não foi possível: verifique se as notificações estão liberadas.'); };

  const link = (titulo, onPress) => (
    <Pressable onPress={onPress} style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: t.borda, flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ color: t.texto, fontSize: 16 }}>{titulo}</Text><Text style={{ color: t.cinza }}>›</Text>
    </Pressable>
  );
  const c = cfg.dados;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina}>
      <Titulo style={{ marginTop: 4 }}>Aparência</Titulo>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[['auto', 'Automático'], ['claro', 'Claro'], ['escuro', 'Escuro']].map(([id, nome]) => (
          <Pressable key={id} onPress={() => definirTema(id)} accessibilityRole="button"
            style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center', borderColor: prefTema === id ? t.azul : t.borda, backgroundColor: prefTema === id ? t.azul : t.card }}>
            <Text style={{ color: prefTema === id ? '#fff' : t.texto, fontWeight: '700' }}>{nome}</Text>
          </Pressable>
        ))}
      </View>

      <Titulo>Lembretes</Titulo>
      <Cartao>
        {!notificacoesDisponiveis() ? (
          <Text style={{ color: t.cinza, fontSize: 14, lineHeight: 21 }}>Os lembretes diários funcionam no aplicativo instalado no celular. Nesta versão de teste (Expo Go) eles ficam indisponíveis.</Text>
        ) : prefs ? (
          <>
            <Lembrete nome="Versículo do dia" valor={prefs.verso} onMudar={v => mudar('verso', v)} />
            <Lembrete nome="Devocional do dia" valor={prefs.devocional} onMudar={v => mudar('devocional', v)} />
          </>
        ) : null}
        {aviso ? <Text style={{ color: t.cinza, fontSize: 13, lineHeight: 19, marginTop: 10 }}>{aviso}</Text> : null}
        {notificacoesDisponiveis() ? <Botao titulo="Testar um lembrete agora" onPress={testar} claro style={{ marginTop: 12 }} /> : null}
      </Cartao>

      <Titulo>Projeto Aster</Titulo>
      <Cartao style={{ paddingVertical: 4 }}>
        {link('Estudos', () => router.push('/estudos'))}
        {link('Plano de leitura', () => router.push('/plano'))}
        {link('Apoie o Aster', () => router.push('/apoie'))}
        {link('Nossa Equipe', () => router.push('/equipe'))}
        {link('Termos de uso', () => abrirLink(SITE + '/termos.html'))}
        {link('Política de privacidade', () => abrirLink(SITE + '/privacidade.html'))}
        {(inst.dados || []).filter(i => /^https?:/i.test(i.link || '')).map(i => <View key={i.id}>{link(i.titulo, () => abrirLink(i.link.trim()))}</View>)}
        {link('Abrir o site', () => abrirLink(SITE))}
      </Cartao>

      {c && c.footerDescricao ? <Text style={{ color: t.cinza, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 }}>{c.footerDescricao}</Text> : null}
      <Redes itens={redesDoSite(c)} centro />
      {c && (c.emailContato || c.telefoneContato) ? <Text style={{ color: t.cinza, fontSize: 13, textAlign: 'center', marginTop: 12 }}>{[c.emailContato, c.telefoneContato].filter(Boolean).join(' · ')}</Text> : null}
    </ScrollView>
  );
}
