// Entry point da serverless function na Vercel.
// Extensão .cjs é proposital: o package.json da raiz tem "type": "module",
// então um .js aqui seria tratado como ESM e o require() abaixo quebraria.
// .cjs força CommonJS independente disso.
module.exports = require('../server/index.js');