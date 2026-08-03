// Teclado.jsx
// Desenho de um teclado (placeholder em CSS - ver nota abaixo) usado
// pra apontar a localização de uma tecla específica. Hoje só destaca
// Enter ou Espaço, mas foi pensado pra crescer conforme mais teclas
// precisarem ser ensinadas (Ctrl, Shift, setas...) - basta adicionar
// um novo valor em `teclaDestacada` e o desenho correspondente aqui
// dentro, sem mudar quem usa este componente.
//
// PLACEHOLDER DE ARTE: se houver algum dia ilustração/gif específico,
// troca o conteúdo interno (a prop `teclaDestacada` continua funcionando 
// do mesmo jeito pra quem usa o componente).
//
// Props:
//   teclaDestacada ('espaco' | 'enter', obrigatório) - qual tecla
//     aparece destacada/pulsando agora.

import styles from './Teclado.module.css';

export function Teclado({ teclaDestacada }) {
  return (
    <div className={styles.teclado} aria-hidden>
      <div className={styles.linha}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={styles.tecla} />
        ))}
      </div>

      <div className={styles.linha}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={styles.tecla} />
        ))}
        <span
          className={`${styles.tecla} ${styles.enter} ${teclaDestacada === 'enter' ? styles.destacada : ''}`}
        >
          ↵
        </span>
      </div>

      <div className={styles.linha}>
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className={styles.tecla} />
        ))}
      </div>

      <div className={styles.linha}>
        <span
          className={`${styles.barraEspaco} ${teclaDestacada === 'espaco' ? styles.destacada : ''}`}
        >
          espaço
        </span>
      </div>
    </div>
  );
}