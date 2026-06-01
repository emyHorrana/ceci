const express = require('express');
const router = express.Router();

// Salvar progresso do usuário
router.post('/', (req, res) => {
  // TODO: INSERT INTO progresso ...
  // req.body virá com: { usuarioId, licaoId, acertos, tempo }
  res.json({ success: true });
});

// Buscar progresso pra verificar se precisa de revisão
router.get('/:usuarioId', (req, res) => {
  // TODO: SELECT * FROM progresso WHERE usuario_id = req.params.usuarioId
  res.json({ licoesConcluidas: [], diasSemUso: 0 });
});

module.exports = router;