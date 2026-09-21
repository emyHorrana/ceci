// seedContasDemo.mjs
// Popula o histórico do algoritmo adaptativo (perfis_aluno) pra cada
// conta demo ANTES da apresentação, chamando direto o endpoint que o
// próprio app usa (POST /api/licao/responder - ver
// server/lib/adaptive-bkt/routes/licao.js). Isso evita ter que clicar
// manualmente em cada jogo, várias vezes, pra cada conta, só pra
// levar o domínio (L) até uma faixa de classificação interessante.
//
// COMO USAR
// 1. Suba o backend normalmente (cd server && npm start).
// 2. Crie as 5 contas no app (cadastro normal, como 'aluno').
// 3. Pegue o `id` (uuid) de cada uma na tabela `usuarios` do Supabase
//    e cole no campo `userId` abaixo, no lugar de 'PREENCHER_...'.
// 4. Rode: node seedContasDemo.mjs
//    (usa fetch nativo do Node - precisa Node 18+)
//
// O QUE ISSO NÃO FAZ: não mexe em etapasCompletas nem no localStorage
// do navegador (isso é só client-side) - então ao entrar com a conta,
// a trilha (Dashboard) já vai mostrar o status correto pintado (pega
// de /api/licao/perfis/:userId), mas se a pessoa abrir um mini-módulo
// específico da Unidade que não estiver no localStorage, o app vai
// tratar como não iniciado ali dentro. Pra demo, o que importa é a
// trilha (GameTrilha) e o nível/dificuldade das etapas em
// MiniModulo.jsx - os dois já lêem do backend.
//
// AJUSTADO (revisão): o etapaId original era "seed#<moduleId>#<i>" -
// isso NÃO batia com a heurística que o app usa pra saber se uma
// Unidade foi "feita de verdade" (server/lib/adaptive-bkt/routes/
// licao.js, rota /perfis/:userId, campo origemPorUnidade): ela olha
// o PRIMEIRO pedaço do etapaId (antes do #) e espera OU um miniModuloId
// real (ex: "1-1") OU o próprio id da Unidade (ex: "U1.1", pro
// checkpoint). Com "seed#..." o primeiro pedaço vira literalmente
// "seed", que não bate com nada - as 5 contas ficariam marcadas como
// "confirmado só no diagnóstico" e sumiriam da trilha (GameTrilha.jsx
// filtra isso), aparecendo só em Módulos com aviso. Trocado pra
// "<moduleId>#checkpoint-<i>", que o app reconhece como o desafio de
// fim de Unidade sendo respondido de verdade.

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

// moduleId sem pré-requisito, ótimo pra semear: U1.1 - Fundamentos do
// mouse (ver src/data/unidades.js). Se quiser pintar mais da trilha
// de uma vez, duplique o bloco de uma conta trocando moduleId pra
// 'U1.2', 'U1.3' etc (repare que aí precisa que U1.1 já esteja acima
// do limiar de 0.5, senão U1.2 continua bloqueada na trilha).
const MODULE_ID_PADRAO = 'U1.1';
const TEMPO_IDEAL_MS = 5000; // ver src/utils/jogoTempoIdeal.js (padrão do quiz)

