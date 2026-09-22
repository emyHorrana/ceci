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

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { MODULOS } from '../data/modulos';
import { UNIDADES } from '../data/unidades';
import { getPerfisAluno } from '../services/algorithmService';
import { isAdmin } from '../utils/roles';
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
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [origemPorUnidade, setOrigemPorUnidade] = useState({});

  useEffect(() => {
    // Mesmo cuidado do MiniModulo.jsx/Dashboard.jsx/Perfil.jsx: conta
    // ADM não tem origem de Unidade real pra buscar.
    if (!user?.id || isAdmin(user)) return;
    let ativo = true;
    getPerfisAluno(user.id)
        .then((data) => {
          if (ativo) setOrigemPorUnidade(data?.origemPorUnidade || {});
        })
        .catch((err) => console.error('Erro ao buscar origem das Unidades:', err));
    return () => { ativo = false; };
  }, [user?.id]);

  const irParaModulo = (modulo) => {
    const primeiroMiniModulo = modulo.miniModulos[0];
    if (primeiroMiniModulo) {
      navigate(`/mini-modulo/${primeiroMiniModulo.id}`);
    }
  };

  // Unidades que a pessoa nunca abriu de verdade, mas o desafio de
  // verificação do onboarding já confirmou que ela domina (ver
  // BoasVindas.jsx) - por isso não ocupam nó na trilha (GameTrilha.jsx
  // as filtra). Aqui aparecem como um aviso DENTRO do card do módulo
  // dono delas (não numa caixa solta no fim da página, que parecia
  // valer pra todos os módulos) - agrupadas por moduloId, já que um
  // módulo pode ter mais de uma Unidade confirmada.
  const unidadesConfirmadasPorModulo = UNIDADES.filter(
      (u) => origemPorUnidade[u.id] === 'onboarding'
  ).reduce((acc, u) => {
    (acc[u.moduloId] ||= []).push(u);
    return acc;
  }, {});

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
            {MODULOS.map((modulo, index) => {
              const confirmadas = unidadesConfirmadasPorModulo[modulo.id];
              const note = confirmadas?.length
                  ? {
                    texto: `Já identificamos domínio em "${confirmadas.map((u) => u.titulo).join('", "')}" - não precisa fazer, mas pode revisar se quiser.`,
                    ctaLabel: 'Fazer mesmo assim',
                    onCtaClick: () => navigate(`/mini-modulo/${confirmadas[0].miniModulos[0].id}`),
                  }
                  : undefined;

              return (
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
                      note={note}
                  />
              );
            })}

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