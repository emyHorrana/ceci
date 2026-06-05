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
      return res.json({ id, nome: 'Usuário', email: '', guest_mode: false });
    }
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Criar perfil na tabela usuarios após cadastro
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
router.put('/:id/perfil', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

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