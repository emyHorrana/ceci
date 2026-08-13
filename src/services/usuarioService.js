// usuarioService.js
// Serviço do perfil complementar do usuário, na tabela `usuarios`
// (nome, e-mail, guest_mode) - separada do login/senha, que o Supabase
// Auth já cuida sozinho (ver services/auth.js).

import apiClient from './api';

// Cria a linha em `usuarios` logo depois do cadastro (POST /api/usuario,
// ver server/routes/usuario.js) - sem isso, a conta existe pro login mas
// fica sem perfil (nome, etc) pro resto do app usar.
export async function criarUsuario({ id, nome, email }) {
  return await apiClient.post('/usuario', { id, nome, email });
}
