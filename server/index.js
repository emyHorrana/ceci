require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const app = express();

// Habilita trust proxy para ler IP correto atrás de proxies reversos (Vercel, Nginx)
app.set('trust proxy', 1);

// 1. Headers de segurança com Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// 2. CORS restrito: só o domínio oficial, o deploy atual da Vercel e localhost em dev.
// Não há mais curinga *.vercel.app (isso liberava qualquer projeto de qualquer pessoa).
//  - CLIENT_URL / FRONTEND_URL: domínio de produção (ex: https://ceci.vercel.app ou domínio próprio)
//  - VERCEL_URL, VERCEL_BRANCH_URL, VERCEL_PROJECT_PRODUCTION_URL: variáveis de sistema que a
//    própria Vercel injeta (sem protocolo) - cobrem produção e previews DESTE projeto.
const normalizarOrigem = (valor) => {
  if (!valor) return null;
  const semBarra = String(valor).trim().replace(/\/+$/, '');
  return /^https?:\/\//.test(semBarra) ? semBarra : `https://${semBarra}`;
};

const allowedOrigins = new Set(
    [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CLIENT_URL,
      process.env.FRONTEND_URL,
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ]
        .map(normalizarOrigem)
        .filter(Boolean)
);

const corsOptions = {
  origin: function (origin, callback) {
    // Requisições sem Origin (curl, health checks, server-to-server) não são navegador: seguem.
    if (!origin) return callback(null, true);
    if (
        allowedOrigins.has(origin) ||
        (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:'))
    ) {
      return callback(null, true);
    }
    return callback(new Error('Origem não permitida pela política de CORS.'));
  },
  // A autenticação é por Bearer token no header, não por cookie: não precisa de credentials.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// 3. Limite de tamanho de body reduzido (10kb) para mitigar DoS/Payload excessivo
app.use(express.json({ limit: '10kb' }));

// 4. Rate limiting global para a API (mitigação de brute-force e DoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // máx 300 requisições por IP a cada 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' },
});

app.use('/api', apiLimiter);

// Rota de health check - confirma que o servidor está no ar
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/licao',     require('./lib/adaptive-bkt/routes/licao'));
app.use('/api/usuario',   require('./routes/usuario'));
app.use('/api/licoes',    require('./routes/licoes'));
app.use('/api/progresso', require('./routes/progresso'));
app.use('/api/conteudo',  require('./routes/conteudo'));

// 404 para rotas de API não reconhecidas
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Rota da API não encontrada.' });
});

// 5. Middleware global de tratamento de erros
// Captura erros de parsing de JSON, CORS e exceções não tratadas, impedindo vazamento de stack traces e detalhes internos.
app.use((err, req, res, next) => {
  console.error('[Servidor CECI - Erro Global]', err);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Formato JSON inválido no corpo da requisição.' });
  }

  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: 'Erro interno do servidor. Tente novamente mais tarde.',
  });
});

// Na Vercel o arquivo é importado por api/index.js como serverless
// function - quem escuta é a plataforma, não o app.listen daqui.
// Localmente (npm run dev) continua subindo o servidor normal.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor CECI rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;