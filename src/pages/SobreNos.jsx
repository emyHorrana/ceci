// SobreNos.jsx

import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer/Footer';
import cecilia from '../assets/ceci-personagem.png';
import mosquinha from '../assets/mosquinha.png';
import ceciPaz from '../assets/ceci-paz.png';
import ceciAlmofada from '../assets/ceci-almofada.png';
import ceciTonta from '../assets/ceci-tonta.png';
import ceciCabecaBaixo from '../assets/ceci-cabeca-baixo.png';
import ceciOi from '../assets/ceci-oi.png';
import ceciDeitada from '../assets/ceci-deitada.png';
import styles from './SobreNos.module.css';
import lixeira from '../assets/lixeira.png';
import explorador from '../assets/explorador.png';

// Textos ainda são um primeiro rascunho - revisar antes de publicar.
const DESCRICAO_CECI = `Cecília, carinhosamente chamada de Ceci, é a mascote que dá nome ao projeto. Inspirada em Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since`;

const DESCRICAO_MOSQUINHA = `Mosquinha é quem aparece pra dar aquela dica na hora certa Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966.`;

export default function SobreNos() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.voltar} onClick={() => navigate(-1)}>
          ← Voltar
        </button>
      </header>

      <section className={styles.secaoHomenageados}>
        <div className={styles.decoracoes} aria-hidden="true">
          <div className={styles.colunaEsquerda}>
            <img src={ceciAlmofada} className={styles.decoracaoImg} alt="" />
            <img src={ceciCabecaBaixo} className={styles.decoracaoImg} alt="" />
            <img src={ceciDeitada} className={styles.decoracaoImg} alt="" />
            <img src={ceciTonta} className={styles.decoracaoImg} alt="" />
            <img src={lixeira} className={styles.decoracaoImg} alt="" />
            <img src={ceciPaz} className={styles.decoracaoImg} alt="" />
            <img src={ceciOi} className={styles.decoracaoImg} alt="" />
            <img src={explorador} className={styles.decoracaoImg} alt="" />
            <img src={ceciAlmofada} className={styles.decoracaoImg} alt="" />
            <img src={ceciTonta} className={styles.decoracaoImg} alt="" />
             <img src={ceciOi} className={styles.decoracaoImg} alt="" />
            <img src={lixeira} className={styles.decoracaoImg} alt="" />
          </div>
          <div className={styles.colunaDireita}>
            <img src={ceciPaz} className={styles.decoracaoImg} alt="" />
            <img src={ceciOi} className={styles.decoracaoImg} alt="" />
            <img src={ceciDeitada} className={styles.decoracaoImg} alt="" />
            <img src={explorador} className={styles.decoracaoImg} alt="" />
            <img src={ceciAlmofada} className={styles.decoracaoImg} alt="" />
            <img src={ceciOi} className={styles.decoracaoImg} alt="" />
            <img src={ceciTonta} className={styles.decoracaoImg} alt="" />
            <img src={lixeira} className={styles.decoracaoImg} alt="" />
            <img src={ceciCabecaBaixo} className={styles.decoracaoImg} alt="" />
            <img src={ceciAlmofada} className={styles.decoracaoImg} alt="" />
            <img src={ceciPaz} className={styles.decoracaoImg} alt="" />
            <img src={ceciDeitada} className={styles.decoracaoImg} alt="" />
             <img src={ceciOi} className={styles.decoracaoImg} alt="" />
             <img src={lixeira} className={styles.decoracaoImg} alt="" />
            <img src={ceciTonta} className={styles.decoracaoImg} alt="" />
          </div>
        </div>

        <div className={styles.conteudoHomenageados}>
          <h1 className={styles.titulo}>Quem inspirou os personagens da Ceci</h1>

          <div className={styles.mascoteRow}>
            <div className={styles.mascoteFoto}>
              <img src={cecilia} alt="Ilustração da mascote Cecília" />
            </div>
            <div className={styles.mascoteTexto}>
              <h2>Cecília</h2>
              <p>{DESCRICAO_CECI}</p>
            </div>
          </div>

          <div className={`${styles.mascoteRow} ${styles.mascoteRowInvertida}`}>
            <div className={styles.mascoteFoto}>
              <img src={mosquinha} alt="Ilustração do mascote Mosquinha" />
            </div>
            <div className={styles.mascoteTexto}>
              <h2>Mosquinha</h2>
              <p>{DESCRICAO_MOSQUINHA}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.secaoEquipe}>
            

        <div className={styles.conteudoEquipe}>
          <h2 className={styles.tituloEquipe}>As desenvolvedoras</h2>
          {/*nomes/fotos/textos reais da equipe. */}
          <div className={styles.equipeGrid}>
            <div className={styles.equipeCard}>
              <div className={styles.equipeFotoPlaceholder} aria-hidden />
              <strong className={styles.equipeNome}>Ana Julia</strong>
              <p className={styles.equipeTexto}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966.</p>
            </div>
            <div className={styles.equipeCard}>
              <div className={styles.equipeFotoPlaceholder} aria-hidden />
              <strong className={styles.equipeNome}>Ana Clara</strong>
              <p className={styles.equipeTexto}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966.</p>
            </div>
            <div className={styles.equipeCard}>
              <div className={styles.equipeFotoPlaceholder} aria-hidden />
              <strong className={styles.equipeNome}>Emily Horrana</strong>
              <p className={styles.equipeTexto}> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966.</p>
            </div>
            <div className={styles.equipeCard}>
              <div className={styles.equipeFotoPlaceholder} aria-hidden />
              <strong className={styles.equipeNome}>Julia Santana</strong>
              <p className={styles.equipeTexto}> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}