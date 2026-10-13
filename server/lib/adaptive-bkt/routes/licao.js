const express = require('express');
const router = express.Router();
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const supabaseModule = require('../../supabaseClient');
const supabase = supabaseModule.supabase || supabaseModule;
const { BKTAdaptativo, FilaDePendencias, Classificador, Recomendacao } = require('../index');
const unidades = require('../data/unidades');
const requireAuth = require('../../../middleware/auth');
const { validate } = require('../../../middleware/validate');
const { responderLicaoSchema, simularLicaoSchema } = require('../../validationSchemas');

// Rate limiting específico para envio de respostas no algoritmo adaptativo
// Limita a no máximo 30 respostas por minuto por usuário autenticado (ou por IP de fallback)
// para impedir robôs ou loops de script de forjarem progresso em massa.
const responderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: (req) => {
    return req.user?.id ? `user_responder_${req.user.id}` : ipKeyGenerator(req.ip);
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Muitas respostas enviadas em curto intervalo. Aguarde alguns instantes antes de enviar novamente.',
  },
});

// Rate limiting específico por IP para a rota pública de simulação (/api/licao/simular)
// Usado no onboarding (/boas-vindas) antes da criação de conta.
// Limita a 30 requisições por minuto por IP para proteger os cálculos do BKT contra DoS/abuso.
const simularLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Muitas simulações solicitadas em curto intervalo. Aguarde um minuto antes de tentar novamente.',
  },
});

router.post('/responder', requireAuth, responderLimiter, validate({ body: responderLicaoSchema }), async (req, res) => {
  try {
    const {
      correto,
      dadosEvento,
      tempoIdeal,
      tentativas,
      tentativasAposErro,
      moduleId,
      etapaId,
      biasModulo,
    } = req.body;

    // Usa req.user.id do token autenticado, ignorando qualquer userId do body
    const userId = req.user.id;

    // --- PROTEÇÕES ANTI-FORJAMENTO DE PROGRESSO (ANTI-CHEAT) ---

    // 1. Limiar fisiológico mínimo de reação humana
    // Um aluno humano genuíno precisa ver, ler o enunciado e realizar uma ação motora na tela.
    // Acertos com tempo de resposta menor que 250ms são fisiologicamente impossíveis e indicam manipulação/bot.
    if (correto === true && !dadosEvento.abandonado && dadosEvento.tempoResposta < 250) {
      return res.status(400).json({
        error: 'Tempo de resposta inverossímil (abaixo do limiar fisiológico humano plausível).',
      });
    }

    // 2. Coerência entre tempo inativo e tempo total da questão
    // O tempo inativo não pode exceder a duração total da resposta.
    if (dadosEvento.tempoInativo > (dadosEvento.tempoResposta / 1000) + 0.5) {
      return res.status(400).json({
        error: 'Tempo inativo registrado não pode ser maior que o tempo total da resposta.',
      });
    }

    // 3. Coerência nas tentativas
    // Se acertou, o total de tentativas deve ser maior que tentativas após erro.
    if (correto === true && tentativasAposErro >= tentativas) {
      return res.status(400).json({
        error: 'Incoerência nas tentativas registradas.',
      });
    }
    if (correto === false && tentativasAposErro > tentativas) {
      return res.status(400).json({
        error: 'Incoerência nas tentativas registradas.',
      });
    }

    // 4. Validação curricular do módulo e etapa
    const unidadeValida = unidades.find((u) => u.id === moduleId);
    if (!unidadeValida) {
      return res.status(400).json({ error: 'Módulo não reconhecido no currículo oficial.' });
    }

    const isCheckpoint = etapaId === `${moduleId}#checkpoint`;
    const isOnboarding = (etapaId.startsWith('boas-vindas#') || etapaId.startsWith('boas-vindas-verificacao#')) && unidadeValida.tier === 0;
    const [miniModChave] = etapaId.split('#');
    const isMiniModulo = (unidadeValida.miniModulos || []).includes(miniModChave);

    if (!isCheckpoint && !isOnboarding && !isMiniModulo) {
      return res.status(400).json({ error: 'A etapa informada não pertence ao módulo especificado.' });
    }

    // 5. Verificação de integridade de pré-requisitos (impede saltar direto para unidades avançadas)
    if (unidadeValida.prerequisitos && unidadeValida.prerequisitos.length > 0) {
      const { data: prereqPerfis, error: errPrereq } = await supabase
        .from('perfis_aluno')
        .select('module_id, dominio')
        .eq('user_id', userId)
        .in('module_id', unidadeValida.prerequisitos);

      if (errPrereq) {
        console.error('[POST /api/licao/responder] Erro no Supabase ao verificar pré-requisitos:', errPrereq);
        return res.status(500).json({ error: 'Erro interno ao validar pré-requisitos do módulo.' });
      }

      const modulosTentados = new Set((prereqPerfis || []).map((p) => p.module_id));
      const faltamPrereqs = unidadeValida.prerequisitos.some((pId) => !modulosTentados.has(pId));
      if (faltamPrereqs) {
        return res.status(403).json({
          error: 'Módulo bloqueado. Conclua os módulos pré-requisitos antes de registrar progresso.',
        });
      }
    }

    const bkt = new BKTAdaptativo({ supabase, userId, moduleId });
    await bkt.iniciar();

    const resultado = await bkt.finalizarQuestao({
      correto,
      dadosEvento,
      tempoIdeal,
      tentativas,
      tentativasAposErro,
      biasModulo,
      etapaId,
    });

    res.json(resultado);
  } catch (err) {
    console.error('[POST /api/licao/responder]', err);
    res.status(500).json({ error: 'Erro ao processar resposta da lição.' });
  }
});

