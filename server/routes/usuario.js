const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');
const requireAuth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { criarUsuarioSchema, atualizarPerfilSchema } = require('../lib/validationSchemas');

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
    console.error('[GET /api/usuario] Erro no Supabase ao buscar dados do usuário:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar perfil do usuário.' });
  }

  res.json(data);
});

// Criar perfil na tabela usuarios após cadastro
// Ignora id e email vindos do corpo da requisição: utiliza req.user.id e req.user.email do token autenticado.
// O tipo nunca vem do cliente (default 'aluno' no banco).
router.post('/', requireAuth, validate({ body: criarUsuarioSchema }), async (req, res) => {
  const id = req.user.id;
  const email = req.user.email || req.body.email || '';
  const nome = (req.body.nome || req.user.user_metadata?.nome || 'Usuário').trim();

  const { data, error } = await supabase
      .from('usuarios')
      .upsert([{ id, nome, email }], { onConflict: 'id' })
      .select()
      .single();

  if (error) {
    console.error('[POST /api/usuario] Erro no Supabase ao criar perfil:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar perfil do usuário.' });
  }
  res.json(data);
});

// Atualizar perfil
// Permite apenas campos autorizados via allowlist (ex: 'nome').
// O id vem exclusivamente do token autenticado (req.user.id), ignorando a URL.
// Bloqueia qualquer tentativa de alteração de id, tipo, email, created_at, etc.
router.put(['/:id/perfil', '/perfil'], requireAuth, validate({ body: atualizarPerfilSchema }), async (req, res) => {
  const id = req.user.id;
  const updates = {
    nome: req.body.nome.trim(),
  };

  const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

  if (error) {
    console.error('[PUT /api/usuario/perfil] Erro no Supabase ao atualizar perfil:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar perfil do usuário.' });
  }
  res.json(data);
});

module.exports = router;