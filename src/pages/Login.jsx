import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { TextInput } from '../components/Forms/TextInput';
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
    <div className={styles.loginContainer}>
      {/* ---- Formulário ---- */}
      <div className={styles.loginForm}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon} />
          <span className={styles.logoText}>CECI</span>
        </div>

        {/* Cabeçalho */}
        <div className={styles.header}>
          <span className={styles.tagline}>Aprendizado inclusivo</span>
          <h1 className={styles.title}>
            Bem-vindo(a) de{' '}
            <span className={styles.titleAccent}>volta!</span>
          </h1>
          <p className={styles.subtitle}>
            Vamos aprender algo novo hoje?
          </p>
        </div>

        {/* Campos */}
        <div className={styles.form}>
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
            <div className={styles.errorBox} role="alert">
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
        <div className={styles.footer}>
          <p>
            Não tem conta?
            <a href="/cadastro" className={styles.link}>Criar cadastro</a>
          </p>
        </div>
      </div>

      {/* ---- Ilustração ---- */}
      <div className={styles.sideIllustration}>
        <div className={styles.illustrationContent}>
          {/* Slot para imagem da mascote */}
          <div className={styles.mascoteSlot} aria-hidden>
            <img
              src="/mascote-ceci.png"
              alt="Mascote Ceci"
              className={styles.mascote}
            />
          </div>

          <h2 className={styles.illustrationTitle}>
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
      </div>
    </div>
  );
}