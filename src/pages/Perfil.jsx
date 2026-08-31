// Perfil.jsx
// Perfil do usuário - dados básicos (nome/e-mail, editáveis) + resumo
// de conquistas e streak, reaproveitando o que Dashboard/Conquistas já
// calculam via ProgressContext. Antes desta página, "Meu perfil" já
// existia como item de navegação na sidebar (AppLayout.jsx) apontando
// pra /perfil, mas a rota e a página nunca tinham sido criadas.
//
// Rota: /perfil

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ProgressContext } from '../context/ProgressContext';
import { AppLayout, PageHeader } from '../components/Layout/AppLayout';
import appStyles from '../components/Layout/AppLayout.module.css';
import { TextInput } from '../components/Forms/TextInput';
import { ButtonPrimary } from '../components/Buttons/ButtonPrimary';
import { ButtonOutline } from '../components/Buttons/ButtonOutline';
import { getUsuario, atualizarUsuario } from '../services/usuarioService';
import styles from './Perfil.module.css';

export default function Perfil() {
  const { user, initializing } = useContext(UserContext);
  const { progress, fetchProgress } = useContext(ProgressContext);
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (user?.id) fetchProgress(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    let ativo = true;
    getUsuario(user.id).then((data) => {
      if (!ativo) return;
      setPerfil(data);
      setCarregandoPerfil(false);
    });
    return () => { ativo = false; };
  }, [user?.id]);

  useEffect(() => {
    if (!initializing && !user) navigate('/', { replace: true });
  }, [initializing, user, navigate]);

  if (initializing || !user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100svh' }}>
      Carregando...
    </div>
  );

  const nomeExibido = perfil?.nome || user?.nome || 'Estudante';
  const emailExibido = perfil?.email || user?.email || '';

  const iniciarEdicao = () => {
    setNome(nomeExibido === 'Estudante' ? '' : nomeExibido);
    setEmail(emailExibido);
    setErro('');
    setSucesso(false);
    setEditando(true);
  };

  const cancelarEdicao = () => {
    setEditando(false);
    setErro('');
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro('Por favor, informe seu nome.');
      return;
    }

    setSalvando(true);
    setErro('');

    try {
      const atualizado = await atualizarUsuario(user.id, {
        nome: nome.trim(),
        email: email.trim(),
      });
      setPerfil(atualizado);
      setEditando(false);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (err) {
      setErro(err.message || err.error || 'Não foi possível salvar agora. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const streakCount = progress?.streak || 0;
  const totalConquistas = progress?.achievements?.length || 0;

  return (
    <AppLayout>
      <PageHeader>
        <div>
          <h1 className={styles.title}>Meu perfil</h1>
          <p className={styles.subtitle}>Seus dados e sua jornada até aqui.</p>
        </div>
      </PageHeader>

      <div className={appStyles.pageContent}>
        {/* CARD DE DADOS BÁSICOS */}
        <div className={styles.card}>
          <div className={styles.avatarSlot} aria-hidden="true">
            {nomeExibido.charAt(0).toUpperCase()}
          </div>

          {!editando ? (
            <div className={styles.infoView}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Nome</span>
                <span className={styles.infoValue}>
                  {carregandoPerfil ? 'Carregando...' : nomeExibido}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>E-mail</span>
                <span className={styles.infoValue}>
                  {carregandoPerfil ? 'Carregando...' : emailExibido || '—'}
                </span>
              </div>

              {sucesso && (
                <p className={styles.sucessoTexto}>✓ Dados atualizados com sucesso!</p>
              )}

              <ButtonOutline onClick={iniciarEdicao} disabled={carregandoPerfil}>
                Editar dados
              </ButtonOutline>
            </div>
          ) : (
            <form className={styles.form} onSubmit={salvar}>
              <TextInput
                label="Nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={salvando}
                autoFocus
              />
              <TextInput
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={salvando}
                error={erro}
              />

              <div className={styles.formAcoes}>
                <ButtonOutline type="button" onClick={cancelarEdicao} disabled={salvando}>
                  Cancelar
                </ButtonOutline>
                <ButtonPrimary type="submit" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar'}
                </ButtonPrimary>
              </div>
            </form>
          )}
        </div>

        {/* CARDS DE ESTATÍSTICA */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{streakCount}</span>
            <span className={styles.statLabel}>
              {streakCount === 1 ? 'dia seguido' : 'dias seguidos'}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{progress?.totalPoints || 0}</span>
            <span className={styles.statLabel}>pontos</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{totalConquistas}</span>
            <span className={styles.statLabel}>
              {totalConquistas === 1 ? 'conquista' : 'conquistas'}
            </span>
          </div>
        </div>

        {/* ÚLTIMAS CONQUISTAS */}
        {totalConquistas > 0 && (
          <div className={styles.conquistasSecao}>
            <div className={styles.sectionHeader}>
              <h2>Últimas conquistas</h2>
              <ButtonOutline size="small" onClick={() => navigate('/conquistas')}>
                Ver todas
              </ButtonOutline>
            </div>
            <div className={styles.conquistasLista}>
              {progress.achievements.slice(0, 4).map((c) => (
                <div key={c.id} className={styles.conquistaChip}>
                  <span aria-hidden="true">{c.emoji}</span> {c.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
