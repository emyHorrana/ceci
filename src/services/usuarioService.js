// usuarioService.js
// Serviço do perfil complementar do usuário, na tabela `usuarios`
// (nome, e-mail, guest_mode) - separada do login/senha, que o Supabase
// Auth já cuida sozinho (ver services/auth.js).

import apiClient from './api';

import { supabase } from '../lib/supabaseClient';

// Cria a linha em `usuarios` logo depois do cadastro (POST /api/usuario,
// ver server/routes/usuario.js) - sem isso, a conta existe pro login mas
// fica sem perfil (nome, etc) pro resto do app usar.
export async function criarUsuario({ id, nome, email }) {
  return await apiClient.post('/usuario', { id, nome, email });
}

// Busca o perfil do usuário diretamente na tabela `usuarios`
export async function getUsuario(id) {
  if (!id) return null;
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Erro ao buscar perfil do usuário:', err);
    return null;
  }
}

// Atualiza nome/e-mail/etc na tabela `usuarios` (PUT /api/usuario/:id/perfil,
// rota que já existia no backend mas nunca era chamada por ninguém).
export async function atualizarUsuario(id, updates) {
  return await apiClient.put(`/usuario/${id}/perfil`, updates);
}
