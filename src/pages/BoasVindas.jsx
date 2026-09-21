// BoasVindas.jsx
// Primeira tela que a pessoa vê ao entrar no CECI, antes de criar conta.
// Rota: /boas-vindas
//
// COMO FUNCIONA (sequência de fases, em ordem)
// 1) Apresentação: a Cecília se apresenta e convida a pessoa a "dar uma
//    volta" - não importa se ela chegou sozinha ou com ajuda de alguém.
// 2) Tutorial da barra de espaço: ensina que dá pra apertar espaço pra
//    avançar telas de só-leitura, sem precisar do mouse. Existe pra
//    quem ainda não sabe usar mouse/teclado não travar aqui mesmo, logo
//    no início - sempre tem um "ou clique aqui" de escape.
// 3) Pergunta de bifurcação sobre familiaridade com o mouse: "sim" ou
//    "não" são igualmente válidos, então NÃO passa pelo GameMoment (que
//    é pra momentos com resposta certa/errada) - é só uma escolha, via
//    PerguntaBinaria.
//    - "não sei usar mouse" -> aula básica de mouse embutida aqui mesmo
//      (fases aula-mouse-intro/aula-mouse-pratica), ANTES de qualquer
//      outra coisa. A ideia: sem o básico de mouse, a pessoa não
//      conseguiria se orientar sozinha nem pra preencher o resto do
//      onboarding, então essa aula não pode vir depois do cadastro.
//    - "já uso" -> desafio rápido de verificação (fase
//      verificacao-mouse, 3 itens mais difíceis que a aula) em vez de
//      aceitar a palavra da pessoa sozinha. Cada resposta já calcula o
//      score real do BKT na hora (ver registrarSinalAdaptativo/
//      simularQuestao mais abaixo) - "confirmado" significa que o
//      domínio calculado ao vivo já cruzou o mesmo limiar (0.5) que
//      libera qualquer Unidade na trilha de verdade, não uma contagem
//      de acertos à parte. Confirmou? segue pro próximo passo, já
//      pulando Fundamentos do mouse. Não confirmou? cai na aula básica
//      mesmo, igual quem respondeu "não sei" - só a palavra sozinha não
//      bastava.
//    Os dois caminhos convergem no formulário de domínios (passo 4).
// 4) Formulário de domínios: mais perguntas de bifurcação (mesmo
//    componente PerguntaBinaria), sobre teclado e internet - pelo mesmo
//    motivo do mouse: quem não sabe usar teclado também teria
//    dificuldade em digitar nome/e-mail no diagnóstico e no cadastro
//    logo a seguir.
//    - "não sei usar teclado" (primeira pergunta do formulário) -> aula
//      básica de teclado embutida aqui mesmo (fases
//      aula-teclado-intro/aula-teclado-pratica), assim que o formulário
//      termina - mesma lógica da aula de mouse: sem o básico de
//      teclado, a pessoa não conseguiria preencher o diagnóstico
//      (digitar nome) nem o cadastro que vem depois.
//    - "já uso" -> desafio de verificação (fase verificacao-teclado),
//      mesma lógica e mesmo critério da verificação de mouse acima.
//      Confirmou? segue pro diagnóstico. Não confirmou? aula básica.
// 5) Diagnóstico inicial: uma sequência de pequenas interações discretas
//    (hoje: digitar o nome). Cada uma parece só uma etapa normal de
//    cadastro, mas na real também dá sinais de familiaridade com
//    mouse/teclado pro algoritmo adaptativo usar depois.
//
// SINAIS PRO ALGORITMO ADAPTATIVO (AB-BKT)
// Ainda não existe conta nesse ponto (ver nota do passo 7), então não dá
// pra PERSISTIR nada no Supabase aqui - mas o CÁLCULO em si (a mesma
// fórmula de sempre: Indicadores -> CalculadoraPesos ->
// ParametrosAdaptativos -> RastreamentoBayesiano -> Classificador) já
// roda ao vivo, via BKTAdaptativo.calcular()/rota /api/licao/simular,
// que não precisa de userId nem toca em `perfis_aluno`. Cada resultado
// de GameMoment (clique do mouse, "digite oi", digitar o nome, os itens
// de verificação) é: 1) bufferizado em onboarding.sinaisAdaptativos (ver
// registrarSinalAdaptativo abaixo), pra ser reenviado de verdade
// (responderQuestao, COM persistência) depois que a conta é criada, em
// Cadastro.jsx/Login.jsx (via services/onboardingSync.js) - como as
// fórmulas são determinísticas, esse reenvio reproduz exatamente os
// mesmos valores já vistos aqui; e 2) simulado na hora (simularQuestao),
// só pra decidir a experiência (e no caso da verificação, se a
// autodeclaração se confirma) com o score real, sem teto artificial e
// sem confiar cegamente numa resposta "sim" isolada.
// 6) Mini-aula de orientações de conta: antes de ir pro cadastro de
//    verdade, avisos rápidos e leves (pode usar e-mail de alguém de
//    confiança, anotar a senha em lugar seguro) - pensados pra quem
//    nunca criou uma conta online antes.
// 7) Ao final, os resultados ficam guardados no navegador (localStorage,
//    via useLocalStorage) até a pessoa criar a conta - não existe
//    usuário autenticado ainda nessa fase, então não dá pra salvar no
//    Supabase diretamente (ver bdCeci.txt: usuarios.id referencia
//    auth.users). Quem lê esse localStorage depois é o Cadastro.jsx
//    (hoje só pra pré-preencher o nome - a bifurcação de destino
//    pós-cadastro não existe mais, porque agora ela toda acontece
//    ANTES do cadastro, aqui nesta página).
//
// COMO ADICIONAR UM NOVO PASSO DE DIAGNÓSTICO
// Só acrescentar um objeto no array DIAGNOSTIC_STEPS abaixo, com uma
// key única, título, instrução e a função que renderiza o joguinho
// dentro do GameMoment. A página já cuida de avançar pro próximo passo
// e de salvar o resultado de cada um automaticamente.
//
// COMO ADICIONAR UMA NOVA PERGUNTA DE DOMÍNIO
// Mesma ideia, no array DOMINIO_PERGUNTAS: key, pergunta, opcaoSim,
// opcaoNao. A resposta fica em onboarding.dominios[key].
//
// A rota "/boas-vindas" em si continua de acesso livre (sem exigir
// login), de propósito, pra facilitar repetir o onboarding manualmente
// em desenvolvimento e testes. Mas a entrada normal do app é a raiz "/"
// (ver pages/Entrada.jsx), que só mostra esta tela pra quem ainda não
// tem a flag onboarding.concluido - setada logo abaixo, ao chegar na
// fase 'concluido'. Quem já concluiu (com ou sem ter criado a conta) cai
// direto no Login a partir da próxima visita.

