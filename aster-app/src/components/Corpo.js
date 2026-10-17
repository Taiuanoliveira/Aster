import React, { useMemo } from 'react';
import { View, Text, Image } from 'react-native';
import { useTema } from '../lib/tema';
import { htmlParaBlocos } from '../lib/html';
import { abrirLink } from '../lib/redes';

export default function Corpo({ html, tamanho }) {
  const t = useTema();
  const T = tamanho || 17;
  const blocos = useMemo(() => htmlParaBlocos(html), [html]);

  const runs = (b, extra) => b.runs.map((r, k) => (
    <Text key={k} onPress={r.href ? () => abrirLink(r.href) : undefined}
      style={[r.b && { fontWeight: '700' }, r.i && { fontStyle: 'italic' }, (r.u || r.href) && { textDecorationLine: 'underline' }, r.href && { color: t.link }, extra]}>
      {r.s}
    </Text>
  ));

  return (
    <View>
      {blocos.map((b, k) => {
        if (b.t === 'img') return <Image key={k} source={{ uri: b.src }} style={{ width: '100%', height: 200, borderRadius: 10, marginVertical: 12, backgroundColor: t.suave }} resizeMode="contain" />;
        const base = { color: t.texto, fontSize: T, lineHeight: T * 1.6 };
        if (b.t === 'h2') return <Text key={k} accessibilityRole="header" style={[base, { fontSize: T + 5, fontWeight: '700', lineHeight: (T + 5) * 1.3, marginTop: 22, marginBottom: 8 }]}>{runs(b)}</Text>;
        if (b.t === 'h3') return <Text key={k} accessibilityRole="header" style={[base, { fontSize: T + 2, fontWeight: '700', lineHeight: (T + 2) * 1.35, marginTop: 18, marginBottom: 6 }]}>{runs(b)}</Text>;
        if (b.t === 'quote') return (
          <View key={k} style={{ borderLeftWidth: 3, borderLeftColor: t.azul, paddingLeft: 14, marginVertical: 10 }}>
            <Text style={[base, { fontStyle: 'italic', color: t.cinza }]}>{runs(b)}</Text>
          </View>
        );
        if (b.t === 'li') return (
          <View key={k} style={{ flexDirection: 'row', marginBottom: 6, paddingLeft: 6 + (b.nivel || 0) * 16 }}>
            <Text style={[base, { width: 26 }]}>{b.n ? b.n + '.' : '•'}</Text>
            <Text style={[base, { flex: 1 }]}>{runs(b)}</Text>
          </View>
        );
        return <Text key={k} style={[base, { marginBottom: 14 }]}>{runs(b)}</Text>;
      })}
    </View>
  );
}
