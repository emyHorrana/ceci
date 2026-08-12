// UnidadeCard.jsx
// Card de uma Unidade (agrupamento de mini-módulos) - ver
// data/unidades.js pro porquê desse agrupamento existir.
//
// Só listagem por enquanto: expande pra mostrar os mini-módulos por
// dentro, cada um clicável levando direto pra `/mini-modulo/:id`. Não
// depende de progresso nem do algoritmo adaptativo - isso vem depois,
// quando o motor de regras (ver documento de arquitetura) existir de
// verdade.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIERS } from '../../data/unidades';
import styles from './UnidadeCard.module.css';

export function UnidadeCard({ unidade }) {
  const [aberta, setAberta] = useState(false);
  const navigate = useNavigate();
  const tier = TIERS[unidade.tier];
  const totalEtapas = unidade.miniModulos.reduce((soma, mm) => soma + mm.etapas.length, 0);

  return (
    <div className={styles.card}>
      <div
        className={styles.header}
        role="button"
        tabIndex={0}
        onClick={() => setAberta((v) => !v)}
        onKeyDown={(e) => e.key === 'Enter' && setAberta((v) => !v)}
      >
        <div className={styles.info}>
          <div className={styles.tituloLinha}>
            <span className={styles.titulo}>{unidade.titulo}</span>
            <span className={styles.tierBadge} data-tier={unidade.tier}>{tier.label}</span>
          </div>
          <span className={styles.meta}>
            {unidade.miniModulos.length} {unidade.miniModulos.length === 1 ? 'mini-módulo' : 'mini-módulos'} · {totalEtapas} etapas
          </span>
        </div>
        <span className={styles.chevron}>{aberta ? '▲' : '▼'}</span>
      </div>

      {aberta && (
        <div className={styles.lista}>
          {unidade.miniModulos.map((mm) => (
            <button
              key={mm.id}
              type="button"
              className={styles.miniModulo}
              onClick={() => navigate(`/mini-modulo/${mm.id}`)}
            >
              <span className={styles.miniModuloTitulo}>{mm.titulo}</span>
              <span className={styles.miniModuloEtapas}>{mm.etapas.length} etapas</span>
            </button>
          ))}

          {/* Só aparece pras Unidades que já têm um desafio escrito
              (ver checkpoint em data/unidades.js) - nem toda Unidade
              tem um ainda. Alcançável direto, sem depender de marcar
              os mini-módulos acima como concluídos primeiro (isso
              ainda não existe de verdade - ver MiniModulo.jsx). */}
          {unidade.checkpoint && (
            <button
              type="button"
              className={styles.checkpointBtn}
              onClick={() => navigate(`/unidade/${unidade.id}/checkpoint`)}
            >
              <span className={styles.checkpointIcone} aria-hidden>🏁</span>
              <span className={styles.miniModuloTitulo}>Fazer o desafio da Unidade</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}