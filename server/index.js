require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuario');
const licoesRoutes = require('./routes/licoes');
const progressoRoutes = require('./routes/progresso');
const conteudoRoutes = require('./routes/conteudo');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares - processam toda requisição antes de chegar nas rotas
app.use(cors());           // permite chamadas do React
app.use(express.json());   // entende JSON no corpo das requisições

// Rotas - cada prefixo direciona pro arquivo certo
app.use('/api/usuario', usuarioRoutes);
app.use('/api/licoes', licoesRoutes);
app.use('/api/progresso', progressoRoutes);
app.use('/api/conteudo', conteudoRoutes);

// Rota de teste - pra confirmar que o servidor está vivo
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Servidor CECI rodando em http://localhost:${PORT}`);
});