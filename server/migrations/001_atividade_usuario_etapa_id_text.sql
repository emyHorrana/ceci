-- Migration: atividade_usuario.etapa_id uuid -> text
--
-- Contexto: licoes/modulos/etapas deixaram de vir do banco (o front usa
-- os dados estáticos de src/data/unidades.js e src/data/modulos.js, com
-- ids como "1-3", "2-14" etc, não uuid). atividade_usuario precisa
-- guardar esses mesmos ids pra logar por resposta, então a coluna
-- etapa_id não pode mais ser uuid nem referenciar a tabela etapas.
--
-- Mesmo padrão já usado em perfis_aluno.module_id (também text, guardando
-- ids de Unidade como "U1.1").

-- 1. Remove a FK pra etapas, se existir (nome pode variar; ajuste caso o
--    Supabase tenha gerado um nome diferente de constraint).
ALTER TABLE atividade_usuario
  DROP CONSTRAINT IF EXISTS atividade_usuario_etapa_id_fkey;

-- 2. Troca o tipo da coluna de uuid para text.
ALTER TABLE atividade_usuario
  ALTER COLUMN etapa_id TYPE text USING etapa_id::text;
