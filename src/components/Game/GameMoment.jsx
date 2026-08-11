// GameMoment.jsx
// Container genérico do "momento de jogo" do CECI.
//
// PARA QUE SERVE
// Quando uma etapa da lição deixa de ser só leitura ("teoria") e passa a
// exigir uma ação do usuário ("prática"), este componente marca essa
// transição de forma bem visível - cor, moldura e um aviso da Cecília -
// para que a pessoa idosa/adulta iniciante entenda: "agora preciso FAZER
// algo para continuar, não só ler".
//
// Ele NÃO sabe jogar nenhum jogo específico. Ele só:
//   1) Sinaliza visualmente a troca de modo (leitura → ação);
//   2) Recebe o jogo de verdade como children (render prop);
//   3) Escuta o resultado de cada tentativa via reportResult(sucesso);
//   4) Decide quando mostrar a mensagem de incentivo da Cecília, quando
//      liberar a opção de "pular por enquanto" e quando avisar o resto da
//      tela que o momento de jogo terminou (onComplete).
//
// O QUE ELE **NÃO** FAZ (de propósito, pra manter simples por enquanto)
//   - Não decide sozinho quando navegar para a próxima etapa. Quem navega
//     continua sendo a página (Licao.jsx / MiniModulo.jsx), usando o
//     resultado que o GameMoment entrega em onComplete para liberar o
//     botão "Próxima" que já existe no rodapé.
//   - Não calcula métricas ricas (tempo, precisão etc). O objeto de
//     resultado já nasce com o formato certo pra isso ser encaixado depois
//     (ver "EVOLUINDO DEPOIS" no fim do arquivo), sem quebrar quem já usa.
//
// COMO USAR NUMA PÁGINA (Licao.jsx / MiniModulo.jsx)
//
//   const [resultadoJogo, setResultadoJogo] = useState(null);
//
//   {etapa.tipo === 'jogo' && (
//     <GameMoment
//       title="Reconhecendo os botões do mouse"
//       instructions="Clique com o botão ESQUERDO do mouse quando estiver pronto."
//       maxAttempts={3}
//       onComplete={(resultado) => setResultadoJogo(resultado)}
//     >
//       {({ reportResult }) => (
//         <MeuJogoDeMouse onResponder={(acertou) => reportResult(acertou)} />
//       )}
//     </GameMoment>
//   )}
//
//   // no rodapé da página, o botão que já existe:
//   <ButtonPrimary
//     onClick={handleNext}
//     disabled={etapa.tipo === 'jogo' && !resultadoJogo}
//   >
//     Próxima
//   </ButtonPrimary>
//
//   // ao trocar de etapa, lembre de resetar: setResultadoJogo(null)
//
// COMO CRIAR UM "JOGO DE VERDADE" PRA ENCAIXAR AQUI
// Qualquer componente pode ser o jogo, contanto que ele receba uma função
// (aqui chamada de onResponder, mas o nome é livre) e chame ela com
// true/false quando o usuário acertar ou errar uma tentativa. Ele não
// precisa saber nada sobre tentativas, mensagens da Cecília ou pular -
// isso é tudo cuidado pelo GameMoment por fora.
//
// PROPS
//   title          (string, obrigatório)  Nome curto do exercício.
//   instructions   (string|node)          O que a pessoa precisa fazer.
//   children       (função, obrigatório)  Render prop: recebe
//                    { reportResult, attempts, status } e retorna o jogo.
//   maxAttempts    (number, padrão 3)     Erros tolerados antes de liberar
//                    o "pular por enquanto".
//   allowSkip      (bool, padrão true)    Se falso, nunca libera pular
//                    (use com cuidado - quebra a promessa de ambiente
//                    acolhedor; pensado só pra casos muito específicos).
//   onComplete     (função)               Chamada UMA vez, quando o
//                    usuário acerta ou escolhe pular. Recebe:
//                    { success, attempts, skipped, meta, sinais }
//   onAbandon      (função, opcional)     Chamada UMA vez, só se o
//                    componente for desmontado ainda em jogo (trocou de
//                    etapa/saiu da página sem acertar nem pular). Recebe
//                    os mesmos `sinais` de onComplete, com abandonado: true.
//   messages       (objeto, opcional)     Sobrescreve as falas padrão da
//                    Cecília. Formato:
//                    {
//                      encourage: ['Quase! Tenta de novo :)', ...],
//                      success: 'Isso aí! Você conseguiu!',
//                      skipAvailable: 'Sem problemas, você pode voltar aqui quando quiser.',
//                    }
//
// EVOLUINDO DEPOIS (algoritmo adaptativo)
// Quando o jogo tiver métricas de verdade (tempo de resposta, nº de erros
// por tipo, precisão de clique etc), dá pra chamar reportResult(acertou,
// metricas) - o segundo argumento já é aceito e simplesmente repassado
// dentro do objeto de resultado como result.meta, sem exigir mudança na
// assinatura nem nos componentes que já usam o GameMoment hoje.
//
// SINAIS DE ENGAJAMENTO (pro AB-BKT)
// Além de meta (livre, específico de cada jogo), o resultado agora também
// carrega `sinais`: dados que QUALQUER etapa produz, sem o jogo precisar
// saber nada disso (igual tentativas/status já funcionava antes):
//   { tempoRespostaMs, trocasDeAba, tempoInativoMs, abandonado }
// Correspondem ao `dadosEvento` que Indicadores.aPartirDoEvento espera
// (tempoResposta, trocasDeAba, tempoInativo, abandonado), só que ainda em
// unidades brutas do navegador (ms) - a conversão final de formato/nomes
// pro contrato exato da rota /api/licao/responder é responsabilidade de
// quem CHAMA o algoritmo (não deste componente - ver algorithmService.js).
//
// IMPORTANTE: isso aqui SÓ captura e expõe os sinais. Não chama nenhum
// back-end, não sabe nada sobre Unidade/BKT - só mede o que já está
// acontecendo na tela.
//
//   - trocasDeAba: quantas vezes a pessoa saiu da aba (visibilitychange)
//     enquanto esse GameMoment estava montado.
//   - tempoInativoMs: soma de intervalos > 3s sem nenhuma atividade
//     (mouse/teclado/toque/scroll) - não conta pausas curtas normais
//     entre uma tentativa e outra, só quando a pessoa realmente parou.
//   - abandonado: true se o componente foi desmontado (trocou de etapa,
//     saiu da página) enquanto o status ainda era 'jogando' - nem acertou
//     nem pulou. Chega via onAbandon (chamado no máximo uma vez, só
//     nesse cenário - onComplete continua reservado pra acerto/pular).

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import styles from './GameMoment.module.css';
import { ButtonOutline } from '../Buttons/ButtonOutline';