import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { GameMoment } from '../components/Game/GameMoment';
import { EspacoParaAvancar } from '../components/Game/EspacoParaAvancar';
import { PerguntaBinaria } from '../components/Game/PerguntaBinaria';
import { Teclado } from '../components/Game/Teclado';
import { DigitarNomeGame } from '../components/Game/games/DigitarNomeGame';
import { DigitarTextoGame } from '../components/Game/games/DigitarTextoGame';
import { ClicarAlvoGame } from '../components/Game/games/ClicarAlvoGame';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { simularQuestao } from '../services/algorithmService';
import { getTempoIdealMs } from '../utils/jogoTempoIdeal';
import styles from './BoasVindas.module.css';

// Sequência de interações de diagnóstico. Adicione novos passos aqui.
const DIAGNOSTIC_STEPS = [
  {
    key: 'nome',
    title: 'Como posso te chamar?',
    instructions: 'Digite seu nome no campinho abaixo e clique em Confirmar.',
    render: (reportResult) => <DigitarNomeGame reportResult={reportResult} />,
  },
];

// Perguntas do "formulário de domínios" - mesma lógica do
// PerguntaBinaria da pergunta do mouse, mas em sequência.
const DOMINIO_PERGUNTAS = [
  {
    key: 'teclado',
    pergunta: 'Você já usa o teclado para digitar palavras ou frases?',
    opcaoSim: 'Sim, já digito',
    opcaoNao: 'Ainda não sei bem',
  },
  {
    key: 'internet',
    pergunta: 'Você já usou a internet - sites, redes sociais ou mensagens - antes?',
    opcaoSim: 'Sim, já usei',
    opcaoNao: 'Ainda não usei',
  },
];

