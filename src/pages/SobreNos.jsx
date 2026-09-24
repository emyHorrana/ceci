// SobreNos.jsx

import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer/Footer';
import { RetroWindow } from '../components/Window/RetroWindow';
import { FrameCard } from '../components/Window/FrameCard.jsx';
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

const DESCRICAO_CECI = `Ceci foi uma das alunas do programa Inatel Cas@Viva e uma das grandes inspirações para o nosso projeto. Durante sua trajetória, enfrentou dificuldades com a retenção dos conteúdos e precisou lidar também com um histórico de faltas. Mesmo diante desses obstáculos, ela persistiu, superou suas dificuldades e conseguiu concluir o curso. Sua história nos mostrou que cada pessoa possui seu próprio ritmo e suas próprias necessidades para aprender, e foi justamente dessa experiência que nasceu a ideia de criar uma aplicação que tornasse o aprendizado de tecnologia mais acessível, acolhedor e adaptável.`;

const DESCRICAO_MOSQUINHA = `O Mosquinha é uma homenagem ao professor Daniel Mosca, do Inatel, nosso orientador na FETIN e uma pessoa muito especial para o projeto. Sua presença e orientação fizeram parte da nossa caminhada durante a construção da Ceci. Por isso, o mascote representa esse vínculo e a importância de quem esteve ao nosso lado, ajudando a transformar uma ideia em um projeto concreto. Assim como a Ceci representa a inspiração que deu origem à aplicação, o Mosquinha representa uma das pessoas que ajudaram a torná-la possível.`;

// github: null pra quem ainda não enviou o username (ex: Ana Clara) -
// o card renderiza sem a linha do GitHub nesse caso.
const EQUIPE = [
  {
    nome: 'Ana Julia',
    foto: '/equipe-ana-julia.jpeg',
    funcao: 'Idealizadora e programadora, graduanda em Engenharia de Software (Inatel).',
    github: 'NjjSouza',
    githubUrl: 'https://github.com/NjjSouza',
  },
  {
    nome: 'Ana Clara',
    foto: '/equipe-ana-clara.jpeg',
    funcao: 'Escritora e articuladora, graduanda em Engenharia de Software (Inatel).',
    github: null,
    githubUrl: null,
  },
  {
    nome: 'Emily Horrana',
    foto: '/equipe-emily.jpeg',
    funcao: 'Programadora e tester, graduanda em Engenharia de Software (Inatel).',
    github: 'EmyHorrana',
    githubUrl: 'https://github.com/emyHorrana',
  },
  {
    nome: 'Julia Santana',
    foto: '/equipe-julia.jpeg',
    funcao: 'Artista, graduanda em Engenharia Biomédica (Inatel).',
    github: 'Julia825-art',
    githubUrl: 'https://github.com/julia825-art',
  },
];

export default function SobreNos() {
  const navigate = useNavigate();

  return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" className={styles.voltar} onClick={() => navigate(-1)}>
            Voltar
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

            <RetroWindow
                title="ceci.exe"
                icon="💜"
                accent="branco"
                className={styles.personagemFrame}
                bodyClassName={styles.personagemCard}
            >
              <div className={styles.mascoteRow}>
                <div className={styles.mascoteFoto}>
                  <img src={cecilia} alt="Ilustração da mascote Cecília" />
                </div>
                <div className={styles.mascoteTexto}>
                  <h2>Ceci</h2>
                  <p>{DESCRICAO_CECI}</p>
                </div>
              </div>
            </RetroWindow>

            <RetroWindow
                title="mosquinha.exe"
                icon="🪰"
                accent="branco"
                className={styles.personagemFrame}
                bodyClassName={styles.personagemCard}
            >
              <div className={`${styles.mascoteRow} ${styles.mascoteRowInvertida}`}>
                <div className={styles.mascoteFoto}>
                  <img src={mosquinha} alt="Ilustração do mascote Mosquinha" />
                </div>
                <div className={styles.mascoteTexto}>
                  <h2>Mosquinha</h2>
                  <p>{DESCRICAO_MOSQUINHA}</p>
                </div>
              </div>
            </RetroWindow>
          </div>
        </section>

        <section className={styles.secaoEquipe}>


          <div className={styles.conteudoEquipe}>
            <h2 className={styles.tituloEquipe}>As desenvolvedoras</h2>
            <div className={styles.equipeGrid}>
              {EQUIPE.map((pessoa) => (
                  <FrameCard key={pessoa.nome} bodyClassName={styles.equipeCard}>
                    <img src={pessoa.foto} alt={`Foto de ${pessoa.nome}`} className={styles.equipeFoto} />
                    <strong className={styles.equipeNome}>{pessoa.nome}</strong>
                    <p className={styles.equipeFuncao}>{pessoa.funcao}</p>
                    {pessoa.github && (
                        <a
                            href={pessoa.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.equipeGithub}
                        >
                          GitHub: {pessoa.github}
                        </a>
                    )}
                  </FrameCard>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
  );
}