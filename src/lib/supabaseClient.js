// supabaseClient.js
// Instância única do cliente Supabase para o frontend.
// Importe este arquivo em qualquer service que precise do Supabase -
// nunca chame createClient() fora daqui.

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);