/*
  Calcula (sem persistir nada, sem exigir userId/moduleId) o score
  adaptativo de uma resposta - o mesmo núcleo puro que /responder usa,
  só que recebendo o histórico (dominioAnterior/biasAluno/
  questoesAnteriores) direto no corpo da requisição em vez de carregar
  de `perfis_aluno`. Existe pro onboarding (/boas-vindas): antes da
  conta existir, ainda queremos saber "quanto seria o domínio até
  agora" com o cálculo de verdade (incluindo o teto pra sinais fáceis
  do onboarding, se `etapaId` indicar isso - ver TETO_DOMINIO_ONBOARDING
  em BKTAdaptativo.js), em vez de confiar cegamente numa autodeclaração
  "já sei usar mouse/teclado" - ver BoasVindas.jsx.
 */
router.post('/simular', simularLimiter, validate({ body: simularLicaoSchema }), (req, res) => {
  try {
    const {
      correto,
      dadosEvento,
      tempoIdeal,
      tentativas,
      tentativasAposErro,
      biasModulo,
      biasAluno,
      dominioAnterior,
      questoesAnteriores,
      etapaId,
    } = req.body;

    const resultado = BKTAdaptativo.calcular({
      correto,
      dadosEvento,
      tempoIdeal,
      tentativas,
      tentativasAposErro,
      biasModulo,
      biasAluno,
      dominioAnterior,
      questoesAnteriores,
      etapaId,
    });

    res.json({ ...resultado, limiar: FilaDePendencias.LIMIAR_PADRAO });
  } catch (err) {
    console.error('[POST /api/licao/simular]', err);
    res.status(500).json({ error: 'Erro ao simular questão da lição.' });
  }
});

/*
  Devolve o domínio (L do BKT) e a classificação categórica (Iniciante/Básico/Intermediário/Avançado)
  de TODAS as Unidades já tentadas pelo aluno autenticado.
  Ignora :userId da URL e busca estritamente os dados de req.user.id.
 */
