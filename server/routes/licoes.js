const express = require('express');
const router = express.Router();
const supabaseModule = require('../../supabaseClient');
const supabase = supabaseModule.supabase || supabaseModule;
const { BKTAdaptativo, FilaDePendencias, Classificador, ParametrosAdaptativos } = require('../index');
const unidades = require('../data/unidades');

router.post('/responder', async (req, res) => {
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

    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado (userId ausente).' });
    }
    if (!moduleId) {
      return res.status(400).json({ error: 'moduleId é obrigatório.' });
    }
    if (!etapaId) {
      return res.status(400).json({ error: 'etapaId é obrigatório.' });
    }
    if (correto === undefined || !dadosEvento || !tempoIdeal) {
      return res.status(400).json({ error: 'correto, dadosEvento e tempoIdeal são obrigatórios.' });
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
    res.status(500).json({ error: 'Erro ao processar resposta.' });
  }
});

/*
  Devolve o domínio (L do BKT) de TODAS as Unidades já tentadas pelo
  aluno - { 'U1.1': 0.82, 'U1.2': 0.31, ... }. Unidades nunca tentadas
  simplesmente não aparecem no objeto.

  Existia só a versão interna disso dentro do handler de
  /proxima-unidade (pra alimentar a FilaDePendencias) - esta rota
  expõe o mesmo dado pro front, que precisa da visão completa (pintar
  cada Unidade da trilha como concluída/pendente/não tentada), não só
  da próxima única recomendação.

  Também devolve `classificacaoPorUnidade` - o nível (Iniciante/
  Básico/Intermediário/Avançado) de CADA Unidade, já calculado com o
  MESMO Classificador que o backend usa no resto do algoritmo (evita
  duplicar os limiares 0.30/0.60/0.85 em JS do front, que dessincroniza
  fácil). Unidades nunca tentadas entram com o mesmo L0 padrão que o
  BKT usaria na primeira tentativa (ParametrosAdaptativos.calcularL0),
  não com um valor arbitrário escolhido só pra essa tela - garante que
  o nível mostrado ANTES de jogar bate com o que o algoritmo real
  assumiria ao processar a primeira resposta.
 */
router.get('/perfis/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: perfis, error } = await supabase
        .from('perfis_aluno')
        .select('module_id, dominio')
        .eq('user_id', userId);

    if (error) throw error;

    const dominiosPorUnidade = Object.fromEntries(
        (perfis || []).map((p) => [p.module_id, p.dominio])
    );

    const classificacaoPorUnidade = Object.fromEntries(
        unidades.map((u) => {
          const L = ParametrosAdaptativos.calcularL0(dominiosPorUnidade[u.id]);
          return [u.id, Classificador.classificar(L)];
        })
    );

    res.json({ dominiosPorUnidade, classificacaoPorUnidade, limiar: FilaDePendencias.LIMIAR_PADRAO });
  } catch (err) {
    console.error('[GET /api/licao/perfis/:userId]', err);
    res.status(500).json({ error: 'Erro ao buscar perfis do aluno.' });
  }
});

/*
  Devolve a próxima Unidade que o aluno deveria estudar: uma pendência
  (Unidade já tentada e abaixo do limiar) tem prioridade sobre a
  próxima Unidade nova da sequência - ver FilaDePendencias.js.
 */
router.get('/proxima-unidade/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

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
    console.error('[GET /api/licao/proxima-unidade/:userId]', err);
    res.status(500).json({ error: 'Erro ao calcular a próxima unidade.' });
  }
});

module.exports = router;