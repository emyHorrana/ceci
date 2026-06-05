// auth.js
// Serviço de autenticação do CECI usando Supabase Auth diretamente.
// Responsável por login, cadastro, logout e recuperação do usuário autenticado.
// O token de sessão é gerenciado automaticamente pelo Supabase SDK.

import { supabase } from '../lib/supabaseClient';

// Autentica o usuário com e-mail e senha.
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data.user;
}

// Cadastra um novo usuário com e-mail e senha.
// Salva o nome nos metadados do Supabase Auth.
export async function register({ nome, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } },
  });
  if (error) throw new Error(error.message);
  return data.user;
}

// Encerra a sessão do usuário atual.
export async function logout() {
  await supabase.auth.signOut();
}

// Retorna os dados do usuário atualmente autenticado (ou null se não logado).
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}