import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { TextInput } from '../components/Forms/TextInput';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, guestLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validação básica
      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        setLoading(false);
        return;
      }

      // Chamar login do context
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
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Bem-vindo ao CECI</h1>
          <p className={styles.subtitle}>
            Aprenda no seu ritmo, sem pressa e sem medo
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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

          {error && (
            <div className={styles.errorBox} role="alert">
              ⚠️ {error}
            </div>
          )}

          <ButtonPrimary
            type="submit"
            fullWidth
            disabled={loading}
            size="large"
          >
            {loading ? '⏳ Entrando...' : 'Entrar'}
          </ButtonPrimary>
   
          <ButtonPrimary
            type="button"
            fullWidth
            onClick={async () => {
              try {
                await guestLogin();
                navigate('/dashboard');
              } catch {
                setError('Erro ao entrar como visitante');
              }
            }}
          >
            Entrar como visitante
          </ButtonPrimary>
        </form>


        <div className={styles.footer}>
          <p>Não tem conta? 
            <a href="/cadastro" className={styles.link}>
              Criar cadastro
            </a>
          </p>
          <p>
            <a href="/recuperar-senha" className={styles.link}>
              Esqueceu a senha?
            </a>
          </p>
        </div>
      </div>

      <div className={styles.sideIllustration}>
        <div className={styles.personagem}>👩‍🏫</div>
        <p className={styles.motivationalText}>
          "Aprender é uma aventura que nunca termina"
        </p>
      </div>
    </div>
  );
}