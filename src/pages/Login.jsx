import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { TextInput } from '../components/Forms/TextInput';
import { AuthLayout } from '../components/Layout/AuthLayout';
import authStyles from '../components/Layout/AuthLayout.module.css';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        return;
      }
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      formPosition="left"
      illustrationMobileMinHeight="260px"
      illustration={
        <div className={styles.illustrationContent}>
          {/* Slot para imagem da mascote */}
          <div className={styles.mascoteSlot} aria-hidden>
            <img
              src="/mascote-ceci.png"
              alt="Mascote Ceci"
              className={styles.mascote}
            />
          </div>

          <h2 className={authStyles.illustrationTitle}>
            Olá! Eu sou a Ceci. 💜
          </h2>
          <p className={styles.illustrationSubtitle}>
            Aprender tecnologia pode ser leve e divertido! 
            Vou te acompanhar em cada etapa da sua jornada.
          </p>

          <div className={styles.featurePills}>
            <span className={styles.pill}>Aulas simples</span>
            <span className={styles.pill}>No seu ritmo</span>
            <span className={styles.pill}>Totalmente gratuito</span>
          </div>
        </div>
      }
    >
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon} />
        <span className={styles.logoText}>CECI</span>
      </div>

      {/* Cabeçalho */}
      <div className={styles.header}>
        <span className={styles.tagline}>Aprendizado inclusivo</span>
        <h1 className={authStyles.title}>
          Bem-vindo(a) de{' '}
          <span className={styles.titleAccent}>volta!</span>
        </h1>
        <p className={authStyles.subtitle}>
          Vamos aprender algo novo hoje?
        </p>
      </div>

      {/* Campos */}
      <div className={authStyles.form}>
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
          placeholder="••••••••"
          required
          disabled={loading}
        />

        <div className={styles.formLinks}>
          <a href="/recuperar-senha" className={styles.linkSmall}>
            Esqueceu a senha?
          </a>
        </div>

        {error && (
          <div className={authStyles.errorBox} role="alert">
            {error}
          </div>
        )}

        <ButtonPrimary
          onClick={handleSubmit}
          fullWidth
          disabled={loading}
          size="large"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </ButtonPrimary>
      </div>

      {/* Rodapé */}
      <div className={authStyles.footer}>
        <p>
          Não tem conta?
          <a href="/cadastro" className={authStyles.link}>Criar cadastro</a>
        </p>
      </div>
    </AuthLayout>
  );
}