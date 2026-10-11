const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');
const requireAuth = require('../middleware/auth');

// Buscar dados do usuário logado
// Ignora qualquer :id vindo da URL por segurança: busca sempre o perfil do usuário autenticado no token (req.user.id).
router.get(['/:id', '/'], requireAuth, async (req, res) => {
  const id = req.user.id;

  const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

  if (error) {
    // Usuário autenticado mas ainda sem linha na tabela usuarios - auto-provisiona com tipo 'aluno'
    if (error.code === 'PGRST116') {
      const nomePadrao = req.user.user_metadata?.nome || (req.user.email ? req.user.email.split('@')[0] : 'Usuário');
      const { data: criado, error: erroCriacao } = await supabase
        .from('usuarios')
        .insert([{ id, nome: nomePadrao, email: req.user.email || '', tipo: 'aluno' }])
        .select()
        .single();

      if (!erroCriacao && criado) {
        return res.json(criado);
      }

      return res.json({
        id,
        nome: nomePadrao,
        email: req.user.email || '',
        guest_mode: false,
        tipo: 'aluno',
      });
    }
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Criar perfil na tabela usuarios após cadastro
// Ignora id e email vindos do corpo da requisição: utiliza req.user.id e req.user.email do token autenticado.
// O tipo nunca vem do cliente (default 'aluno' no banco).
router.post('/', requireAuth, async (req, res) => {
  const id = req.user.id;
  const email = req.user.email || req.body.email || '';
  const nome = (req.body.nome || req.user.user_metadata?.nome || 'Usuário').trim();

  const { data, error } = await supabase
      .from('usuarios')
      .upsert([{ id, nome, email }], { onConflict: 'id' })
      .select()
      .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Atualizar perfil
// Permite apenas campos autorizados via allowlist (ex: 'nome').
// O id vem exclusivamente do token autenticado (req.user.id), ignorando a URL.
// Bloqueia qualquer tentativa de alteração de id, tipo, email, created_at, etc.
router.put(['/:id/perfil', '/perfil'], requireAuth, async (req, res) => {
  const id = req.user.id;
  const ALLOWED_FIELDS = ['nome'];
  const updates = {};

  for (const field of ALLOWED_FIELDS) {
    if (req.body[field] !== undefined) {
      updates[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      error: 'Nenhum campo permitido para alteração foi fornecido.',
    });
  }

  const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;