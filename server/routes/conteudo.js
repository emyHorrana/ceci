const express = require('express');
const router = express.Router();
const ai = require('../lib/geminiClient');

// Reformular explicação via Gemini
router.post('/reformular', async (req, res) => {
  const { contexto, nivel } = req.body;

  if (!contexto) return res.status(400).json({ error: 'contexto é obrigatório' });

  try {
    const prompt = `Você é a Ceci, uma professora paciente e acolhedora que ensina tecnologia para adultos iniciantes.
Reescreva a seguinte explicação de forma ainda mais simples e encorajadora, usando analogias do cotidiano.
Nível do aluno: ${nivel || 'iniciante'}.
Explicação original: ${contexto}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    res.json({ explicacao: response.text });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Erro ao gerar explicação' });
  }
});

module.exports = router;