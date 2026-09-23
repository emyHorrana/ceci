// BoasVindas.jsx
// Primeira tela que a pessoa vê ao entrar no CECI, antes de criar conta.
// Rota: /boas-vindas
//
// COMO FUNCIONA (sequência de fases, em ordem)
// 0) Intro/manifesto: banner do projeto + texto institucional (o que é
//    o CECI, quem é a Ceci, a origem da ideia no Inatel Cas@Viva) - é a
//    "capa" do app, antes até da Cecília se apresentar. Avança com um
//    clique normal (ButtonPrimary) - ver nota "AVANÇO SÓ COM MOUSE"
//    abaixo pro raciocínio completo.
// 1) Pergunta de bifurcação sobre familiaridade com o mouse (fase
//    'pergunta-mouse', via PerguntaBinaria): "sim" ou "não" são
//    igualmente válidos, então NÃO passa pelo GameMoment (que é pra
//    momentos com resposta certa/errada) - é só uma escolha.
//    - "sim, já uso" -> desafio de verificação (fase verificacao-mouse,
//      3 itens - ver VERIFICACAO_MOUSE_STEPS) em vez de aceitar a
//      palavra da pessoa sozinha. Cada resposta já calcula o score real
//      do BKT na hora (ver registrarSinalAdaptativo/simularQuestao mais
//      abaixo) - "confirmado" significa que o domínio calculado ao vivo
//      já cruzou o mesmo limiar (0.5) que libera qualquer Unidade na
//      trilha de verdade, não uma contagem de acertos à parte.
//      Confirmou? segue pro formulário de domínios (passo 2). Não
//      confirmou? cai numa prática rápida (fase aula-mouse-pratica -
//      só o "clique aqui" com feedback, SEM repetir explicação nenhuma,
//      já que a orientação de clicar com o botão esquerdo agora é FIXA
//      na lateral da página - ver nota "DICAS FIXAS NA LATERAL" abaixo)
//      - ao concluir, também segue pro formulário de domínios. Tanto a
//      verificação quanto essa prática continuam rodando normalmente
//      porque são elas que de fato alimentam o algoritmo adaptativo com
//      sinais reais de uso do mouse - ver nota "SINAIS PRO ALGORITMO
//      ADAPTATIVO" abaixo.
//    - "ainda não sei bem" -> NÃO joga nenhum jogo de mouse aqui (nem
//      verificação, nem prática) - vai direto pro formulário de
//      domínios (passo 2). Quem já disse que não sabe não precisa
//      "provar" nada, e insistir em jogos de mouse agora só atrasaria
//      o cadastro sem gerar sinal novo de verdade. Fundamentos do
//      mouse (Unidade U1.1) não tem pré-requisito e é Tier 0
//      (essencial) - ela já aparece em primeiro lugar na trilha de
//      verdade assim que a conta é criada, então quem respondeu "não"
//      aprende mouse por lá mesmo, jogando pra valer (com progresso
//      salvo de verdade), em vez de repetir a mesma coisa aqui no
//      onboarding pra depois jogar fora.
// 2) Pergunta de bifurcação sobre teclado (fase 'pergunta-teclado', mesmo
//    componente PerguntaBinaria da pergunta do mouse) - pelo mesmo
//    motivo do mouse: quem não sabe usar teclado também teria
//    dificuldade em digitar nome/e-mail no diagnóstico e no cadastro
//    logo a seguir.
//    - "não sei usar teclado" -> aula básica de teclado embutida aqui
//      mesmo (fases aula-teclado-intro/aula-teclado-pratica) - AO
//      CONTRÁRIO do mouse, aqui a aula continua dentro do próprio
//      onboarding: o passo seguinte (digitar o nome, e depois o
//      cadastro de verdade) já exige digitar de verdade, então não dá
//      pra adiar pra depois do registro como fizemos com o mouse.
//    - "já uso" -> desafio de verificação (fase verificacao-teclado),
//      mesma lógica e mesmo critério da verificação de mouse acima -
//      mas, ao contrário do mouse, aqui o resultado da verificação não
//      muda o destino: confirmando ou não, segue em frente (nunca pro
//      teclado101.exe). Quem disse que já usa teclado não deveria cair
//      numa aula básica só por não ter confirmado num desafio - o
//      tutorial fica reservado só pra quem respondeu "não sei" na
//      pergunta de teclado (ver handleRespostaTeclado).
//    Só DEPOIS que esse ciclo termina (jogo de verificação OU tutorial
//    completo, tanto faz) é que vem a pergunta de internet (fase
//    'pergunta-internet', mesma ideia, sem jogo nem tutorial associado -
//    ver nota "ORDEM: TECLADO ANTES DE INTERNET" abaixo).
// 3) Diagnóstico inicial: uma sequência de pequenas interações discretas
//    (hoje: digitar o nome). Cada uma parece só uma etapa normal de
//    cadastro, mas na real também dá sinais de familiaridade com
//    teclado pro algoritmo adaptativo usar depois.
//
// AVANÇO SÓ COM MOUSE (sem atalho de teclado aqui)
// O resto do site usa EspacoParaAvancar (Espaço/Enter + "ou clique
// aqui") em telas só-de-leitura - mas AQUI no onboarding, de propósito,
// só existe avanço por clique (ButtonPrimary/PerguntaBinaria/GameMoment),
// nunca tecla de atalho. Motivo: da fase 'pergunta-mouse' em diante, a
// própria orientação fixa na lateral (ver abaixo) já ensina "clique com
// o botão ESQUERDO do mouse" como o jeito padrão de interagir - é
// exatamente assim que as lições de verdade funcionam depois (MiniModulo
// usa clique em botão, nunca Enter/Espaço pra avançar etapa). Ensinar um
// atalho de teclado bem no início só pra "esquecer" dele em seguida
// confundiria mais do que ajudaria; o padrão de tecla-de-atalho continua
// existindo no resto do app (ele é ensinado só depois, já dentro da
// trilha de verdade, quando fizer sentido).
//
// DICAS FIXAS NA LATERAL (em vez de card próprio)
// As duas orientações do onboarding (clicar com o botão esquerdo do
// mouse; e que o tamanho do texto pode ser ajustado pelos botões "A A A"
// no topo) NÃO são um card/fase própria - ficam fixas na coluna lateral
// (.ceciliaCol), visíveis desde o primeiro card (fase 'intro', o
// leia-me.txt), já que é ele que ensina o avanço por clique desde o
// início. Só somem nas fases de GameMoment, porque o GameMoment já tem
// o próprio feedback da Cecília - mesmo padrão usado em MiniModulo.jsx,
// ver `.main[data-modo='jogo']` lá. Assim a pessoa pode reler as duas
// dicas a qualquer momento, sem precisar decorar tudo de uma vez lá no
// início nem perder espaço de tela com elas separadas em telas próprias.
//
// ORDEM: TECLADO ANTES DE INTERNET
// A pergunta de teclado resolve pro jogo (verificacao-teclado) ou pro
// tutorial (aula-teclado-intro/pratica) IMEDIATAMENTE depois de
// respondida, em vez de esperar outras perguntas - só depois que esse
// ciclo termina é que a pergunta de internet aparece (fase
// 'pergunta-internet', sem jogo nem tutorial associado - internet não
// tem um mini-módulo de fundamentos pra "roubar" sinal aqui, então essa
// pergunta é só a resposta mesmo, igual a pergunta de teclado seria se
// não tivesse o jogo/tutorial no meio). Isso evita perguntar sobre
// internet no meio do raciocínio de teclado, quando a pessoa ainda está
// "no assunto" - cada domínio (mouse, depois teclado) resolve sua
// própria pergunta + jogo/aula de uma vez antes de passar pro próximo.
//
// VOLTAR ENTRE AS TELAS (histórico de fases)
// Mesmo padrão de Anterior/Próxima já usado nas lições (MiniModulo.jsx):
// aqui não existe uma ordem fixa de fases (o fluxo bifurca de acordo
// com as respostas), então "Anterior" funciona como uma pilha de
// histórico de verdade (ver `historico`/`irPara`/`voltar` abaixo) - ele
// sempre volta pra fase que a pessoa estava ANTES, seja qual for o
// caminho que ela tomou pra chegar até aqui. Não existe "Próxima"
// separado (ao contrário das lições): aqui o avanço sempre já acontece
// através da própria ação da fase (responder a pergunta, completar o
// jogo, clicar no botão "Entendi") - um botão genérico de "Próxima" ao
// lado seria redundante.
//
// SINAIS PRO ALGORITMO ADAPTATIVO (AB-BKT)
// Ainda não existe conta nesse ponto (ver nota do passo 5), então não dá
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
// sem confiar cegamente numa resposta "sim" isolada. Quem responde
// "não sei" pro mouse não gera nenhum sinal aqui (ver passo 1 acima) -
// e não tem problema nenhum nisso: o primeiro sinal de verdade pra
// U1.1 vai ser dentro da própria trilha, depois do cadastro.
// 4) Mini-aula de orientações de conta: antes de ir pro cadastro de
//    verdade, avisos rápidos e leves (pode usar e-mail de alguém de
//    confiança, anotar a senha em lugar seguro) - pensados pra quem
//    nunca criou uma conta online antes.
// 5) Ao final, os resultados ficam guardados no navegador (localStorage,
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
// Cada domínio (mouse, teclado, internet) tem sua própria fase de
// pergunta (PerguntaBinaria) + handler dedicado (handleRespostaMouse,
// handleRespostaTeclado, handleRespostaInternet) que decide a próxima
// fase - não existe mais um array genérico percorrido em sequência,
// porque cada domínio pode ter (ou não) um jogo/tutorial associado no
// meio. A resposta de cada um fica em onboarding.dominios[key] (exceto
// mouse, que usa onboarding.familiaridadeMouse por legado).
//
// A rota "/boas-vindas" em si continua de acesso livre (sem exigir
// login), de propósito, pra facilitar repetir o onboarding manualmente
// em desenvolvimento e testes. Mas a entrada normal do app é a raiz "/"
// (ver pages/Entrada.jsx), que só mostra esta tela pra quem ainda não
// tem a flag onboarding.concluido - setada logo abaixo, ao chegar na
// fase 'concluido'. Quem já concluiu (com ou sem ter criado a conta) cai
// direto no Login a partir da próxima visita.
//
// EXCEÇÃO PRA CONTA ADM: o guard abaixo ("se já está logado, manda pro
// Dashboard") não vale pra quem é admin (ver isAdmin/utils/roles.js) -
// assim dá pra revisitar /boas-vindas quantas vezes quiser, mesmo já
// logado, pra testar mudanças no fluxo sem precisar deslogar ou limpar
// localStorage a cada vez. Alunos continuam vendo só uma vez, como
// antes - essa exceção não muda nada pra eles.

