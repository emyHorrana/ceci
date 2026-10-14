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

// Envia e-mail de instruções para redefinição de senha.
// O link do e-mail leva para /redefinir-senha (onde a pessoa define a nova senha).
// Essa URL precisa estar cadastrada em Authentication > URL Configuration >
// Redirect URLs no painel do Supabase, senão o Supabase ignora o redirectTo.
export async function recuperarSenha(email) {
  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/redefinir-senha` : undefined;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) throw new Error(error.message);
  return data;
}

// Define a nova senha da sessão de recuperação ativa (aberta pelo link do e-mail).
// Depois encerra TODAS as sessões da conta (scope 'global'), para que quem
// tinha acesso com a senha antiga seja desconectado também.
export async function redefinirSenha(novaSenha) {
  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) throw new Error(error.message);
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch {
    await supabase.auth.signOut();
  }
}

// Escuta mudanças de sessão (login, logout, refresh de token, sessão
// restaurada do localStorage ao abrir/recarregar a página, etc).
// Chama callback(user) sempre que o estado de autenticação mudar.
// Retorna uma função de unsubscribe - chame ao desmontar quem escuta.
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}