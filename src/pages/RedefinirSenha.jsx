// RedefinirSenha.jsx
// Tela aberta pelo link do e-mail de recuperação de senha (rota /redefinir-senha).
//
// Fluxo: o Supabase lê o token da URL, abre uma sessão especial de
// "recuperação" e dispara o evento PASSWORD_RECOVERY. Só com essa sessão
// é possível definir a nova senha (supabase.auth.updateUser).
//
// Segurança: quem abre esta rota sem ter vindo do link do e-mail (ou com
// o link expirado) NÃO consegue trocar a senha por aqui - vê a mensagem
// de "link inválido" e um atalho para pedir outro. Também por isso a tela
// não redireciona ao dashboard quando já existe sessão (ela é justamente
// a sessão de recuperação).

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { redefinirSenha } from '../services/auth';
import { validarSenha, SENHA_MIN_CARACTERES } from '../utils/senha';
import { AuthLayout } from '../components/Layout/AuthLayout';
import { Mascote } from '../components/Mascote/Mascote';
import { TextInput } from '../components/Forms/TextInput';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { Footer } from '../components/Footer/Footer';
import authStyles from '../components/Layout/AuthLayout.module.css';
import styles from './RecuperarSenha.module.css';

// O Supabase apaga o token da URL assim que o processa. Por isso lemos a URL
// uma única vez, aqui no carregamento do módulo (antes de ele limpar), para
// saber se a pessoa realmente chegou por um link de recuperação.
const ORIGEM_DO_LINK = (() => {
    try {
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const query = new URLSearchParams(window.location.search);
        return {
            veioDoLink:
                hash.get('type') === 'recovery' ||
                query.has('code') ||
                query.has('token_hash') ||
                hash.has('access_token'),
            temErro: hash.has('error') || query.has('error'),
        };
    } catch {
        return { veioDoLink: false, temErro: false };
    }
})();

const TEMPO_MAXIMO_VERIFICACAO_MS = 8000;

export default function RedefinirSenha() {
    // 'verificando' | 'pronto' | 'invalido' | 'concluido'
    const [estado, setEstado] = useState(
        ORIGEM_DO_LINK.temErro || !ORIGEM_DO_LINK.veioDoLink ? 'invalido' : 'verificando'
    );
    const [senha, setSenha] = useState('');
    const [confirmacao, setConfirmacao] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (ORIGEM_DO_LINK.temErro || !ORIGEM_DO_LINK.veioDoLink) return undefined;

        let ativo = true;
        const marcarPronto = () => {
            if (ativo) setEstado((atual) => (atual === 'verificando' ? 'pronto' : atual));
        };

        const { data } = supabase.auth.onAuthStateChange((evento, sessao) => {
            if (evento === 'PASSWORD_RECOVERY' || (sessao && evento === 'SIGNED_IN')) {
                marcarPronto();
            }
        });

        // Cobre o caso do evento já ter disparado antes de esta tela montar.
        supabase.auth.getSession().then(({ data: dadosSessao }) => {
            if (dadosSessao?.session) marcarPronto();
        });

        const timeout = setTimeout(() => {
            if (ativo) setEstado((atual) => (atual === 'verificando' ? 'invalido' : atual));
        }, TEMPO_MAXIMO_VERIFICACAO_MS);

        return () => {
            ativo = false;
            clearTimeout(timeout);
            data?.subscription?.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setErro('');

        const erroSenha = validarSenha(senha);
        if (erroSenha) {
            setErro(erroSenha);
            return;
        }
        if (senha !== confirmacao) {
            setErro('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            await redefinirSenha(senha);
            setSenha('');
            setConfirmacao('');
            setEstado('concluido');
        } catch (err) {
            setErro(err.message || 'Não foi possível redefinir a senha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const titulos = {
        verificando: 'Só um instante... 💜',
        pronto: 'Vamos criar uma nova senha! 🔐',
        invalido: 'Esse link não está mais valendo',
        concluido: 'Senha atualizada! 🎉',
    };
    const subtitulos = {
        verificando: 'Estamos conferindo o seu link com segurança.',
        pronto: 'Escolha uma senha que você consiga lembrar com facilidade, mas que outras pessoas não adivinhem.',
        invalido: 'Isso acontece quando o link já foi usado ou passou do prazo. Peça um novo, é rapidinho.',
        concluido: 'Tudo certo. Agora é só entrar com a sua nova senha.',
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
                                variante={estado === 'concluido' ? 'acerto' : 'duvida'}
                            />
                        </div>
                        <h2 className={authStyles.illustrationTitle}>{titulos[estado]}</h2>
                        <p className={styles.illustrationSubtitle}>{subtitulos[estado]}</p>
                    </div>
                }
            >
                <div className={styles.logo}>
                    <img src="/logo-ceci.png" alt="CECI" className={styles.logoImg} />
                </div>

                <div className={styles.header}>
                    <span className={styles.tagline}>Acesso à conta</span>
                    <h1 className={authStyles.title}>
                        Nova <span className={styles.titleAccent}>senha</span>
                    </h1>
                    <p className={authStyles.subtitle}>{subtitulos[estado]}</p>
                </div>

                <div className={authStyles.form}>
                    {estado === 'verificando' && (
                        <p role="status" aria-live="polite">Verificando seu link...</p>
                    )}

                    {estado === 'invalido' && (
                        <div className={styles.successBox} role="alert">
                            <h3 className={styles.successTitle}>
                                <span>⚠️</span> Link inválido ou expirado
                            </h3>
                            <p className={styles.successText}>
                                Por segurança, cada link de recuperação funciona uma vez só e por pouco tempo.
                            </p>
                            <ButtonPrimary
                                onClick={() => navigate('/recuperar-senha')}
                                fullWidth
                                size="large"
                            >
                                Pedir um novo link
                            </ButtonPrimary>
                        </div>
                    )}

                    {estado === 'pronto' && (
                        <form onSubmit={handleSubmit}>
                            <TextInput
                                label="Nova senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder={`Pelo menos ${SENHA_MIN_CARACTERES} caracteres`}
                                hint={`Use no mínimo ${SENHA_MIN_CARACTERES} caracteres. Pode ser uma frase fácil de lembrar.`}
                                autoComplete="new-password"
                                required
                                disabled={loading}
                            />
                            <TextInput
                                label="Confirmar nova senha"
                                type="password"
                                value={confirmacao}
                                onChange={(e) => setConfirmacao(e.target.value)}
                                placeholder="Repita a nova senha"
                                autoComplete="new-password"
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
                                {loading ? 'Salvando...' : 'Salvar nova senha'}
                            </ButtonPrimary>
                        </form>
                    )}

                    {estado === 'concluido' && (
                        <div className={styles.successBox} role="status">
                            <h3 className={styles.successTitle}>
                                <span>✅</span> Senha alterada!
                            </h3>
                            <p className={styles.successText}>
                                Por segurança, você foi desconectado de todos os aparelhos. Entre de novo com a nova senha.
                            </p>
                            <ButtonPrimary
                                onClick={() => navigate('/login', { replace: true })}
                                fullWidth
                                size="large"
                            >
                                Ir para o Login
                            </ButtonPrimary>
                        </div>
                    )}
                </div>

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