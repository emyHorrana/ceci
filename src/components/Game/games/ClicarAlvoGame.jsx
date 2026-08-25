// Mecânica genérica de CLIQUE. Cobre a maior parte do Módulo 1 (Mouse):
// identificar botão esquerdo/direito, clicar no ícone certo, escolher a
// opção certa num menu, duplo clique, clique com o botão direito etc.
//
// Recebe uma lista de "alvos" clicáveis e só um deles é o correto.
//
//   // clique simples (botão esquerdo)
//   <ClicarAlvoGame reportResult={reportResult} alvos={[...]} />
//
//   // clique com botão direito
//   <ClicarAlvoGame reportResult={reportResult} tipoClique="direito" alvos={[...]} />
//
//   // duplo clique
//   <ClicarAlvoGame reportResult={reportResult} duploClique={true} alvos={[...]} />
//
//   // menu de contexto simulado (clicar com o botão direito para abrir menu, depois esquerdo na opção)
//   <ClicarAlvoGame reportResult={reportResult}
//     menuContexto={{
//       instrucaoMenu: 'Clique com o botão esquerdo na opção "Abrir":',
//       opcoes: [
//         { id: 'abrir', label: 'Abrir', correto: true },
//         { id: 'renomear', label: 'Renomear', correto: false },
//         { id: 'excluir', label: 'Excluir', correto: false },
//       ]
//     }}
//     alvos={[{ id: 'arquivo', label: '📄 Meu Documento.docx', correto: true }]} />

import { useState } from 'react';
import styles from './ClicarAlvoGame.module.css';

