// TecladoCompleto.jsx
// Teclado com TODAS as teclas visíveis e rotuladas (letras, números,
// símbolos, especiais) - diferente do Teclado.jsx simplificado, que só
// nomeia teclas especiais e não tem como apontar "onde fica o C".
//
// CONVIVE com o Teclado.jsx simplificado, não o substitui: o
// simplificado continua sendo o certo pra quem está vendo um teclado
// pela primeira vez (menos informação na tela, mais fácil de não se
// perder) - ver PressionarTeclaGame. Este aqui entra
// onde é preciso apontar uma tecla específica de letra/número/símbolo,
// como nos atalhos (AtalhoTecladoGame), que precisam mostrar Ctrl E a
// letra ao mesmo tempo.
//
// O desenho do teclado (layout ABNT2, o mais comum no Brasil, incluindo
// o Ç e as teclas mortas de acento) vem do TecladoSvg. Teclados de
// outros países/padrões (o americano, por exemplo) têm símbolos em
// posições diferentes - isso já apareceu na prática: o @ é Alt Gr+Q no
// ABNT2, mas Shift+2 no americano (ver dica em data/modulos.js, 2-11).
//
// Props:
//   teclasDestacadas (array de e.code, obrigatório) - quais teclas
//     aparecem destacadas/pulsando agora. É array (não uma string só)
//     porque um atalho precisa destacar duas teclas ao mesmo tempo
//     (ex: Ctrl E a letra C) - e também porque Shift/Ctrl têm duas
//     teclas físicas cada, então "destacar Ctrl" já significa duas.
//
//   <TecladoCompleto teclasDestacadas={['ControlLeft', 'ControlRight', 'KeyC']} />

import { TecladoSvg } from './TecladoSvg';
import styles from './TecladoCompleto.module.css';

export function TecladoCompleto({ teclasDestacadas = [] }) {
  return (
      <div className={styles.wrapper}>
        <TecladoSvg destaque={teclasDestacadas} maxWidth="1024px" />
      </div>
  );
}