const express = require('express');
const router = express.Router();

// Reformular explicação via Google API
router.post('/reformular', async (req, res) => {
  // TODO: chamar Google Gemini API com req.body.contexto
  res.json({ explicacao: "Explicação reformulada (stub)" });
});

module.exports = router;