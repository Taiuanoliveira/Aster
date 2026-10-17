import { useColorScheme } from 'react-native';

export const SITE = 'https://projetoaster.com.br';

const claro = { bg: '#FBFAF6', texto: '#000000', cinza: '#5b6770', card: '#FFFFFF', borda: '#E3DDD0', azul: '#3056FF', amarelo: '#FFFD73', link: '#3056FF', suave: '#EEF1FF' };
const escuro = { bg: '#0F1720', texto: '#FFFFFF', cinza: '#9fb0bd', card: '#1B2430', borda: '#2A3442', azul: '#3056FF', amarelo: '#FFFD73', link: '#8CC4EA', suave: '#16233A' };

export function useTema() {
  const esquema = useColorScheme();
  const c = esquema === 'dark' ? escuro : claro;
  return { ...c, escuro: esquema === 'dark' };
}
