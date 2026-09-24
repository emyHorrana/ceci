// FrameCard.jsx
// Moldura "retrô" SEM barra de título: só a borda grossa, a sombra dura
// (sem blur) e os cantos arredondados - o mesmo "objeto físico" da
// RetroWindow (mesma classe .window de Window.module.css), mas sem o
// "nome de programa" (ex: "ceci.exe") e sem os botõezinhos _ □ ×.
//
// POR QUE EXISTE: a barra de título é ótima em cards grandes e únicos
// (1 por seção, ex: cada módulo da trilha), mas em card pequeno ou
// repetido ela só polui - e pode confundir quem está aprendendo a usar
// computador (adultos/idosos): o que é esse "algumacoisa.exe"? Dá pra
// clicar nesses botões? Então o padrão é:
//   - card pequeno / repetido / que já tem título próprio -> FrameCard
//   - card grande / único da página                        -> RetroWindow
//
// Props:
//   bodyClassName - classes do miolo (padding, fundo, gap, layout...).
//                   A moldura só cuida de borda/sombra/cantos - o resto
//                   continua definido no CSS da própria página.
//   className     - classes extras pro frame externo
//   as            - tag do frame externo (padrão: 'div'). Ex: 'section'
//   children      - conteúdo
//   ...props      - repassado pro frame externo (id, onClick, role,
//                   aria-label, data-*, etc.)

import styles from './Window.module.css';

export function FrameCard({
                              bodyClassName = '',
                              className = '',
                              as: Tag = 'div',
                              children,
                              ...props
                          }) {
    return (
        <Tag className={`${styles.window} ${className}`.trim()} {...props}>
            <div className={bodyClassName}>{children}</div>
        </Tag>
    );
}