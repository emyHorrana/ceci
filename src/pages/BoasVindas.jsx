// BoasVindas.jsx
// Primeira tela que a pessoa vê ao entrar no CECI, antes de criar conta.
// Rota: /boas-vindas
//
// COMO FUNCIONA
// 1) Apresentação: a Cecília se apresenta e convida a pessoa a "dar uma
//    volta" - não importa se ela chegou sozinha ou com ajuda de alguém.
// 2) Tutorial da barra de espaço: ensina que dá pra apertar espaço pra
//    avançar telas de só-leitura, sem precisar do mouse. Existe pra
//    quem ainda não sabe usar mouse/teclado não travar aqui mesmo, logo
//    no início - sempre tem um "ou clique aqui" de escape.
// 3) Pergunta de bifurcação sobre familiaridade com o mouse: "sim" ou
//    "não" são igualmente válidos, então NÃO passa pelo GameMoment (que
//    é pra momentos com resposta certa/errada) - é só uma escolha, via
//    PerguntaBinaria. A resposta fica salva pro algoritmo adaptativo;
//    o encaminhamento de verdade (formulário de afinidade vs. lição
//    introdutória de mouse) ainda não existe, então por hoje os dois
//    caminhos convergem pro mesmo diagnóstico de nome (ver TODO abaixo).
// 4) Diagnóstico inicial: uma sequência de pequenas interações discretas
//    (hoje: digitar o nome). Cada uma parece só uma etapa normal de
//    cadastro, mas na real também dá sinais de familiaridade com
//    mouse/teclado pro algoritmo adaptativo usar depois.
// 5) Ao final, os resultados ficam guardados no navegador (localStorage,
//    via useLocalStorage) até a pessoa criar a conta - não existe
//    usuário autenticado ainda nessa fase, então não dá pra salvar no
//    Supabase diretamente (ver bdCeci.txt: usuarios.id referencia
//    auth.users). Quem lê esse localStorage depois é o Cadastro.jsx.
//
// COMO ADICIONAR UM NOVO PASSO DE DIAGNÓSTICO
// Só acrescentar um objeto no array DIAGNOSTIC_STEPS abaixo, com uma
// key única, título, instrução e a função que renderiza o joguinho
// dentro do GameMoment. A página já cuida de avançar pro próximo passo
// e de salvar o resultado de cada um automaticamente.
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
import { DigitarNomeGame } from '../components/Game/games/DigitarNomeGame';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { useLocalStorage } from '../hooks/useLocalStorage';
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

export default function BoasVindas() {
  const navigate = useNavigate();
  const [fase, setFase] = useState('apresentacao'); // 'apresentacao' | 'tutorial-espaco' | 'pergunta-mouse' | 'diagnostico' | 'concluido'
  const [stepIndex, setStepIndex] = useState(0);
  const [onboarding, setOnboarding] = useLocalStorage('ceci_onboarding', {});

  const stepAtual = DIAGNOSTIC_STEPS[stepIndex];
  const ultimoStep = stepIndex === DIAGNOSTIC_STEPS.length - 1;

  const handleStepComplete = (resultado) => {
    // Guarda o resultado desse passo, mantendo os anteriores.
    setOnboarding((atual) => ({ ...atual, [stepAtual.key]: resultado }));

    if (ultimoStep) {
      setFase('concluido');
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  // TODO: quando as lições de mouse e o formulário de afinidade
  // existirem de verdade, esta função deve decidir a próxima fase com
  // base na resposta ('sim' -> formulário de afinidade; 'nao' -> direto
  // pra lição introdutória de mouse). Por enquanto os dois caminhos
  // convergem pro mesmo diagnóstico de nome, mas a resposta já fica
  // salva no onboarding pra quando essas rotas existirem.
  const handleRespostaMouse = (resposta) => {
    setOnboarding((atual) => ({ ...atual, familiaridadeMouse: resposta }));
    setFase('diagnostico');
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