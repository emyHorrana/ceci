// server/lib/validationSchemas.js
// Esquemas de validação de dados da API CECI utilizando Zod.
// Centraliza regras de tipos, limites de tamanho e sanitização contra valores maliciosos.

const { z } = require('zod');

// ==========================================
// 1. Progresso e Conquistas (/api/progresso)
// ==========================================

const salvarProgressoSchema = z.object({
  licao_id: z
    .string({ required_error: 'licao_id é obrigatório.' })
    .trim()
    .min(1, 'licao_id não pode ser vazio.')
    .max(100, 'licao_id muito longo.'),
  progress: z
    .number({ invalid_type_error: 'progress deve ser um número.' })
    .min(0, 'progress não pode ser negativo.')
    .max(100, 'progress não pode ser maior que 100.')
    .default(0),
  completed: z
    .boolean({ invalid_type_error: 'completed deve ser booleano.' })
    .optional()
    .default(false),
});

const salvarConquistaSchema = z.object({
  title: z
    .string({ required_error: 'title é obrigatório.' })
    .trim()
    .min(1, 'title não pode ser vazio.')
    .max(150, 'title muito longo.'),
});

// ==========================================
// 2. Usuário (/api/usuario)
// ==========================================

const criarUsuarioSchema = z.object({
  nome: z
    .string()
    .trim()
    .max(100, 'Nome muito longo.')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Formato de email inválido.')
    .max(255, 'Email muito longo.')
    .optional()
    .or(z.literal('')),
});

const atualizarPerfilSchema = z.object({
  nome: z
    .string({ required_error: 'nome é obrigatório.' })
    .trim()
    .min(1, 'Nome não pode ser vazio.')
    .max(100, 'Nome muito longo.'),
});

// ==========================================
// 3. Lições (/api/licoes)
// ==========================================

const licaoIdParamSchema = z.object({
  id: z
    .string({ required_error: 'id da lição é obrigatório.' })
    .trim()
    .min(1, 'id da lição não pode ser vazio.')
    .max(100, 'id muito longo.'),
});

// ==========================================
// 4. Conteúdo e IA (/api/conteudo)
// ==========================================

const reformularConteudoSchema = z
  .object({
    miniModuloId: z.string().trim().max(50).optional(),
    moduleId: z.string().trim().max(50).optional(),
    etapaIndice: z
      .union([
        z.number().int().min(0, 'etapaIndice não pode ser negativo.'),
        z.string().regex(/^\d+$/, 'etapaIndice deve ser um número inteiro.'),
      ])
      .optional(),
    etapaId: z.string().trim().max(100).optional(),
    nivel: z.string().trim().max(50).optional(),
    motivo: z.string().trim().max(50).optional(),
  })
  .refine(
    (data) => Boolean(data.miniModuloId || data.moduleId),
    {
      message: 'miniModuloId ou moduleId é obrigatório.',
      path: ['miniModuloId'],
    }
  );

// ==========================================
// 5. Algoritmo Adaptativo (/api/licao)
// ==========================================

const dadosEventoSchema = z.object({
  tempoResposta: z
    .number({ required_error: 'tempoResposta é obrigatório em dadosEvento.', invalid_type_error: 'tempoResposta deve ser numérico.' })
    .min(0, 'tempoResposta não pode ser negativo.')
    .max(600000, 'tempoResposta excede o tempo máximo razoável (10 minutos).'),
  trocasDeAba: z
    .number({ invalid_type_error: 'trocasDeAba deve ser numérico.' })
    .int('trocasDeAba deve ser um número inteiro.')
    .min(0, 'trocasDeAba não pode ser negativo.')
    .max(1000, 'trocasDeAba excessivo.')
    .default(0),
  tempoInativo: z
    .number({ invalid_type_error: 'tempoInativo deve ser numérico.' })
    .min(0, 'tempoInativo não pode ser negativo.')
    .max(600, 'tempoInativo excessivo.')
    .default(0),
  abandonado: z
    .boolean({ invalid_type_error: 'abandonado deve ser booleano.' })
    .default(false),
});

