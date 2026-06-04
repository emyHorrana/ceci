require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares - processam toda requisição antes de chegar nas rotas
app.use(cors());          // permite chamadas do frontend React
app.use(express.json());  // entende JSON no corpo das requisições

// Rota de health check - confirma que o servidor está no ar
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// TODO: implementar e importar rotas conforme o banco de dados
// app.use('/api/usuario',   require('./routes/usuario'));
// app.use('/api/licoes',    require('./routes/licoes'));
// app.use('/api/progresso', require('./routes/progresso'));
// app.use('/api/conteudo',  require('./routes/conteudo'));

app.listen(PORT, () => {
  console.log(`Servidor CECI rodando em http://localhost:${PORT}`);
});