// Só conta como "tempo parado" gaps de atividade maiores que isso -
// evita contar o intervalo normal entre um clique e outro como inatividade.
const LIMIAR_INATIVIDADE_MS = 3000;

const DEFAULT_MESSAGES = {
  encourage: [
    'Quase! Vamos tentar de novo?',
    'Sem problema, é assim que a gente aprende. Tenta mais uma vez!',
    'Você está pertinho de conseguir. Mais uma tentativa!',
  ],
  success: 'Isso aí! Você conseguiu!',
  skipAvailable: 'Sem problemas! Você pode voltar aqui pra treinar quando quiser.',
};

export function GameMoment({
  title,
  instructions,
  children,
  maxAttempts = 3,
  allowSkip = true,
  onComplete,
  onAbandon,
  messages,
}) {
  const msgs = useMemo(() => ({ ...DEFAULT_MESSAGES, ...messages }), [messages]);

  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState('jogando'); // 'jogando' | 'sucesso' | 'pulado'
  const [ceciMessage, setCeciMessage] = useState(null);

  const canSkip = allowSkip && status === 'jogando' && attempts >= maxAttempts;

  // --- Sinais de engajamento (ver comentário no topo do arquivo) ---
  // Date.now() não pode ser chamado direto no useRef(...) - é uma
  // função impura, e chamar ela durante o render (mesmo que só o
  // primeiro valor de um useRef seja usado depois) quebra a regra de
  // pureza do React Compiler. Por isso inicia com null e marca o
  // instante real de início dentro de um efeito, que roda só uma vez.
  const inicioRef = useRef(null);
  const trocasDeAbaRef = useRef(0);
  const tempoInativoRef = useRef(0);
  const ultimaAtividadeRef = useRef(null);
  const statusRef = useRef(status);

  useEffect(() => {
    inicioRef.current = Date.now();
    ultimaAtividadeRef.current = Date.now();
  }, []);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Precisa vir ANTES do efeito de atividade/visibilidade logo abaixo,
  // que referencia coletarSinais no cleanup (abandono) - referenciar
  // antes de declarar funciona em runtime graças ao closure (o
  // cleanup só roda no unmount, bem depois de tudo já estar
  // atribuído), mas o linter não consegue provar isso estaticamente.
  const coletarSinais = useCallback((extra = {}) => ({
    tempoRespostaMs: inicioRef.current ? Date.now() - inicioRef.current : 0,
    trocasDeAba: trocasDeAbaRef.current,
    tempoInativoMs: tempoInativoRef.current,
    abandonado: false,
    ...extra,
  }), []);

  useEffect(() => {
    const registrarAtividade = () => {
      const agora = Date.now();
      if (ultimaAtividadeRef.current === null) {
        ultimaAtividadeRef.current = agora;
        return;
      }
      const gap = agora - ultimaAtividadeRef.current;
      if (gap > LIMIAR_INATIVIDADE_MS) {
        tempoInativoRef.current += gap;
      }
      ultimaAtividadeRef.current = agora;
    };

    const registrarVisibilidade = () => {
      if (document.hidden) trocasDeAbaRef.current += 1;
    };

    const eventosDeAtividade = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    eventosDeAtividade.forEach((ev) => window.addEventListener(ev, registrarAtividade));
    document.addEventListener('visibilitychange', registrarVisibilidade);

    return () => {
      eventosDeAtividade.forEach((ev) => window.removeEventListener(ev, registrarAtividade));
      document.removeEventListener('visibilitychange', registrarVisibilidade);

      // Componente sendo desmontado ainda em jogo (trocou de etapa, saiu
      // da página) - nem acertou, nem pulou. onComplete não é o lugar
      // certo pra isso (é reservado pra conclusão de verdade), por isso
      // um callback separado.
      if (statusRef.current === 'jogando') {
        onAbandon?.(coletarSinais({ abandonado: true }));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chamada pelo jogo filho a cada tentativa do usuário.
  // meta é opcional e serve pra informação específica daquele jogo (ex:
  // qual alvo foi escolhido) - sinais de engajamento vêm à parte, em
  // result.sinais, sem o jogo precisar saber que isso existe.
  const reportResult = useCallback((success, meta) => {
    // já concluído (acertou ou pulou) - ignora tentativas fora de hora
    if (status !== 'jogando') return;

    if (success) {
      setStatus('sucesso');
      setCeciMessage(msgs.success);
      onComplete?.({ success: true, attempts, skipped: false, meta, sinais: coletarSinais() });
      return;
    }

    const proximaTentativa = attempts + 1;
    const indiceMsg = attempts % msgs.encourage.length;
    setAttempts(proximaTentativa);
    setCeciMessage(msgs.encourage[indiceMsg]);
  }, [status, attempts, msgs, onComplete, coletarSinais]);

  const handleSkip = useCallback(() => {
    setStatus('pulado');
    setCeciMessage(msgs.skipAvailable);
    onComplete?.({ success: false, attempts, skipped: true, sinais: coletarSinais() });
  }, [attempts, msgs, onComplete, coletarSinais]);

  return (
    <div className={styles.gameMoment} data-status={status}>

      {/* Aviso de transição: sinaliza que a leitura acabou e agora é ação */}
      <div className={styles.modeBanner}>
        <span className={styles.modeLabel}>Hora de praticar!</span>
      </div>

      <h2 className={styles.title}>{title}</h2>

      {status === 'jogando' && (
        <p className={styles.instructions}>{instructions}</p>
      )}

      {/* Slot do jogo de verdade - o GameMoment não sabe o que tem aqui dentro */}
      <div className={styles.gameSlot}>
        {/* eslint-disable-next-line react-hooks/refs -- reportResult só
            LÊ refs quando é de fato CHAMADO (dentro de um evento do
            jogo filho), nunca durante este render - é o padrão
            clássico de render prop. A regra do compiler não consegue
            provar isso estaticamente e trata qualquer função exposta
            aqui que toque ref em algum lugar do corpo como arriscada,
            mesmo sem ser invocada agora. */}
        {children({ reportResult, attempts, status })}
      </div>

      {/* Recadinho da Cecília - só aparece quando ela tem algo de fato a
          dizer (erro, acerto ou "pular"), pra não repetir a instrução */}
      {ceciMessage && (
        <div className={styles.ceciFeedback}>
          <div className={styles.ceciAvatar} aria-hidden>
            <img src="/mascote-ceci.png" alt="" />
          </div>
          <p className={styles.ceciMessage}>{ceciMessage}</p>
        </div>
      )}

      {/* Indicador discreto de tentativas - só aparece depois do 1º erro,
          pra não deixar a pessoa ansiosa logo de cara */}
      {attempts > 0 && status === 'jogando' && (
        <div className={styles.attemptsRow}>
          <span className={styles.attemptsText}>
            Tentativa {attempts + 1}
          </span>
          {canSkip && (
            <ButtonOutline size="small" onClick={handleSkip}>
              Pular por enquanto
            </ButtonOutline>
          )}
        </div>
      )}
    </div>
  );
}