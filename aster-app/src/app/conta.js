import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import { useTema } from '../lib/tema';
import { useConta, entrar, cadastrar, recuperarSenha, sair } from '../lib/conta';
import { Cartao, Titulo, Botao, estilos } from '../components/ui';

export default function Conta() {
  const t = useTema();
  const { conta, pronto } = useConta();
  const [modo, setModo] = useState('entrar');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const campo = { borderWidth: 1, borderColor: t.borda, backgroundColor: t.card, color: t.texto, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, marginBottom: 10 };
  const rodar = async f => {
    setMsg(''); setOcupado(true);
    try { await f(); } catch (e) { setMsg(e.message || 'Algo deu errado.'); }
    setOcupado(false);
  };
  const enviar = () => rodar(async () => {
    if (!email.trim() || !senha) throw new Error('Preencha o e-mail e a senha.');
    if (modo === 'cadastrar') { if (!nome.trim()) throw new Error('Digite seu nome.'); await cadastrar(nome.trim(), email, senha); }
    else await entrar(email, senha);
    setSenha('');
  });
  const esqueci = () => rodar(async () => {
    if (!email.trim()) throw new Error('Digite seu e-mail acima e toque de novo.');
    await recuperarSenha(email); setMsg('Enviamos um link para redefinir a senha no seu e-mail.');
  });

  if (!pronto) return <View style={{ flex: 1, backgroundColor: t.bg }} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={estilos.pagina} keyboardShouldPersistTaps="handled">
      {conta ? (
        <>
          <Titulo style={{ marginTop: 4 }}>Minha conta</Titulo>
          <Cartao>
            <Text style={{ color: t.texto, fontSize: 18, fontWeight: '700' }}>{conta.nome || 'Leitor'}</Text>
            <Text style={{ color: t.cinza, fontSize: 15, marginTop: 4 }}>{conta.email}</Text>
            <Text style={{ color: t.cinza, fontSize: 13, marginTop: 10, lineHeight: 19 }}>Você continua conectado neste aparelho, mesmo fechando o app. É a mesma conta do site.</Text>
          </Cartao>
          <Botao titulo="Sair da conta" claro onPress={() => rodar(sair)} style={{ marginTop: 16 }} />
        </>
      ) : (
        <>
          <Titulo style={{ marginTop: 4 }}>{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</Titulo>
          <Cartao>
            {modo === 'cadastrar' ? <TextInput style={campo} placeholder="Seu nome" placeholderTextColor={t.cinza} value={nome} onChangeText={setNome} autoCapitalize="words" /> : null}
            <TextInput style={campo} placeholder="E-mail" placeholderTextColor={t.cinza} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} />
            <TextInput style={campo} placeholder="Senha" placeholderTextColor={t.cinza} value={senha} onChangeText={setSenha} secureTextEntry autoCapitalize="none" />
            {msg ? <Text style={{ color: /enviamos/i.test(msg) ? t.link : '#C0392B', fontSize: 14, marginBottom: 10, lineHeight: 20 }}>{msg}</Text> : null}
            <Botao titulo={ocupado ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'} onPress={ocupado ? () => {} : enviar} />
            {modo === 'entrar' ? <Pressable onPress={esqueci} style={{ paddingVertical: 12 }}><Text style={{ color: t.link, textAlign: 'center' }}>Esqueci minha senha</Text></Pressable> : null}
          </Cartao>
          <Pressable onPress={() => { setModo(modo === 'entrar' ? 'cadastrar' : 'entrar'); setMsg(''); }} style={{ paddingVertical: 16 }}>
            <Text style={{ color: t.link, textAlign: 'center', fontSize: 15 }}>{modo === 'entrar' ? 'Ainda não tenho conta' : 'Já tenho conta'}</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