import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { isAdmin } from '../utils/roles';
import { GameMoment } from '../components/Game/GameMoment';
import { PerguntaBinaria } from '../components/Game/PerguntaBinaria';
import { Teclado } from '../components/Game/Teclado';
import { MouseSvg } from '../components/Game/MouseSvg.jsx';
import { DigitarNomeGame } from '../components/Game/games/DigitarNomeGame';
import { DigitarTextoGame } from '../components/Game/games/DigitarTextoGame';
import { ClicarAlvoGame } from '../components/Game/games/ClicarAlvoGame';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { ButtonOutline } from '../components/Buttons/ButtonOutline';
import { RetroWindow } from '../components/Window/RetroWindow';
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

// Perguntas de bifurcação sobre teclado e internet - mesma lógica da
// pergunta do mouse (fase própria + PerguntaBinaria), mas cada uma
// SEPARADA da outra, não mais em sequência dentro de um "formulário":
// a de teclado já resolve pro jogo/tutorial de teclado logo em seguida
// (fase 'pergunta-teclado'), e só depois vem a de internet (fase
// 'pergunta-internet') - ver nota "ORDEM: TECLADO ANTES DE INTERNET" no
// topo do arquivo pro raciocínio completo.
const PERGUNTA_TECLADO = {
  pergunta: 'Você já usa o teclado para digitar palavras ou frases?',
  opcaoSim: 'Sim, já digito',
  opcaoNao: 'Ainda não sei bem',
};

