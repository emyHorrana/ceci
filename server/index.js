require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de health check - confirma que o servidor está no ar
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/licao', require('./routes/licao'));
app.use('/api/usuario',   require('./routes/usuario'));
app.use('/api/licoes',    require('./routes/licoes'));
app.use('/api/progresso', require('./routes/progresso'));
app.use('/api/conteudo',  require('./routes/conteudo'));

app.listen(PORT, () => {
  console.log(`Servidor CECI rodando em http://localhost:${PORT}`);
});