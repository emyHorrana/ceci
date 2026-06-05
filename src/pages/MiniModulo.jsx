/**
 * MiniModulo.jsx
 * Página de estudo de um mini-módulo.
 * Exibe as etapas de teoria em sequência, com navegação entre elas.
 * Futuramente: depois das etapas de teoria, o aluno passa por jogos/exercícios.
 *
 * Rota: /mini-modulo/:miniModuloId
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMiniModulo } from '../data/modulos';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { ButtonOutline } from '../components/Buttons/ButtonOutline';
import styles from './MiniModulo.module.css';

export default function MiniModulo() {
  const { miniModuloId } = useParams();
  const navigate = useNavigate();

  const resultado = getMiniModulo(miniModuloId);

  // mini-módulo não encontrado
  if (!resultado) {
    return (
      <div className={styles.notFound}>
        <span className={styles.notFoundEmoji}>🔍</span>
        <h2>Mini-módulo não encontrado</h2>
        <ButtonOutline onClick={() => navigate('/dashboard')}>
          Voltar ao início
        </ButtonOutline>
      </div>
    );
  }

  const { modulo, miniModulo } = resultado;
  const etapas = miniModulo.etapas;

  const [etapaAtual, setEtapaAtual] = useState(0);

  const etapa = etapas[etapaAtual];
  const isFirst = etapaAtual === 0;
  const isLast  = etapaAtual === etapas.length - 1;

  const avancar    = () => { if (!isLast)  setEtapaAtual((n) => n + 1); };
  const retroceder = () => { if (!isFirst) setEtapaAtual((n) => n - 1); };

  const concluir = () => {
    // TODO: marcar mini-módulo como concluído no contexto/backend
    navigate('/dashboard');
  };

  return (
    <div className={styles.page}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          Início
        </button>

        {/* breadcrumb */}
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbModulo}>
            {modulo.emoji} {modulo.titulo}
          </span>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbMini}>{miniModulo.titulo}</span>
        </div>

        {/* progresso por etapas */}
        <div className={styles.etapaInfo}>
          Etapa {etapaAtual + 1} / {etapas.length}
        </div>
      </header>

      {/* ── BARRA DE PROGRESSO ─────────────────────────────────────── */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((etapaAtual + 1) / etapas.length) * 100}%` }}
        />
      </div>

      {/* ── CONTEÚDO PRINCIPAL ─────────────────────────────────────── */}
      <main className={styles.main}>

        {/* Coluna do conteúdo */}
        <section className={styles.conteudoCol}>
          <div key={etapaAtual} className={styles.card}>
            <h1 className={styles.etapaTitulo}>{etapa.titulo}</h1>

            <div
              className={styles.etapaConteudo}
              /* o conteúdo é HTML controlado definido em modulos.js */
              dangerouslySetInnerHTML={{ __html: etapa.conteudo }}
            />
          </div>
        </section>

        {/* Coluna da Cecília (mascote / dica) */}
        <aside className={styles.ceciliaCol}>
          <div className={styles.ceciliaCard}>
            {/* Slot para arte da personagem-guia — substitua pela <img> quando estiver pronta */}
            <div className={styles.mascoteSlot} aria-hidden>
              {/* <img src="/mascote-ceci.png" alt="Mascote Ceci" /> */}
            </div>
            <p className={styles.dica}>
              {etapa.dica || 'Você está indo muito bem! Continue assim! 💪'}
            </p>
          </div>

          {/* dots de navegação */}
          <div className={styles.dots}>
            {etapas.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === etapaAtual ? styles.dotActive : ''} ${i < etapaAtual ? styles.dotDone : ''}`}
                onClick={() => setEtapaAtual(i)}
                aria-label={`Ir para etapa ${i + 1}`}
              />
            ))}
          </div>
        </aside>
      </main>

      {/* ── RODAPÉ COM NAVEGAÇÃO ───────────────────────────────────── */}
      <footer className={styles.footer}>
        <ButtonOutline onClick={retroceder} disabled={isFirst}>
          Anterior
        </ButtonOutline>

        {isLast ? (
          <ButtonPrimary onClick={concluir}>
            Concluir mini-módulo 🎉
          </ButtonPrimary>
        ) : (
          <ButtonPrimary onClick={avancar}>
            Próxima
          </ButtonPrimary>
        )}
      </footer>
    </div>
  );
}