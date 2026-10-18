import React from 'react';
import { Image } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../lib/tema';

const banner = require('../../../assets/aster-banner.png');

export default function Abas() {
  const t = useTema();
  const aba = (name, title, icone) => (
    <Tabs.Screen name={name} options={{ title, tabBarIcon: ({ color, size }) => <Ionicons name={icone} size={size} color={color} /> }} />
  );
  return (
    <Tabs screenOptions={{
      sceneStyle: { backgroundColor: t.bg },
      headerStyle: { backgroundColor: '#3056FF' }, headerTintColor: '#FFFFFF',
      headerTitle: () => <Image source={banner} style={{ width: 116, height: 27 }} resizeMode="contain" accessibilityLabel="Projeto Aster" />,
      tabBarActiveTintColor: t.link, tabBarInactiveTintColor: t.cinza,
      tabBarStyle: { backgroundColor: t.card, borderTopColor: t.borda }
    }}>
      {aba('index', 'Início', 'home-outline')}
      {aba('biblia', 'Bíblia', 'book-outline')}
      {aba('editorial', 'Editorial', 'newspaper-outline')}
      {aba('biblioteca', 'Biblioteca', 'library-outline')}
      {aba('mais', 'Mais', 'menu-outline')}
    </Tabs>
  );
}