export function ClicarAlvoGame({
                                 reportResult,
                                 alvos,
                                 duploClique = false,
                                 tipoClique = 'esquerdo',
                                 layout = 'linha',
                                 menuContexto = null,
                                 dicaApoio = null,
                                 fundo = null,
                               }) {
  const [alvoErrado, setAlvoErrado] = useState(null);
  const [alvoCerto, setAlvoCerto] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [opcaoMenuErrada, setOpcaoMenuErrada] = useState(null);
  const [opcaoMenuCerta, setOpcaoMenuCerta] = useState(null);
  const [avisoBotao, setAvisoBotao] = useState(null);

  const exigeBotaoDireito = tipoClique === 'direito' || Boolean(menuContexto);

  const handleCliqueEsquerdo = (e, alvo) => {
    if (exigeBotaoDireito && !menuAberto) {
      setAvisoBotao('Você clicou com o botão esquerdo! Tente clicar com o botão DIREITO do mouse.');
      setAlvoErrado(alvo.id);
      reportResult(false, { motivo: 'usou_botao_esquerdo_em_vez_de_direito', alvo: alvo.id });
      setTimeout(() => {
        setAlvoErrado(null);
      }, 500);
      return;
    }

    if (duploClique) {
      // Deixa o onDoubleClick lidar
      return;
    }

    processarClique(alvo, 'esquerdo');
  };

  const handleDuploClique = (alvo) => {
    if (!duploClique) return;
    processarClique(alvo, 'duplo');
  };

  const handleCliqueDireito = (e, alvo) => {
    e.preventDefault();
    setAvisoBotao(null);

    if (menuContexto) {
      if (alvo.correto) {
        setMenuAberto(true);
      } else {
        setAlvoErrado(alvo.id);
        reportResult(false, { alvo: alvo.id });
        setTimeout(() => setAlvoErrado(null), 400);
      }
      return;
    }

    if (tipoClique === 'direito') {
      processarClique(alvo, 'direito');
    } else {
      setAvisoBotao('Você usou o botão direito! Para esta ação, use o botão ESQUERDO.');
      setAlvoErrado(alvo.id);
      reportResult(false, { motivo: 'usou_botao_direito_em_vez_de_esquerdo', alvo: alvo.id });
      setTimeout(() => setAlvoErrado(null), 500);
    }
  };

  const processarClique = (alvo, tipoUsado) => {
    if (alvo.correto) {
      setAlvoCerto(alvo.id);
      setAvisoBotao(null);
      reportResult(true, { alvoEscolhido: alvo.id, tipoClique: tipoUsado });
      return;
    }

    setAlvoErrado(alvo.id);
    reportResult(false, { alvoEscolhido: alvo.id, tipoClique: tipoUsado });
    setTimeout(() => setAlvoErrado(null), 400);
  };

  const handleEscolherOpcaoMenu = (e, opcao) => {
    e.stopPropagation();
    if (opcao.correto) {
      setOpcaoMenuCerta(opcao.id);
      setAlvoCerto(alvos.find((a) => a.correto)?.id || 'alvo');
      reportResult(true, { opcaoMenu: opcao.id });
    } else {
      setOpcaoMenuErrada(opcao.id);
      reportResult(false, { opcaoMenu: opcao.id });
      setTimeout(() => setOpcaoMenuErrada(null), 400);
    }
  };

  return (
      <div className={`${styles.wrapper} ${fundo ? styles.comFundo : ''}`}
           style={
             fundo
                 ? {
                   backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(${typeof fundo === 'string' ? fundo : '/fundo.png'})`,
                 }
                 : undefined
           }
      >
        {fundo && (
            <div className={styles.desktopBar}>
              <span className={styles.desktopDot} />
              <span className={styles.desktopDot} />
              <span className={styles.desktopDot} />
              <span className={styles.desktopTitle}>Área de Trabalho</span>
            </div>
        )}

        {avisoBotao && (
            <div className={styles.avisoBotao} role="alert">
              {avisoBotao}
            </div>
        )}

        {(() => {
          const grupo = (
              <div
                  className={styles.grupo}
                  data-layout={layout}
                  role="group"
                  aria-label="Escolha uma opção"
                  onContextMenu={(e) => {
                    if (exigeBotaoDireito) e.preventDefault();
                  }}
              >
                {alvos.map((alvo) => (
                    <div key={alvo.id} className={styles.alvoContainer}>
                      <button
                          type="button"
                          className={`${styles.alvo} ${alvo.icone ? styles.alvoComIcone : ''} ${alvoErrado === alvo.id ? styles.erro : ''} ${alvoCerto === alvo.id ? styles.acerto : ''} ${menuAberto && alvo.correto ? styles.alvoMenuAberto : ''}`}
                          onClick={(e) => handleCliqueEsquerdo(e, alvo)}
                          onDoubleClick={() => handleDuploClique(alvo)}
                          onContextMenu={(e) => handleCliqueDireito(e, alvo)}
                      >
                        {alvo.icone && (
                            <img src={alvo.icone} alt="" className={styles.alvoIcone} draggable={false} />
                        )}
                        <span className={styles.alvoLabel}>{alvo.label}</span>
                      </button>

                      {menuAberto && alvo.correto && menuContexto && (
                          <div className={styles.contextMenu} role="menu">
                            {menuContexto.instrucaoMenu && (
                                <div className={styles.contextMenuHeader}>
                                  {menuContexto.instrucaoMenu}
                                </div>
                            )}
                            {menuContexto.opcoes.map((opcao) => (
                                <button
                                    key={opcao.id}
                                    type="button"
                                    role="menuitem"
                                    className={`${styles.contextMenuItem} ${opcaoMenuErrada === opcao.id ? styles.erro : ''} ${opcaoMenuCerta === opcao.id ? styles.acerto : ''}`}
                                    onClick={(e) => handleEscolherOpcaoMenu(e, opcao)}
                                >
                                  {opcao.label}
                                </button>
                            ))}
                          </div>
                      )}
                    </div>
                ))}
              </div>
          );

          // Com fundo de "área de trabalho", os alvos são ícones de app
          // e devem pousar na barra de tarefas simulada, não flutuar soltos.
          return fundo ? <div className={styles.taskbar}>{grupo}</div> : grupo;
        })()}

        {dicaApoio && <p className={styles.dicaApoio}>{dicaApoio}</p>}
      </div>
  );
}