-- ==============================================================================
-- CECI - POLÍTICAS DE SEGURANÇA E REGRAS DE ACESSO DO SUPABASE (RLS & TRIGGERS)
-- Arquivo equivalente ao `firestore.rules` para o Supabase / PostgreSQL.
--
-- Como aplicar:
-- 1. Abra o painel do Supabase -> SQL Editor -> New Query.
-- 2. Cole este script e execute (Run).
--
-- O que este arquivo garante:
--  - Toda tabela possui Row Level Security (RLS) habilitado.
--  - Catálogo (módulos, lições, etapas) é aberto para leitura, blindado contra escrita.
--  - Usuários só lêem seus próprios dados de perfil e progresso.
--  - Todo novo cadastro no Supabase Auth gera automaticamente a linha em `usuarios`
--    com `tipo = 'aluno'` via Trigger nativa do PostgreSQL (sem depender do front).
--  - Ninguém consegue se promover a 'admin' via console do navegador (DevTools).
--  - Escritas sensíveis são orquestradas pelo backend com SUPABASE_SERVICE_ROLE_KEY.
-- ==============================================================================

-- ==============================================================================
-- 1. GARANTIA DO TIPO DE CONTA (ALUNO / ADMIN)
-- ==============================================================================
ALTER TABLE public.usuarios ALTER COLUMN tipo SET DEFAULT 'aluno';
UPDATE public.usuarios SET tipo = 'aluno' WHERE tipo IS NULL OR tipo NOT IN ('aluno', 'admin');
ALTER TABLE public.usuarios ALTER COLUMN tipo SET NOT NULL;

ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS chk_tipo_usuario;
ALTER TABLE public.usuarios ADD CONSTRAINT chk_tipo_usuario CHECK (tipo IN ('aluno', 'admin'));


-- ==============================================================================
-- 2. HABILITAÇÃO DE ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
-- ==============================================================================
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conquistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_aluno ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atividade_usuario ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- 3. POLÍTICAS DE ACESSO (RLS POLICIES)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 3.1 `usuarios`
-- Alunos autenticados podem LER apenas o próprio perfil.
-- Escritas e atualizações com allowlist ocorrem via backend (service_role).
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "usuarios_proprios_dados" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios podem atualizar seu proprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios podem criar seu proprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios podem ler seu proprio perfil" ON public.usuarios;

CREATE POLICY "Usuarios podem ler seu proprio perfil"
  ON public.usuarios
  FOR SELECT
                                     TO authenticated
                                     USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 3.2 CATÁLOGO: `modulos`, `licoes`, `etapas`
-- Somente leitura pública (qualquer pessoa logada ou visitante pode carregar as aulas).
-- Ninguém pelo cliente pode inserir, editar ou deletar conteúdo.
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Leitura publica de modulos" ON public.modulos;
CREATE POLICY "Leitura publica de modulos"
  ON public.modulos
  FOR SELECT
                      TO public
                      USING (true);

DROP POLICY IF EXISTS "Leitura publica de licoes" ON public.licoes;
CREATE POLICY "Leitura publica de licoes"
  ON public.licoes
  FOR SELECT
                      TO public
                      USING (true);

DROP POLICY IF EXISTS "Leitura publica de etapas" ON public.etapas;
CREATE POLICY "Leitura publica de etapas"
  ON public.etapas
  FOR SELECT
                      TO public
                      USING (true);

-- ------------------------------------------------------------------------------
-- 3.3 `perfis_aluno`
-- Somente leitura para o aluno dono daquele histórico adaptativo.
-- O algoritmo BKT (backend) calcula e grava usando a service_role_key.
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "usuario_ve_so_o_proprio_perfil" ON public.perfis_aluno;
DROP POLICY IF EXISTS "usuario_le_proprio_perfil_bkt" ON public.perfis_aluno;

CREATE POLICY "usuario_le_proprio_perfil_bkt"
  ON public.perfis_aluno
  FOR SELECT
                           TO authenticated
                           USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3.4 `progresso_usuario`
-- Alunos gerenciam seu próprio progresso de lições.
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "progresso_proprio" ON public.progresso_usuario;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio progresso" ON public.progresso_usuario;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio progresso" ON public.progresso_usuario;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio progresso" ON public.progresso_usuario;
DROP POLICY IF EXISTS "Usuários podem deletar seu próprio progresso" ON public.progresso_usuario;

