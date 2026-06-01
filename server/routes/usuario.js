const express = require('express');
const router = express.Router();
// const supabase = require('../lib/supabaseClient'); // descomente quando Emily entregar

// Buscar dados do usuário logado
router.get('/:id', (req, res) => {
  // TODO: SELECT * FROM usuarios WHERE id = req.params.id
  res.json({ id: req.params.id, nome: "Ana (stub)", nivelAtual: 1 });
});

// Atualizar perfil de aprendizado
router.put('/:id/perfil', (req, res) => {
  // TODO: UPDATE perfil_aprendizado SET ...
  res.json({ success: true });
});

module.exports = router;