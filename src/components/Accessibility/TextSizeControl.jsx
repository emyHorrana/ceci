// TextSizeControl.jsx
// Barra de tamanho de texto - fixa no topo, largura inteira, por cima
// de QUALQUER tela do site (login, boas-vindas, dashboard, lição...),
// porque é renderizada uma vez direto no App.jsx, fora das rotas.
//
// Por que uma barra fixa no topo (e não um botão de canto, nem algo
// dentro de um menu de configurações): o público do CECI é
// majoritariamente adulto/idoso iniciante em tecnologia, pra quem
// "abre o menu, acha a opção certa" já é uma barreira - e um widget
// solto de canto arriscava sobrepor conteúdo real (badges de
// pontos/streak no topbar do Dashboard, por exemplo). Uma barra de
// largura inteira no topo é um padrão que parte desse público já
// reconhece de sites de governo/bancos, e reserva o próprio espaço
// (ver #root/.topbar/.sidebar em index.css e AppLayout.module.css) em
// vez de flutuar por cima de outra coisa.
//
// Os 3 botões mostram a letra "A" em tamanhos crescentes (em vez de
// só texto "P/M/G" ou ícones abstratos) de propósito: o próprio botão
// já comunica visualmente o que ele faz, sem depender de já saber ler
// a palavra "tamanho".

import { useContext } from 'react';
import { TextSizeContext } from '../../context/TextSizeContext';
import styles from './TextSizeControl.module.css';

export function TextSizeControl() {
  const { textSize, setTextSize, niveis, rotulos } = useContext(TextSizeContext);

  return (
    <div className={styles.barra} role="group" aria-label="Tamanho do texto">
      <span className={styles.rotulo} aria-hidden>Tamanho do texto</span>
      <div className={styles.botoes}>
        {niveis.map((nivel) => (
          <button
            key={nivel}
            type="button"
            className={styles.botao}
            data-nivel={nivel}
            data-ativo={textSize === nivel}
            aria-pressed={textSize === nivel}
            aria-label={rotulos[nivel]}
            onClick={() => setTextSize(nivel)}
          >
            A
          </button>
        ))}
      </div>
    </div>
  );
}