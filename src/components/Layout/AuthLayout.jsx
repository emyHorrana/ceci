// AuthLayout.jsx
// Casca compartilhada das telas de autenticação (Login e Cadastro):
// duas colunas - formulário de um lado, ilustração com a mascote do
// outro. Mesmo padrão do AppLayout, mas para as telas de fora do
// dashboard (que não têm sidebar).
//
// Uso:
//   <AuthLayout
//     formPosition="left"                 // 'left' (padrão) ou 'right'
//     illustration={<>...conteúdo do lado da ilustração...</>}
//   >
//     <>...conteúdo do lado do formulário...</>
//   </AuthLayout>

import styles from './AuthLayout.module.css';

export function AuthLayout({
  formPosition = 'left',
  illustrationMobileMinHeight = '240px',
  illustration,
  children,
}) {
  return (
    <div
      className={styles.container}
      data-form-position={formPosition}
      style={{ '--auth-illustration-min-height': illustrationMobileMinHeight }}
    >
      <div className={styles.formSide}>{children}</div>
      <div className={styles.illustrationSide}>{illustration}</div>
    </div>
  );
}
