// server/middleware/validate.js
// Middleware genérico de validação de schemas Zod para Express.
// Garante validação de tipos, tamanhos e limites antes de qualquer rota processar dados,
// retornando respostas de erro claras e amigáveis sem vazar detalhes internos.

/**
 * Cria um middleware do Express para validar body, query e/ou params com Zod.
 *
 * @param {Object} schemas
 * @param {import('zod').ZodSchema} [schemas.body] - Schema Zod para validar req.body
 * @param {import('zod').ZodSchema} [schemas.query] - Schema Zod para validar req.query
 * @param {import('zod').ZodSchema} [schemas.params] - Schema Zod para validar req.params
 * @returns {import('express').RequestHandler}
 */
function validate({ body, query, params } = {}) {
  return (req, res, next) => {
    try {
      if (body) {
        const parsed = body.safeParse(req.body);
        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0];
          const mensagemAmigavel = firstIssue?.message || 'Dados no corpo da requisição inválidos.';
          return res.status(400).json({
            error: 'Dados de entrada inválidos.',
            mensagem: mensagemAmigavel,
            campos: parsed.error.issues.map((issue) => ({
              campo: issue.path.join('.'),
              mensagem: issue.message,
            })),
          });
        }
        req.body = parsed.data;
      }

      if (query) {
        const parsed = query.safeParse(req.query);
        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0];
          return res.status(400).json({
            error: 'Parâmetros de consulta (query) inválidos.',
            mensagem: firstIssue?.message || 'Parâmetros de busca inválidos.',
            campos: parsed.error.issues.map((issue) => ({
              campo: issue.path.join('.'),
              mensagem: issue.message,
            })),
          });
        }
        req.query = parsed.data;
      }

      if (params) {
        const parsed = params.safeParse(req.params);
        if (!parsed.success) {
          const firstIssue = parsed.error.issues[0];
          return res.status(400).json({
            error: 'Parâmetros de rota (URL) inválidos.',
            mensagem: firstIssue?.message || 'Parâmetro de URL inválido.',
            campos: parsed.error.issues.map((issue) => ({
              campo: issue.path.join('.'),
              mensagem: issue.message,
            })),
          });
        }
        req.params = parsed.data;
      }

      next();
    } catch (err) {
      console.error('[validate middleware] Erro inesperado ao validar requisição:', err);
      return res.status(400).json({ error: 'Erro ao validar dados da requisição.' });
    }
  };
}

module.exports = {
  validate,
};
