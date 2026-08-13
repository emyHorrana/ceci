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
//    - "já uso" -> pula direto pro próximo passo.
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
//    - "já uso" -> pula direto pro diagnóstico.
// 5) Diagnóstico inicial: uma sequência de pequenas interações discretas
//    (hoje: digitar o nome). Cada uma parece só uma etapa normal de
//    cadastro, mas na real também dá sinais de familiaridade com
//    mouse/teclado pro algoritmo adaptativo usar depois.
//
// SINAIS PRO ALGORITMO ADAPTATIVO (AB-BKT)
// Ainda não existe conta nesse ponto (ver nota do passo 7), então não dá
// pra chamar o backend aqui. Os resultados dos GameMoment que já rodam
// no onboarding (clique do mouse, "digite oi", digitar o nome) ficam
// bufferizados em onboarding.sinaisAdaptativos (ver
// registrarSinalAdaptativo abaixo) e só são enviados pro algoritmo
// depois que a conta é criada, em Cadastro.jsx (via
// services/onboardingSync.js) - assim o L inicial de "Fundamentos do
// mouse"/"Fundamentos do teclado" já nasce baseado em comportamento
// real, em vez do padrão fixo.
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
// IMPORTANTE: por enquanto essa rota fica de acesso livre (sem exigir
// login), de propósito, pra facilitar o desenvolvimento e os testes.
// Quando estiver pronta pra valer, o ideal é ela só aparecer pra quem
// ainda não passou pelo onboarding (ex: checando uma flag salva depois
// do cadastro), e não ficar acessível repetidamente.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameMoment } from '../components/Game/GameMoment';
import { EspacoParaAvancar } from '../components/Game/EspacoParaAvancar';
import { PerguntaBinaria } from '../components/Game/PerguntaBinaria';
import { Teclado } from '../components/Game/Teclado';
import { DigitarNomeGame } from '../components/Game/games/DigitarNomeGame';
import { DigitarTextoGame } from '../components/Game/games/DigitarTextoGame';
import { ClicarAlvoGame } from '../components/Game/games/ClicarAlvoGame';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { useLocalStorage } from '../hooks/useLocalStorage';
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

export default function BoasVindas() {
  const navigate = useNavigate();
  // 'apresentacao' | 'tutorial-espaco' | 'pergunta-mouse' |
  // 'aula-mouse-intro' | 'aula-mouse-pratica' | 'formulario-dominios' |
  // 'aula-teclado-intro' | 'aula-teclado-pratica' | 'diagnostico' |
  // 'mini-aula-seguranca' | 'concluido'
  const [fase, setFase] = useState('apresentacao');
  const [stepIndex, setStepIndex] = useState(0);
  const [dominioIndex, setDominioIndex] = useState(0);
  const [onboarding, setOnboarding] = useLocalStorage('ceci_onboarding', {});

  const stepAtual = DIAGNOSTIC_STEPS[stepIndex];
  const ultimoStep = stepIndex === DIAGNOSTIC_STEPS.length - 1;

  const perguntaDominioAtual = DOMINIO_PERGUNTAS[dominioIndex];
  const ultimaPerguntaDominio = dominioIndex === DOMINIO_PERGUNTAS.length - 1;

  // Acumula um sinal comportamental no buffer que vai ser enviado pro
  // algoritmo adaptativo assim que a conta existir (ver nota "SINAIS PRO
  // ALGORITMO ADAPTATIVO" no topo do arquivo).
  const registrarSinalAdaptativo = ({ etapaId, moduleId, resultado, tempoIdeal }) => {
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
  };

  const handleStepComplete = (resultado) => {
    // Guarda o resultado desse passo, mantendo os anteriores (formato
    // usado hoje só pra pré-preencher o nome em Cadastro.jsx).
    setOnboarding((atual) => ({ ...atual, [stepAtual.key]: resultado }));

    // "Digitar o nome" também é sinal de familiaridade com teclado.
    registrarSinalAdaptativo({
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
  // qualquer outro passo (ver nota no topo do arquivo). "já uso" pula
  // direto pro formulário de domínios - os dois caminhos convergem ali.
  const handleRespostaMouse = (resposta) => {
    setOnboarding((atual) => ({ ...atual, familiaridadeMouse: resposta }));
    setFase(resposta === 'nao' ? 'aula-mouse-intro' : 'formulario-dominios');
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
      // igual já acontece com o mouse (ver nota no topo do arquivo).
      setFase(dominiosAtualizados.teclado === 'nao' ? 'aula-teclado-intro' : 'diagnostico');
    } else {
      setDominioIndex((i) => i + 1);
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
            onComplete={(resultado) => {
              registrarSinalAdaptativo({
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
            onComplete={(resultado) => {
              registrarSinalAdaptativo({
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
          <ButtonPrimary size="large" onClick={() => setFase('concluido')}>
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