// Modulos.jsx
// Visão geral de todos os módulos do currículo do CECI.
// Rota: /modulos
//
// Mostra os módulos que já têm conteúdo pronto (hoje: 1, 2 e 3, vindos de
// data/modulos.js) junto com os que ainda faltam ser escritos, pra pessoa
// ter noção do caminho completo - mesmo que ainda não possa acessá-los.
//
// SOBRE O PROGRESSO: por enquanto todo módulo com conteúdo mostra 0 de
// progresso. Isso porque a conclusão de mini-módulos ainda não é salva em
// lugar nenhum (nem localStorage, nem Supabase) - os dados em
// data/modulos.js não têm nenhuma relação com a tabela progresso_usuario
// do banco, que foi pensada pra outra estrutura (licoes/etapas). Quando
// existir uma forma real de marcar "mini-módulo concluído", é aqui que
// esse número precisa vir de verdade, no lugar do placeholder abaixo.

import { useNavigate } from 'react-router-dom';
import { MODULOS } from '../data/modulos';
import { ModuleCard } from '../components/Cards/ModuleCard';
import { AppLayout, PageHeader } from '../components/Layout/AppLayout';
import appStyles from '../components/Layout/AppLayout.module.css';
import styles from './Modulos.module.css';

// Módulos do currículo que ainda não têm conteúdo escrito. Aparecem como
// "em breve" pra dar noção do caminho completo (6 módulos ao todo).
// Assim que o conteúdo de um desses for escrito e adicionado em
// data/modulos.js, é só remover a entrada correspondente daqui.
const MODULOS_EM_BREVE = [
  { emoji: '🖥️', titulo: 'Área de Trabalho' },
  { emoji: '🌐', titulo: 'Navegando na Internet' },
  { emoji: '🛡️', titulo: 'Segurança Online' },
];

export default function Modulos() {
  const navigate = useNavigate();

  const irParaModulo = (modulo) => {
    const primeiroMiniModulo = modulo.miniModulos[0];
    if (primeiroMiniModulo) {
      navigate(`/mini-modulo/${primeiroMiniModulo.id}`);
    }
  };

  return (
    <AppLayout>
      <PageHeader>
        <div>
          <h1 className={styles.title}>Seus módulos</h1>
          <p className={styles.subtitle}>
            Acompanhe seu caminho de aprendizado, um módulo de cada vez.
          </p>
        </div>
      </PageHeader>

      <div className={appStyles.pageContent}>
        <div className={styles.grid}>
          {MODULOS.map((modulo, index) => (
            <ModuleCard
              key={modulo.id}
              title={modulo.titulo}
              emoji={modulo.emoji}
              // Placeholder até existir uma forma real de salvar conclusão
              // de mini-módulos (ver nota no topo do arquivo).
              progress={0}
              lessonCount={modulo.miniModulos.length}
              status={index === 0 ? 'featured' : 'inprogress'}
              onClick={() => irParaModulo(modulo)}
              onContinueClick={() => irParaModulo(modulo)}
            />
          ))}

          {MODULOS_EM_BREVE.map((modulo) => (
            <ModuleCard
              key={modulo.titulo}
              title={modulo.titulo}
              emoji={modulo.emoji}
              progress={0}
              lessonCount={0}
              status="locked"
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}