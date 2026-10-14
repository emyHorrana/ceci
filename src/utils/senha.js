// senha.js
// Regras de senha do CECI em um só lugar (usadas no Cadastro e na
// Redefinição de senha). Mantenha este mínimo igual ao configurado no
// painel do Supabase (Authentication > Sign In / Providers > Password
// > Minimum password length), que é quem de fato impõe a regra no servidor.

export const SENHA_MIN_CARACTERES = 8;
// O Supabase Auth (bcrypt) rejeita senhas acima de 72 caracteres.
export const SENHA_MAX_CARACTERES = 72;

/**
 * @param {string} senha
 * @returns {string|null} mensagem de erro amigável, ou null se a senha é válida
 */
export function validarSenha(senha) {
    if (typeof senha !== 'string' || senha.length < SENHA_MIN_CARACTERES) {
        return `A senha deve ter pelo menos ${SENHA_MIN_CARACTERES} caracteres.`;
    }
    if (senha.length > SENHA_MAX_CARACTERES) {
        return `A senha deve ter no máximo ${SENHA_MAX_CARACTERES} caracteres.`;
    }
    return null;
}