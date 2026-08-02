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

export function ArrastarSoltarGame({ reportResult, item, zonas }) {
  const [zonaSobre, setZonaSobre] = useState(null);
  const [zonaErrada, setZonaErrada] = useState(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDrop = (e, zona) => {
    e.preventDefault();
    setZonaSobre(null);

    if (zona.correta) {
      reportResult(true, { zonaEscolhida: zona.id });
      return;
    }

    setZonaErrada(zona.id);
    reportResult(false, { zonaEscolhida: zona.id });
    setTimeout(() => setZonaErrada(null), 400);
  };

  return (
    <div className={styles.area}>
      <div
        className={styles.item}
        draggable
        onDragStart={handleDragStart}
        aria-label={`Arraste: ${item.label}`}
      >
        {item.label}
      </div>

      <div className={styles.zonas}>
        {zonas.map((zona) => (
          <div
            key={zona.id}
            className={`${styles.zona} ${zonaErrada === zona.id ? styles.erro : ''}`}
            data-sobre={zonaSobre === zona.id}
            onDragOver={(e) => {
              e.preventDefault();
              setZonaSobre(zona.id);
            }}
            onDragLeave={() => setZonaSobre(null)}
            onDrop={(e) => handleDrop(e, zona)}
          >
            {zona.label}
          </div>
        ))}
      </div>
    </div>
  );
}