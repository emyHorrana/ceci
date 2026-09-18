// roles.js
// Tipos de conta do CECI: 'aluno' (padrão) e 'admin'.
//
// Contas ADM enxergam a trilha completa (todas as Unidades e todas as
// dificuldades de cadas etapa dos mini-módulos) sem bloqueio por
// pré-requisito nem por progresso - útil pra revisão de conteúdo por
// quem está construindo o curso. Em troca, ações de conta ADM não
// gravam nada no progresso do usuário nem no algoritmo adaptativo
// (ver MiniModulo.jsx), pra não distorcer os dados reais dos alunos.
//
// A definição de quem é ADM fica só no banco (tabela `usuarios`,
// coluna `tipo`) - não existe fluxo de auto-promoção nem de promoção
// via API (ver server/routes/usuario.js), só direto no Supabase.

export function isAdmin(user) {
    return user?.tipo === 'admin';
}