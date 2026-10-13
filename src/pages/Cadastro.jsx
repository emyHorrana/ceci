import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { TextInput } from '../components/Forms/TextInput';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { flushOnboardingSignals } from '../services/onboardingSync';
import { criarUsuario } from '../services/usuarioService';
import { salvarConquista } from '../services/progressService';
import { salvarModoDesbloqueadoLocal, marcarModoNotificadoLocal } from '../services/laboratorioService';
import { AuthLayout } from '../components/Layout/AuthLayout';
import { Footer } from '../components/Footer/Footer';
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
  const { register, user, initializing } = useContext(UserContext);
  const navigate = useNavigate();

  // Se já estiver logado, vai direto pro dashboard
  useEffect(() => {
    if (!initializing && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [initializing, user, navigate]);

  // Se ainda não concluiu o diagnóstico de boas-vindas, não deve se registrar direto:
  // o algoritmo adaptativo precisa dos sinais para calibrar a trilha e recomendações.
  useEffect(() => {
    if (!initializing && !user && !onboarding?.concluido) {
      navigate('/boas-vindas', { replace: true });
    }
  }, [initializing, user, onboarding?.concluido, navigate]);

  if (initializing || user || !onboarding?.concluido) return null;

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
      const newUser = await register({ nome: nome.trim(), email: email.trim(), password });
      setSuccess(true);

      // O Supabase Auth já criou a conta de login (auth.users) - falta a
      // linha correspondente em `usuarios` (perfil complementar: nome,
      // e-mail), que o resto do app espera existir. Aguarda pra reduzir
      // a chance do Dashboard carregar antes dessa linha existir, mas
      // não trava o cadastro se falhar - a conta em si já está criada.
      try {
        await criarUsuario({ id: newUser.id, nome: nome.trim(), email: email.trim() });
      } catch (err) {
        console.error('Erro ao criar perfil em usuarios:', err);
      }

      // Desbloqueia a primeira conquista: "Primeiros Passos" (Concluir o cadastro)
      try {
        await salvarConquista(newUser.id, 'Primeiros Passos');
      } catch (err) {
        console.warn('Erro ao registrar conquista de cadastro:', err);
      }

      // A conta acabou de nascer - agora sim dá pra mandar pro algoritmo
      // adaptativo os sinais capturados durante /boas-vindas (clique do
      // mouse, "digite oi", digitar o nome), que até aqui só existiam no
      // localStorage por falta de userId. Fire-and-forget: não deve
      // atrasar o redirecionamento nem quebrar o cadastro se falhar.
      flushOnboardingSignals(newUser.id).catch((err) => {
        console.error('Erro ao sincronizar sinais do onboarding:', err);
      });

      // Se comprovou pelo algoritmo no onboarding, os jogos no laboratório se mantêm desbloqueados por padrão
      try {
        if (onboarding?.verificacao_mouse_confirmada) {
          salvarModoDesbloqueadoLocal(newUser.id, 'mouse');
          salvarModoDesbloqueadoLocal(newUser.id, 'arrastar');
          salvarModoDesbloqueadoLocal(newUser.id, 'desenho');
          marcarModoNotificadoLocal(newUser.id, 'mouse');
          marcarModoNotificadoLocal(newUser.id, 'arrastar');
          marcarModoNotificadoLocal(newUser.id, 'desenho');
        }
        if (onboarding?.verificacao_teclado_confirmada) {
          salvarModoDesbloqueadoLocal(newUser.id, 'teclado');
          salvarModoDesbloqueadoLocal(newUser.id, 'dedos');
          marcarModoNotificadoLocal(newUser.id, 'teclado');
          marcarModoNotificadoLocal(newUser.id, 'dedos');
        }
      } catch (err) {
        console.warn('Erro ao configurar modos do laboratório no cadastro:', err);
      }

      // Aguarda 2s para mostrar mensagem de sucesso, depois redireciona pro
      // Dashboard - a bifurcação por familiaridade com mouse acontece toda
      // ANTES do cadastro agora (embutida no /boas-vindas: aula-mouse-intro
      // + aula-mouse-pratica), então aqui não tem mais decisão a fazer.
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
    <>
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
            <img src="/logo-ceci.png" alt="CECI" className={styles.logoMini} />
            <h1 className={authStyles.title}>Criar conta</h1>
            <p className={authStyles.subtitle}>Comece a aprender hoje, de graça</p>
          </div>

          {success ? (
            <div className={styles.successBox}>
              <h3>Conta criada com sucesso!</h3>
              <p>Redirecionando para o dashboard...</p>
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
              <Link to="/login" className={authStyles.link}>
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </AuthLayout>
      <Footer />
    </>
  );
}
