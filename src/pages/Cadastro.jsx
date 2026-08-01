import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { TextInput } from '../components/Forms/TextInput';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AuthLayout } from '../components/Layout/AuthLayout';
import authStyles from '../components/Layout/AuthLayout.module.css';
import styles from './Cadastro.module.css';

export default function Cadastro() {
  // Se a pessoa passou pelo fluxo de /boas-vindas antes de chegar aqui,
  // o nome que ela digitou lá já fica pré-preenchido - não faz sentido
  // pedir de novo algo que ela já contou pra Ceci.
  const [onboarding] = useLocalStorage('ceci_onboarding', {});
  const [nome, setNome] = useState(onboarding?.nome?.meta?.valor || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(UserContext);
  const navigate = useNavigate();

  // Pra onde mandar a pessoa depois de criar a conta.
  // Quem disse no /boas-vindas que "ainda não sabe usar mouse" vai direto
  // pro primeiro mini-módulo do Módulo 1 (Uso do Mouse), em vez do
  // Dashboard genérico - ainda não existe um formulário de afinidade
  // separado pra quem respondeu "sim", então esse caminho continua indo
  // pro Dashboard normalmente.
  const destinoAposCadastro =
    onboarding?.familiaridadeMouse === 'nao' ? '/mini-modulo/1-1' : '/dashboard';

  const validate = () => {
    if (!nome.trim()) return 'Por favor, informe seu nome.';
    if (!email.trim()) return 'Por favor, informe seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-mail inválido.';
    if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    if (password !== confirmPassword) return 'As senhas não coincidem.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register({ nome: nome.trim(), email: email.trim(), password });
      setSuccess(true);
      // Aguarda 2s para mostrar mensagem de sucesso, depois redireciona
      setTimeout(() => navigate(destinoAposCadastro), 2000);
    } catch (err) {
      // Supabase pode retornar "User already registered" em inglês
      if (err.message?.toLowerCase().includes('already registered')) {
        setError('Este e-mail já possui uma conta. Tente fazer login.');
      } else {
        setError(err.message || 'Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      formPosition="right"
      illustrationMobileMinHeight="220px"
      illustration={
        <>
          <h2 className={authStyles.illustrationTitle}>Aprenda com a CECI</h2>
          <p className={styles.illustrationText}>
            Uma plataforma pensada para você aprender tecnologia no seu próprio ritmo, com leveza e sem pressão.
          </p>
          <div className={styles.features}>
            <div className={styles.featureItem}>Lições adaptadas ao seu nível</div>
            <div className={styles.featureItem}>Atividades práticas e interativas</div>
            <div className={styles.featureItem}>Acompanhe seu progresso em tempo real</div>
            <div className={styles.featureItem}>Conquistas e recompensas ao longo do caminho</div>
          </div>
        </>
      }
    >
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.logoMini}>CECI</div>
          <h1 className={authStyles.title}>Criar conta</h1>
          <p className={authStyles.subtitle}>Comece a aprender hoje, de graça</p>
        </div>

        {success ? (
          <div className={styles.successBox}>
            <h3>Conta criada com sucesso!</h3>
            <p>
              {destinoAposCadastro === '/dashboard'
                ? 'Redirecionando para o dashboard...'
                : 'Redirecionando para sua primeira lição...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={authStyles.form} noValidate>
            <TextInput
              label="Como você se chama?"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              required
              disabled={loading}
              autoFocus
            />

            <TextInput
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />

            <TextInput
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
            />

            <TextInput
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita sua senha"
              required
              disabled={loading}
            />

            {error && (
              <div className={authStyles.errorBox} role="alert">
                ⚠️ {error}
              </div>
            )}

            <ButtonPrimary
              type="submit"
              fullWidth
              disabled={loading}
              size="large"
            >
              {loading ? '⏳ Criando conta...' : 'Criar conta grátis'}
            </ButtonPrimary>
          </form>
        )}

        <div className={authStyles.footer}>
          <p>
            Já tem conta?{' '}
            <a href="/" className={authStyles.link}>
              Fazer login
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}