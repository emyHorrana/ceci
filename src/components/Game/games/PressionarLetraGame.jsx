// PressionarLetraGame.jsx
// Drill de digitação de UMA letra específica, com dica de qual dedo
// usar. Diferente do PressionarTeclaGame (que mostra o Teclado.jsx
// inteiro e só serve pra teclas nomeadas tipo Espaço/Enter - letras
// individuais não têm como ser marcadas nesse desenho, sem rótulo em
// cada tecla), este é bem mais simples: letra grande + dica de dedo,
// pensado pra repetição rápida em sequência (várias etapas seguidas,
// uma letra de cada vez) até pegar confiança - não precisa abrir um
// teclado inteiro toda hora.
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   letra (string, obrigatória) - a letra esperada (ex: 'f')
//   dedo (string, opcional) - dica de qual dedo usar (ex: 'indicador
//     esquerdo') - se omitido, não mostra a dica

import { useState, useEffect } from 'react';
import styles from './PressionarLetraGame.module.css';

export function PressionarLetraGame({ reportResult, letra, dedo }) {
  const [errada, setErrada] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === letra.toLowerCase()) {
        e.preventDefault();
        reportResult(true, { tecla: e.code });
        return;
      }

      // Só conta como tentativa errada se for outra letra de verdade -
      // não pune quem só encostou num Shift ou Tab por engano.
      if (/^[a-zà-úç]$/i.test(e.key)) {
        setErrada(true);
        reportResult(false, { tecla: e.code });
        setTimeout(() => setErrada(false), 400);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [letra, reportResult]);

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.letra} ${errada ? styles.erro : ''}`}>
        {letra.toUpperCase()}
      </div>
      {dedo && <p className={styles.dedo}>Use o dedo {dedo}</p>}
    </div>
  );
}