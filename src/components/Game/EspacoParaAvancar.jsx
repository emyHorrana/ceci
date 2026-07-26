// EspacoParaAvancar.jsx
// Ensina a pessoa que, sempre que a tela só tiver texto pra ler (sem
// nenhuma ação pra fazer), dá pra apertar a BARRA DE ESPAÇO pra
// continuar, em vez de precisar achar e clicar num botão.
//
// Pensado especialmente pra quem "não faz a menor ideia" de mouse ou
// teclado ainda - por isso o teclado é desenhado por inteiro (não só a
// barra de espaço solta), pra pessoa primeiro reconhecer o objeto e
// depois nós apontamos qual tecla importa agora.
//
// PLACEHOLDER DE ARTE: o teclado aqui é feito só em CSS (retângulos),
// pra não depender da responsável pelas artes agora. Quando tiver uma
// ilustração/gif de verdade mostrando o dedo apertando a tecla, é só
// trocar o bloco <div className={styles.teclado}> por essa mídia - o
// resto do componente (escuta de tecla, fallback) continua igual.
//
// NÃO TRAVA NINGUÉM: além de escutar a barra de espaço, sempre existe
// um "ou clique aqui" discreto embaixo. Serve pra quem não encontrar a
// tecla, estiver num celular/tablet sem teclado físico, ou simplesmente
// preferir clicar - ninguém fica preso nesta tela.
//
// Props:
//   onAvancar (função, obrigatória) - chamada ao apertar espaço OU ao
//     clicar no link alternativo
//   mensagem (string, opcional) - texto explicativo acima do teclado

import { useEffect } from 'react';
import styles from './EspacoParaAvancar.module.css';

const MENSAGEM_PADRAO =
  'Sempre que a tela tiver só texto pra ler, você pode apertar a barra de espaço (a tecla maior, bem embaixo) para continuar.';

export function EspacoParaAvancar({ onAvancar, mensagem }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        onAvancar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAvancar]);

  return (
    <div className={styles.wrapper}>
      <p className={styles.mensagem}>{mensagem || MENSAGEM_PADRAO}</p>

      {/* Teclado simples em CSS - ver nota de placeholder de arte acima */}
      <div className={styles.teclado} aria-hidden>
        <div className={styles.linha}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={styles.tecla} />
          ))}
        </div>
        <div className={styles.linha}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={styles.tecla} />
          ))}
        </div>
        <div className={styles.linha}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className={styles.tecla} />
          ))}
        </div>
        <div className={styles.linha}>
          <span className={styles.barraEspaco}>espaço</span>
        </div>
      </div>

      <button type="button" className={styles.fallback} onClick={onAvancar}>
        ou clique aqui para continuar
      </button>
    </div>
  );
}