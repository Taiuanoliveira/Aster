import React from 'react';
import { View, Text, Pressable, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../lib/tema';
import { ICONES, ROTULOS, abrirLink } from '../lib/redes';

export function Tela({ children, style }) {
  const t = useTema();
  return <View style={[{ flex: 1, backgroundColor: t.bg }, style]}>{children}</View>;
}

export function Titulo({ children, style }) {
  const t = useTema();
  return <Text accessibilityRole="header" style={[{ color: t.texto, fontSize: 22, fontWeight: '700', marginTop: 22, marginBottom: 10 }, style]}>{children}</Text>;
}

export function Cartao({ children, onPress, style }) {
  const t = useTema();
  const base = [{ backgroundColor: t.card, borderColor: t.borda, borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 }, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return <Pressable onPress={onPress} style={({ pressed }) => [...base, pressed && { opacity: 0.7 }]}>{children}</Pressable>;
}

export function Botao({ titulo, onPress, claro, style }) {
  const t = useTema();
  return (
    <Pressable onPress={onPress} accessibilityRole="button"
      style={({ pressed }) => [{ backgroundColor: claro ? t.suave : t.azul, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18, alignItems: 'center', opacity: pressed ? 0.7 : 1 }, style]}>
      <Text style={{ color: claro ? t.link : '#fff', fontWeight: '700', fontSize: 15 }}>{titulo}</Text>
    </Pressable>
  );
}

export function Carregando() {
  return <View style={{ padding: 40 }}><ActivityIndicator size="large" color="#3056FF" /></View>;
}

export function Aviso({ texto, onTentar }) {
  const t = useTema();
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ color: t.cinza, textAlign: 'center', fontSize: 15, marginBottom: 12 }}>{texto}</Text>
      {onTentar ? <Botao titulo="Tentar de novo" onPress={onTentar} claro /> : null}
    </View>
  );
}

export function Selo({ children }) {
  const t = useTema();
  return <Text style={{ color: t.link, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 }}>{children}</Text>;
}

export function Redes({ itens, centro }) {
  const t = useTema();
  if (!itens || !itens.length) return null;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: centro ? 'center' : 'flex-start', marginTop: 8 }}>
      {itens.map(r => (
        <Pressable key={r.tipo} onPress={() => abrirLink(r.url)} accessibilityLabel={ROTULOS[r.tipo]} accessibilityRole="link"
          style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: t.borda, alignItems: 'center', justifyContent: 'center', backgroundColor: t.card }}>
          <Ionicons name={ICONES[r.tipo]} size={20} color={t.link} />
        </Pressable>
      ))}
    </View>
  );
}

export function CartaoArtigo({ n, destaque, onPress }) {
  const t = useTema();
  const autores = [n.autorNome].concat(n.coautores || []).filter(Boolean).join(', ');
  return (
    <Cartao onPress={onPress} style={{ padding: 0, overflow: 'hidden' }}>
      {n.imagemUrl && /^https:\/\//i.test(n.imagemUrl)
        ? <Image source={{ uri: n.imagemUrl }} style={{ width: '100%', height: destaque ? 190 : 140, backgroundColor: t.suave }} resizeMode="cover" />
        : null}
      <View style={{ padding: 16 }}>
        <Selo>{destaque ? 'Matéria de capa' : (n.categoria || 'Artigo')}</Selo>
        <Text style={{ color: t.texto, fontSize: destaque ? 21 : 18, fontWeight: '700', marginTop: 4 }}>{n.titulo}</Text>
        {n.resumo ? <Text style={{ color: t.cinza, fontSize: 14, lineHeight: 20, marginTop: 6 }} numberOfLines={3}>{n.resumo}</Text> : null}
        {autores ? <Text style={{ color: t.cinza, fontSize: 13, marginTop: 8 }}>{autores}</Text> : null}
      </View>
    </Cartao>
  );
}

export const estilos = StyleSheet.create({ pagina: { padding: 16, paddingBottom: 40 } });
