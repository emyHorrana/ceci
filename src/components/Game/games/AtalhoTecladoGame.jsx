// Mecânica de ATALHO: uma tecla modificadora (hoje só Ctrl) segurada
// junto com uma letra. Cobre o mini-módulo 2-14 (Ctrl+C, Ctrl+V,
// Ctrl+Z, Ctrl+A).
//
// Usa o TecladoCompleto (não o Teclado simplificado) porque aqui
// precisamos apontar Ctrl E a letra ao mesmo tempo - o simplificado
// não tem como marcar uma letra individual.
//
// Aceita tanto Ctrl (Windows/Linux) quanto Cmd (Mac) - em macOS, os
// atalhos de copiar/colar/desfazer/selecionar usam Cmd, não Ctrl, e
// ambos deveriam funcionar aqui pra não excluir quem usa Mac.
//
//   <AtalhoTecladoGame reportResult={reportResult} letra="c" />
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   letra        (string, obrigatória) - a letra do atalho, minúscula
//     (ex: 'c', 'v', 'z', 'a')

import { useEffect, useState } from 'react';
import { TecladoCompleto } from '../TecladoCompleto';
import styles from './AtalhoTecladoGame.module.css';

export function AtalhoTecladoGame({ reportResult, letra }) {
  const [errada, setErrada] = useState(false);
  const codigoLetra = `Key${letra.toUpperCase()}`;

  useEffect(() => {
    const handleKeyDown = (e) => {
      const modificadorSegurado = e.ctrlKey || e.metaKey;

      if (modificadorSegurado && e.code === codigoLetra) {
        e.preventDefault();
        reportResult(true, { letra: e.code, comMeta: e.metaKey });
        return;
      }

      // Confusões que valem virar feedback: apertou a letra certa mas
      // esqueceu de segurar o modificador, ou segurou o modificador
      // mas apertou outra letra.
      const apertouALetraSemSegurar = !modificadorSegurado && e.code === codigoLetra;
      const segurouMasErrouALetra =
        modificadorSegurado && /^Key[A-Z]$/.test(e.code) && e.code !== codigoLetra;

      if (apertouALetraSemSegurar || segurouMasErrouALetra) {
        e.preventDefault();
        setErrada(true);
        reportResult(false, { letra: e.code, segurouModificador: modificadorSegurado });
        setTimeout(() => setErrada(false), 400);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [codigoLetra, reportResult]);

  return (
    <div className={`${styles.wrapper} ${errada ? styles.erro : ''}`}>
      <TecladoCompleto
        teclasDestacadas={['ControlLeft', 'ControlRight', 'MetaLeft', codigoLetra]}
      />
      <p className={styles.letraAlvo}>
        Ctrl (ou Cmd) + <strong>{letra.toUpperCase()}</strong>
      </p>
    </div>
  );
}