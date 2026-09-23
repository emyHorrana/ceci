// RetroWindow.jsx
// "Janela" estilo computador antigo (barra de título + corpo), usada como
// moldura pros cards do site. É o ponto de entrada da Cecília/roxo no resto
// do site (ver comentário atualizado em styles/variables.css): o amarelo
// continua sendo a cor dominante do CORPO da janela, o roxo/rosa entra
// como cor de apoio na barra de título.
//
// Props:
//   title    - texto da barra de título (ex: "ceci.exe") - inventa um
//              "nome de programa" curto pra reforçar a metáfora retrô
//   icon     - emoji opcional antes do título (ex: '💜')
//   accent   - 'purple' | 'pink' | 'yellow' | 'branco' (padrão: 'purple') -
//              cor da barra de título. 'branco' é neutro (sem cor de
//              destaque) - usado nos cards de teoria/jogo das lições
//              (GameMoment, MiniModulo, Licao).
//   controls - mostra os botõezinhos decorativos "_ □ ×" (padrão: true).
//              São só visuais (aria-hidden), não fazem nada ao clicar -
//              não é pra fingir que a janela minimiza/fecha de verdade,
//              o que confundiria quem está aprendendo a usar computador.
//   bodyClassName - classes do card da própria página (padding/gap/etc.
//              continuam definidos lá - este componente só cuida da
//              moldura: borda, sombra, cantos, barra de título)
//   className - classes extras pro frame externo
//   children  - conteúdo do corpo da janela

import styles from './Window.module.css';

export function RetroWindow({
                                title,
                                icon,
                                accent = 'purple',
                                controls = true,
                                bodyClassName = '',
                                className = '',
                                children,
                                ...props
                            }) {
    return (
        <div className={`${styles.window} ${styles[`accent-${accent}`]} ${className}`.trim()} {...props}>
            <div className={styles.titlebar}>
        <span className={styles.caption}>
          {icon && <span className={styles.captionIcon}>{icon}</span>}
            {title}
        </span>

                {controls && (
                    <span className={styles.controls} aria-hidden="true">
            <span className={styles.ctrl}>–</span>
            <span className={styles.ctrl}>▢</span>
            <span className={`${styles.ctrl} ${styles.ctrlClose}`}>×</span>
          </span>
                )}
            </div>

            <div className={bodyClassName}>{children}</div>
        </div>
    );
}