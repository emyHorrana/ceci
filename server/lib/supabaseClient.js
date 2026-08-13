const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Usa a service_role key, não a anon key: este código roda só no
// servidor (nunca é exposto ao navegador), e precisa ignorar RLS pra
// gravar em tabelas como usuarios/perfis_aluno/atividade_usuario -
// com a anon key, qualquer insert/update aqui é bloqueado a menos que
// existam policies de RLS liberando explicitamente ("new row violates
// row-level security policy").
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;