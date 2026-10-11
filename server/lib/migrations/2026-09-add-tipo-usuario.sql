-- ==============================================================================
-- Migração: Garantir padrão 'aluno' e proteção de elevação de privilégios (ADM)
-- Execute este script no SQL Editor do painel do Supabase.
-- ==============================================================================

-- 1. Garante que a coluna `tipo` existe, tem valor padrão 'aluno' e é obrigatória
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'tipo'
  ) THEN
    ALTER TABLE public.usuarios ADD COLUMN tipo text DEFAULT 'aluno' NOT NULL;
  ELSE
    ALTER TABLE public.usuarios ALTER COLUMN tipo SET DEFAULT 'aluno';
    UPDATE public.usuarios SET tipo = 'aluno' WHERE tipo IS NULL;
    ALTER TABLE public.usuarios ALTER COLUMN tipo SET NOT NULL;
  END IF;
END $$;

-- 2. Restringe os valores permitidos para apenas 'aluno' ou 'admin'
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS chk_tipo_usuario;
ALTER TABLE public.usuarios ADD CONSTRAINT chk_tipo_usuario CHECK (tipo IN ('aluno', 'admin'));

-- 3. Habilita Row Level Security (RLS) na tabela usuarios
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE RLS:
-- 4.1 Leitura (SELECT): Alunos podem ler apenas o próprio perfil
DROP POLICY IF EXISTS "Usuarios podem ler seu proprio perfil" ON public.usuarios;
CREATE POLICY "Usuarios podem ler seu proprio perfil"
  ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 4.2 Inserção e Atualização (INSERT / UPDATE):
-- O backend roda com SUPABASE_SERVICE_ROLE_KEY, que bypassa RLS automaticamente.
-- Ao remover/bloquear permissão de UPDATE direto via anon/authenticated,
-- evitamos que qualquer aluno altere `tipo` via Console do navegador (F12).
DROP POLICY IF EXISTS "Usuarios podem atualizar seu proprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios podem criar seu proprio perfil" ON public.usuarios;

-- 5. TRIGGER DE DEFESA EM PROFUNDIDADE:
-- Caso alguma política de UPDATE venha a ser criada no futuro, esta trigger
-- impede sumariamente que papéis de cliente (authenticated / anon) alterem `tipo`.
CREATE OR REPLACE FUNCTION public.bloquear_alteracao_tipo_usuario()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o campo `tipo` estiver sendo modificado
  IF NEW.tipo IS DISTINCT FROM OLD.tipo THEN
    -- Impede se a chamada vier do cliente Supabase (usuário logado ou anônimo)
    IF current_user IN ('authenticated', 'anon') THEN
      RAISE EXCEPTION 'Acesso negado: o tipo de conta (aluno/admin) só pode ser alterado manualmente pelo administrador.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_bloquear_alteracao_tipo ON public.usuarios;
CREATE TRIGGER trg_bloquear_alteracao_tipo
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.bloquear_alteracao_tipo_usuario();

-- ==============================================================================
-- Fim da migração.
-- Agora:
--  - Toda nova conta nasce como 'aluno'.
--  - Ninguém consegue se promover a 'admin' via console do navegador.
--  - Promoções a admin são feitas exclusivamente de forma manual no painel do Supabase:
--    Table Editor -> usuarios -> alterar coluna 'tipo' para 'admin'.
-- ==============================================================================
