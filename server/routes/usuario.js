const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');

// Buscar dados do usuário logado
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

  if (error) {
    // Usuário autenticado mas ainda sem linha na tabela usuarios - retorna mínimo
    if (error.code === 'PGRST116') {
      return res.json({ id, nome: 'Usuário', email: '', guest_mode: false, tipo: 'aluno' });
    }
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Criar perfil na tabela usuarios após cadastro
// `tipo` nunca vem do corpo da requisição: toda conta nasce 'aluno'
// (default da coluna no banco, ver migração em
// server/lib/migrations/2026-09-add-tipo-usuario.sql) - promover
// alguém a ADM é uma ação manual direta no Supabase, não algo que o
// próprio cadastro possa fazer.
router.post('/', async (req, res) => {
  const { id, nome, email } = req.body;

  const { data, error } = await supabase
      .from('usuarios')
      .insert([{ id, nome, email }])
      .select()
      .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Atualizar perfil
// `tipo` é descartado aqui de propósito - essa rota é chamada pela
// própria conta editando seu perfil (ver Perfil.jsx), e não pode ser
// usada pra se auto-promover a ADM. Mudança de tipo só direto no banco.
router.put('/:id/perfil', async (req, res) => {
  const { id } = req.params;
  const { tipo, ...updates } = req.body;

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