const PERGUNTA_INTERNET = {
  pergunta: 'Você já usou a internet - sites, redes sociais ou mensagens - antes?',
  opcaoSim: 'Sim, já usei',
  opcaoNao: 'Ainda não usei',
};

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

// Fases em que o GameMoment está ativo - a coluna lateral com as dicas
// fixas some nelas (o GameMoment já mostra o próprio feedback da
// Cecília), mesmo padrão de `.main[data-modo='jogo']` em
// MiniModulo.module.css.
const FASES_DE_JOGO = new Set([
  'verificacao-mouse',
  'aula-mouse-pratica',
  'verificacao-teclado',
  'aula-teclado-pratica',
  'diagnostico',
]);

export default function BoasVindas() {
  const navigate = useNavigate();
  const { user, initializing } = useContext(UserContext);
  // 'intro' | 'pergunta-mouse' | 'verificacao-mouse' | 'aula-mouse-pratica' |
  // 'pergunta-teclado' | 'aula-teclado-intro' | 'aula-teclado-pratica' |
  // 'verificacao-teclado' | 'pergunta-internet' | 'diagnostico' |
  // 'mini-aula-seguranca' | 'concluido'
  const [fase, setFase] = useState('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [verificacaoIndex, setVerificacaoIndex] = useState(0);
  const [onboarding, setOnboarding] = useLocalStorage('ceci_onboarding', {});

  // Pilha de fases já visitadas, pro botão "Anterior" - ver nota
  // "VOLTAR ENTRE AS TELAS" no topo do arquivo.
  const [historico, setHistorico] = useState([]);
  const faseAtualRef = useRef(fase);
  useEffect(() => {
    faseAtualRef.current = fase;
  }, [fase]);

  // Troca de fase "pra frente" - empilha a fase atual no histórico antes
  // de trocar, pra "Anterior" saber pra onde voltar.
  const irPara = useCallback((novaFase) => {
    setHistorico((h) => [...h, faseAtualRef.current]);
    setFase(novaFase);
  }, []);

  // "Anterior" - desempilha a última fase visitada. Zera os índices de
  // sequência (passo do diagnóstico, pergunta de domínio, item de
  // verificação) porque só o relevante pra fase de destino importa, e
  // reentrar sempre no primeiro item de novo é mais previsível do que
  // tentar adivinhar "em qual item exato a pessoa estava".
  const voltar = useCallback(() => {
    setHistorico((h) => {
      if (h.length === 0) return h;
      const copia = [...h];
      const anterior = copia.pop();
      setStepIndex(0);
      setVerificacaoIndex(0);
      setFase(anterior);
      return copia;
    });
  }, []);

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
  // Excepto conta ADM: pra facilitar teste manual do fluxo, admin pode
  // ficar aqui mesmo já logado, quantas vezes quiser.
  useEffect(() => {
    if (!initializing && user && !isAdmin(user)) navigate('/dashboard', { replace: true });
  }, [initializing, user, navigate]);

  if (initializing || (user && !isAdmin(user))) return null;

  const stepAtual = DIAGNOSTIC_STEPS[stepIndex];
  const ultimoStep = stepIndex === DIAGNOSTIC_STEPS.length - 1;

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
      irPara('mini-aula-seguranca');
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  // "não sei bem" -> não joga nenhum jogo de mouse aqui (nem
  // verificação, nem prática) - vai direto pro formulário de domínios.
  // Ver passo 1 do comentário no topo do arquivo pro raciocínio
  // completo: Fundamentos do mouse (U1.1) não tem pré-requisito, então
  // já é a primeira coisa que a pessoa encontra na trilha de verdade
  // depois de criar a conta - não precisa repetir aqui pra depois
  // jogar fora.
  // "sim, já uso" -> desafio de verificação (não aceita a palavra da
  // pessoa sozinha - ver VERIFICACAO_MOUSE_STEPS acima).
  const handleRespostaMouse = (resposta) => {
    setOnboarding((atual) => ({ ...atual, familiaridadeMouse: resposta }));
    irPara(resposta === 'nao' ? 'pergunta-teclado' : 'verificacao-mouse');
  };

  // "não sei usar teclado" -> aula básica embutida aqui mesmo (fases
  // aula-teclado-intro/aula-teclado-pratica). "já uso" -> desafio de
  // verificação (fase verificacao-teclado, ver VERIFICACAO_TECLADO_STEPS
  // acima). Só depois que esse ciclo termina (jogo OU tutorial) é que a
  // pergunta de internet aparece - ver nota "ORDEM: TECLADO ANTES DE
  // INTERNET" no topo do arquivo.
  const handleRespostaTeclado = (resposta) => {
    setOnboarding((atual) => ({
      ...atual,
      dominios: { ...atual.dominios, teclado: resposta },
    }));
    irPara(resposta === 'nao' ? 'aula-teclado-intro' : 'verificacao-teclado');
  };

  const handleRespostaInternet = (resposta) => {
    setOnboarding((atual) => ({
      ...atual,
      dominios: { ...atual.dominios, internet: resposta },
    }));
    irPara('diagnostico');
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
      // Sem card explicativo antes: quem não confirma cai direto na
      // prática (aula-mouse-pratica) - a explicação de qual botão usar
      // já está fixa na lateral (ver nota "DICAS FIXAS NA LATERAL" no
      // topo do arquivo), não precisa repetir.
      irPara(confirmado ? 'pergunta-teclado' : 'aula-mouse-pratica');
    } else {
      // Teclado é diferente do mouse: quem respondeu "já uso" nunca vê
      // o teclado101.exe, confirmando ou não no desafio - só segue pra
      // pergunta de internet. O tutorial fica reservado só pra quem
      // respondeu "não sei" na pergunta de teclado (ver
      // handleRespostaTeclado), já que só ela realmente precisa da aula
      // básica pra conseguir digitar o próprio nome em seguida.
      irPara('pergunta-internet');
    }
  };

  const ehFaseDeJogo = FASES_DE_JOGO.has(fase);
  // A coluna lateral com as dicas fixas aparece desde a "capa" (fase
  // 'intro') - é ela que já ensina o avanço por clique, então faz
  // sentido a dica de clique com o botão esquerdo estar visível desde
  // o leia-me.txt. Só some nos momentos de jogo (que já têm o próprio
  // feedback da Cecília) - ver nota "DICAS FIXAS NA LATERAL" no topo.
  const mostrarLateral = !ehFaseDeJogo;
  const podeVoltar = historico.length > 0;

  return (
      <div className={styles.page}>
        <main className={styles.main} data-modo={ehFaseDeJogo ? 'jogo' : 'conteudo'}>
          {/* key força remontar a coluna a cada troca de card (fase, ou
          item dentro da mesma fase - pergunta de domínio, passo do
          diagnóstico, item de verificação), reiniciando a animação de
          entrada em .module.css (ver "entradaCard") - é isso que tira
          a brusquidão de trocar pra próximo card/jogo direto no clique,
          sem precisar de pausa (diferente do GameMoment, que já tem a
          própria pausa em PAUSA_TRANSICAO_MS antes de chegar aqui). */}
          <div
              key={`${fase}-${stepIndex}-${verificacaoIndex}`}
              className={`${styles.conteudoCol} ${styles.entradaCard}`}
          >
            {fase === 'intro' && (
                <RetroWindow
                    title="leia-me.txt"
                    icon="📄"
                    accent="yellow"
                    className={styles.frame}
                    bodyClassName={`${styles.card} ${styles.introCard}`}
                >
                  <img
                      src="/banner.png"
                      alt="Ceci - tecnologia para todas as idades"
                      className={styles.banner}
                  />

                  <h1 className={styles.titulo}>Saudações, terráqueo!</h1>

                  <p className={styles.introTexto}>
                    Seja bem-vindo(a) à Ceci! Esta aplicação ajuda pessoas de
                    todas as idades a se familiarizarem um pouco mais com a
                    tecnologia. Nossa mascote Ceci, uma senhorinha doce e
                    esperta, vai te guiar durante toda a jornada.
                  </p>

                  <p className={styles.introTexto}>
                    Aqui você pode conhecer recursos do computador, praticar
                    diferentes tarefas e repetir quantas vezes quiser - errar
                    faz parte do aprendizado! A plataforma nasceu de aulas de
                    informática para adultos e idosos, onde vimos que o maior
                    desafio não era aprender, e sim ter um espaço seguro para
                    tentar. Vamos começar?
                  </p>

                  <ButtonPrimary size="large" onClick={() => irPara('pergunta-mouse')}>
                    Vamos começar!
                  </ButtonPrimary>
                </RetroWindow>
            )}

            {fase === 'pergunta-mouse' && (
                <RetroWindow title="pergunta.exe" icon="❓" className={styles.frame} bodyClassName={styles.card}>
                  <h1 className={styles.titulo}>Me conta uma coisa...</h1>
                  <PerguntaBinaria
                      pergunta="Você já usa o mouse no seu dia a dia?"
                      opcaoSim="Sim, já uso"
                      opcaoNao="Ainda não sei bem"
                      onResposta={handleRespostaMouse}
                  />
                </RetroWindow>
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
                        irPara('pergunta-teclado');
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

            {fase === 'pergunta-teclado' && (
                <RetroWindow title="pergunta.exe" icon="❓" className={styles.frame} bodyClassName={styles.card}>
                  <h1 className={styles.titulo}>Mais uma coisinha...</h1>
                  <PerguntaBinaria
                      pergunta={PERGUNTA_TECLADO.pergunta}
                      opcaoSim={PERGUNTA_TECLADO.opcaoSim}
                      opcaoNao={PERGUNTA_TECLADO.opcaoNao}
                      onResposta={handleRespostaTeclado}
                  />
                </RetroWindow>
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
                <RetroWindow title="teclado101.exe" icon="⌨️" className={styles.frame} bodyClassName={styles.card}>
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
                  <ButtonPrimary size="large" onClick={() => irPara('aula-teclado-pratica')}>
                    Vamos praticar!
                  </ButtonPrimary>
                </RetroWindow>
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
                        irPara('pergunta-internet');
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

            {fase === 'pergunta-internet' && (
                <RetroWindow title="pergunta.exe" icon="❓" className={styles.frame} bodyClassName={styles.card}>
                  <h1 className={styles.titulo}>Mais uma coisinha...</h1>
                  <PerguntaBinaria
                      pergunta={PERGUNTA_INTERNET.pergunta}
                      opcaoSim={PERGUNTA_INTERNET.opcaoSim}
                      opcaoNao={PERGUNTA_INTERNET.opcaoNao}
                      onResposta={handleRespostaInternet}
                  />
                </RetroWindow>
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
                <RetroWindow title="seguranca.txt" icon="🔒" className={styles.frame} bodyClassName={styles.card}>
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
                        irPara('concluido');
                      }}
                  >
                    Entendi, continuar
                  </ButtonPrimary>
                </RetroWindow>
            )}

            {fase === 'concluido' && (
                <RetroWindow title="sucesso.exe" icon="🎉" accent="pink" className={styles.frame} bodyClassName={styles.card}>
                  <h1 className={styles.titulo}>
                    Prazer, {onboarding?.nome?.meta?.valor || 'por aqui'}!
                  </h1>
                  <p className={styles.texto}>
                    Agora só falta criar sua conta pra guardar seu progresso.
                  </p>
                  <ButtonPrimary size="large" onClick={() => navigate('/cadastro')}>
                    Criar minha conta
                  </ButtonPrimary>
                </RetroWindow>
            )}
          </div>

          {/* Coluna lateral fixa - ver nota "DICAS FIXAS NA LATERAL" no
              topo do arquivo. */}
          {mostrarLateral && (
              <aside className={styles.ceciliaCol}>
                <RetroWindow title="ceci.exe" icon="👋" accent="purple" className={styles.dicaFrame} bodyClassName={styles.dicaCard}>
                  <img src="/mascote-ceci.png" alt="Mascote Ceci" className={styles.dicaMascote} />
                  <p className={styles.dicaTexto}>
                    Pra responder e avançar, clique nos botões da tela com
                    o botão <strong>ESQUERDO</strong> do mouse - o que fica
                    embaixo do seu dedo indicador, em destaque no desenho
                    abaixo.
                  </p>
                  <MouseSvg maxWidth="90px" />
                </RetroWindow>

                <RetroWindow title="dica.exe" icon="💡" accent="yellow" className={styles.dicaFrame} bodyClassName={styles.dicaCard}>
                  <p className={styles.dicaTexto}>
                    Reparou na barrinha <strong>"Tamanho do texto"</strong>,
                    lá no topo da tela, com as letrinhas <strong>A A A</strong>?
                    A qualquer momento, em qualquer tela, você pode clicar
                    nelas para deixar as letras do tamanho mais confortável
                    para você.
                  </p>
                </RetroWindow>
              </aside>
          )}
        </main>

        {podeVoltar && (
            <footer className={styles.footer}>
              <ButtonOutline onClick={voltar}>
                Anterior
              </ButtonOutline>
            </footer>
        )}
      </div>
  );
}