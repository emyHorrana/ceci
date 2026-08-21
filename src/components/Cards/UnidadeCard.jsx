// UnidadeCard.jsx
// Card de uma Unidade (agrupamento de mini-módulos) - ver
// data/unidades.js pro porquê desse agrupamento existir.
//
// Expande pra mostrar os mini-módulos por dentro, cada um clicável
// levando direto pra `/mini-modulo/:id`.
//
// `status` (opcional) - agora que o Dashboard consome o algoritmo
// adaptativo de verdade (getProximaUnidade/getPerfisAluno), o card
// pode receber um selo de onde essa Unidade está pra ESSE aluno:
//   'atual'      - a Unidade recomendada agora (destaque)
//   'concluida'  - domínio >= limiar
//   'pendente'   - já tentada, abaixo do limiar (precisa reforçar)
//   sem status   - não tentada ainda / Unidade sem jogo - mostra só o
//                  tierBadge de sempre, sem selo extra
// Sem essa prop, o card se comporta exatamente como antes (usado, por
// ex., no "modo tudo desbloqueado" de teste, sem noção de aluno).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIERS } from '../../data/unidades';
import styles from './UnidadeCard.module.css';

const STATUS_LABEL = {
  atual: 'Recomendada agora',
  concluida: 'Concluída',
  pendente: 'Em prática',
};

export function UnidadeCard({ unidade, status }) {
  const [aberta, setAberta] = useState(false);
  const navigate = useNavigate();
  const tier = TIERS[unidade.tier];
  const totalEtapas = unidade.miniModulos.reduce((soma, mm) => soma + mm.etapas.length, 0);

  return (
    <div className={styles.card} data-status={status || undefined}>
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
            {status && (
              <span className={styles.statusBadge} data-status={status}>
                {STATUS_LABEL[status]}
              </span>
            )}
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