router.get(['/perfis/:userId', '/perfis'], requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: perfis, error } = await supabase
      .from('perfis_aluno')
      .select('module_id, dominio, questoes')
      .eq('user_id', userId);

    if (error) throw error;

    const dominiosPorUnidade = Object.fromEntries(
      (perfis || []).map((p) => [p.module_id, p.dominio])
    );

    const classificacaoPorUnidade = Object.fromEntries(
      (perfis || []).map((p) => [p.module_id, Classificador.classificar(p.dominio, p.questoes)])
    );

    // Recomendação pedagógica por Unidade (frase acionável, não só o
    // nível) - usada no card "Seu progresso" do Dashboard. Antes esse
    // texto só era calculado em /responder e nunca chegava a aparecer
    // em nenhuma tela - ver comentário em Recomendacao.js.
    const recomendacaoPorUnidade = Object.fromEntries(
      Object.entries(classificacaoPorUnidade).map(([moduleId, nivel]) => [
        moduleId,
        Recomendacao.recomendar(nivel),
      ])
    );

    // `atividade_usuario` não guarda module_id, só etapa_id - então pra
    // saber SE uma Unidade foi feita de verdade (mini-módulo/checkpoint)
    // ou só confirmada pelo desafio de verificação do onboarding
    // (etapaId "boas-vindas..."), precisamos casar o etapaId com o
    // currículo: "1-1#..." -> miniModuloId "1-1" -> Unidade dona dele;
    // "U1.1#checkpoint" -> a própria chave já é o id da Unidade.
    const { data: atividades, error: erroAtividades } = await supabase
      .from('atividade_usuario')
      .select('etapa_id')
      .eq('usuario_id', userId);

    if (erroAtividades) throw erroAtividades;

    const miniModuloParaUnidade = {};
    unidades.forEach((u) => {
      (u.miniModulos || []).forEach((mmId) => {
        miniModuloParaUnidade[mmId] = u.id;
      });
    });

    const unidadesPorId = new Set(unidades.map((u) => u.id));
    const unidadesComAtividadeReal = new Set();
    const miniModulosComAtividade = new Set();

    (atividades || []).forEach(({ etapa_id: etapaId }) => {
      if (!etapaId || etapaId.startsWith('boas-vindas')) return;
      const [chave] = etapaId.split('#');
      if (miniModuloParaUnidade[chave]) {
        unidadesComAtividadeReal.add(miniModuloParaUnidade[chave]);
        miniModulosComAtividade.add(chave);
      } else if (unidadesPorId.has(chave)) {
        unidadesComAtividadeReal.add(chave);
      }
    });

    // 'licao' = fez de verdade (mini-módulo e/ou checkpoint); 'onboarding'
    // = o domínio salvo veio só do desafio de verificação (ver
    // BoasVindas.jsx) - a pessoa nunca abriu essa Unidade de verdade.
    const origemPorUnidade = Object.fromEntries(
      Object.keys(dominiosPorUnidade).map((id) => [
        id,
        unidadesComAtividadeReal.has(id) ? 'licao' : 'onboarding',
      ])
    );

    res.json({
      dominiosPorUnidade,
      classificacaoPorUnidade,
      recomendacaoPorUnidade,
      origemPorUnidade,
      miniModulosComAtividade: Array.from(miniModulosComAtividade),
      limiar: FilaDePendencias.LIMIAR_PADRAO,
    });
  } catch (err) {
    console.error('[GET /api/licao/perfis]', err);
    res.status(500).json({ error: 'Erro ao buscar perfis do aluno.' });
  }
});

/*
  Devolve a próxima Unidade que o aluno deveria estudar: uma pendência
  (Unidade já tentada e abaixo do limiar) tem prioridade sobre a
  próxima Unidade nova da sequência - ver FilaDePendencias.js.
  Ignora :userId da URL e calcula estritamente para o req.user.id autenticado.
 */
router.get(['/proxima-unidade/:userId', '/proxima-unidade'], requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: perfis, error } = await supabase
      .from('perfis_aluno')
      .select('module_id, dominio')
      .eq('user_id', userId);

    if (error) throw error;

    const dominiosPorUnidade = Object.fromEntries(
      (perfis || []).map((p) => [p.module_id, p.dominio])
    );

    const proxima = FilaDePendencias.decidirProximaUnidade(unidades, dominiosPorUnidade);

    if (!proxima) {
      return res.json({ unidade: null, motivo: null, mensagem: 'Nada pendente - currículo concluído.' });
    }

    res.json(proxima);
  } catch (err) {
    console.error('[GET /api/licao/proxima-unidade]', err);
    res.status(500).json({ error: 'Erro ao calcular a próxima unidade.' });
  }
});

module.exports = router;