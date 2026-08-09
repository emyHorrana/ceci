// EspacoParaAvancar.jsx
// Ensina a pessoa que, sempre que a tela só tiver texto pra ler (sem
// nenhuma ação pra fazer), dá pra apertar a BARRA DE ESPAÇO pra
// continuar, em vez de precisar achar e clicar num botão.
//
// Pensado especialmente pra quem "não faz a menor ideia" de mouse ou
// teclado ainda - por isso o teclado é desenhado por inteiro (não só a
// barra de espaço solta), pra pessoa primeiro reconhecer o objeto e
// depois nós apontamos qual tecla importa agora. O desenho do teclado
// em si vive em components/Game/Teclado.jsx (compartilhado - reaproveita
// pra apontar outras teclas, como o Enter, em outras telas).
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
import { Teclado } from './Teclado';
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

      <Teclado teclaDestacada="espaco" />

      <button type="button" className={styles.fallback} onClick={onAvancar}>
        ou clique aqui para continuar
      </button>
    </div>
  );
}