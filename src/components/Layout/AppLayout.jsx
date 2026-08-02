// AppLayout.jsx
// Casca compartilhada das páginas internas (depois do login): barra
// lateral com navegação + botão de sair, e uma área de conteúdo à
// direita. Extraído do Dashboard.jsx pra não duplicar esse bloco em
// cada página nova (Módulos, Conquistas, Perfil...).
//
// O item ativo da navegação é calculado a partir da rota atual - não
// precisa passar isso por prop.
//
// Uso:
//   <AppLayout>
//     <PageHeader>...conteúdo do cabeçalho (título, stats, etc)...</PageHeader>
//     <div className={styles.pageContent /* de AppLayout.module.css */}>
//       conteúdo da página aqui
//     </div>
//   </AppLayout>
//
// PageHeader só aplica o wrapper <header> sticky compartilhado - o
// conteúdo de dentro é livre e específico de cada página.

import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import styles from './AppLayout.module.css';

export function PageHeader({ children }) {
  return <header className={styles.topbar}>{children}</header>;
}

const NAV_ITEMS = [
  { icon: '⌂', label: 'Início',      path: '/dashboard' },
  { icon: '◫', label: 'Módulos',     path: '/modulos' },
  { icon: '★', label: 'Conquistas',  path: '/conquistas' },
  { icon: '◎', label: 'Meu perfil',  path: '/perfil' },
];

export function AppLayout({ children }) {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoIcon} />
          <span className={styles.sidebarLogoText}>CECI</span>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.navItemIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className={styles.sidebarLogout} onClick={handleLogout}>
          Sair
        </button>
      </aside>

      {/* CONTEÚDO DA PÁGINA */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}