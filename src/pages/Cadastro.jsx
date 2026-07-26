import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { TextInput } from '../components/Forms/TextInput';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
      setTimeout(() => navigate('/dashboard'), 2000);
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
    <div className={styles.container}>
      {/* Lado esquerdo: ilustração */}
      <div className={styles.illustration}>
        <h2 className={styles.illustrationTitle}>Aprenda com a CECI</h2>
        <p className={styles.illustrationText}>
          Uma plataforma pensada para você aprender tecnologia no seu próprio ritmo, com leveza e sem pressão.
        </p>
        <div className={styles.features}>
          <div className={styles.featureItem}>Lições adaptadas ao seu nível</div>
          <div className={styles.featureItem}>Atividades práticas e interativas</div>
          <div className={styles.featureItem}>Acompanhe seu progresso em tempo real</div>
          <div className={styles.featureItem}>Conquistas e recompensas ao longo do caminho</div>
        </div>
    </div>

      {/* Lado direito: formulário */}
      <div className={styles.formSide}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.logoMini}>CECI</div>
            <h1 className={styles.title}>Criar conta</h1>
            <p className={styles.subtitle}>Comece a aprender hoje, de graça</p>
          </div>

          {success ? (
            <div className={styles.successBox}>
              <div className={styles.successEmoji}>🎉</div>
              <h3>Conta criada com sucesso!</h3>
              <p>Redirecionando para o dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
                {loading ? '⏳ Criando conta...' : 'Criar conta grátis'}
              </ButtonPrimary>
            </form>
          )}

          <div className={styles.footer}>
            <p>
              Já tem conta?{' '}
              <a href="/" className={styles.link}>
                Fazer login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}