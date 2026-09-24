import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RetroWindow } from '../Window/RetroWindow';
import styles from './Footer.module.css';

// Texto ainda é um primeiro rascunho
const TEXTO_TEMA_FETIN = `A Feira Tecnológica Fetin do ano de 2026 conta a história da vinda de três seres extraterrestres ao Inatel: o touro, o lobo e a capivara. As três figuras são referências diretas da instituição e da cidade Santa Rita do Sapucaí, sendo o touro o mascote oficial da faculdade; o lobo, mascote de sua equipe competitiva de jogos, o E-Sports; e a capivara, mascote da cidade. 
Eles ficaram muito encantados com as tecnologias que encontraram na Terra e em especial neste lugar.
E conforme o tempo ia passando, eles vão evoluindo e aderindo a essas tecnologias, tal como personagens pokémon. 
Esperamos que sua viagem pelo universo da tecnologia, utilizando o Ceci, seja tão proveitosa quanto!Saiba mais em: https://inatel.br/fetin/`;

const ANO_ATUAL = new Date().getFullYear();

export function Footer() {
  const [modalAberto, setModalAberto] = useState(null); // null | 'tema-fetin'

  useEffect(() => {
    if (!modalAberto) return;
    const fecharComEsc = (e) => {
      if (e.key === 'Escape') setModalAberto(null);
    };
    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [modalAberto]);

  return (
      <>
        <footer className={styles.footer}>
          <nav className={styles.links} aria-label="Sobre o projeto">
          <span className={styles.linkDesabilitado}>
            Depoimentos
            <span className={styles.emBreve}>em breve</span>
          </span>

            <a
                href="https://inatel.br/casaviva/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
            >
              Mais sobre o Cas@Viva
            </a>

            <a
                href="https://inatel.br/fetin/sobre-a-fetin"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
            >
              Sobre a Fetin
            </a>

            <button type="button" className={styles.link} onClick={() => setModalAberto('tema-fetin')}>
              Tema Fetin 2026
            </button>

            <Link to="/sobre-nos" className={styles.link}>
              Sobre nós
            </Link>
          </nav>

          <div className={styles.copyright}>
            © {ANO_ATUAL} CECI - Inatel.
          </div>
        </footer>

        {modalAberto && (
            <div className={styles.overlay} onClick={() => setModalAberto(null)}>
              <RetroWindow
                  className={styles.modal}
                  bodyClassName={styles.modalBody}
                  role="dialog"
                  aria-modal="true"
                  onClick={(e) => e.stopPropagation()}
              >
                <button
                    type="button"
                    className={styles.fechar}
                    onClick={() => setModalAberto(null)}
                    aria-label="Fechar"
                >
                  ×
                </button>

                <h2 className={styles.modalTitulo}>Tema Fetin 2026</h2>
                {TEXTO_TEMA_FETIN.split('\n\n').map((paragrafo, i) => (
                    <p key={i} className={styles.modalTexto}>{paragrafo}</p>
                ))}
              </RetroWindow>
            </div>
        )}
      </>
  );
}