CREATE POLICY "Usuários podem ver seu próprio progresso"
  ON public.progresso_usuario
  FOR SELECT
                                          TO authenticated
                                          USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem inserir seu próprio progresso"
  ON public.progresso_usuario
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar seu próprio progresso"
  ON public.progresso_usuario
  FOR UPDATE
                        TO authenticated
                        USING (auth.uid() = usuario_id)
      WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar seu próprio progresso"
  ON public.progresso_usuario
  FOR DELETE
TO authenticated
  USING (auth.uid() = usuario_id);

-- ------------------------------------------------------------------------------
-- 3.5 `conquistas`
-- Alunos têm acesso somente às suas próprias conquistas desbloqueadas.
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "conquistas_proprias" ON public.conquistas;
CREATE POLICY "conquistas_proprias"
  ON public.conquistas
  FOR ALL
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- ------------------------------------------------------------------------------
-- 3.6 `atividade_usuario`
-- Sem políticas para client.
-- Tabela restrita a telemetria interna gravada e consultada apenas pelo backend (service_role).
-- ------------------------------------------------------------------------------


-- ==============================================================================
-- 4. TRIGGERS DE SEGURANÇA E AUTOMAÇÃO
-- ==============================================================================

-- 4.1 Bloqueio de auto-promoção para 'admin' via console do navegador
--
-- ATENÇÃO: esta função NÃO pode ser SECURITY DEFINER. Em uma função
-- SECURITY DEFINER, `current_user` é o DONO da função (postgres), e não
-- quem fez a chamada - então o teste abaixo nunca seria verdadeiro e o
-- trigger não bloquearia nada. Como função comum (SECURITY INVOKER), o
-- `current_user` é o papel que o PostgREST usa na requisição:
-- 'authenticated' (aluno logado) ou 'anon'. Já o backend (service_role)
-- e o painel do Supabase (postgres) continuam podendo alterar o tipo.
CREATE OR REPLACE FUNCTION public.bloquear_alteracao_tipo_usuario()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.tipo IS DISTINCT FROM OLD.tipo THEN
    IF current_user IN ('authenticated', 'anon') THEN
      RAISE EXCEPTION 'Acesso negado: o tipo de conta só pode ser alterado manualmente pelo administrador no painel.';
END IF;
END IF;
RETURN NEW;
END;
$$;

-- 4.1.1 Camada extra por privilégio: o cliente (anon/authenticated) não precisa
-- escrever em `usuarios` (leitura direta; escritas passam pelo backend com
-- service_role). Revogar no nível da TABELA é o que de fato vale: um REVOKE
-- só na coluna não tem efeito quando o privilégio da tabela inteira foi concedido.
REVOKE INSERT, UPDATE, DELETE ON public.usuarios FROM anon, authenticated;

DROP TRIGGER IF EXISTS trg_bloquear_alteracao_tipo ON public.usuarios;
CREATE TRIGGER trg_bloquear_alteracao_tipo
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.bloquear_alteracao_tipo_usuario();

-- 4.2 Auto-criação de perfil em `public.usuarios` assim que o usuário nasce em `auth.users`
-- Isso resolve 100% de cadastros órfãos, independentemente de confirmação de e-mail ou JWT no front.
-- SECURITY DEFINER aqui é necessário (o trigger roda em auth.users e grava em
-- public.usuarios); por isso fixamos o search_path para evitar sequestro de schema.
-- O nome é limitado a 100 caracteres (mesmo limite validado no backend).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
INSERT INTO public.usuarios (id, nome, email, tipo)
VALUES (
           NEW.id,
           LEFT(COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'nome'), ''), SPLIT_PART(NEW.email, '@', 1), 'Usuário'), 100),
           NEW.email,
           'aluno'
       )
    ON CONFLICT (id) DO UPDATE
                            SET email = EXCLUDED.email,
                            nome = CASE
                            WHEN public.usuarios.nome IS NULL OR public.usuarios.nome = ''
                            THEN EXCLUDED.nome
                            ELSE public.usuarios.nome
END;
RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 5. BACKFILL: SINCRONIZA USUÁRIOS QUE JÁ ESTÃO EM AUTH.USERS MAS NÃO EM USUARIOS
-- ==============================================================================
INSERT INTO public.usuarios (id, nome, email, tipo)
SELECT
    id,
    COALESCE(raw_user_meta_data->>'nome', SPLIT_PART(email, '@', 1), 'Usuário'),
    email,
    'aluno'
FROM auth.users
    ON CONFLICT (id) DO NOTHING;