const responderLicaoSchema = z.object({
  moduleId: z
    .string({ required_error: 'moduleId é obrigatório.' })
    .trim()
    .min(1, 'moduleId não pode ser vazio.')
    .max(50, 'moduleId muito longo.'),
  etapaId: z
    .string({ required_error: 'etapaId é obrigatório.' })
    .trim()
    .min(1, 'etapaId não pode ser vazio.')
    .max(100, 'etapaId muito longo.'),
  correto: z
    .boolean({ required_error: 'correto é obrigatório.' }),
  tempoIdeal: z
    .number({ required_error: 'tempoIdeal é obrigatório.', invalid_type_error: 'tempoIdeal deve ser numérico.' })
    .min(500, 'tempoIdeal deve ser de pelo menos 500ms.')
    .max(120000, 'tempoIdeal excede o limite máximo suportado.'),
  tentativas: z
    .number({ invalid_type_error: 'tentativas deve ser numérico.' })
    .int('tentativas deve ser um número inteiro.')
    .min(1, 'tentativas deve ser de pelo menos 1.')
    .max(50, 'tentativas muito elevado.')
    .default(1),
  tentativasAposErro: z
    .number({ invalid_type_error: 'tentativasAposErro deve ser numérico.' })
    .int('tentativasAposErro deve ser um número inteiro.')
    .min(0, 'tentativasAposErro não pode ser negativo.')
    .max(50, 'tentativasAposErro muito elevado.')
    .default(0),
  biasModulo: z
    .number({ invalid_type_error: 'biasModulo deve ser numérico.' })
    .min(-1, 'biasModulo deve ser entre -1 e 1.')
    .max(1, 'biasModulo deve ser entre -1 e 1.')
    .default(0),
  dadosEvento: dadosEventoSchema,
});

const simularLicaoSchema = z.object({
  correto: z
    .boolean({ required_error: 'correto é obrigatório.' }),
  tempoIdeal: z
    .number({ required_error: 'tempoIdeal é obrigatório.', invalid_type_error: 'tempoIdeal deve ser numérico.' })
    .min(500, 'tempoIdeal deve ser de pelo menos 500ms.')
    .max(120000, 'tempoIdeal excede o limite máximo suportado.'),
  tentativas: z
    .number({ invalid_type_error: 'tentativas deve ser numérico.' })
    .int('tentativas deve ser inteiro.')
    .min(1, 'tentativas deve ser pelo menos 1.')
    .max(50)
    .default(1),
  tentativasAposErro: z
    .number({ invalid_type_error: 'tentativasAposErro deve ser numérico.' })
    .int('tentativasAposErro deve ser inteiro.')
    .min(0, 'tentativasAposErro não pode ser negativo.')
    .max(50)
    .default(0),
  biasModulo: z
    .number({ invalid_type_error: 'biasModulo deve ser numérico.' })
    .min(-1)
    .max(1)
    .default(0),
  biasAluno: z
    .number({ invalid_type_error: 'biasAluno deve ser numérico.' })
    .min(-1)
    .max(1)
    .default(0),
  dominioAnterior: z
    .number({ invalid_type_error: 'dominioAnterior deve ser numérico.' })
    .min(0, 'dominioAnterior deve estar entre 0 e 1.')
    .max(1, 'dominioAnterior deve estar entre 0 e 1.')
    .nullable()
    .optional(),
  questoesAnteriores: z
    .number({ invalid_type_error: 'questoesAnteriores deve ser numérico.' })
    .int('questoesAnteriores deve ser um número inteiro.')
    .min(0, 'questoesAnteriores não pode ser negativo.')
    .max(5000, 'questoesAnteriores excede o limite razoável.')
    .default(0),
  etapaId: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional(),
  dadosEvento: dadosEventoSchema,
});

module.exports = {
  salvarProgressoSchema,
  salvarConquistaSchema,
  criarUsuarioSchema,
  atualizarPerfilSchema,
  licaoIdParamSchema,
  reformularConteudoSchema,
  dadosEventoSchema,
  responderLicaoSchema,
  simularLicaoSchema,
};
