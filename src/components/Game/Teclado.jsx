// Teclado.jsx
// Renderização padronizada do teclado completo ABNT2 com foco e destaque
// na tecla solicitada, com visual nítido e proporções confortáveis.

import { TecladoSvg } from './TecladoSvg';
import styles from './Teclado.module.css';

export function Teclado({ teclaDestacada }) {
  return (
    <div className={styles.wrapper}>
      <TecladoSvg destaque={teclaDestacada} maxWidth="960px" />
    </div>
  );
}