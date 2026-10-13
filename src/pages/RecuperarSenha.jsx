import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { recuperarSenha } from '../services/auth';
import { AuthLayout } from '../components/Layout/AuthLayout';
import { Mascote } from '../components/Mascote/Mascote';
import { TextInput } from '../components/Forms/TextInput';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { ButtonOutline } from '../components/Buttons/ButtonOutline';
import { Footer } from '../components/Footer/Footer';
import authStyles from '../components/Layout/AuthLayout.module.css';
import styles from './RecuperarSenha.module.css';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const { user, initializing } = useContext(UserContext);
  const navigate = useNavigate();

  // Se já estiver logado, redireciona para o dashboard
  useEffect(() => {
    if (!initializing && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [initializing, user, navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErro('');

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setErro('Por favor, digite seu e-mail cadastrado.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setErro('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      await recuperarSenha(emailTrimmed);
      setEnviado(true);
    } catch (err) {
      setErro(err.message || 'Não foi possível solicitar a recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        formPosition="left"
        illustrationMobileMinHeight="240px"
        illustration={
          <div className={styles.illustrationContent}>
            <div className={styles.mascoteSlot} aria-hidden>
              <Mascote
                alt="Mascote Ceci"
                variante={enviado ? 'acerto' : 'duvida'}
              />
            </div>

            <h2 className={authStyles.illustrationTitle}>
              {enviado ? 'Tudo certo por aqui! 🎉' : 'Esqueceu a senha? Sem problemas! 💜'}
            </h2>
            <p className={styles.illustrationSubtitle}>
              {enviado
                ? 'Dá uma olhadinha no seu e-mail para continuar. A Ceci te espera!'
                : 'Acontece com todo mundo. Digite seu e-mail e vamos te ajudar a criar uma nova senha com calma e segurança.'}
            </p>
          </div>
        }
      >
        {/* Logo */}
        <div className={styles.logo}>
          <img src="/logo-ceci.png" alt="CECI" className={styles.logoImg} />
        </div>

        {/* Cabeçalho */}
        <div className={styles.header}>
          <span className={styles.tagline}>Acesso à conta</span>
          <h1 className={authStyles.title}>
            Recuperar <span className={styles.titleAccent}>senha</span>
          </h1>
          <p className={authStyles.subtitle}>
            {enviado
              ? 'Instruções enviadas com sucesso.'
              : 'Enviaremos um link seguro para o seu e-mail para você redefinir sua senha.'}
          </p>
        </div>

        {/* Conteúdo */}
        <div className={authStyles.form}>
          {enviado ? (
            <div className={styles.successBox} role="status">
              <h3 className={styles.successTitle}>
                <span>✉️</span> E-mail enviado!
              </h3>
              <p className={styles.successText}>
                Enviamos as instruções para <span className={styles.successEmail}>{email.trim()}</span>.
              </p>
              <p className={styles.successHint}>
                💡 <strong>Dica da Ceci:</strong> Se o e-mail não chegar em alguns minutinhos, verifique sua pasta de <em>Spam</em> ou <em>Lixo Eletrônico</em>.
              </p>

              <ButtonPrimary
                onClick={() => navigate('/login')}
                fullWidth
                size="large"
              >
                Voltar para o Login
              </ButtonPrimary>

              <ButtonOutline
                onClick={() => {
                  setEnviado(false);
                  setEmail('');
                }}
                fullWidth
                size="small"
              >
                Tentar outro e-mail
              </ButtonOutline>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextInput
                label="Seu e-mail cadastrado"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />

              {erro && (
                <div className={authStyles.errorBox} role="alert">
                  {erro}
                </div>
              )}

              <ButtonPrimary
                onClick={handleSubmit}
                fullWidth
                disabled={loading}
                size="large"
              >
                {loading ? 'Enviando instruções...' : 'Enviar link de recuperação'}
              </ButtonPrimary>
            </form>
          )}
        </div>

        {/* Rodapé */}
        <div className={authStyles.footer}>
          <p>
            Lembrou da senha?{' '}
            <Link to="/login" className={authStyles.link}>
              Voltar ao login
            </Link>
          </p>
        </div>
      </AuthLayout>
      <Footer />
    </>
  );
}