// Quem responde "já uso" pra mouse/teclado não deveria ser jogado direto
// pra "Cliques com timing"/"Escrever e confirmar" só por ter dito isso -
// mas também não faz sentido forçar a aula básica de novo se a pessoa
// realmente já sabe. Esses 3 itens por domínio são um desafio rápido
// (mais difícil que a aula de "não sei") pra confirmar a palavra da
// pessoa com comportamento real, antes de decidir pular a aula ou não
// (ver handleVerificacaoMouseComplete/handleVerificacaoTecladoComplete).
const VERIFICACAO_MOUSE_STEPS = [
  {
    key: 'clique-alvo',
    instructions: 'Clique no ícone "Meus Documentos".',
    render: (reportResult) => (
      <ClicarAlvoGame
        reportResult={reportResult}
        alvos={[
          { id: 'lixeira', label: '🗑️ Lixeira', correto: false },
          { id: 'documentos', label: '📁 Meus Documentos', correto: true },
          { id: 'config', label: '⚙️ Configurações', correto: false },
        ]}
      />
    ),
  },
  {
    key: 'clique-direito',
    instructions: 'Clique com o botão DIREITO do mouse no ícone.',
    render: (reportResult) => (
      <ClicarAlvoGame
        reportResult={reportResult}
        tipoClique="direito"
        alvos={[{ id: 'arquivo', label: '📄 Documento.docx', correto: true }]}
      />
    ),
  },
  {
    key: 'duplo-clique',
    instructions: 'Dê um clique DUPLO no ícone para abrir.',
    render: (reportResult) => (
      <ClicarAlvoGame
        reportResult={reportResult}
        duploClique={true}
        alvos={[{ id: 'pasta', label: '📁 Fotos', correto: true }]}
      />
    ),
  },
];

const VERIFICACAO_TECLADO_STEPS = [
  {
    key: 'frase-espaco',
    instructions: 'Digite "bom dia" (com espaço entre as palavras) e confirme.',
    render: (reportResult) => (
      <DigitarTextoGame
        reportResult={reportResult}
        label='Digite "bom dia"'
        placeholder="Digite aqui"
        validar={(valor) => valor.toLowerCase() === 'bom dia'}
        mensagemErro='Confere se digitou "bom dia" com espaço entre as palavras.'
      />
    ),
  },
  {
    key: 'maiuscula',
    instructions: 'Digite "Ceci", com o C maiúsculo, e confirme.',
    render: (reportResult) => (
      <DigitarTextoGame
        reportResult={reportResult}
        label='Digite "Ceci" (com C maiúsculo)'
        placeholder="Digite aqui"
        validar={(valor) => valor === 'Ceci'}
        mensagemErro="Confere se o C está maiúsculo."
      />
    ),
  },
  {
    key: 'numero',
    instructions: 'Digite o número 2024 e confirme.',
    render: (reportResult) => (
      <DigitarTextoGame
        reportResult={reportResult}
        label="Digite o número 2024"
        placeholder="Digite aqui"
        validar={(valor) => valor === '2024'}
        mensagemErro='Confere se digitou "2024" certinho.'
      />
    ),
  },
];

