// Teclado.jsx
// Desenho de um teclado (placeholder em CSS - ver nota abaixo) usado
// pra apontar a localização de uma tecla específica. Foi pensado pra
// crescer conforme mais teclas precisarem ser ensinadas - basta
// adicionar um novo valor em `teclaDestacada` e o desenho
// correspondente aqui dentro, sem mudar quem usa este componente.
//
// PLACEHOLDER DE ARTE: quando/se houver ilustração/gif específico,
// troca o conteúdo interno e a prop `teclaDestacada` continua 
// funcionando do mesmo jeito pra quem usa o componente.
//
// Cada tecla especial fica desenhada onde ela realmente mora num
// teclado de verdade, não só "destacada em algum lugar genérico":
//   - Espaço: isolado numa fileira própria (só ele é assim de verdade)
//   - Enter: fim da "home row", mais largo que as vizinhas
//   - Backspace: fim da fileira de números, mais largo
//   - Caps Lock: INÍCIO da "home row", mais largo
//   - Shift: as DUAS pontas da fileira de baixo (existem dois de
//     verdade - qualquer um dos dois conta como acerto)
//   - Esc: sozinho, acima da fileira de números (não faz parte dela)
//   - Delete: NÃO fica no bloco principal - mora num agrupamento à
//     parte (por isso está visualmente separado aqui também)
//
// Só as teclas SEM tipografia sobreposta (Espaço, Enter, Backspace,
// Caps Lock, Shift, Esc, Delete) dá pra desenhar aqui - letras,
// números e símbolos individuais não têm como ser marcados num
// teclado sem rótulos em cada tecla. Pra ensinar "onde fica o @", por
// exemplo, a mecânica certa é digitar (DigitarTextoGame), não apontar
// no teclado.
//
// Props:
//   teclaDestacada obrigatório, um de:
//     'espaco' | 'enter' | 'backspace' | 'capslock' | 'shift' | 'esc'
//     | 'delete'

import styles from './Teclado.module.css';

export function Teclado({ teclaDestacada }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.teclado} aria-hidden>
        {/* Esc mora sozinho, acima da fileira de números */}
        <div className={styles.linhaEsc}>
          <span
            className={`${styles.tecla} ${styles.esc} ${teclaDestacada === 'esc' ? styles.destacada : ''}`}
          >
            esc
          </span>
        </div>

        {/* Fileira de números - é aqui que o Backspace mora de verdade,
            no fim, encostado nas teclas vizinhas. */}
        <div className={styles.linha}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={styles.tecla} />
          ))}
          <span
            className={`${styles.tecla} ${styles.backspace} ${teclaDestacada === 'backspace' ? styles.destacada : ''}`}
          >
            ⌫
          </span>
        </div>

        {/* Fileira do meio ("home row") - Caps Lock no início, Enter
            no fim, ambos encostados nas teclas vizinhas. */}
        <div className={styles.linha}>
          <span
            className={`${styles.tecla} ${styles.capslock} ${teclaDestacada === 'capslock' ? styles.destacada : ''}`}
          >
            ⇪
          </span>
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className={styles.tecla} />
          ))}
          <span
            className={`${styles.tecla} ${styles.enter} ${teclaDestacada === 'enter' ? styles.destacada : ''}`}
          >
            ↵
          </span>
        </div>

        {/* Fileira de baixo - Shift nas duas pontas (qualquer um dos
            dois conta como acerto, é assim de verdade). */}
        <div className={styles.linha}>
          <span
            className={`${styles.tecla} ${styles.shift} ${teclaDestacada === 'shift' ? styles.destacada : ''}`}
          >
            ⇧
          </span>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={styles.tecla} />
          ))}
          <span
            className={`${styles.tecla} ${styles.shift} ${teclaDestacada === 'shift' ? styles.destacada : ''}`}
          >
            ⇧
          </span>
        </div>

        <div className={styles.linha}>
          <span
            className={`${styles.barraEspaco} ${teclaDestacada === 'espaco' ? styles.destacada : ''}`}
          >
            espaço
          </span>
        </div>
      </div>

      {/* Delete não fica no bloco principal - é um agrupamento à
          parte, por isso aparece visualmente separado. */}
      <div className={styles.clusterExtra}>
        <span
          className={`${styles.tecla} ${styles.delete} ${teclaDestacada === 'delete' ? styles.destacada : ''}`}
        >
          del
        </span>
      </div>
    </div>
  );
}