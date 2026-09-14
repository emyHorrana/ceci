require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Rota de health check - confirma que o servidor está no ar
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/licao', require('./lib/adaptive-bkt/routes/licao'));
app.use('/api/usuario',   require('./routes/usuario'));
app.use('/api/licoes',    require('./routes/licoes'));
app.use('/api/progresso', require('./routes/progresso'));
app.use('/api/conteudo',  require('./routes/conteudo'));

// Na Vercel o arquivo é importado por api/index.cjs como serverless
// function - quem escuta é a plataforma, não o app.listen daqui.
// Localmente (npm run dev) continua subindo o servidor normal.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor CECI rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;