export default function BoasVindas() {
  const navigate = useNavigate();
  const { user, initializing } = useContext(UserContext);
  // 'apresentacao' | 'tutorial-espaco' | 'pergunta-mouse' |
  // 'aula-mouse-intro' | 'aula-mouse-pratica' | 'verificacao-mouse' |
  // 'formulario-dominios' | 'aula-teclado-intro' | 'aula-teclado-pratica' |
  // 'verificacao-teclado' | 'diagnostico' | 'mini-aula-seguranca' |
  // 'concluido'
  const [fase, setFase] = useState('apresentacao');
  const [stepIndex, setStepIndex] = useState(0);
  const [dominioIndex, setDominioIndex] = useState(0);
  const [verificacaoIndex, setVerificacaoIndex] = useState(0);
  const [onboarding, setOnboarding] = useLocalStorage('ceci_onboarding', {});

  // Score adaptativo calculado AO VIVO durante o onboarding, mesma
  // fórmula de sempre (BKTAdaptativo.calcular, via /api/licao/simular) -
  // sem persistir nada ainda (não existe conta), sem teto artificial.
  // Mouse (U1.1) e teclado (U2.1) são acompanhados separadamente porque
  // são módulos independentes; cada um começa do zero (L0 padrão) na
  // primeira resposta daquele domínio, igual uma Unidade nunca tentada.
  const [scoreMouse, setScoreMouse] = useState({ dominio: null, questoes: 0 });
  const [scoreTeclado, setScoreTeclado] = useState({ dominio: null, questoes: 0 });

  // Rota "/boas-vindas" continua acessível por URL direta (ver comentário
  // no topo do arquivo), mas quem já está autenticado nunca deveria cair
  // aqui de novo - manda direto pro Dashboard. Isso cobre o caso da
  // Entrada.jsx (rota "/") não pegar: acesso direto a "/boas-vindas".
  useEffect(() => {
    if (!initializing && user) navigate('/dashboard', { replace: true });
  }, [initializing, user, navigate]);

  if (initializing || user) return null;

  const stepAtual = DIAGNOSTIC_STEPS[stepIndex];
  const ultimoStep = stepIndex === DIAGNOSTIC_STEPS.length - 1;

  const perguntaDominioAtual = DOMINIO_PERGUNTAS[dominioIndex];
  const ultimaPerguntaDominio = dominioIndex === DOMINIO_PERGUNTAS.length - 1;

  // Acumula um sinal comportamental no buffer que vai ser enviado de
  // verdade (responderQuestao) assim que a conta existir - ver nota
  // "SINAIS PRO ALGORITMO ADAPTATIVO" no topo do arquivo - E, ao mesmo
  // tempo, já calcula o score real AGORA (sem persistir, via
  // simularQuestao/api/licao/simular), encadeando o domínio/questões
  // desse mesmo domínio (mouse ou teclado) pra próxima chamada. Como as
  // fórmulas são determinísticas, o flush pós-cadastro (onboardingSync)
  // reproduz exatamente os mesmos valores - não precisa de teto nem de
  // regra própria em lugar nenhum: é o BKT de verdade desde o início.
  const registrarSinalAdaptativo = async ({ etapaId, moduleId, resultado, tempoIdeal }) => {
    setOnboarding((atual) => ({
      ...atual,
      sinaisAdaptativos: [
        ...(atual.sinaisAdaptativos ?? []),
        {
          etapaId,
          moduleId,
          correto: resultado.success,
          sinais: resultado.sinais,
          tempoIdeal,
        },
      ],
    }));

    const ehMouse = moduleId === 'U1.1';
    const scoreAtual = ehMouse ? scoreMouse : scoreTeclado;
    const setScore = ehMouse ? setScoreMouse : setScoreTeclado;

    try {
      const resposta = await simularQuestao({
        correto: resultado.success,
        sinais: resultado.sinais,
        tempoIdeal,
        tentativas: (resultado.attempts ?? 0) + 1,
        tentativasAposErro: resultado.attempts ?? 0,
        dominioAnterior: scoreAtual.dominio,
        questoesAnteriores: scoreAtual.questoes,
        etapaId,
      });
      setScore({ dominio: resposta.dominio, questoes: scoreAtual.questoes + 1 });
      return resposta;
    } catch (err) {
      console.error('Erro ao calcular score adaptativo no onboarding:', err);
      return null;
    }
  };

  const handleStepComplete = async (resultado) => {
    // Guarda o resultado desse passo, mantendo os anteriores (formato
    // usado hoje só pra pré-preencher o nome em Cadastro.jsx).
    setOnboarding((atual) => ({ ...atual, [stepAtual.key]: resultado }));

    // "Digitar o nome" também é sinal de familiaridade com teclado.
    await registrarSinalAdaptativo({
      etapaId: `boas-vindas#diagnostico-${stepAtual.key}`,
      moduleId: 'U2.1',
      resultado,
      tempoIdeal: getTempoIdealMs('digitar'),
    });

    if (ultimoStep) {
      setFase('mini-aula-seguranca');
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  // "não sei usar mouse" -> aula básica embutida aqui mesmo, antes de
  // qualquer outro passo (ver nota no topo do arquivo). "já uso" vai pro
  // desafio de verificação em vez de aceitar a palavra sozinha (ver
  // VERIFICACAO_MOUSE_STEPS acima).
  const handleRespostaMouse = (resposta) => {
    setOnboarding((atual) => ({ ...atual, familiaridadeMouse: resposta }));
    setFase(resposta === 'nao' ? 'aula-mouse-intro' : 'verificacao-mouse');
  };

  const handleRespostaDominio = (resposta) => {
    // Calculado localmente (não só via setOnboarding) pra poder decidir
    // a próxima fase já nesta mesma chamada, sem depender do timing da
    // atualização de estado - funciona não importa em que ordem as
    // perguntas de domínio estejam.
    const dominiosAtualizados = { ...onboarding.dominios, [perguntaDominioAtual.key]: resposta };
    setOnboarding((atual) => ({ ...atual, dominios: dominiosAtualizados }));

    if (ultimaPerguntaDominio) {
      // "não sei usar teclado" -> aula básica embutida aqui mesmo,
      // igual já acontece com o mouse. "já uso" vai pro desafio de
      // verificação (ver VERIFICACAO_TECLADO_STEPS acima).
      setFase(dominiosAtualizados.teclado === 'nao' ? 'aula-teclado-intro' : 'verificacao-teclado');
    } else {
      setDominioIndex((i) => i + 1);
    }
  };

  // Processa 1 item do desafio de verificação (mouse OU teclado) e, no
  // último item, decide se confirma a autodeclaração (segue em frente,
  // pulando a aula básica) ou não (cai na aula básica, igual quem
  // respondeu "não sei" - a pessoa só disse que sabia, mas não mostrou).
  // A decisão usa o MESMO limiar (0.5) que libera qualquer Unidade na
  // trilha de verdade - "confirmado" aqui significa literalmente "já
  // teria dominado Fundamentos", não uma contagem de acertos à parte.
  const handleVerificacaoComplete = async (dominio, steps, moduleId, resultado) => {
    const resposta = await registrarSinalAdaptativo({
      etapaId: `boas-vindas-verificacao#${dominio}-${steps[verificacaoIndex].key}`,
      moduleId,
      resultado,
      tempoIdeal: getTempoIdealMs(dominio === 'mouse' ? 'clicar' : 'digitar'),
    });

    const ultimoItem = verificacaoIndex === steps.length - 1;
    if (!ultimoItem) {
      setVerificacaoIndex((i) => i + 1);
      return;
    }

    setVerificacaoIndex(0);
    const confirmado = (resposta?.dominio ?? 0) >= (resposta?.limiar ?? 0.5);
    if (dominio === 'mouse') {
      setFase(confirmado ? 'formulario-dominios' : 'aula-mouse-intro');
    } else {
      setFase(confirmado ? 'diagnostico' : 'aula-teclado-intro');
    }
  };

  return (
    <div className={styles.page}>
      {fase === 'apresentacao' && (
        <div className={styles.card}>
          <img
            src="/mascote-ceci.png"
            alt="Mascote Ceci"
            className={styles.mascote}
          />
          <h1 className={styles.titulo}>Oi, eu sou a Ceci! 💜</h1>
          <p className={styles.texto}>
            Vou te acompanhar nessa jornada de aprender tecnologia, no seu
            tempo e do seu jeito. Não precisa saber nada de antemão -
            vamos descobrindo juntos.
          </p>
          <p className={styles.texto}>
            Que tal dar uma voltinha comigo antes de começar?
          </p>
          <ButtonPrimary size="large" onClick={() => setFase('tutorial-espaco')}>
            Vamos lá!
          </ButtonPrimary>
        </div>
      )}

      {fase === 'tutorial-espaco' && (
        <div className={styles.card}>
          <img
            src="/mascote-ceci.png"
            alt="Mascote Ceci"
            className={styles.mascote}
          />
          <h1 className={styles.titulo}>Um segredinho antes de começar</h1>
          <EspacoParaAvancar onAvancar={() => setFase('pergunta-mouse')} />
        </div>
      )}

      {fase === 'pergunta-mouse' && (
        <div className={styles.card}>
          <img
            src="/mascote-ceci.png"
            alt="Mascote Ceci"
            className={styles.mascote}
          />
          <h1 className={styles.titulo}>Me conta uma coisa...</h1>
          <PerguntaBinaria
            pergunta="Você já usa o mouse no seu dia a dia?"
            opcaoSim="Sim, já uso"
            opcaoNao="Ainda não sei bem"
            onResposta={handleRespostaMouse}
          />
        </div>
      )}

      {fase === 'verificacao-mouse' && (
        <div className={styles.diagnosticoWrapper}>
          {/* key=item.key remonta o GameMoment a cada item novo, zerando
              tentativas/status automaticamente (mesmo padrão da fase
              'diagnostico' mais abaixo) */}
          <GameMoment
            key={VERIFICACAO_MOUSE_STEPS[verificacaoIndex].key}
            title="Vamos conferir!"
            instructions={VERIFICACAO_MOUSE_STEPS[verificacaoIndex].instructions}
            onComplete={(resultado) =>
              handleVerificacaoComplete('mouse', VERIFICACAO_MOUSE_STEPS, 'U1.1', resultado)
            }
          >
            {({ reportResult }) => VERIFICACAO_MOUSE_STEPS[verificacaoIndex].render(reportResult)}
          </GameMoment>
        </div>
      )}

      {fase === 'aula-mouse-intro' && (
        <div className={styles.card}>
          <img
            src="/mascote-ceci.png"
            alt="Mascote Ceci"
            className={styles.mascote}
          />
          <h1 className={styles.titulo}>Vamos aprender juntos</h1>
          <p className={styles.texto}>
            O mouse é o objeto que você move com a mão para controlar a
            setinha na tela. Segure-o com calma, sem apertar - ele
            desliza sozinho sobre a mesa.
          </p>
          <p className={styles.texto}>
            O botão da esquerda (o que fica embaixo do seu dedo
            indicador) é o que você mais vai usar: um toque leve nele é
            chamado de <strong>clique</strong>.
          </p>
          <ButtonPrimary size="large" onClick={() => setFase('aula-mouse-pratica')}>
            Vamos praticar!
          </ButtonPrimary>
        </div>
      )}

      {fase === 'aula-mouse-pratica' && (
        <div className={styles.diagnosticoWrapper}>
          <GameMoment
            title="Agora é sua vez!"
            instructions="Clique no botão abaixo com o botão esquerdo do mouse."
            onComplete={async (resultado) => {
              await registrarSinalAdaptativo({
                etapaId: 'boas-vindas#pratica-mouse',
                moduleId: 'U1.1',
                resultado,
                tempoIdeal: getTempoIdealMs('clicar'),
              });
              setFase('formulario-dominios');
            }}
          >
            {({ reportResult }) => (
              <ClicarAlvoGame
                reportResult={reportResult}
                alvos={[{ id: 'aqui', label: '👆 Clique aqui', correto: true }]}
              />
            )}
          </GameMoment>
        </div>
      )}

      {fase === 'formulario-dominios' && perguntaDominioAtual && (
        <div className={styles.card}>
          <img
            src="/mascote-ceci.png"
            alt="Mascote Ceci"
            className={styles.mascote}
          />
          <h1 className={styles.titulo}>Mais uma coisinha...</h1>
          <PerguntaBinaria
            key={perguntaDominioAtual.key}
            pergunta={perguntaDominioAtual.pergunta}
            opcaoSim={perguntaDominioAtual.opcaoSim}
            opcaoNao={perguntaDominioAtual.opcaoNao}
            onResposta={handleRespostaDominio}
          />
        </div>
      )}

      {fase === 'verificacao-teclado' && (
        <div className={styles.diagnosticoWrapper}>
          <GameMoment
            key={VERIFICACAO_TECLADO_STEPS[verificacaoIndex].key}
            title="Vamos conferir!"
            instructions={VERIFICACAO_TECLADO_STEPS[verificacaoIndex].instructions}
            onComplete={(resultado) =>
              handleVerificacaoComplete('teclado', VERIFICACAO_TECLADO_STEPS, 'U2.1', resultado)
            }
          >
            {({ reportResult }) => VERIFICACAO_TECLADO_STEPS[verificacaoIndex].render(reportResult)}
          </GameMoment>
        </div>
      )}

      {fase === 'aula-teclado-intro' && (
        <div className={styles.card}>
          <img
            src="/mascote-ceci.png"
            alt="Mascote Ceci"
            className={styles.mascote}
          />
          <h1 className={styles.titulo}>Vamos aprender o teclado</h1>
          <p className={styles.texto}>
            Cada tecla tem uma letra, número ou símbolo desenhado nela.
            Apertar uma tecla escreve o que está desenhado ali - um
            toque leve já é suficiente, não precisa de força.
          </p>
          <p className={styles.texto}>
            Se sair uma letra errada, sem problema: a tecla{' '}
            <strong>Backspace</strong> apaga a última letra escrita, e
            você pode tentar de novo.
          </p>
          <Teclado teclaDestacada="backspace" />
          <ButtonPrimary size="large" onClick={() => setFase('aula-teclado-pratica')}>
            Vamos praticar!
          </ButtonPrimary>
        </div>
      )}

      {fase === 'aula-teclado-pratica' && (
        <div className={styles.diagnosticoWrapper}>
          <GameMoment
            title="Agora é sua vez!"
            instructions='Digite a palavra "oi" e confirme.'
            onComplete={async (resultado) => {
              await registrarSinalAdaptativo({
                etapaId: 'boas-vindas#pratica-teclado',
                moduleId: 'U2.1',
                resultado,
                tempoIdeal: getTempoIdealMs('digitar'),
              });
              setFase('diagnostico');
            }}
          >
            {({ reportResult }) => (
              <DigitarTextoGame
                reportResult={reportResult}
                label='Digite a palavra "oi"'
                placeholder="Digite aqui"
                validar={(valor) => valor.toLowerCase() === 'oi'}
                mensagemErro='Quase lá! Confere se digitou "oi" certinho.'
              />
            )}
          </GameMoment>
        </div>
      )}

      {fase === 'diagnostico' && stepAtual && (
        <div className={styles.diagnosticoWrapper}>
          {/* key=stepAtual.key remonta o GameMoment a cada novo passo,
              zerando tentativas e status automaticamente */}
          <GameMoment
            key={stepAtual.key}
            title={stepAtual.title}
            instructions={stepAtual.instructions}
            onComplete={handleStepComplete}
          >
            {({ reportResult }) => stepAtual.render(reportResult)}
          </GameMoment>
        </div>
      )}

      {fase === 'mini-aula-seguranca' && (
        <div className={styles.card}>
          <img
            src="/mascote-ceci.png"
            alt="Mascote Ceci"
            className={styles.mascote}
          />
          <h1 className={styles.titulo}>Antes de criar sua conta</h1>
          <p className={styles.texto}>
            Se você não tiver um e-mail próprio, pode usar o de alguém
            de confiança - só combine com essa pessoa antes, porque os
            avisos da sua conta vão chegar lá.
          </p>
          <p className={styles.texto}>
            Depois de escolher sua senha, anote-a em um lugar seguro
            (um caderninho, por exemplo) - assim você não corre o
            risco de esquecê-la.
          </p>
          <ButtonPrimary
            size="large"
            onClick={() => {
              // Marca o onboarding como concluído assim que a pessoa
              // termina o diagnóstico, mesmo que ainda não tenha criado a
              // conta - assim ela não vê o onboarding de novo se voltar
              // depois (cai direto no Login). Ver pages/Entrada.jsx.
              setOnboarding((atual) => ({ ...atual, concluido: true }));
              setFase('concluido');
            }}
          >
            Entendi, continuar
          </ButtonPrimary>
        </div>
      )}

      {fase === 'concluido' && (
        <div className={styles.card}>
          <img
            src="/mascote-ceci.png"
            alt="Mascote Ceci"
            className={styles.mascote}
          />
          <h1 className={styles.titulo}>
            Prazer, {onboarding?.nome?.meta?.valor || 'por aqui'}! 
          </h1>
          <p className={styles.texto}>
            Agora só falta criar sua conta pra guardar seu progresso.
          </p>
          <ButtonPrimary size="large" onClick={() => navigate('/cadastro')}>
            Criar minha conta
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
}