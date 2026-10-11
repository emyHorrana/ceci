const supabase = require('../lib/supabaseClient');

/**
 * Middleware de autenticação que valida o JWT emitido pelo Supabase Auth.
 * Lê o header `Authorization: Bearer <access_token>`, valida via
 * `supabase.auth.getUser(token)` e anexa o usuário autenticado em `req.user`.
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de autenticação não fornecido ou em formato inválido.',
      });
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token) {
      return res.status(401).json({
        error: 'Token de autenticação ausente.',
      });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        error: 'Token inválido ou expirado. Faça login novamente.',
      });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('[requireAuth] Erro inesperado ao validar token:', err);
    return res.status(401).json({
      error: 'Falha ao autenticar requisição.',
    });
  }
}

module.exports = requireAuth;
