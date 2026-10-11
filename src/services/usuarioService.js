// usuarioService.js
// Serviço do perfil complementar do usuário, na tabela `usuarios`
// (nome, e-mail, guest_mode) - gerenciado via backend autenticado.

import apiClient from './api';
import { supabase } from '../lib/supabaseClient';

// Cria a linha em `usuarios` logo depois do cadastro (POST /api/usuario).
// O backend agora valida o token JWT e usa o ID/email da sessão autenticada.
export async function criarUsuario({ id, nome, email }) {
  return await apiClient.post('/usuario', { id, nome, email });
}

// Busca o perfil do usuário logado via backend autenticado (GET /api/usuario/:id).
// Se o backend estiver indisponível, faz fallback consultando o Supabase diretamente.
export async function getUsuario(id) {
  if (!id) return null;
  try {
    return await apiClient.get(`/usuario/${id}`);
  } catch (apiErr) {
    console.warn('Falha ao buscar perfil via API, usando fallback do Supabase SDK:', apiErr);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Erro ao buscar perfil do usuário no Supabase:', err);
      return null;
    }
  }
}

// Atualiza o perfil na tabela `usuarios` (PUT /api/usuario/:id/perfil).
// O backend aplica allowlist garantindo que apenas campos permitidos (nome) sejam alterados.
export async function atualizarUsuario(id, updates) {
  return await apiClient.put(`/usuario/${id}/perfil`, updates);
}
