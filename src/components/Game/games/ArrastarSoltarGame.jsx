// Mecânica genérica de ARRASTAR E SOLTAR. Cobre a seção "Arrastar e
// soltar" do Módulo 1 (mover ícone, soltar no local certo) e serve
// também pra interações de diagnóstico fora dos módulos (ex: "arraste
// o cartão" do onboarding).
//
// Recebe um item arrastável e uma ou mais zonas de destino - só uma é a
// correta.
//
//   <ArrastarSoltarGame reportResult={reportResult}
//     item={{ id: 'carta', label: '💌' }}
//     zonas={[
//       { id: 'caixa', label: 'Solte aqui', correta: true },
//     ]} />
//
//   // com distrator (mais de uma zona, só uma certa)
//   <ArrastarSoltarGame reportResult={reportResult}
//     item={{ id: 'arquivo', label: '📄 relatorio.docx' }}
//     zonas={[
//       { id: 'lixeira', label: '🗑️ Lixeira', correta: false },
//       { id: 'pasta',   label: '📁 Documentos', correta: true },
//     ]} />
//
// ACESSIBILIDADE: esta primeira versão usa Drag and Drop nativo do
// navegador (HTML5), que funciona bem com mouse mas não com teclado
// nem touch em todos os browsers. Se aparecer dificuldade de alguém
// usando touch/teclado, o próximo passo é adicionar um modo alternativo
// (ex: clicar no item, depois clicar na zona) - não implementado ainda
// de propósito, pra não gastar tempo numa via que talvez nem precise.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   item  (obrigatório) - { id, label } - o que será arrastado
//   zonas (array, obrigatório) - cada item: { id, label, correta }

import { useState } from 'react';
import styles from './ArrastarSoltarGame.module.css';

export function ArrastarSoltarGame({ reportResult, item, zonas, fundo = null }) {
  const [zonaSobre, setZonaSobre] = useState(null);
  const [zonaErrada, setZonaErrada] = useState(null);
  const [zonaCerta, setZonaCerta] = useState(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDrop = (e, zona) => {
    e.preventDefault();
    setZonaSobre(null);

    if (zona.correta) {
      setZonaCerta(zona.id);
      reportResult(true, { zonaEscolhida: zona.id });
      return;
    }

    setZonaErrada(zona.id);
    reportResult(false, { zonaEscolhida: zona.id });
    setTimeout(() => setZonaErrada(null), 400);
  };

  return (
      <div
          className={`${styles.area} ${fundo ? styles.comFundo : ''}`}
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

        <div
            className={styles.item}
            draggable
            onDragStart={handleDragStart}
            aria-label={`Arraste: ${item.label}`}
        >
          {item.icone && (
              <img src={item.icone} alt="" className={styles.itemIcone} draggable={false} />
          )}
          <span className={styles.itemLabel}>{item.label}</span>
        </div>

        {(() => {
          const zonasEl = (
              <div className={styles.zonas}>
                {zonas.map((zona) => (
                    <div
                        key={zona.id}
                        className={`${styles.zona} ${zona.icone ? styles.zonaComIcone : ''} ${zonaErrada === zona.id ? styles.erro : ''} ${zonaCerta === zona.id ? styles.acerto : ''}`}
                        data-sobre={zonaSobre === zona.id}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setZonaSobre(zona.id);
                        }}
                        onDragLeave={() => setZonaSobre(null)}
                        onDrop={(e) => handleDrop(e, zona)}
                    >
                      {zona.icone && (
                          <img src={zona.icone} alt="" className={styles.zonaIcone} draggable={false} />
                      )}
                      <span className={styles.zonaLabel}>{zona.label}</span>
                    </div>
                ))}
              </div>
          );

          // Com fundo de "área de trabalho", as zonas são ícones de app
          // e devem pousar na barra de tarefas simulada, não flutuar soltas.
          return fundo ? <div className={styles.taskbar}>{zonasEl}</div> : zonasEl;
        })()}
      </div>
  );
}