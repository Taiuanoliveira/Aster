import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIXO = 'aster:cache:';

// Mostra na hora o que já foi baixado antes e atualiza em seguida (funciona até sem internet).
export function useDados(chave, buscar) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const vivo = useRef(true);
  const fn = useRef(buscar);
  fn.current = buscar;

  const carregar = useCallback(async () => {
    setErro('');
    try {
      const novo = await fn.current();
      if (!vivo.current) return;
      setDados(novo);
      AsyncStorage.setItem(PREFIXO + chave, JSON.stringify(novo)).catch(() => {});
    } catch (e) {
      if (vivo.current) setErro('Não foi possível atualizar agora. Verifique a internet.');
    } finally {
      if (vivo.current) setCarregando(false);
    }
  }, [chave]);

  useEffect(() => {
    vivo.current = true;
    (async () => {
      try {
        const c = await AsyncStorage.getItem(PREFIXO + chave);
        if (c && vivo.current) { setDados(JSON.parse(c)); setCarregando(false); }
      } catch (e) {}
      carregar();
    })();
    return () => { vivo.current = false; };
  }, [chave, carregar]);

  return { dados, carregando, erro, recarregar: carregar };
}
