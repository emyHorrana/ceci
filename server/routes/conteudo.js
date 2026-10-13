const express = require('express');
const router = express.Router();
const ai = require('../lib/geminiClient');
const requireAuth = require('../middleware/auth');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { buscarEtapa } = require('../lib/conteudoModulos');

// Rate limiting específico para chamadas de IA (Gemini):
// Limita a no máximo 5 requisições por minuto por usuário autenticado (ou por IP de fallback)
const reformularLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    return req.user?.id ? `user_${req.user.id}` : ipKeyGenerator(req.ip);
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Limite de solicitações de IA atingido. Aguarde 1 minuto antes de solicitar outra reformulação.',
  },
});

/**
 * Remove tags HTML simples para limpar o contexto original antes de enviar ao prompt
 */
function limparHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// POST /api/conteudo/reformular
// Reformula a explicação de uma etapa com analogias do cotidiano e tom acolhedor da Ceci.
// Exige autenticação (requireAuth) e limita chamadas por usuário (reformularLimiter),
// buscando o conteúdo estático no servidor para impedir manipulações e custos descontrolados.
router.post('/reformular', requireAuth, reformularLimiter, async (req, res) => {

  const { miniModuloId, etapaIndice, etapaId, moduleId, nivel, motivo } = req.body;

  // Busca o conteúdo seguro e auditado diretamente do servidor
  const etapaInfo = buscarEtapa({
    miniModuloId: miniModuloId || moduleId,
    etapaIndice,
    etapaId,
  });

  if (!etapaInfo || !etapaInfo.conteudo) {
    return res.status(400).json({
      error: 'Etapa não encontrada no currículo oficial. Informe miniModuloId e etapaIndice válidos.',
    });
  }

  const contextoLimpo = limparHtml(etapaInfo.conteudo);
  const nivelAluno = nivel || 'Iniciante';
  const tituloEtapa = etapaInfo.titulo;

  try {
    const prompt = `Você é a Ceci, uma professora virtual calorosa, paciente e encorajadora da plataforma CECI, voltada para inclusão digital de adultos e pessoas idosas que estão tendo o primeiro contato com computadores.

O aluno está estudando o tópico: "${tituloEtapa}".
Nível de domínio atual do aluno: ${nivelAluno}.
${
  motivo === 'reforco'
    ? 'Contexto: O aluno sentiu dificuldade na prática ou no desafio anterior e precisa de uma explicação reconfortante com um novo ângulo para fixar o conteúdo.'
    : 'Contexto: O aluno solicitou uma explicação alternativa para entender melhor o conceito.'
}

Explicação original do curso:
"""
${contextoLimpo}
"""

Instruções para a sua resposta:
1. Comece com uma saudação breve, afetuosa e empática (ex: "Sem pressa, vamos olhar para isso de um jeito diferente!", "Com calma a gente aprende tudo, veja só:").
2. Explique o conceito usando uma analogia simples e tangível do cotidiano (ex: eletrodomésticos, controle remoto da TV, trânsito, máquina de lavar, tarefas manuais ou compras).
3. Seja concisa, clara e acolhedora (máximo 2 a 3 parágrafos curtos).
4. Termine com uma frase curta de incentivo e carinho.
5. Formate o texto usando HTML simples (<p>, <strong> para termos-chave). NÃO inclua blocos de código com crases (\`\`\`html), nem tags <script>, <img>, <iframe> ou tags estruturais <html>/<body>.`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    let explicacaoGerada = response.text || '';

    // Limpa eventuais blocos de código markdown que o modelo possa ter colocado
    explicacaoGerada = explicacaoGerada
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();

    res.json({
      success: true,
      explicacao: explicacaoGerada,
      titulo: tituloEtapa,
      nivel: nivelAluno,
    });
  } catch (err) {
    console.error('[POST /api/conteudo/reformular] Erro na API do Gemini:', err);
    res.status(500).json({
      error: 'Não foi possível gerar a explicação personalizada no momento.',
      detalhes: err.message,
    });
  }
});

module.exports = router;