// Cada item de `respostas` = uma "rodada" simulada, na ordem em que é
// enviada (a última rodada é a que fica mais perto do estado "atual"
// visto na trilha). tempoInativo é em segundos, os demais tempos em ms.
const CONTAS = [
  {
    label: 'Ana Avançada',
    email: 'emilyhlrarmando+demo.avancado@gmail.com',
    userId: '673b47f3-4f7c-44b7-9a7d-125d6dcb3f13',
    moduleId: MODULE_ID_PADRAO,
    respostas: Array.from({ length: 5 }, () => ({
      correto: true,
      tempoResposta: 3000, tempoInativo: 0, trocasDeAba: 0, abandonado: false,
      tentativas: 1, tentativasAposErro: 0,
    })),
  },
  {
    label: 'Diego Iniciante',
    email: 'emilyhlrarmando+demo.iniciante@gmail.com',
    userId: '2bd17a9c-22cd-4702-8e9d-c2c72de94bbb',
    moduleId: MODULE_ID_PADRAO,
    respostas: [
      { correto: false, tempoResposta: 13000, tempoInativo: 12, trocasDeAba: 2, abandonado: true, tentativas: 1, tentativasAposErro: 0 },
      { correto: false, tempoResposta: 14000, tempoInativo: 10, trocasDeAba: 3, abandonado: false, tentativas: 1, tentativasAposErro: 0 },
      { correto: false, tempoResposta: 15000, tempoInativo: 8, trocasDeAba: 1, abandonado: true, tentativas: 1, tentativasAposErro: 0 },
      { correto: false, tempoResposta: 12000, tempoInativo: 9, trocasDeAba: 2, abandonado: false, tentativas: 1, tentativasAposErro: 0 },
    ],
  },
  {
    label: 'Marcos Consistente',
    email: 'emilyhlrarmando+demo.mediano@gmail.com',
    userId: 'a19668c0-7836-4fee-ada1-f3e82fa28753',
    moduleId: MODULE_ID_PADRAO,
    respostas: [
      { correto: true,  tempoResposta: 5500, tempoInativo: 1, trocasDeAba: 1, abandonado: false, tentativas: 1, tentativasAposErro: 0 },
      { correto: false, tempoResposta: 6500, tempoInativo: 2, trocasDeAba: 1, abandonado: false, tentativas: 1, tentativasAposErro: 0 },
      // tentativasAposErro <= tentativas - 1 (não dá pra ter mais
      // tentativas-depois-de-erro do que tentativas no total): errou
      // 1x, tentou de novo e acertou = 2 tentativas, 1 depois do erro.
      { correto: true,  tempoResposta: 5800, tempoInativo: 1, trocasDeAba: 0, abandonado: false, tentativas: 2, tentativasAposErro: 1 },
      { correto: true,  tempoResposta: 5200, tempoInativo: 0, trocasDeAba: 0, abandonado: false, tentativas: 1, tentativasAposErro: 0 },
    ],
  },
  {
    label: 'Duda Distraída',
    email: 'emilyhlrarmando+demo.distraida@gmail.com',
    userId: '4ed91f79-f28e-405e-856c-ae55700eacf4',
    moduleId: MODULE_ID_PADRAO,
    // Acerta quase tudo, mas troca de aba e fica inativa o tempo
    // todo - mostra o foco derrubando o score mesmo com acerto.
    respostas: Array.from({ length: 4 }, () => ({
      correto: true,
      tempoResposta: 5500, tempoInativo: 15, trocasDeAba: 4, abandonado: false,
      tentativas: 1, tentativasAposErro: 0,
    })),
  },
  {
    label: 'Eli em Evolução',
    email: 'emilyhlrarmando+demo.evolucao@gmail.com',
    userId: '8992795e-b82f-4cee-be87-48334df63f7b',
    moduleId: MODULE_ID_PADRAO,
    // Só semeia a PRIMEIRA metade (começa devagar e errando) - a
    // "virada" fica pra fazer AO VIVO na apresentação, respondendo
    // certo e rápido pra mostrar o nível mudando na hora dentro do
    // MiniModulo (handleGameComplete recalcula etapas nível na mesma
    // sessão, sem precisar sair e voltar).
    respostas: [
      { correto: false, tempoResposta: 12000, tempoInativo: 6, trocasDeAba: 1, abandonado: false, tentativas: 1, tentativasAposErro: 0 },
      { correto: false, tempoResposta: 11000, tempoInativo: 5, trocasDeAba: 1, abandonado: false, tentativas: 1, tentativasAposErro: 0 },
    ],
  },
];

async function enviarResposta(conta, resposta, indice) {
  const body = {
    userId: conta.userId,
    moduleId: conta.moduleId,
    // ver nota "AJUSTADO" no topo do arquivo - precisa bater com o
    // formato que origemPorUnidade reconhece como "feito de verdade".
    etapaId: `${conta.moduleId}#checkpoint-${indice}`,
    correto: resposta.correto,
    dadosEvento: {
      tempoResposta: resposta.tempoResposta,
      trocasDeAba: resposta.trocasDeAba,
      tempoInativo: resposta.tempoInativo,
      abandonado: resposta.abandonado,
    },
    tempoIdeal: TEMPO_IDEAL_MS,
    tentativas: resposta.tentativas,
    tentativasAposErro: resposta.tentativasAposErro,
  };

  const res = await fetch(`${API_BASE_URL}/licao/responder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const texto = await res.text();
    throw new Error(`HTTP ${res.status}: ${texto}`);
  }

  return res.json();
}

async function main() {
  for (const conta of CONTAS) {
    if (conta.userId.startsWith('PREENCHER')) {
      console.warn(`⚠️  Pulando "${conta.label}" - userId ainda não preenchido.`);
      continue;
    }

    console.log(`\n▶ ${conta.label} (${conta.moduleId})`);
    let ultimoResultado = null;

    for (let i = 0; i < conta.respostas.length; i++) {
      ultimoResultado = await enviarResposta(conta, conta.respostas[i], i);
      console.log(
        `  resposta ${i + 1}/${conta.respostas.length} -> ` +
        `dominio=${ultimoResultado.dominio.toFixed(2)} nivel=${ultimoResultado.nivel}`
      );
    }

    if (ultimoResultado) {
      console.log(`  ✅ estado final: ${ultimoResultado.nivel} (L=${ultimoResultado.dominio.toFixed(2)})`);
    }
  }
}

main().catch((err) => {
  console.error('Erro ao semear contas demo:', err);
  process.exit(1);
});
