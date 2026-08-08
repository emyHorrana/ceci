// TextSizeContext.jsx
// Contexto global de tamanho de texto (acessibilidade).
//
// PARA QUE SERVE
// O público do CECI é majoritariamente adulto/idoso iniciante em
// tecnologia - texto pequeno demais é uma barreira real, não só uma
// preferência estética. Por isso esse controle precisa ficar visível
// o tempo todo (não escondido num menu de configurações), em
// qualquer tela do site, logada ou não.
//
// COMO FUNCIONA
// 3 níveis fixos: 'normal' | 'grande' | 'extra-grande'. Escolhido em
// vez de uma escala contínua (%/zoom) de propósito - poucos passos
// bem definidos são mais fáceis de entender e "sempre voltar" pra
// alguém não-técnico do que um zoom livre.
//
// Como quase todo font-size do projeto já está em rem (relativo ao
// font-size do <html>), a implementação é só isso: aplicar um
// data-attribute no <html> e deixar 3 regras CSS (ver index.css)
// mudarem o font-size base. Todo o resto (textos, paddings, gaps em
// rem) escala sozinho, sem precisar tocar em nenhum outro arquivo CSS
// do projeto.
//
// Uso: envolva o app inteiro (App.jsx, fora do <BrowserRouter> ou por
// fora, não importa a ordem) com <TextSizeProvider>. Pra consumir:
// const { textSize, setTextSize } = useContext(TextSizeContext)
// ou o hook useTextSize() em hooks/useTextSize.js.

import { createContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const TextSizeContext = createContext();

// Não exportado de propósito (só usado aqui dentro) - evita misturar
// export de componente com export de constante no mesmo arquivo, que
// quebra o Fast Refresh do Vite. Quem precisa da lista de fora usa
// `niveis` do próprio contexto (ver value, embaixo).
const NIVEIS_TEXTO = ['normal', 'grande', 'extra-grande'];

const ROTULOS = {
  normal: 'Normal',
  grande: 'Grande',
  'extra-grande': 'Extra grande',
};

export function TextSizeProvider({ children }) {
  const [textSize, setTextSize] = useLocalStorage('ceci-tamanho-texto', 'normal');

  // Mantém o <html> sempre sincronizado com a preferência salva -
  // inclusive no primeiro carregamento da página (refresh, link
  // direto, etc), não só quando a pessoa clica no controle.
  useEffect(() => {
    document.documentElement.dataset.tamanhoTexto = textSize;
  }, [textSize]);

  const value = {
    textSize,
    setTextSize,
    niveis: NIVEIS_TEXTO,
    rotulos: ROTULOS,
  };

  return (
    <TextSizeContext.Provider value={value}>
      {children}
    </TextSizeContext.Provider>
  );
}