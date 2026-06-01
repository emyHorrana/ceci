const express = require('express');
const router = express.Router();

// Listar lições disponíveis pro usuário
router.get('/', (req, res) => {
  // TODO: SELECT * FROM licoes WHERE desbloqueada = true
  res.json([
    { id: 1, titulo: "Introdução ao Terminal (stub)", desbloqueada: true, concluida: false }
  ]);
});

// Buscar etapas de uma lição específica
router.get('/:id/etapas', (req, res) => {
  // TODO: SELECT * FROM etapas WHERE licao_id = req.params.id ORDER BY ordem
  res.json([
    { tipo: "teoria", conteudo: "stub", ordemNaLicao: 1 }
  ]);
});

// Marcar lição como concluída
router.post('/:id/concluir', (req, res) => {
  // TODO: UPDATE licoes SET concluida = true ...
  res.json({ success: true });
});

module.exports = router;