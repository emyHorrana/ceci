// MouseDemonstracaoGame.jsx
// Demonstração interativa das ações fundamentais do mouse:
// - Clique com o botão esquerdo (acao: 'esquerdo')
// - Clique com o botão direito (acao: 'direito')
// - Rolar a rodinha / scroll (acao: 'scroll')
// - Todas juntas (acao: 'todas')
//
// O aluno executa o gesto diretamente com o mouse físico na área interativa.
// Quando a ação solicitada for realizada, valida a demonstração com feedback imediato.

import { useState, useEffect, useRef } from 'react';
import styles from './MouseDemonstracaoGame.module.css';

export function MouseDemonstracaoGame({ reportResult, acao = 'todas' }) {
  const [esquerdoOk, setEsquerdoOk] = useState(false);
  const [direitoOk, setDireitoOk] = useState(false);
  const [scrollOk, setScrollOk] = useState(false);
  const [ultimoGesto, setUltimoGesto] = useState(null);
  const [mensagemFeedback, setMensagemFeedback] = useState(null);

  const concluiuRef = useRef(false);

  const registrarAcao = (tipo) => {
    setUltimoGesto(tipo);

    if (tipo === 'esquerdo') {
      if (acao === 'direito') {
        setMensagemFeedback('Você usou o botão esquerdo! Tente clicar com o botão DIREITO.');
        return;
      }
      setEsquerdoOk(true);
      setMensagemFeedback('Muito bem! Botão esquerdo acionado com sucesso.');
    } else if (tipo === 'direito') {
      if (acao === 'esquerdo') {
        setMensagemFeedback('Você usou o botão direito! Tente clicar com o botão ESQUERDO.');
        return;
      }
      setDireitoOk(true);
      setMensagemFeedback('Perfeito! Botão direito acionado com sucesso.');
    } else if (tipo === 'scroll') {
      setScrollOk(true);
      setMensagemFeedback('Excelente! Rodinha (scroll) girada com sucesso.');
    }
  };

  useEffect(() => {
    if (concluiuRef.current) return;

    const completou =
      acao === 'esquerdo'
        ? esquerdoOk
        : acao === 'direito'
        ? direitoOk
        : acao === 'scroll'
        ? scrollOk
        : esquerdoOk && direitoOk && scrollOk;

    if (completou) {
      concluiuRef.current = true;
      setMensagemFeedback('Demonstração concluída com sucesso!');
      const timer = setTimeout(() => {
        reportResult(true, {
          acoes: [
            esquerdoOk ? 'esquerdo' : null,
            direitoOk ? 'direito' : null,
            scrollOk ? 'scroll' : null,
          ].filter(Boolean),
        });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [esquerdoOk, direitoOk, scrollOk, acao, reportResult]);

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      registrarAcao('esquerdo');
    } else if (e.button === 2) {
      e.preventDefault();
      registrarAcao('direito');
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    registrarAcao('direito');
  };

  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) > 1 || Math.abs(e.deltaX) > 1) {
      registrarAcao('scroll');
    }
  };

  const mostrarTodos = acao === 'todas';

  return (
    <div
      className={styles.container}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
      tabIndex={0}
      role="region"
      aria-label="Área interativa de teste do mouse"
    >
      <div className={styles.checklist}>
        {(mostrarTodos || acao === 'esquerdo') && (
          <div className={`${styles.checkItem} ${esquerdoOk ? styles.checkItemOk : ''}`}>
            <span className={styles.checkIcon}>{esquerdoOk ? '✓' : '1'}</span>
            <span>Clique com o <strong>botão esquerdo</strong> do seu mouse</span>
          </div>
        )}

        {(mostrarTodos || acao === 'direito') && (
          <div className={`${styles.checkItem} ${direitoOk ? styles.checkItemOk : ''}`}>
            <span className={styles.checkIcon}>{direitoOk ? '✓' : mostrarTodos ? '2' : '1'}</span>
            <span>Clique com o <strong>botão direito</strong> do seu mouse</span>
          </div>
        )}

        {(mostrarTodos || acao === 'scroll') && (
          <div className={`${styles.checkItem} ${scrollOk ? styles.checkItemOk : ''}`}>
            <span className={styles.checkIcon}>{scrollOk ? '✓' : mostrarTodos ? '3' : '1'}</span>
            <span>Gire a <strong>rodinha (scroll)</strong> do seu mouse</span>
          </div>
        )}
      </div>

      <div className={styles.mouseVisualWrapper}>
        <svg viewBox="0 0 200 260" className={styles.mouseSvg} aria-hidden="true">
          {/* Corpo do mouse */}
          <path
            d="M 100 18 C 46 18, 18 62, 18 132 L 18 200 C 18 230, 46 246, 100 246 C 154 246, 182 230, 182 200 L 182 132 C 182 62, 154 18, 100 18 Z"
            className={styles.mouseCorpo}
          />

          {/* Botão Esquerdo */}
          <path
            d="M 100 18 C 46 18, 18 62, 18 132 L 95 132 L 95 18 Z"
            className={`${styles.mouseBotao} ${esquerdoOk ? styles.botaoAtivo : ''} ${ultimoGesto === 'esquerdo' ? styles.botaoPressionado : ''}`}
            onClick={() => registrarAcao('esquerdo')}
          />

          {/* Botão Direito */}
          <path
            d="M 100 18 C 154 18, 182 62, 182 132 L 105 132 L 105 18 Z"
            className={`${styles.mouseBotao} ${direitoOk ? styles.botaoAtivo : ''} ${ultimoGesto === 'direito' ? styles.botaoPressionado : ''}`}
            onContextMenu={(e) => {
              e.preventDefault();
              registrarAcao('direito');
            }}
            onClick={(e) => {
              if (e.button === 0 && !direitoOk) {
                registrarAcao('direito');
              }
            }}
          />

          {/* Linha central divisória */}
          <line x1="100" y1="18" x2="100" y2="132" className={styles.linhaDivisoria} />

          {/* Rodinha (scroll) */}
          <rect
            x="88"
            y="36"
            width="24"
            height="52"
            rx="12"
            className={`${styles.mouseScroll} ${scrollOk ? styles.scrollAtivo : ''} ${ultimoGesto === 'scroll' ? styles.scrollGirando : ''}`}
            onClick={() => registrarAcao('scroll')}
          />
        </svg>

        {mensagemFeedback ? (
          <p className={styles.feedbackTexto}>{mensagemFeedback}</p>
        ) : (
          <p className={styles.instrucaoApoio}>
            {acao === 'esquerdo'
              ? 'Clique em qualquer lugar desta área com o botão ESQUERDO do seu mouse.'
              : acao === 'direito'
              ? 'Clique em qualquer lugar desta área com o botão DIREITO do seu mouse.'
              : acao === 'scroll'
              ? 'Gire a rodinha (scroll) do seu mouse sobre esta área.'
              : 'Use seu mouse para clicar com o esquerdo, direito e girar a rodinha nesta área.'}
          </p>
        )}
      </div>
    </div>
  );
}

