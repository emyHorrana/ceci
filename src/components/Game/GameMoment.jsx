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
//                    { success, attempts, skipped }
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

import { useState, useCallback, useMemo } from 'react';
import styles from './GameMoment.module.css';
import { ButtonOutline } from '../Buttons/ButtonOutline';

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
  messages,
}) {
  const msgs = useMemo(() => ({ ...DEFAULT_MESSAGES, ...messages }), [messages]);

  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState('jogando'); // 'jogando' | 'sucesso' | 'pulado'
  const [ceciMessage, setCeciMessage] = useState(null);

  const canSkip = allowSkip && status === 'jogando' && attempts >= maxAttempts;

  // Chamada pelo jogo filho a cada tentativa do usuário.
  // meta é opcional e serve para o algoritmo adaptativo evoluir depois
  // (tempo de resposta, tipo de erro etc) sem mudar essa assinatura.
  const reportResult = useCallback((success, meta) => {
    // já concluído (acertou ou pulou) - ignora tentativas fora de hora
    if (status !== 'jogando') return;

    if (success) {
      setStatus('sucesso');
      setCeciMessage(msgs.success);
      onComplete?.({ success: true, attempts, skipped: false, meta });
      return;
    }

    const proximaTentativa = attempts + 1;
    const indiceMsg = attempts % msgs.encourage.length;
    setAttempts(proximaTentativa);
    setCeciMessage(msgs.encourage[indiceMsg]);
  }, [status, attempts, msgs, onComplete]);

  const handleSkip = useCallback(() => {
    setStatus('pulado');
    setCeciMessage(msgs.skipAvailable);
    onComplete?.({ success: false, attempts, skipped: true });
  }, [attempts, msgs, onComplete]);

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