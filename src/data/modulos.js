/**
 * modulos.js
 * Fonte da verdade local para a estrutura de módulos e mini-módulos do CECI.
 * Não precisa estar no banco de dados - é conteúdo estático do currículo.
 * Novo: campo `dificuldade: 'demonstracao' | 'padrao' | 'desafio'` em cada etapa tipo 'jogo'
 *
 * Estrutura:
 *  modulos[]
 *    └── miniModulos[]
 *          └── etapas[]  ← cada etapa é uma "tela" dentro do mini-módulo
 *                            { titulo, conteudo (HTML/texto), dica? }
 */

// Artes da designer para os jogos de arraste/clique (substituem os emojis
// nos pontos em que já temos ícone pronto). `iconeFundo` imita a tela do
// Windows por trás dos jogos de "ícone de app" (duplo clique, arrastar).
import iconeExplorador from '../assets/explorador.png';
import iconeLixeira from '../assets/lixeira.png';
import iconeGoogle from '../assets/google.png';
import iconeFundo from '../assets/fundo.png';
import { gerarTecladoSvg, gerarFileiraBaseDetalhadaSvg } from '../utils/keyboardSvg';

export const MODULOS = [
  {
    id: '1',
    emoji: '🖱️',
    titulo: 'Uso do Mouse',
    descricao: 'Aprenda a reconhecer, segurar e usar o mouse com confiança.',
    miniModulos: [
      {
        id: '1-1',
        titulo: 'Reconhecendo o mouse',
        etapas: [
          {
            titulo: 'Bem-vindo(a) ao mouse',
            conteudo: `<p>Aqui vamos falar sobre um instrumento simples, mas muito importante para quem está começando a usar o computador: o <strong>mouse</strong>.</p> <p>Talvez você já tenha usado um mouse antes, ainda que rapidamente, ou talvez esta seja a primeira vez que vai se aproximar dele com atenção. De qualquer forma, não se preocupe: cada movimento novo, no início, exige um pouco de prática - assim como aprender a usar um controle remoto novo ou uma máquina de lavar diferente da que você já conhecia. Com o tempo, o gesto se torna natural.</p> <p>Vamos passo a passo. Sinta-se à vontade para repetir cada parte quantas vezes precisar.</p>`,
            dica: 'Vamos com calma - não existe pressa nesse aprendizado. 💛',
          },
          {
            titulo: 'O que é o mouse',
            conteudo: `<p>O mouse é aquele pequeno objeto que fica ao lado do teclado e que você segura com uma das mãos para "conversar" com o computador. Pense nele como um ponteiro: por meio dele, você indica ao computador o que deseja fazer, aponta para o que quer abrir ou selecionar.</p> <p>Existem também os <strong>touchpads</strong>, que são as superfícies planas encontradas em notebooks, onde se usa o dedo em vez do mouse. O princípio é parecido, mas aqui vamos focar no mouse tradicional, aquele que se segura com a mão.</p>`,
          },
          {
            titulo: 'Como segurar o mouse',
            conteudo: `<p>Apoie a palma da mão suavemente sobre o mouse, deixando os dedos levemente curvados sobre os botões - sem apertar. Pense em como você seguraria um controle remoto: com firmeza o suficiente para não deixar cair, mas sem tensão.</p> <p>Se sua mão ficar cansada ou dolorida, é sinal de que está segurando com força demais. Relaxe os ombros e o punho: essa postura mais tranquila facilita o controle e evita desconforto.</p>`,
            dica: 'Você já usou algum aparelho com botões, como um controle de TV ou um caixa eletrônico? O que foi mais fácil ou mais difícil na primeira vez?',
          },

          // Botão esquerdo: texto + demonstração
          {
            titulo: 'O botão esquerdo',
            conteudo: `<p>O <strong>botão esquerdo</strong> é o mais usado de todos. Fica sob o dedo indicador (para quem é destro) e serve para selecionar, abrir programas e confirmar ações (como clicar em botões).</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Demonstração: O botão esquerdo',
            instructions: 'Clique em qualquer lugar da área abaixo com o botão ESQUERDO do seu mouse.',
            jogo: 'mouse-demonstracao',
            dificuldade: 'demonstracao',
            jogoProps: { acao: 'esquerdo' },
          },

          // Botão direito: texto + demonstração
          {
            titulo: 'O botão direito',
            conteudo: `<p>O <strong>botão direito</strong> abre um menu com opções extras sobre o que você clicou - é uma forma do computador dizer "aqui estão outras coisas que você pode fazer com isso".</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Demonstração: O botão direito',
            instructions: 'Clique em qualquer lugar da área abaixo com o botão DIREITO do seu mouse.',
            jogo: 'mouse-demonstracao',
            dificuldade: 'demonstracao',
            jogoProps: { acao: 'direito' },
          },

          // Roda (scroll): texto + demonstração
          {
            titulo: 'A roda (scroll)',
            conteudo: `<p>A <strong>roda</strong> (também chamada de scroll) fica entre os dois botões e serve para rolar a tela para cima ou para baixo, revelando o que está fora da tela no momento.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Demonstração: A roda (scroll)',
            instructions: 'Gire a rodinha (scroll) do seu mouse para cima ou para baixo.',
            jogo: 'mouse-demonstracao',
            dificuldade: 'demonstracao',
            jogoProps: { acao: 'scroll' },
          },

          // Práticas de clique
          {
            tipo: 'jogo',
            titulo: 'Prática: Selecionar com botão esquerdo',
            instructions: 'Clique com o botão ESQUERDO do mouse no ícone do aplicativo "Fotos" para selecioná-lo.',
            jogo: 'clicar',
            dificuldade: 'padrao',
            jogoProps: {
              tipoClique: 'esquerdo',
              layout: 'grade',
              alvos: [
                { id: 'musica', label: '🎵 Músicas', correto: false },
                { id: 'fotos', label: '🖼️ Fotos', correto: true },
                { id: 'calculadora', label: '🔢 Calculadora', correto: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Prática: Opções com botão direito',
            instructions: 'Clique com o botão DIREITO do mouse sobre o arquivo para ver as opções extras.',
            jogo: 'clicar',
            dificuldade: 'padrao',
            jogoProps: {
              tipoClique: 'direito',
              alvos: [
                { id: 'doc', label: '📄 Meus Documentos.docx', correto: true },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Prática: Abrindo um documento',
            instructions: 'Clique com o botão DIREITO no arquivo para abrir o menu e depois clique com o botão ESQUERDO na opção "Abrir".',
            jogo: 'clicar',
            dificuldade: 'desafio',
            jogoProps: {
              alvos: [
                { id: 'arquivo', label: '📄 Relatório.pdf', correto: true },
              ],
              menuContexto: {
                instrucaoMenu: 'Escolha a ação desejada com o botão esquerdo:',
                opcoes: [
                  { id: 'abrir', label: 'Abrir', correto: true },
                  { id: 'renomear', label: 'Renomear', correto: false },
                  { id: 'excluir', label: 'Excluir', correto: false },
                ],
              },
            },
          },

          // Revisões
          {
            tipo: 'jogo',
            titulo: 'Revisão: Abrindo aplicativos',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'No dia a dia, qual ação você usa para clicar em um botão ou abrir um aplicativo na tela?',
              alternativas: [
                { id: 'esquerdo', texto: 'Clicar com o botão esquerdo (ou duplo clique)', correta: true },
                { id: 'desligar', texto: 'Apenas passar o mouse por cima sem clicar', correta: false },
                { id: 'roda', texto: 'Girar a rodinha do mouse cinco vezes', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Revisão: O botão direito',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'desafio',
            jogoProps: {
              pergunta: 'Você clicou com o botão direito num arquivo e apareceu uma lista com opções ("Abrir", "Renomear", "Excluir"). Isso é normal?',
              alternativas: [
                { id: 'sim', texto: 'Sim, o botão direito serve exatamente para abrir o menu de opções extras', correta: true },
                { id: 'nao', texto: 'Não, isso é um defeito do mouse', correta: false },
                { id: 'desligar', texto: 'Não, o computador vai travar', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Revisão: A rodinha (scroll)',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Quando uma página ou documento é muito comprido e não cabe inteiro na tela, o que você usa para ver o resto do texto?',
              alternativas: [
                { id: 'scroll', texto: 'Girar a rodinha (scroll) do mouse para cima ou para baixo', correta: true },
                { id: 'direito', texto: 'Clicar com o botão direito repetidas vezes', correta: false },
                { id: 'desligar', texto: 'Desligar o monitor', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '1-2',
        titulo: 'Movimento do cursor',
        etapas: [
          {
            titulo: 'O cursor: seu dedo virtual',
            conteudo: `<p>Quando você move o mouse sobre a mesa, uma pequena seta se move na tela do computador. Essa seta é chamada de <strong>cursor</strong>, e ela é o seu "dedo virtual" - é por meio dela que você aponta para tudo o que deseja fazer.</p>
<ul>
  <li>Se você mover o mouse para cima, o cursor sobe.</li>
  <li>Se mover para baixo, o cursor desce.</li>
  <li>Para a esquerda, o cursor vai para a esquerda da tela.</li>
  <li>Para a direita, o cursor vai para a direita.</li>
</ul>`,
          },
          {
            titulo: 'Ajustando o ritmo',
            conteudo: `<p>No começo, é comum que a mão queira ir mais rápido do que o cursor consegue acompanhar, ou o contrário. Isso é absolutamente normal - é uma questão de costume, parecida com aprender a dosar a força ao mexer em uma torneira nova até descobrir o ponto certo.</p>
<p>Uma dica valiosa: mova o mouse devagar no início. Você pode até levantar o mouse do lugar e reposicioná-lo no centro da mesa se sentir que "ficou sem espaço" - isso não afeta nada no computador, só o cursor não se move enquanto o mouse está no ar.</p>`,
            dica: 'Pensando em apontar para algo numa prateleira ou indicar um lugar num mapa: você percebe alguma semelhança com apontar o cursor na tela?',
          },
          {
            titulo: 'O clique simples',
            conteudo: `<p>Depois de conseguir mover o cursor com tranquilidade, vem o próximo passo: parar o cursor exatamente onde você quer e fazer um <strong>clique simples</strong>, apertando levemente o botão esquerdo uma única vez.</p>
<p>É esse clique que você vai usar para selecionar algo na tela ou confirmar uma escolha.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Agora é sua vez!',
            instructions: 'Clique no botão abaixo com o botão esquerdo do mouse.',
            jogo: 'clicar',
            dificuldade: 'demonstracao', // 1 alvo só, zero distrator
            jogoProps: {
              alvos: [{ id: 'aqui', label: '👆 Clique aqui', correto: true }],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Mais uma vez, com atenção',
            instructions: 'Dessa vez tem mais de uma opção na tela - clique só na certa.',
            jogo: 'clicar',
            dificuldade: 'padrao',
            jogoProps: {
              layout: 'grade',
              alvos: [
                { id: 'errado', label: '👆 Não é aqui', correto: false },
                { id: 'certo', label: '👆 Clique aqui', correto: true },
              ],
            },
          },
          // NOVO - faltava um `desafio`: mesma mecânica, mais distratores.
          {
            tipo: 'jogo',
            titulo: 'Com mais opções na tela',
            instructions: 'Agora tem 4 opções - clique só na certa, sem demora.',
            jogo: 'clicar',
            dificuldade: 'desafio',
            jogoProps: {
              layout: 'grade',
              alvos: [
                { id: 'errado1', label: '👆 Não é aqui', correto: false },
                { id: 'errado2', label: '👆 Também não', correto: false },
                { id: 'certo', label: '👆 Clique aqui', correto: true },
                { id: 'errado3', label: '👆 Nem aqui', correto: false },
              ],
            },
          },
        ],
      },
      {
        id: '1-3',
        titulo: 'Duplo clique',
        etapas: [
          {
            titulo: 'O que é o duplo clique',
            conteudo: `<p>O duplo clique é simplesmente dois cliques rápidos, um logo em seguida do outro, feitos com o botão esquerdo, sem mover o mouse entre eles.</p>
<p>Ele é usado, por exemplo, para abrir arquivos, pastas ou programas - é como "bater duas vezes na porta" para avisar que você quer entrar.</p>`,
          },
          {
            titulo: 'Pegando o ritmo',
            conteudo: `<p>O desafio, no início, costuma ser o ritmo: se os cliques forem devagar demais, o computador entende como dois cliques separados, e não como um duplo clique. Se vier com muita força ou muito rápido, pode acontecer de sair do lugar.</p>
<p>Não existe problema em tentar novamente - praticar esse ritmo é como aprender a bater palmas em um compasso constante: no começo exige atenção, depois vem naturalmente.</p>`,
            dica: 'Mantenha a mão parada sobre o mouse durante os dois cliques, sem deslizar. Isso ajuda bastante a acertar o duplo clique!',
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o duplo clique',
            instructions: 'Dê um duplo clique (dois cliques rápidos, sem mover o mouse) no ícone do Google, para abri-lo.',
            jogo: 'clicar',
            dificuldade: 'demonstracao', // 1 alvo só, zero distrator
            jogoProps: {
              duploClique: true,
              fundo: iconeFundo,
              alvos: [{ id: 'google', label: 'Google', icone: iconeGoogle, correto: true }],
            },
          },
          // NOVO - faltava `padrao`: agora tem um ícone perto que não é
          // o alvo, pra reforçar que é preciso mirar certo, não só
          // acertar o ritmo do duplo clique.
          {
            tipo: 'jogo',
            titulo: 'Duplo clique no ícone certo',
            instructions: 'Dê um duplo clique só no ícone do Google - não no Explorador de Arquivos ao lado.',
            jogo: 'clicar',
            dificuldade: 'padrao',
            jogoProps: {
              duploClique: true,
              layout: 'grade',
              fundo: iconeFundo,
              alvos: [
                { id: 'explorador', label: 'Explorador de Arquivos', icone: iconeExplorador, correto: false },
                { id: 'google', label: 'Google', icone: iconeGoogle, correto: true },
              ],
            },
          },
        ],
      },
      {
        id: '1-4',
        titulo: 'Scroll (a rodinha do mouse)',
        etapas: [
          {
            titulo: 'Rolando a página',
            conteudo: `<p>O scroll é a rodinha que fica entre os dois botões do mouse. Ela serve para rolar a página na tela, revelando conteúdos que estão acima ou abaixo do que você está vendo no momento - como quando você folheia as páginas de uma revista para ver o que vem a seguir.</p>
<ul>
  <li>Girar a roda para baixo faz a página rolar para baixo, mostrando o conteúdo que estava mais abaixo.</li>
  <li>Girar a roda para cima faz a página voltar, mostrando o que estava mais acima.</li>
</ul>`,
          },
          {
            titulo: 'Controlando a velocidade',
            conteudo: `<p>Você pode controlar a velocidade da rolagem: gire devagar para ler com calma, ou um pouco mais rápido quando quiser passar por um conteúdo já conhecido.</p>
<p>O importante é girar aos poucos e observar como a tela responde, até sentir confiança para parar exatamente no ponto que deseja ler.</p>`,
            dica: 'Essa ação de "rolar" pra ver mais conteúdo lembra alguma outra situação da sua vida, como desenrolar um tecido ou passar as páginas de um álbum de fotos?',
          },
          {
            tipo: 'jogo',
            titulo: 'Primeiro contato com o scroll',
            instructions: 'Role a área abaixo até parar em qualquer ponto dentro da faixa marcada - ela é bem larga.',
            jogo: 'scroll',
            dificuldade: 'demonstracao',
            jogoProps: {
              zonaAlvo: { inicio: 20, fim: 80 },
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o scroll para baixo',
            instructions: 'Role a área abaixo (com a rodinha do mouse) até parar dentro da faixa marcada no meio.',
            jogo: 'scroll',
            dificuldade: 'padrao',
            jogoProps: {
              zonaAlvo: { inicio: 45, fim: 55 },
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o scroll com precisão',
            instructions: 'Role com mais calma até parar exatamente na faixa mais estreita abaixo.',
            jogo: 'scroll',
            dificuldade: 'desafio',
            jogoProps: {
              zonaAlvo: { inicio: 70, fim: 76 },
              alturaConteudoPx: 1200,
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Revisão: Subir e descer páginas',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Você rolou uma página da internet até o fim e quer voltar ao início do texto. Para qual direção você gira a rodinha do mouse?',
              alternativas: [
                { id: 'cima', texto: 'Girar a rodinha para cima', correta: true },
                { id: 'baixo', texto: 'Girar a rodinha para baixo', correta: false },
                { id: 'clique-duplo', texto: 'Dar um clique duplo no teclado', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '1-5',
        titulo: 'Arrastar e soltar',
        etapas: [
          {
            titulo: 'Como arrastar e soltar',
            conteudo: `<p>Arrastar e soltar é uma ação um pouco mais completa, que reúne tudo o que vimos até aqui:</p>
<ol>
  <li>Você posiciona o cursor sobre um item na tela (um ícone, por exemplo).</li>
  <li>Clica e segura o botão esquerdo, sem soltar.</li>
  <li>Move o mouse até o local desejado, mantendo o botão pressionado.</li>
  <li>Solta o botão no lugar certo, "largando" o item ali.</li>
</ol>
<p>É parecido com pegar um objeto da mesa e carregá-lo até outro lugar antes de soltá-lo: enquanto você o segura, ele se move junto com sua mão; quando você abre a mão, ele fica onde foi deixado.</p>`,
          },
          {
            titulo: 'Pra que serve',
            conteudo: `<p>Esse recurso é útil, por exemplo, para mover ícones de lugar na tela ou para selecionar um trecho de texto (arrastando o cursor sobre as palavras que você deseja marcar).</p>`,
          },
          {
            titulo: 'Atenção ao soltar',
            conteudo: `<p>O ponto de maior atenção aqui é não soltar o botão antes da hora. Se isso acontecer, o item cai em um lugar diferente do pretendido - mas não é motivo para preocupação, pois basta repetir o processo e arrastá-lo novamente para o lugar certo.</p>`,
            dica: 'Você consegue pensar numa tarefa manual do dia a dia - como carregar uma xícara até a pia - parecida com o movimento de "segurar e soltar"?',
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique arrastar e soltar',
            instructions: 'Arraste o documento abaixo até a pasta do Explorador de Arquivos.',
            jogo: 'arrastar',
            dificuldade: 'demonstracao',
            jogoProps: {
              fundo: iconeFundo,
              item: { id: 'documento', label: '📄 Documento' },
              zonas: [{ id: 'pasta', label: 'Explorador de Arquivos', icone: iconeExplorador, correta: true }],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Mais uma vez',
            instructions: 'Agora arraste a foto até a lixeira, pra apagá-la.',
            jogo: 'arrastar',
            dificuldade: 'demonstracao',
            jogoProps: {
              fundo: iconeFundo,
              item: { id: 'foto', label: '🖼️ Foto' },
              zonas: [{ id: 'lixeira', label: 'Lixeira', icone: iconeLixeira, correta: true }],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Com atenção: tem duas opções agora',
            instructions: 'Arraste a música até a lixeira - repare que agora tem mais de um lugar na tela.',
            jogo: 'arrastar',
            dificuldade: 'padrao',
            jogoProps: {
              fundo: iconeFundo,
              item: { id: 'musica', label: '🎵 Música' },
              zonas: [
                { id: 'pasta', label: 'Explorador de Arquivos', icone: iconeExplorador, correta: false },
                { id: 'lixeira', label: 'Lixeira', icone: iconeLixeira, correta: true },
              ],
            },
          },
          {
            titulo: 'Selecionando vários itens ao mesmo tempo',
            conteudo: `<p>Às vezes você quer mover, copiar ou apagar vários arquivos de uma vez, em vez de um por um. Uma forma simples de fazer isso: clique numa área vazia perto dos arquivos e arraste - como se estivesse "jogando uma rede" por cima dos itens que quer pegar. Tudo que a rede tocar fica selecionado.</p>
<p>Depois de selecionados, qualquer ação que você fizer (arrastar pra lixeira, copiar, etc.) vale para todos de uma vez.</p>`,
            dica: 'Existe também outra forma, segurando uma tecla (geralmente Ctrl) e clicando em cada arquivo individualmente - mas arrastar costuma ser mais rápido quando os itens estão pertinho um do outro.',
          },
          {
            tipo: 'jogo',
            titulo: 'Selecione as fotos',
            instructions: 'Arraste sobre as 3 fotos (sem incluir os documentos) para selecioná-las todas de uma vez.',
            jogo: 'selecionar-arrastando',
            dificuldade: 'desafio',
            jogoProps: {
              modo: 'arquivos',
              itens: [
                { id: 'doc1', rotulo: '📄 Documento', alvoSelecao: false },
                { id: 'foto1', rotulo: '🖼️ Foto', alvoSelecao: true },
                { id: 'foto2', rotulo: '🖼️ Foto', alvoSelecao: true },
                { id: 'foto3', rotulo: '🖼️ Foto', alvoSelecao: true },
                { id: 'doc2', rotulo: '📄 Documento', alvoSelecao: false },
              ],
            },
          },
          {
            titulo: 'Selecionando um trecho de texto',
            conteudo: `<p>O mesmo gesto de arrastar também serve para marcar parte de um texto - por exemplo, antes de copiar ou apagar só um trecho, sem mexer no resto.</p>
<p>Clique bem no início do trecho que você quer, segure o botão, arraste até o final dele e solte. As palavras por onde o cursor passou ficam destacadas (geralmente em azul), mostrando o que está selecionado.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Selecione o trecho certo',
            instructions: `Arraste sobre as palavras "computador está lento" para selecioná-las.`,
            jogo: 'selecionar-arrastando',
            dificuldade: 'desafio',
            jogoProps: {
              modo: 'texto',
              itens: [
                { id: 'hoje', rotulo: 'Hoje', alvoSelecao: false },
                { id: 'o', rotulo: 'o', alvoSelecao: false },
                { id: 'computador', rotulo: 'computador', alvoSelecao: true },
                { id: 'esta', rotulo: 'está', alvoSelecao: true },
                { id: 'lento', rotulo: 'lento', alvoSelecao: true },
              ],
            },
          },
        ],
      },
      {
        id: '1-6',
        titulo: 'Coordenação e precisão',
        etapas: [
          {
            titulo: 'Juntando tudo o que você aprendeu',
            conteudo: `<p>Este último tópico traz um convite para exercitar tudo o que foi aprendido - mover o cursor, clicar com o esquerdo e direito, dar duplo clique, rolar a tela e arrastar - em situações práticas do dia a dia, como:</p>
<ul>
  <li>Clicar em botões menores ou links</li>
  <li>Fechar, maximizar ou minimizar uma janela</li>
  <li>Abrir e fechar programas</li>
  <li>Selecionar arquivos com precisão</li>
  <li>Navegar por menus</li>
</ul>`,
          },
          {
            titulo: 'A precisão vem com a prática',
            conteudo: `<p>É natural que, no começo, a mão precise de mais tempo para apontar com exatidão em áreas menores da tela. Isso melhora com a repetição tranquila, da mesma forma que qualquer habilidade manual - como costurar um botão ou encaixar uma chave na fechadura.</p>
<p>Se em algum momento você clicar fora do lugar, não há problema: basta clicar novamente no local correto. Errar faz parte do processo de aprender.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Prática: Fechar janela (botão pequeno)',
            instructions: 'Com calma e precisão, clique no botão de fechar (✕) no canto superior da janela.',
            jogo: 'clicar',
            dificuldade: 'padrao',
            jogoProps: {
              layout: 'linha',
              alvos: [
                { id: 'minimizar', label: '— Minimizar', correto: false },
                { id: 'maximizar', label: '□ Maximizar', correto: false },
                { id: 'fechar', label: '✕ Fechar janela', correto: true },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Prática: Mira e precisão em grade',
            instructions: 'Clique com precisão apenas no ícone do "Navegador de Internet" entre os vários programas.',
            jogo: 'clicar',
            dificuldade: 'padrao',
            jogoProps: {
              layout: 'grade',
              alvos: [
                { id: 'calculadora', label: '🔢 Calculadora', correto: false },
                { id: 'navegador', label: '🌐 Navegador', correto: true },
                { id: 'relogio', label: '⏰ Relógio', correto: false },
                { id: 'notas', label: '📝 Bloco de notas', correto: false },
                { id: 'lixeira', label: '🗑️ Lixeira', correto: false },
                { id: 'painel', label: '⚙️ Configurações', correto: false },
              ],
            },
          },
          {
            titulo: 'Hora de treinar com movimento',
            conteudo: `<p>Na vida real, às vezes você precisa acompanhar algo que se move na tela. O exercício a seguir ajuda a treinar essa coordenação olho-mão.</p>
<p>Sem pressa: o alvo vai se mover suavemente pela área. Vá acompanhando com o olhar e clique quando sentir que posicionou o cursor sobre ele.</p>`,
            dica: 'Mova o mouse na direção geral do alvo com calma, sem fazer movimentos bruscos.',
          },
          {
            tipo: 'jogo',
            titulo: 'Desafio: Coordenação com alvo móvel',
            instructions: 'Acompanhe o alvo com o cursor e clique nele quando conseguir alcançá-lo.',
            jogo: 'alvo-movel',
            dificuldade: 'desafio',
            jogoProps: { velocidade: 35, rotulo: '🎯 Clique aqui' },
          },
          {
            titulo: 'Para lembrar',
            conteudo: `<ul>
  <li>O mouse é a sua forma de apontar e escolher no computador.</li>
  <li>O cursor (a seta na tela) segue o movimento da sua mão.</li>
  <li>Clique simples seleciona; duplo clique abre; o botão direito mostra opções extras.</li>
  <li>A rodinha (scroll) rola a página para cima ou para baixo.</li>
  <li>Arrastar e soltar é clicar, segurar, mover e soltar no lugar certo.</li>
  <li>A precisão vem com o tempo e com a prática - continue sempre no seu ritmo!</li>
</ul>`,
            dica: 'Você está construindo, um clique de cada vez, uma habilidade que vai abrir muitas portas. Parabéns pelo empenho!',
          },
        ],
      },
    ],
  },

  /**
   * RASCUNHO - Módulo 2 (Teclado) com o campo `dificuldade` adicionado.
   *
   * Mesmo espírito do rascunho do Módulo 1: nenhum texto pedagógico foi
   * reescrito, só foi adicionado:
   *
   *   1. O campo `dificuldade` em todas as 39 etapas tipo 'jogo' que já
   *      existiam.
   *   2. 1 etapa nova (marcada "// NOVO"), fechando a única lacuna real
   *      encontrada.
   *
   * Diferença importante em relação ao Módulo 1: aqui quase não faltava
   * nada. As 15 Unidades que cobrem o Módulo 2 (U2.1 a U2.8, ver
   * data/unidades.js) já têm um `checkpoint` no fim de cada uma - e
   * esse checkpoint já cumpre o papel de `desafio` na maioria dos
   * casos. Então, diferente do Módulo 1 (onde eu inventei etapas de
   * `desafio` dentro do mini-módulo), aqui o padrão
   * demonstração → padrão → (checkpoint da Unidade = desafio) já
   * aparece organicamente na maior parte dos mini-módulos:
   *
   *   - 2-1/2-2 (U2.1), 2-6/2-7 (U2.3), 2-8/2-9 (U2.4),
   *     2-12/2-13 (U2.6): arco completo, nenhuma lacuna.
   *   - 2-3/2-4/2-5 (U2.2): arco completo (2-3 e o "Pratique a barra de
   *     espaço" de 2-4 fazem as vezes de demonstração; "Pratique duas
   *     palavras" e o quiz do Enter já são padrão real).
   *   - 2-14 (Atalhos, U2.7, tier 2): os 4 atalhos são demonstração
   *     (sem distrator - escuta o teclado físico, não tem nada clicável
   *     na tela) e o quiz final já funciona como desafio dentro do
   *     próprio mini-módulo, além do checkpoint da Unidade.
   *   - 2-15 (Prática funcional, U2.8): igual ao 1-6 do mouse - é o
   *     mini-módulo de fechamento, então as 2 etapas já nascem
   *     `desafio` mesmo (os próprios títulos já diziam "Desafio:").
   *   - 2-10/2-11 (Números e símbolos, U2.5): ÚNICA lacuna real - as
   *     duas mini-módulos pulavam direto pra prática com validação
   *     (mín. 2 dígitos, CEP com hífen etc), sem nenhum primeiro
   *     contato sem risco. Adicionei 1 etapa `demonstracao` no início
   *     de 2-10 (reaproveitando o jogo 'digitar', sem `validar` -
   *     mesmo padrão que "Pratique mais uma vez" em 2-3).
   *
   * Isso é uma boa notícia: mostra que a estrutura de vocês já nasceu
   * bem desenhada nesse sentido - a maior parte do trabalho aqui foi
   * só nomear o que já existia, não consertar.
   */

  {
    id: '2',
    emoji: '⌨️',
    titulo: 'Uso do Teclado',
    descricao: 'Conheça as teclas e aprenda a digitar com segurança.',
    miniModulos: [
      {
        id: '2-1',
        titulo: 'Reconhecendo o teclado',
        etapas: [
          {
            titulo: 'O que é o teclado',
            conteudo: `<p>Agora que você já se sente mais à vontade com o mouse, vamos conhecer outra ferramenta essencial: o <strong>teclado</strong>. É por meio dele que você vai escrever mensagens, preencher formulários, digitar uma senha ou até mandar um recado para um familiar.</p>
<p>Pode parecer que existem teclas demais, e é natural sentir um pouco de insegurança no início - mas você não precisa decorar tudo de uma vez. Vamos avançar aos poucos, uma tecla de cada vez.</p>`,
          },
          {
            titulo: 'O que você vai encontrar: as letras',
            conteudo: `<p>As letras ficam concentradas bem no <strong>centro</strong> do teclado, no bloco principal - é ali que você vai passar a maior parte do tempo digitando.</p>
<p>Um detalhe que costuma surpreender: elas não seguem a ordem do alfabeto (A, B, C...). O motivo é histórico, vem de máquinas de escrever antigas - mas não se preocupe em decorar a ordem agora, seus dedos vão aprender o caminho naturalmente com a prática.</p>
${gerarTecladoSvg('letras')}`,
          },
          {
            titulo: 'O que você vai encontrar: os números',
            conteudo: `<p>Os números aparecem em <strong>dois lugares</strong>: numa fileira ao longo do topo do teclado, e também - em muitos teclados de computador de mesa - num bloco separado do lado direito, parecido com uma calculadora.</p>
<p>Esse bloco à direita nem sempre existe (notebooks costumam não ter), mas quando existe, é uma forma rápida de digitar números em sequência, como um valor ou uma data.</p>
${gerarTecladoSvg('numeros')}`,
          },
          {
            titulo: 'O que você vai encontrar: os símbolos',
            conteudo: `<p>Símbolos como @ (arroba), ponto e vírgula ficam <strong>acessíveis</strong> por combinações de teclas, principalmente em cima da fileira de números e em algumas teclas específicas próximas ao Enter - você vai aprender a digitar os mais usados mais adiante, com calma.</p>
<p>Por enquanto, só vale saber que eles existem e mais ou menos onde procurar.</p>
${gerarTecladoSvg('simbolos')}
<p>Uma última observação sobre o teclado como um todo: teclas maiores, como a barra de espaço e o Enter, são pensadas de propósito pra serem fáceis de encontrar sem precisar olhar.</p>`,
            dica: 'Você já usou algum teclado antes, como o de um caixa eletrônico ou de um telefone antigo? O que foi parecido ou diferente do teclado do computador?',
          },
          {
            tipo: 'jogo',
            titulo: 'Você reparou nas letras?',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Verdadeiro ou falso: as letras do teclado seguem a ordem do alfabeto (A, B, C...), como num abecedário.',
              alternativas: [
                { id: 'falso', texto: 'Falso', correta: true },
                { id: 'verdadeiro', texto: 'Verdadeiro', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Onde ficam as letras?',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Onde fica concentrada a maior parte das letras no teclado?',
              alternativas: [
                { id: 'centro', texto: 'No centro do teclado, no bloco principal', correta: true },
                { id: 'direita', texto: 'No teclado numérico da lateral direita', correta: false },
                { id: 'cima', texto: 'Apenas na fileira de cima junto aos números', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'O teclado numérico',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Para que serve o bloco de números localizado no lado direito de muitos teclados?',
              alternativas: [
                { id: 'calculadora', texto: 'Para digitar números com facilidade e rapidez, como numa calculadora', correta: true },
                { id: 'desligar', texto: 'Para ligar e desligar o computador', correta: false },
                { id: 'letras', texto: 'Para escrever palavras em letra maiúscula', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-2',
        titulo: 'Posição das mãos',
        etapas: [
          {
            titulo: 'Como apoiar as mãos',
            conteudo: `<p>Apoie os pulsos de maneira relaxada, sem tensão, e deixe os dedos levemente curvados sobre as teclas - como se estivesse prestes a tocar um instrumento musical.</p>
<p>Não existe obrigação de usar todos os dedos: algumas pessoas digitam com apenas um ou dois dedos, e isso funciona muito bem, principalmente no início. Com o tempo, se sentir vontade, você pode ir incorporando mais dedos - mas isso é um objetivo de longo prazo, não uma exigência imediata.</p>`,
          },
          {
            titulo: 'Um toque leve já basta',
            conteudo: `<p>Pressione as teclas suavemente. Elas não precisam de força para responder - assim como o controle remoto de uma televisão, um toque leve já é suficiente. Apertar com força só cansa os dedos, sem necessidade.</p>`,
          },
          {
            titulo: 'Se quiser digitar mais rápido, no seu tempo',
            conteudo: `<p>Isso aqui é opcional - lembre-se, não existe obrigação de usar todos os dedos. Mas se um dia você quiser ganhar velocidade, existe um truque usado por quem digita bastante: cada dedo tem uma "casinha" numa fileira central do teclado, chamada de <strong>fileira base</strong>. Ele sai dali pra apertar outras teclas e sempre volta pra essa posição de descanso.</p>
${gerarFileiraBaseDetalhadaSvg()}
<p><strong>Mão esquerda</strong> (fileira em amarelo): mindinho no A, anelar no S, médio no D, indicador no F.</p>
<p><strong>Mão direita</strong> (fileira em âmbar): indicador no J, médio no K, anelar no L, mindinho no Ç.</p>
<p>Com o tempo, esses dedos aprendem o caminho sozinhos, sem você precisar olhar pra baixo - é exatamente isso que faz digitar ficar mais rápido.</p>`,
            dica: 'Não se preocupe em decorar agora - as próximas etapas são só pra ir pegando o jeito, uma tecla de cada vez, sem pressa nenhuma.',
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique: A',
            instructions: 'Aperte a tecla A no seu teclado.',
            jogo: 'pressionar-letra',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'a', dedo: 'mindinho esquerdo' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique: S',
            instructions: 'Aperte a tecla S no seu teclado.',
            jogo: 'pressionar-letra',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 's', dedo: 'anelar esquerdo' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique: D',
            instructions: 'Aperte a tecla D no seu teclado.',
            jogo: 'pressionar-letra',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'd', dedo: 'médio esquerdo' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique: F',
            instructions: 'Aperte a tecla F no seu teclado.',
            jogo: 'pressionar-letra',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'f', dedo: 'indicador esquerdo' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique: J',
            instructions: 'Aperte a tecla J no seu teclado.',
            jogo: 'pressionar-letra',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'j', dedo: 'indicador direito' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique: K',
            instructions: 'Aperte a tecla K no seu teclado.',
            jogo: 'pressionar-letra',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'k', dedo: 'médio direito' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique: L',
            instructions: 'Aperte a tecla L no seu teclado.',
            jogo: 'pressionar-letra',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'l', dedo: 'anelar direito' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique: ;',
            instructions: 'Aperte a tecla ; no seu teclado.',
            jogo: 'pressionar-letra',
            dificuldade: 'demonstracao',
            jogoProps: { letra: ';', dedo: 'mindinho direito' },
          },
          {
            tipo: 'jogo',
            titulo: 'Sobre os dedos',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Verdadeiro ou falso: para digitar corretamente, é obrigatório usar os dez dedos.',
              alternativas: [
                { id: 'falso', texto: 'Falso', correta: true },
                { id: 'verdadeiro', texto: 'Verdadeiro', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'A força ao digitar',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Qual é a forma correta de pressionar as teclas do teclado?',
              alternativas: [
                { id: 'suave', texto: 'Com toques leves e suaves, sem precisar de força', correta: true },
                { id: 'forte', texto: 'Apertando com o máximo de força possível', correta: false },
                { id: 'pancada', texto: 'Dando pancadas rápidas com os punhos', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'A fileira base',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'O que é a "fileira base" (onde ficam as teclas A, S, D, F e J, K, L, Ç)?',
              alternativas: [
                { id: 'descanso', texto: 'A posição central de descanso e referência para onde os dedos retornam', correta: true },
                { id: 'bloqueio', texto: 'Uma trava de segurança que bloqueia o teclado', correta: false },
                { id: 'som', texto: 'A fileira que controla o volume do computador', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-3',
        titulo: 'Digitação básica',
        etapas: [
          {
            titulo: 'Seus primeiros passos digitando',
            conteudo: `<p>Digitar é simplesmente apertar as teclas correspondentes às letras, números ou palavras que você deseja escrever. O caminho mais tranquilo é começar por algo familiar: o seu próprio nome, por exemplo.</p>
<p>Vá com calma. Digitar devagar, letra por letra, é uma etapa normal e importante do aprendizado - não é sinal de dificuldade, mas parte natural do processo, como quem está aprendendo a bordar um ponto novo e vai devagar até pegar o jeito.</p>
<p>Se, ao digitar, uma letra sair errada, não há problema algum: já vamos ver como corrigir isso com tranquilidade, usando a tecla Backspace.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique digitando: gato',
            instructions: 'Digite a palavra "gato" e confirme.',
            jogo: 'digitar',
            dificuldade: 'demonstracao',
            jogoProps: {
              label: 'Digite a palavra "gato"',
              placeholder: 'Digite aqui',
              validar: (valor) => valor.toLowerCase() === 'gato',
              mensagemErro: 'Quase lá! Confere se digitou "gato" certinho.',
            },
          },
          {
            titulo: 'Praticando outra palavra do dia a dia',
            conteudo: `<p>Agora vamos praticar com outra palavra bem comum do nosso cotidiano: <strong>casa</strong>.</p>
<p>Procure cada letra no teclado com calma: primeiro a letra C, depois A, depois S e por fim a letra A novamente.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique digitando: casa',
            instructions: 'Digite a palavra "casa" e confirme.',
            jogo: 'digitar',
            dificuldade: 'padrao',
            jogoProps: {
              label: 'Digite a palavra "casa"',
              placeholder: 'Digite aqui',
              validar: (valor) => valor.toLowerCase() === 'casa',
              mensagemErro: 'Confere se digitou "casa" certinho (C - A - S - A).',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique digitando: sol',
            instructions: 'Digite a palavra "sol" e confirme.',
            jogo: 'digitar',
            dificuldade: 'padrao',
            jogoProps: {
              label: 'Digite a palavra "sol"',
              placeholder: 'Digite aqui',
              validar: (valor) => valor.toLowerCase() === 'sol',
              mensagemErro: 'Confere se digitou "sol" certinho (S - O - L).',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Ritmo e paciência',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Ao começar a digitar no computador, o que é mais recomendado?',
              alternativas: [
                { id: 'calma', texto: 'Digitar com calma e no seu próprio ritmo, sem pressa', correta: true },
                { id: 'rapido', texto: 'Tentar digitar o mais rápido possível sem olhar', correta: false },
                { id: 'forca', texto: 'Apertar as teclas com força para não errar', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Corrigindo letras erradas',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Se você errar uma letra ao digitar uma palavra, o que deve fazer?',
              alternativas: [
                { id: 'apagar', texto: 'Usar a tecla de apagar com tranquilidade e digitar a letra certa', correta: true },
                { id: 'desligar', texto: 'Desligar o monitor e reiniciar o computador', correta: false },
                { id: 'desistir', texto: 'Não é possível corrigir textos no computador', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-4',
        titulo: 'Barra de espaço',
        etapas: [
          {
            titulo: 'Separando as palavras',
            conteudo: `<p>A barra de espaço é a tecla comprida localizada na parte inferior do teclado. Ela serve para separar as palavras, criando o espaço em branco que permite a leitura, exatamente como fazemos ao escrever à mão.</p>
<ul>
  <li>Aperte a barra de espaço uma vez entre cada palavra - apertar várias vezes seguidas cria espaços demais no texto.</li>
  <li>Depois do espaço, você pode continuar digitando normalmente a próxima palavra da frase.</li>
</ul>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a barra de espaço',
            instructions: 'Aperte a barra de espaço (a tecla comprida, destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'espaco' },
          },
          {
            titulo: 'Usando o espaço numa frase de verdade',
            conteudo: `<p>Agora vamos juntar a barra de espaço com o que você já sabe: digitar. Escreva duas palavras separadas por um espaço, como se estivesse escrevendo o começo de uma frase: <strong>bom dia</strong>.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique duas palavras',
            instructions: 'Digite as palavras "bom dia" separadas por um espaço e confirme.',
            jogo: 'digitar',
            dificuldade: 'padrao',
            jogoProps: {
              label: 'Digite "bom dia"',
              placeholder: 'Ex: bom dia',
              validar: (valor) => valor.trim().toLowerCase() === 'bom dia' || valor.trim().split(/\s+/).length >= 2,
              mensagemErro: 'Faltou o espaço entre as palavras - digite "bom dia" com um espaço no meio.',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Espaçamento correto',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Quantas vezes devemos apertar a barra de espaço entre uma palavra e outra?',
              alternativas: [
                { id: 'uma', texto: 'Apenas 1 vez', correta: true },
                { id: 'varias', texto: '5 vezes seguidas', correta: false },
                { id: 'segurar', texto: 'Segurar apertado por vários segundos', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Localização da barra de espaço',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Como você pode identificar a barra de espaço no teclado com facilidade?',
              alternativas: [
                { id: 'comprida', texto: 'É a tecla mais comprida e fica na parte inferior central', correta: true },
                { id: 'canto', texto: 'Fica no canto superior direito bem pequena', correta: false },
                { id: 'redonda', texto: 'É uma tecla redonda que fica atrás do teclado', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-5',
        titulo: 'Enter',
        etapas: [
          {
            titulo: 'Os usos do Enter',
            conteudo: `<p>A tecla Enter costuma ficar do lado direito do teclado e tem alguns usos bem comuns:</p>
<ul>
  <li><strong>Quebrar linha</strong>: ao escrever um texto mais longo, o Enter leva o cursor para a linha de baixo, começando um novo parágrafo.</li>
  <li><strong>Confirmar uma ação</strong>: em muitas telas, apertar Enter é como dizer "sim, pode continuar" - por exemplo, depois de digitar uma senha.</li>
  <li><strong>Enviar uma mensagem</strong>: em aplicativos de conversa, o Enter costuma enviar o que foi escrito.</li>
  <li><strong>Abrir uma pesquisa</strong>: ao digitar algo em um site de busca, apertar Enter inicia a procura.</li>
</ul>
<p>Pense nele como o ponto final de uma ação: ele avisa ao computador que você concluiu aquele passo.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Enter',
            instructions: 'Aperte a tecla Enter (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'enter' },
          },
          {
            tipo: 'jogo',
            titulo: 'Enter no dia a dia',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Você terminou de escrever uma mensagem para um familiar num aplicativo de conversa. Qual tecla costuma enviá-la?',
              alternativas: [
                { id: 'enter', texto: 'Enter', correta: true },
                { id: 'tab', texto: 'Tab', correta: false },
                { id: 'esc', texto: 'Esc', correta: false },
                { id: 'seta', texto: 'Uma seta direcional', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Pulando de linha',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Ao escrever um bilhete ou mensagem, qual tecla você aperta para pular para a linha de baixo?',
              alternativas: [
                { id: 'enter', texto: 'Tecla Enter', correta: true },
                { id: 'espaco', texto: 'Barra de espaço', correta: false },
                { id: 'esc', texto: 'Tecla Esc', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-6',
        titulo: 'Backspace',
        etapas: [
          {
            titulo: 'Apagando o que veio antes',
            conteudo: `<p>O Backspace é uma das teclas mais úteis para quem está aprendendo, porque ela serve para <strong>apagar a letra imediatamente antes do cursor</strong>. Costuma ficar acima do Enter, geralmente identificada por uma seta apontando para a esquerda.</p>
<p>Se você errar uma letra, ou quiser reescrever uma palavra, é só apertar o Backspace quantas vezes forem necessárias para apagar o que não está certo, e depois digitar novamente. Não há pressa nem julgamento nesse processo.</p>`,
            dica: 'Quando você escreve à mão e erra uma palavra, o que costuma fazer? Talvez perceba que corrigir no computador é até mais simples do que apagar com borracha.',
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Backspace',
            instructions: 'Aperte a tecla Backspace (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'backspace' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pra qual lado o Backspace apaga?',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Verdadeiro ou falso: o Backspace apaga a letra que vem DEPOIS do cursor.',
              alternativas: [
                { id: 'falso', texto: 'Falso - ele apaga a letra de ANTES (à esquerda)', correta: true },
                { id: 'verdadeiro', texto: 'Verdadeiro', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Identificando o Backspace',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Como a tecla Backspace costuma ser identificada no teclado?',
              alternativas: [
                { id: 'seta-esq', texto: 'Pelo nome Backspace ou por uma setinha apontando para a esquerda (⌫)', correta: true },
                { id: 'seta-cima', texto: 'Por uma seta para cima', correta: false },
                { id: 'lixeira', texto: 'Por um desenho de lixeira', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-7',
        titulo: 'Delete',
        etapas: [
          {
            titulo: 'Backspace × Delete',
            conteudo: `<p>O Delete tem uma função parecida com o Backspace, mas com uma diferença importante:</p>
<ul>
  <li>O <strong>Backspace</strong> apaga o que está antes do cursor (à esquerda).</li>
  <li>O <strong>Delete</strong> apaga o que está depois do cursor (à direita), ou apaga algo que você já selecionou na tela (um arquivo ou foto, por exemplo).</li>
</ul>
<p>Não é preciso decorar isso de imediato - com a prática, a diferença fica clara naturalmente.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Delete',
            instructions: 'Aperte a tecla Delete (destacada abaixo - repare que ela fica no bloco de navegação).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'delete' },
          },
          {
            tipo: 'jogo',
            titulo: 'Backspace e Delete são a mesma coisa?',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Verdadeiro ou falso: Backspace e Delete fazem exatamente a mesma coisa, sem nenhuma diferença.',
              alternativas: [
                { id: 'falso', texto: 'Falso - Backspace apaga antes e Delete apaga depois do cursor', correta: true },
                { id: 'verdadeiro', texto: 'Verdadeiro', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Apagando itens selecionados',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Se você clicar em um arquivo que não quer mais e apertar a tecla Delete, o que acontece?',
              alternativas: [
                { id: 'arquivo', texto: 'O arquivo selecionado é apagado e enviado para a Lixeira', correta: true },
                { id: 'aumentar', texto: 'O arquivo dobra de tamanho', correta: false },
                { id: 'desligar', texto: 'O monitor desliga imediatamente', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-8',
        titulo: 'Shift',
        etapas: [
          {
            titulo: 'Maiúsculas e símbolos',
            conteudo: `<p>A tecla Shift, localizada nos <strong>dois lados do teclado</strong> (esquerdo e direito), tem duas funções principais:</p>
<ul>
  <li>Permite escrever <strong>letras maiúsculas</strong>: basta segurar o Shift e, ao mesmo tempo, apertar a letra desejada.</li>
  <li>Permite digitar os <strong>símbolos que ficam na parte de cima</strong> de algumas teclas (como os números 1 a 0).</li>
</ul>
<p>O segredo para usá-la bem é a ordem: primeiro segure o Shift, depois aperte a outra tecla, e solte as duas em seguida.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Shift ESQUERDO',
            instructions: 'Aperte a tecla Shift do lado ESQUERDO do teclado (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'shift-esquerdo' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Shift DIREITO',
            instructions: 'Aperte a tecla Shift do lado DIREITO do teclado (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'shift-direito' },
          },
          {
            titulo: 'Juntando o Shift com uma letra',
            conteudo: `<p>Agora vamos usar o Shift do jeito que ele é usado no dia a dia: segurando ele e apertando uma letra ao mesmo tempo para ela sair maiúscula.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique uma maiúscula',
            instructions: 'Segurando o Shift, digite a letra "A" maiúscula e confirme.',
            jogo: 'digitar',
            dificuldade: 'padrao',
            jogoProps: {
              label: 'Digite a letra A maiúscula',
              placeholder: 'Digite aqui',
              validar: (valor) => valor === 'A',
              mensagemErro: 'Segure o Shift e, com ele segurado, aperte a tecla A.',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Os dois lados do Shift',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Onde ficam as teclas Shift no teclado e quantas existem?',
              alternativas: [
                { id: 'duas', texto: 'Existem 2 teclas Shift: uma na ponta esquerda e outra na ponta direita', correta: true },
                { id: 'uma', texto: 'Existe apenas 1 tecla Shift no meio do teclado', correta: false },
                { id: 'nenhuma', texto: 'O teclado não possui teclas Shift', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Como fazer maiúscula com Shift',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Qual é a forma correta de usar o Shift para digitar uma letra maiúscula?',
              alternativas: [
                { id: 'segurar', texto: 'Segurar o Shift, apertar a letra desejada e depois soltar os dois', correta: true },
                { id: 'depois', texto: 'Apertar a letra primeiro e depois o Shift', correta: false },
                { id: 'clique-duplo', texto: 'Dar um clique duplo na barra de espaço', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-9',
        titulo: 'Caps Lock',
        etapas: [
          {
            titulo: 'Travando as maiúsculas',
            conteudo: `<p>O Caps Lock (também chamado de Fixa) é uma tecla que, quando ativada, faz com que todas as letras digitadas apareçam em maiúsculas, sem precisar segurar o Shift o tempo todo.</p>
<ul>
  <li>Para ativar, basta apertar a tecla uma vez.</li>
  <li>Para desativar, aperte novamente.</li>
  <li>A maioria dos teclados tem uma pequena luz que acende quando o Caps Lock está ativo.</li>
</ul>
<p>Se, ao digitar, você notar que TUDO ESTÁ SAINDO EM MAIÚSCULAS sem que você quisesse, é bem provável que o Caps Lock esteja ativado. Basta apertá-lo novamente para voltar ao normal.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Caps Lock',
            instructions: 'Aperte a tecla Caps Lock (destacada abaixo, no início da fileira do meio).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'capslock' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique digitando em maiúsculas',
            instructions: 'Ative o Caps Lock (ou use o Shift) e digite a palavra "PAZ" em maiúsculas e confirme.',
            jogo: 'digitar',
            dificuldade: 'padrao',
            jogoProps: {
              label: 'Digite PAZ em maiúsculas',
              placeholder: 'PAZ',
              validar: (valor) => valor.trim() === 'PAZ',
              mensagemErro: 'Confere se todas as letras saíram em MAIÚSCULAS: PAZ.',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Como o Caps Lock se comporta',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Verdadeiro ou falso: uma vez ativado, o Caps Lock continua deixando tudo em maiúsculas até você apertá-lo de novo pra desativar.',
              alternativas: [
                { id: 'verdadeiro', texto: 'Verdadeiro', correta: true },
                { id: 'falso', texto: 'Falso', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Caps Lock versus Shift',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Quando é mais prático ligar o Caps Lock em vez de segurar o Shift?',
              alternativas: [
                { id: 'texto-todo', texto: 'Ao digitar um título ou uma frase inteira em maiúsculas', correta: true },
                { id: 'uma-letra', texto: 'Ao digitar apenas a primeira letra de um nome', correta: false },
                { id: 'espaco', texto: 'Para separar as palavras com espaço', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-10',
        titulo: 'Números',
        etapas: [
          {
            titulo: 'Duas formas de digitar números',
            conteudo: `<ul>
  <li>Pela <strong>fileira de números</strong> na parte de cima do teclado, logo acima das letras.</li>
  <li>Pelo <strong>teclado numérico</strong>, um bloco à direita presente em muitos teclados de computador de mesa, organizado de forma parecida com uma calculadora.</li>
</ul>
<p>Essa habilidade é útil para digitar telefones, datas e documentos como o CPF - situações comuns no dia a dia, como preencher um cadastro.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique os números: ano 2026',
            instructions: 'Digite os quatro números do ano 2026 e confirme.',
            jogo: 'digitar',
            dificuldade: 'demonstracao',
            jogoProps: {
              label: 'Digite o ano 2026',
              placeholder: '2026',
              validar: (valor) => valor.trim() === '2026',
              mensagemErro: 'Digite os 4 números do ano 2026.',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique os números: valor 50',
            instructions: 'Digite o número 50 e confirme.',
            jogo: 'digitar',
            dificuldade: 'padrao',
            jogoProps: {
              label: 'Digite o número 50',
              placeholder: '50',
              validar: (valor) => valor.trim() === '50',
              mensagemErro: 'Digite o número 50.',
            },
          },
          {
            titulo: 'Números em situações reais',
            conteudo: `<p>Uma das situações mais comuns é digitar um número de telefone com o código DDD da sua cidade na frente. Vamos praticar isso agora com validação completa.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique um telefone com DDD',
            instructions: 'Digite um número de telefone completo com DDD (10 ou 11 números, tipo 11987654321 ou (11) 98765-4321) e confirme.',
            jogo: 'digitar',
            dificuldade: 'desafio',
            jogoProps: {
              label: 'Digite um telefone com DDD',
              placeholder: 'Ex: 11987654321 ou (11) 98765-4321',
              validar: (valor) => {
                const digitos = valor.replace(/\D/g, '');
                return digitos.length === 10 || digitos.length === 11;
              },
              mensagemErro: 'O telefone precisa ter DDD e 8 ou 9 dígitos (total de 10 ou 11 números, ex: 11987654321 ou (11) 98765-4321).',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Onde estão os números',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Onde podemos encontrar teclas de números no teclado do computador?',
              alternativas: [
                { id: 'dois-lugares', texto: 'Na fileira superior acima das letras e no bloco numérico lateral', correta: true },
                { id: 'apenas-espaco', texto: 'Apenas na barra de espaço', correta: false },
                { id: 'nenhum', texto: 'O teclado não possui números', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Ativando o teclado numérico',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Se os números do bloco lateral direito não estiverem digitando, qual tecla deve estar ativada?',
              alternativas: [
                { id: 'numlock', texto: 'Tecla Num Lock (com a luz indicadora acesa)', correta: true },
                { id: 'capslock', texto: 'Tecla Caps Lock', correta: false },
                { id: 'esc', texto: 'Tecla Esc', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-11',
        titulo: 'Símbolos',
        etapas: [
          {
            titulo: 'Os símbolos mais usados',
            conteudo: `<ul>
  <li><strong>@</strong> (arroba): muito usado em endereços de e-mail.</li>
  <li><strong>.</strong> (ponto): usado em sites, e-mails e valores.</li>
  <li><strong>-</strong> (hífen): usado em alguns documentos e endereços.</li>
  <li><strong>/</strong> (barra): aparece em endereços de internet e datas.</li>
  <li><strong>?</strong> (interrogação): usado ao final de perguntas.</li>
  <li><strong>:</strong> e <strong>;</strong> (dois-pontos e ponto e vírgula): usados na escrita de frases.</li>
</ul>
<p>Não é necessário memorizar a posição de todos de uma vez - com o uso repetido em situações reais, como digitar seu próprio e-mail, a localização vai se tornando familiar.</p>`,
            dica: 'No teclado brasileiro (ABNT2), o @ costuma sair com Alt Gr + Q (essa tecla fica à direita da barra de espaço). Em teclados americanos, geralmente é Shift + 2. Se um não funcionar, vale tentar o outro!',
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique um símbolo',
            instructions: 'Digite o símbolo @ (arroba) e confirme.',
            jogo: 'digitar',
            dificuldade: 'padrao',
            jogoProps: {
              label: 'Digite o símbolo @ (arroba)',
              placeholder: 'Digite aqui',
              validar: (valor) => valor.includes('@'),
              mensagemErro: 'Tenta encontrar o símbolo @ no teclado e digitar de novo.',
            },
          },
          {
            titulo: 'Outro símbolo bem comum: o hífen',
            conteudo: `<p>O hífen (-) aparece bastante em documentos e endereços - por exemplo, no meio de um CEP. Vamos praticar ele também com a quantidade exata de dígitos de um CEP brasileiro.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o hífen no CEP',
            instructions: 'Digite um CEP completo com hífen (5 números, hífen e 3 números, tipo 01310-100) e confirme.',
            jogo: 'digitar',
            dificuldade: 'padrao',
            jogoProps: {
              label: 'Digite um CEP com hífen',
              placeholder: 'Ex: 01310-100',
              validar: (valor) => /^\d{5}-\d{3}$/.test(valor.trim()),
              mensagemErro: 'Digite o CEP com exatamente 5 números, o traço (-) e mais 3 números (ex: 01310-100).',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Símbolo essencial do e-mail',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Qual símbolo é obrigatório e exclusivo de todos os endereços de e-mail?',
              alternativas: [
                { id: 'arroba', texto: '@ (arroba)', correta: true },
                { id: 'hashtag', texto: '# (jogo da velha)', correta: false },
                { id: 'cifrao', texto: '$ (cifrão)', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Digitando símbolos superiores',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Para digitar os símbolos que aparecem na parte de CIMA das teclas de números (como !, @, #, $, %), o que devemos fazer?',
              alternativas: [
                { id: 'shift-num', texto: 'Segurar o Shift enquanto aperta o número correspondente', correta: true },
                { id: 'caps-num', texto: 'Ligar o Caps Lock', correta: false },
                { id: 'espaco-num', texto: 'Apertar a barra de espaço duas vezes', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-12',
        titulo: 'Teclas especiais',
        etapas: [
          {
            titulo: 'Conhecendo as teclas especiais',
            conteudo: `<ul>
  <li><strong>ESC</strong>: cancela uma ação, fecha um menu aberto ou sai de tela cheia.</li>
  <li><strong>TAB</strong>: pula para o próximo campo em formulários e cadastros.</li>
  <li><strong>Windows (⊞)</strong>: abre o menu principal do computador com seus programas e arquivos.</li>
  <li><strong>Ctrl e Alt</strong>: usadas em conjunto com outras teclas para atalhos e funções especiais.</li>
  <li><strong>Alt Gr</strong>: localizada à direita do espaço, serve para digitar o terceiro símbolo de certas teclas (como o @ e o ª).</li>
</ul>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Esc',
            instructions: 'Aperte a tecla Esc (destacada abaixo, sozinha, acima da fileira de números).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'esc' },
          },
          {
            titulo: 'Avançando entre campos com o Tab',
            conteudo: `<p>A tecla <strong>Tab</strong> (geralmente identificada pelo nome Tab ou por setinhas opostas ⇥) fica no início da fileira de letras. Ao preencher cadastros na internet, apertar Tab faz o cursor pular direto para o próximo campo (do Nome para o E-mail, por exemplo), sem precisar clicar com o mouse.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Tab',
            instructions: 'Aperte a tecla Tab (destacada abaixo, no início da fileira de letras).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'tab' },
          },
          {
            titulo: 'O menu principal e a tecla Windows',
            conteudo: `<p>A tecla <strong>Windows</strong> (com o símbolo de quatro quadradinhos ⊞) fica na fileira de baixo, ao lado do Ctrl e do Alt. Apertá-la abre o menu Iniciar do computador para pesquisar programas e arquivos.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a tecla Windows',
            instructions: 'Aperte a tecla Windows (destacada abaixo, na fileira inferior com o símbolo ⊞).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'windows' },
          },
          {
            titulo: 'As teclas Ctrl e Alt',
            conteudo: `<p>As teclas <strong>Ctrl</strong> (Control) e <strong>Alt</strong> funcionam como ajudantes: você segura uma delas e aperta outra tecla para acionar atalhos úteis (como copiar, colar ou salvar).</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a tecla Ctrl',
            instructions: 'Aperte a tecla Ctrl (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'ctrl' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a tecla Alt',
            instructions: 'Aperte a tecla Alt (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'alt' },
          },
          {
            tipo: 'jogo',
            titulo: 'Avançando entre campos de formulário',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Você está preenchendo um cadastro na internet e terminou de escrever no campo do Nome. Qual tecla leva para o campo seguinte sem usar o mouse?',
              alternativas: [
                { id: 'tab', texto: 'Tab', correta: true },
                { id: 'esc', texto: 'Esc', correta: false },
                { id: 'capslock', texto: 'Caps Lock', correta: false },
                { id: 'backspace', texto: 'Backspace', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Cancelando uma ação com Esc',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Você abriu um menu ou janela por engano e deseja fechar rapidamente. Qual tecla apertar?',
              alternativas: [
                { id: 'esc', texto: 'Tecla Esc (Escape)', correta: true },
                { id: 'enter', texto: 'Tecla Enter', correta: false },
                { id: 'espaco', texto: 'Barra de espaço', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Abrindo o menu principal',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Qual tecla abre o menu principal do computador com seus aplicativos e programas?',
              alternativas: [
                { id: 'windows', texto: 'Tecla Windows (com o símbolo ⊞)', correta: true },
                { id: 'shift', texto: 'Tecla Shift', correta: false },
                { id: 'tab', texto: 'Tecla Tab', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-13',
        titulo: 'Navegação pelo teclado',
        etapas: [
          {
            titulo: 'Se movendo dentro de um texto',
            conteudo: `<p>Além do mouse, o próprio teclado permite se movimentar dentro de um texto:</p>
<ul>
  <li>As <strong>setas direcionais</strong> (⬅ ➡ ⬆ ⬇) movem o cursor pelo texto, letra por letra ou linha por linha, sem apagar nada.</li>
  <li>As teclas <strong>Home</strong> e <strong>End</strong> levam direto ao início ou ao fim da linha atual.</li>
  <li>As teclas <strong>Page Up</strong> (PgUp) e <strong>Page Down</strong> (PgDn) rolam uma página inteira para cima ou para baixo.</li>
  <li>Segurando o Shift junto com as setas, é possível selecionar trechos de texto sem usar o mouse.</li>
</ul>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a seta para baixo',
            instructions: 'Aperte a seta para baixo (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'seta-baixo' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a seta para a direita',
            instructions: 'Aperte a seta para a direita (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'seta-direita' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a seta para a esquerda',
            instructions: 'Aperte a seta para a esquerda (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'seta-esquerda' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a seta para cima',
            instructions: 'Aperte a seta para cima (destacada abaixo).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'seta-cima' },
          },
          {
            titulo: 'Teclas de salto rápido: Home e End',
            conteudo: `<p>As teclas <strong>Home</strong> e <strong>End</strong> ficam no bloco de navegação acima das setas:</p>
<ul>
  <li><strong>Home</strong>: salta instantaneamente para o início da linha.</li>
  <li><strong>End</strong>: salta instantaneamente para o final da linha.</li>
</ul>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a tecla Home',
            instructions: 'Aperte a tecla Home (destacada abaixo no bloco de navegação).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'home' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a tecla End',
            instructions: 'Aperte a tecla End (destacada abaixo no bloco de navegação).',
            jogo: 'pressionar',
            dificuldade: 'demonstracao',
            jogoProps: { tecla: 'end' },
          },
          {
            tipo: 'jogo',
            titulo: 'Setas e seleção',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Verdadeiro ou falso: segurando o Shift e apertando as setas, é possível selecionar um trecho de texto, sem usar o mouse.',
              alternativas: [
                { id: 'verdadeiro', texto: 'Verdadeiro', correta: true },
                { id: 'falso', texto: 'Falso', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Navegando sem apagar',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Você percebeu que esqueceu de colocar uma letra no meio de uma palavra. Como mover o cursor até o ponto certo sem apagar o texto?',
              alternativas: [
                { id: 'setas', texto: 'Usando as setas direcionais para mover o cursor suavemente', correta: true },
                { id: 'delete', texto: 'Apertando Delete até apagar a página toda', correta: false },
                { id: 'desligar', texto: 'Desligando o computador e ligando novamente', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Início e fim da linha',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Quais teclas levam o cursor diretamente para o início ou para o final da linha atual de texto?',
              alternativas: [
                { id: 'home-end', texto: 'Home (início) e End (fim)', correta: true },
                { id: 'esc-tab', texto: 'Esc e Tab', correta: false },
                { id: 'ctrl-alt', texto: 'Ctrl e Alt', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-14',
        titulo: 'Atalhos básicos',
        etapas: [
          {
            titulo: 'Combinações que economizam cliques',
            conteudo: `<p>Os atalhos são combinações de teclas que executam ações rapidamente. Alguns dos mais úteis:</p>
<ul>
  <li><strong>Ctrl + C</strong>: copia algo que está selecionado.</li>
  <li><strong>Ctrl + V</strong>: cola o que foi copiado em outro lugar.</li>
  <li><strong>Ctrl + Z</strong>: desfaz a última ação - uma espécie de "voltar atrás".</li>
  <li><strong>Ctrl + A</strong>: seleciona todo o conteúdo de uma vez.</li>
</ul>`,
            dica: 'Esses atalhos não precisam ser usados desde já - eles vão se tornando naturais conforme você for ganhando confiança com o teclado.',
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Ctrl + C',
            instructions: 'Segure Ctrl e aperte a tecla C ao mesmo tempo (em Mac, use Cmd no lugar do Ctrl).',
            jogo: 'atalho',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'c' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Ctrl + V',
            instructions: 'Segure Ctrl e aperte a tecla V ao mesmo tempo (em Mac, use Cmd no lugar do Ctrl).',
            jogo: 'atalho',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'v' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Ctrl + Z',
            instructions: 'Segure Ctrl e aperte a tecla Z ao mesmo tempo (em Mac, use Cmd no lugar do Ctrl).',
            jogo: 'atalho',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'z' },
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique o Ctrl + A',
            instructions: 'Segure Ctrl e aperte a tecla A ao mesmo tempo (em Mac, use Cmd no lugar do Ctrl).',
            jogo: 'atalho',
            dificuldade: 'demonstracao',
            jogoProps: { letra: 'a' },
          },
          {
            tipo: 'jogo',
            titulo: 'Desfazendo um erro com atalho',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'desafio',
            jogoProps: {
              pergunta: 'Você apagou por engano uma frase inteira que tinha acabado de escrever. Qual atalho desfaz isso rapidamente?',
              alternativas: [
                { id: 'ctrl-z', texto: 'Ctrl + Z', correta: true },
                { id: 'ctrl-c', texto: 'Ctrl + C', correta: false },
                { id: 'ctrl-v', texto: 'Ctrl + V', correta: false },
                { id: 'ctrl-a', texto: 'Ctrl + A', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'A dupla Copiar e Colar',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Qual combinação de teclas é usada para COPIAR e depois COLAR um texto ou imagem?',
              alternativas: [
                { id: 'copiar-colar', texto: 'Ctrl + C para copiar e Ctrl + V para colar', correta: true },
                { id: 'apagar', texto: 'Ctrl + Z para copiar e Ctrl + A para colar', correta: false },
                { id: 'fechar', texto: 'Alt + F4 para copiar e colar', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Selecionando todo o texto',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Qual atalho seleciona todo o conteúdo de um texto ou documento de uma só vez?',
              alternativas: [
                { id: 'ctrl-a', texto: 'Ctrl + A', correta: true },
                { id: 'ctrl-v', texto: 'Ctrl + V', correta: false },
                { id: 'ctrl-z', texto: 'Ctrl + Z', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '2-15',
        titulo: 'Digitação funcional',
        etapas: [
          {
            titulo: 'Juntando tudo em situações reais',
            conteudo: `<p>Todas essas habilidades se juntam em situações reais e úteis do cotidiano, como:</p>
<ul>
  <li>Digitar uma senha para acessar um aplicativo ou site</li>
  <li>Digitar um e-mail com formato completo</li>
  <li>Preencher um endereço com CEP e telefone</li>
  <li>Escrever uma mensagem para um familiar ou amigo</li>
  <li>Fazer uma pesquisa no Google</li>
</ul>
<p>É normal ir com calma nessas primeiras vezes - a fluência vem naturalmente, na medida em que essas ações se repetem no seu dia a dia.</p>`,
          },
          {
            titulo: 'Erros comuns (e por que não se preocupar)',
            conteudo: `<p>Durante a prática, alguns deslizes são bastante comuns:</p>
<ul>
  <li>Apertar o Enter sem querer, no meio da digitação</li>
  <li>Confundir o Enter com o Backspace</li>
  <li>Soltar o Shift antes de apertar a letra desejada</li>
  <li>Manter o Caps Lock ligado sem perceber</li>
</ul>
<p>São os erros mais comuns entre quem está aprendendo, e cada um deles tem uma solução simples, como já vimos ao longo deste módulo.</p>`,
          },
          {
            titulo: 'Hora de juntar tudo numa frase só',
            conteudo: `<p>Uma frase curta já usa várias das teclas que você praticou até aqui: uma letra maiúscula no início (Shift), o espaço entre as palavras, e um símbolo de pontuação no final.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Desafio: digite a frase',
            instructions: 'Digite a frase com a primeira letra maiúscula: Bom dia!',
            jogo: 'digitar',
            dificuldade: 'desafio',
            jogoProps: {
              label: 'Digite a frase "Bom dia!"',
              placeholder: 'Digite aqui',
              validar: (valor) => /^Bom dia!?$/.test(valor.trim()),
              mensagemErro: 'Confere se digitou certinho: primeira letra B maiúscula (Shift+B), o resto minúsculo, espaço e exclamação: Bom dia!',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Desafio: frase em maiúsculas',
            instructions: 'Ative o Caps Lock e digite a frase toda em maiúsculas: BOM DIA!',
            jogo: 'digitar',
            dificuldade: 'desafio',
            jogoProps: {
              label: 'Digite BOM DIA! em maiúsculas',
              placeholder: 'BOM DIA!',
              validar: (valor) => /^BOM DIA!?$/.test(valor.trim()),
              mensagemErro: 'Ative o Caps Lock e digite toda a frase em MAIÚSCULAS: BOM DIA!',
            },
          },
          {
            titulo: 'Para lembrar',
            conteudo: `<ul>
  <li>O teclado é organizado em letras, números, símbolos e teclas especiais.</li>
  <li>Um toque leve nas teclas já é suficiente - não é preciso força.</li>
  <li>Backspace apaga para trás; Delete apaga para frente ou apaga itens selecionados.</li>
  <li>Shift escreve maiúsculas e símbolos superiores; Caps Lock mantém tudo em maiúsculas.</li>
  <li>Os atalhos tornam tarefas mais rápidas, mas podem ser aprendidos com calma.</li>
</ul>`,
            dica: 'Cada palavra digitada é um passo a mais na sua autonomia. Continue praticando no seu ritmo - a confiança vem da repetição, não da pressa. 💛',
          },
          {
            tipo: 'jogo',
            titulo: 'Desafio: juntando tudo com e-mail',
            instructions: 'Digite um e-mail válido com @ e domínio (tipo maria@email.com ou exemplo@provedor.com.br) e confirme.',
            jogo: 'digitar',
            dificuldade: 'desafio',
            jogoProps: {
              label: 'Digite um e-mail',
              placeholder: 'exemplo@email.com',
              validar: (valor) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor.trim()),
              mensagemErro: 'Digite um e-mail com formato válido contendo @ e ponto (ex: exemplo@email.com).',
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Texto todo maiúsculo por engano',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Se você estiver escrevendo e notar que todas as letras estão saindo maiúsculas sem você querer, o que aconteceu?',
              alternativas: [
                { id: 'capslock', texto: 'A tecla Caps Lock ficou ativada - basta apertá-la uma vez para desativar', correta: true },
                { id: 'quebrou', texto: 'O teclado quebrou e precisa comprar outro', correta: false },
                { id: 'virus', texto: 'O computador pegou um vírus', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'O caminho da autonomia',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Qual é o segredo para se sentir cada vez mais seguro(a) ao digitar no computador?',
              alternativas: [
                { id: 'pratica', texto: 'Praticar com calma no seu próprio ritmo, sabendo que errar e corrigir faz parte natural do aprendizado', correta: true },
                { id: 'forca', texto: 'Apertar as teclas com mais força', correta: false },
                { id: 'pressa', texto: 'Digitar correndo mesmo sem saber onde estão as teclas', correta: false },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: '3',
    emoji: '🔌',
    titulo: 'Hardware e Periféricos',
    descricao: 'Entenda as partes físicas do computador e como cuidar delas.',
    miniModulos: [
      {
        id: '3-1',
        titulo: 'O que é hardware',
        etapas: [
          {
            titulo: 'Reconhecendo as peças',
            conteudo: `<p>Depois de conhecer o mouse e o teclado, chegou o momento de olhar para o computador como um todo. Você não precisa se tornar um técnico em informática - o objetivo é bem mais simples: reconhecer os equipamentos ao seu redor e ganhar confiança para usá-los no dia a dia.</p>
<p>"Hardware" é o nome dado a tudo aquilo que é físico no computador: as peças que você pode tocar, ver e segurar - diferente do que aparece na tela, que chamamos de "software" (os programas e aplicativos).</p>
<p>Pense assim: o hardware é como o corpo do computador, e os programas são como os pensamentos e ações que esse corpo realiza. O monitor, o teclado, o mouse, as caixas de som - tudo isso é hardware.</p>`,
            dica: 'Em sua casa, quais equipamentos você já reconhece como parte do computador? Talvez você já conheça mais peças do que imagina.',
          },
          {
            titulo: 'Por que isso importa no dia a dia',
            conteudo: `<p>É comum ouvir alguém dizer "meu computador não liga" quando, na verdade, o problema é só um cabo solto ou o monitor apagado. Saber separar "hardware" (a peça física) de "software" (o programa) já ajuda bastante a entender onde pode estar um problema - e a explicar isso, com calma, pra quem for te ajudar.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Hardware ou software?',
            instructions: 'Destas três opções, apenas uma é hardware (algo físico, que dá pra tocar). Clique nela.',
            jogo: 'clicar',
            dificuldade: 'padrao',
            jogoProps: {
              layout: 'grade',
              alvos: [
                { id: 'navegador', label: '🌐 Navegador de internet', correto: false },
                { id: 'impressora', label: '🖨️ Impressora', correto: true },
                { id: 'aplicativo-fotos', label: '🖼️ Aplicativo de fotos', correto: false },
              ],
            },
          },
        ],
      },
      {
        id: '3-2',
        titulo: 'Monitor',
        etapas: [
          {
            titulo: 'A tela do computador',
            conteudo: `<p>O monitor é a tela onde aparecem as imagens, textos e vídeos - é por meio dele que "conversamos" visualmente com o computador.</p>
<ul>
  <li><strong>Ajustar a posição</strong>: vale a pena posicionar o monitor na altura dos olhos, para evitar desconforto no pescoço.</li>
  <li><strong>Entender o que aparece na tela</strong>: ícones, janelas e textos mudam a cada clique ou tecla digitada.</li>
</ul>`,
          },
          {
            titulo: 'O botão que muita gente esquece',
            conteudo: `<p>Aqui vai um detalhe que confunde bastante gente no começo: o <strong>monitor tem um botão de ligar só dele</strong>, separado do botão que liga o gabinete (a caixa que guarda as peças internas).</p>
<p>Isso quer dizer que às vezes o computador está ligado e funcionando normalmente, mas a tela aparece preta - porque só o monitor foi desligado, sem querer, ou nunca foi ligado. Antes de se preocupar com "o computador quebrou", vale sempre checar esse botãozinho primeiro.</p>`,
            dica: 'Imagine que você senta pra usar o computador e a tela está preta. Antes de qualquer coisa, o que você vai checar primeiro agora que sabe desse detalhe?',
          },
          {
            tipo: 'jogo',
            titulo: 'Encontre o botão de ligar do monitor',
            instructions: 'Entre as duas peças abaixo, clique no botão que liga a TELA (o monitor) - repare que não é o pedestal, e não é o botão da outra peça ao lado.',
            jogo: 'monitor-gabinete',
            dificuldade: 'padrao', // agora com 5 alvos (2 peças) em vez de 2 - deixou de ser fácil demais
            jogoProps: { alvoCorreto: 'monitor' },
          },
        ],
      },
      {
        id: '3-3',
        titulo: 'Gabinete/CPU',
        etapas: [
          {
            titulo: 'O "cérebro" da máquina',
            conteudo: `<p>O gabinete (também chamado de CPU) é a caixa que guarda as peças internas do computador - é como o "cérebro" da máquina, guardado dentro de uma estrutura protegida, parecido com uma caixa de ferramentas fechada: você não precisa abrir pra usar, só reconhecer onde fica e o que tem por fora.</p>
<p>Vale a pena reconhecer o botão de ligar, geralmente localizado na parte da frente do gabinete.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Encontre o botão de ligar do gabinete',
            instructions: 'Agora clique no botão que liga o COMPUTADOR (o gabinete) - repare que é diferente do botão do monitor que você acabou de usar.',
            jogo: 'monitor-gabinete',
            dificuldade: 'padrao',
            jogoProps: { alvoCorreto: 'gabinete' },
          },
          {
            titulo: 'Um cuidado importante',
            conteudo: `<p>Evite desligar o gabinete de forma incorreta, como tirando o cabo de energia diretamente da tomada enquanto o computador está em uso - é parecido com fechar um livro no meio de uma frase: o computador pode não ter terminado de "guardar" o que estava fazendo, e isso pode causar problemas.</p>
<p>O jeito certo de desligar é sempre pelo menu do próprio sistema - isso é assunto do mini-tópico "Botão de ligar e desligar", mais adiante.</p>`,
          },
        ],
      },
      {
        id: '3-4',
        titulo: 'Mouse e teclado como periféricos',
        etapas: [
          {
            titulo: 'Um novo ângulo sobre o que você já conhece',
            conteudo: `<p>Você já conhece bem o mouse e o teclado - agora vamos vê-los como <strong>periféricos</strong>: equipamentos que se conectam ao computador para permitir que você interaja com ele.</p>
<ul>
  <li>Ambos podem ser <strong>com fio</strong> (conectados por um cabo) ou <strong>sem fio</strong> (conectados por um sinal).</li>
  <li>Se pararem de responder, muitas vezes o motivo é simples: um cabo solto, uma pilha descarregada ou uma conexão que precisa ser refeita.</li>
</ul>`,
            dica: 'Já aconteceu de um controle remoto parar de funcionar e, no fim, era só a pilha? Com mouse e teclado sem fio é bem parecido.',
          },
          {
            tipo: 'jogo',
            titulo: 'Pratique a conexão',
            instructions: 'Arraste o cabo do mouse até a porta certa - repare no formato de cada uma.',
            jogo: 'porta-traseira',
            dificuldade: 'padrao',
            jogoProps: {},
          },
          // NOVO - reforço conceitual, sem mecânica nova: reusa 'quiz'.
          {
            tipo: 'jogo',
            titulo: 'Parou de responder - e agora?',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'padrao',
            jogoProps: {
              pergunta: 'Seu mouse sem fio parou de responder do nada. O que vale mais a pena checar primeiro?',
              alternativas: [
                { id: 'pilha', texto: 'Se a pilha não descarregou, ou se a conexão precisa ser refeita', correta: true },
                { id: 'reinstalar', texto: 'Reinstalar o sistema operacional inteiro', correta: false },
                { id: 'comprar', texto: 'Já ir comprando um mouse novo', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '3-5',
        titulo: 'Caixas de som',
        etapas: [
          {
            titulo: 'Reproduzindo os sons do computador',
            conteudo: `<p>As caixas de som são responsáveis por reproduzir os sons do computador - músicas, vídeos, mensagens de áudio e avisos do sistema.</p>
<p>Elas se conectam por um cabo específico, ligado à saída de som, que costuma ficar na parte de trás ou na lateral do gabinete ou do notebook.</p>`,
          },
          {
            titulo: 'Uma situação comum',
            conteudo: `<p>Imagine que você está numa videochamada com a família e ninguém consegue te ouvir direito, ou você não consegue ouvir quem está falando. Antes de se preocupar, vale sempre checar uma coisa simples primeiro: o volume não está baixo demais ou no mudo?</p>
<p>No exercício a seguir, o som que você vai ouvir é real - vai tocar de verdade pelas caixas de som ou fone do seu computador, e os botões - e + realmente controlam o quanto ele toca alto ou baixo, exatamente como um controle de volume de verdade.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Ajuste o volume',
            instructions: 'Use os botões - e + até o volume chegar exatamente no nível 6. Se passar do ponto, é só usar o - pra voltar - não tem problema.',
            jogo: 'volume',
            dificuldade: 'padrao',
            jogoProps: { alvo: 6, min: 0, max: 10 },
          },
          // NOVO - reforço conceitual da "situação comum" que a teoria
          // acabou de descrever, sem mecânica nova.
          {
            tipo: 'jogo',
            titulo: 'Ninguém te ouve na chamada',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'desafio',
            jogoProps: {
              pergunta: 'Você está numa videochamada e ninguém consegue te ouvir. O que checar primeiro?',
              alternativas: [
                { id: 'volume', texto: 'Se o volume não está baixo demais ou no mudo', correta: true },
                { id: 'internet', texto: 'Trocar de provedor de internet', correta: false },
                { id: 'reiniciar', texto: 'Desligar o computador na tomada direto', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '3-6',
        titulo: 'Fones de ouvido',
        etapas: [
          {
            titulo: 'Som de forma individual',
            conteudo: `<p>Os fones de ouvido cumprem uma função parecida com a das caixas de som, mas de forma mais individual e discreta - úteis, por exemplo, para ouvir uma videochamada tarde da noite sem incomodar quem está dormindo na casa.</p>
<p>Existem diferentes tipos de conexão, dependendo do modelo: alguns usam um cabo com entrada específica (chamada de P2), outros se conectam sem fio, como o mouse e o teclado sem fio que você já conheceu.</p>`,
          },
          // NOVO - o FoneGame (abaixo) não aceita configuração de fora
          // (ver observação no cabeçalho do arquivo), então não dá pra
          // criar uma versão "fácil" dele. Esse quiz funciona como
          // aquecimento conceitual antes do desafio visual de verdade.
          {
            tipo: 'jogo',
            titulo: 'De olho no detalhe',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'demonstracao',
            jogoProps: {
              pergunta: 'A entrada do fone (P2) e a entrada de energia do notebook costumam ser parecidas. O que ajuda a diferenciar as duas?',
              alternativas: [
                { id: 'simbolo', texto: 'O símbolo de fone de ouvido gravado ao lado da entrada certa', correta: true },
                { id: 'cor', texto: 'A cor do plástico do notebook', correta: false },
                { id: 'tamanho', texto: 'Não tem como saber, é só tentar', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Encontre a entrada certa',
            instructions: 'Arraste o plugue do fone até a entrada certa - repare no símbolo de fone de ouvido ao lado dela, bem parecido com a entrada de energia, que é redonda também.',
            jogo: 'fone',
            dificuldade: 'desafio',
            jogoProps: {},
          },
        ],
      },
      {
        id: '3-7',
        titulo: 'Webcam e microfone',
        etapas: [
          {
            titulo: 'Vendo e sendo ouvido',
            conteudo: `<p>A webcam é uma pequena câmera, geralmente localizada na parte de cima do monitor ou embutida no notebook, usada para videochamadas e fotos. O microfone capta o som da sua voz, permitindo que outras pessoas te ouçam durante uma chamada.</p>
<p>Um cuidado importante: muitos aparelhos têm uma pequena luz que acende quando a câmera está em uso - vale a pena conferir essa luz antes de uma chamada, ou sempre que quiser ter mais tranquilidade sobre sua privacidade.</p>`,
            dica: 'Da próxima vez que abrir um aplicativo de videochamada, repare nessa luzinha acendendo - é um bom hábito conferir isso sempre.',
          },
          {
            tipo: 'jogo',
            titulo: 'Ache a luz indicadora',
            instructions: 'Clique na luzinha que indica que a webcam está ligada - não na lente da câmera.',
            jogo: 'webcam-luz',
            dificuldade: 'padrao',
            jogoProps: {},
          },
          // NOVO - reforço do hábito descrito na teoria, sem mecânica nova.
          {
            tipo: 'jogo',
            titulo: 'Antes de uma chamada',
            instructions: 'Escolha a resposta certa.',
            jogo: 'quiz',
            dificuldade: 'desafio',
            jogoProps: {
              pergunta: 'Você vai entrar numa videochamada. O que vale a pena conferir antes, por privacidade?',
              alternativas: [
                { id: 'luz', texto: 'Se a luzinha da webcam só acende quando ela está mesmo em uso', correta: true },
                { id: 'senha', texto: 'Trocar a senha do computador', correta: false },
                { id: 'reiniciar', texto: 'Reiniciar o roteador de internet', correta: false },
              ],
            },
          },
        ],
      },
      {
        id: '3-8',
        titulo: 'Cabos e conexões',
        etapas: [
          {
            titulo: 'Aos poucos, sem pressa',
            conteudo: `<p>Existem diversos tipos de cabos e conexões diferentes no universo dos computadores, cada um com uma função específica - não é necessário conhecer todos de uma vez. Aos poucos, à medida que for usando o computador no dia a dia, você vai naturalmente identificando qual cabo serve para qual finalidade, só de reparar no formato de cada conector.</p>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Reconhecendo cabos',
            instructions: 'Clique no cabo USB entre as opções abaixo.',
            jogo: 'identificar-cabo',
            dificuldade: 'padrao',
            jogoProps: {},
          },
        ],
      },
      {
        id: '3-9',
        titulo: 'Botão de ligar e desligar',
        etapas: [
          {
            titulo: 'Ligando, desligando e reiniciando',
            conteudo: `<ul>
  <li><strong>Ligar</strong>: aperte o botão indicado no gabinete ou notebook e aguarde o computador carregar - esse processo pode levar alguns instantes, e isso é normal.</li>
  <li><strong>Desligar corretamente</strong>: o ideal é usar a opção de desligar disponível nos menus do sistema, em vez de apertar o botão físico ou tirar da tomada.</li>
  <li><strong>Reiniciar</strong>: às vezes o computador precisa ser desligado e ligado novamente para resolver pequenos travamentos.</li>
</ul>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Qual é a forma certa?',
            instructions: 'Escolha a forma correta de desligar o computador.',
            jogo: 'clicar',
            dificuldade: 'padrao',
            jogoProps: {
              layout: 'grade',
              alvos: [
                { id: 'menu', label: '🖥️ Usar o menu Desligar do sistema', correto: true },
                { id: 'tomada', label: '🔌 Tirar o cabo da tomada direto', correto: false },
                { id: 'segurar', label: '⏻ Segurar o botão de ligar até apagar', correto: false },
              ],
            },
          },
          {
            titulo: 'Quando a tela "trava"',
            conteudo: `<p>Se a tela parar de responder por um tempo, vale esperar um pouco antes de tomar qualquer decisão mais drástica, como desligar na força - muitas vezes o computador só está processando algo mais pesado e volta a responder sozinho em instantes.</p>`,
            dica: 'Você já teve alguma experiência com um aparelho eletrônico que "travou" temporariamente, como uma TV ou um controle remoto? Como resolveu?',
          },
        ],
      },
      {
        id: '3-10',
        titulo: 'Internet e conexão',
        etapas: [
          {
            titulo: 'Se conectando ao mundo',
            conteudo: `<p>A internet é o que permite ao computador se comunicar com outros lugares do mundo - enviar mensagens, pesquisar informações, assistir vídeos.</p>
<ul>
  <li><strong>Wi-Fi</strong>: conexão sem fio à internet, muito comum em casas e estabelecimentos.</li>
  <li><strong>Cabo de rede</strong>: uma conexão física à internet, usada em alguns computadores de mesa.</li>
  <li>O sistema costuma indicar se você está conectado com um ícone específico, geralmente num cantinho da tela.</li>
</ul>`,
          },
          {
            tipo: 'jogo',
            titulo: 'Reconhecendo o ícone de conexão',
            instructions: 'Dentre as opções, escolha o ícone que indica que você está conectado à internet (o de sinal cheio e colorido).',
            jogo: 'clicar',
            dificuldade: 'padrao',
            jogoProps: {
              layout: 'linha',
              alvos: [
                { id: 'sem-sinal', label: '📶 Sinal apagado/fraco', correto: false },
                { id: 'conectado', label: '📶 Sinal cheio e ativo', correto: true },
                { id: 'bateria', label: '🔋 Ícone de bateria', correto: false },
              ],
            },
          },
          {
            titulo: 'Quando a conexão cai',
            conteudo: `<p>Se páginas não carregam ou mensagens não são enviadas, pode ser sinal de que a conexão caiu - algo que acontece até com os usuários mais experientes. Normalmente, esperar um instante ou reiniciar o roteador (o aparelho que distribui o Wi-Fi em casa) já resolve.</p>`,
          },
        ],
      },
      {
        id: '3-11',
        titulo: 'Cuidados com os equipamentos',
        etapas: [
          {
            titulo: 'Pequenos cuidados que fazem diferença',
            conteudo: `<ul>
  <li><strong>Limpeza básica</strong>: manter o equipamento livre de poeira, com um pano seco e macio.</li>
  <li><strong>Não puxar os cabos com força</strong>: ao desconectar algo, segure pelo conector, não pelo fio.</li>
  <li><strong>Não molhar os equipamentos</strong>: líquidos próximos ao computador merecem atenção redobrada.</li>
  <li><strong>Organizar os fios</strong>: evita tropeços e conexões soltas sem querer.</li>
  <li><strong>Transportar o notebook com cuidado</strong>: vale usar uma bolsa ou capa protetora.</li>
</ul>`,
          },
          // SUBSTITUÍDO - a versão anterior pedia pra "laçar" vários
          // itens certos ao mesmo tempo (selecionar-arrastando), o que
          // exige entender uma mecânica de seleção múltipla ANTES de
          // conseguir pensar no conteúdo - carga cognitiva dupla,
          // ruim pro público. Trocado por associação simples (mesma
          // mecânica 'arrastar' já usada e comprovada em 1-1 a 1-5):
          // um hábito de cada vez, arrasta pro rótulo "certo" ou
          // "errado". Foco fica só na dúvida real, não na mecânica.
          {
            tipo: 'jogo',
            titulo: 'Esse hábito está certo?',
            instructions: 'Arraste o hábito abaixo até o rótulo certo.',
            jogo: 'arrastar',
            dificuldade: 'demonstracao',
            jogoProps: {
              item: { id: 'pano-seco', label: '🧽 Limpar com pano seco e macio' },
              zonas: [
                { id: 'certo', label: '✅ Jeito certo', correta: true },
                { id: 'errado', label: '❌ Jeito errado', correta: false },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'E esse outro?',
            instructions: 'Arraste o hábito abaixo até o rótulo certo.',
            jogo: 'arrastar',
            dificuldade: 'padrao',
            jogoProps: {
              item: { id: 'puxar-fio', label: '🪢 Puxar o cabo pelo fio' },
              zonas: [
                { id: 'certo', label: '✅ Jeito certo', correta: false },
                { id: 'errado', label: '❌ Jeito errado', correta: true },
              ],
            },
          },
          {
            tipo: 'jogo',
            titulo: 'Mais um',
            instructions: 'Arraste o hábito abaixo até o rótulo certo.',
            jogo: 'arrastar',
            dificuldade: 'desafio',
            jogoProps: {
              item: { id: 'liquido-perto', label: '🥤 Deixar um copo de líquido do lado' },
              zonas: [
                { id: 'certo', label: '✅ Jeito certo', correta: false },
                { id: 'errado', label: '❌ Jeito errado', correta: true },
              ],
            },
          },
          {
            titulo: 'Para lembrar',
            conteudo: `<ul>
  <li>Hardware é tudo o que é físico no computador: monitor, gabinete, teclado, mouse e outros equipamentos.</li>
  <li>Cada periférico tem uma função própria, mas todos trabalham juntos.</li>
  <li>Ligar, desligar e reiniciar de forma correta ajuda a evitar problemas.</li>
  <li>Pequenos cuidados no dia a dia prolongam a vida do equipamento.</li>
</ul>`,
            dica: 'Reconhecer essas peças é como aprender os nomes dos cômodos de uma casa nova: no começo pode parecer muita informação, mas logo tudo passa a fazer parte do seu dia a dia. 💛',
          },
        ],
      },
    ],
  },
];

/** Busca um módulo pelo id */
export function getModulo(moduloId) {
  return MODULOS.find((m) => m.id === moduloId) ?? null;
}

/** Busca um mini-módulo pelo id composto (ex: "1-2") */
export function getMiniModulo(miniModuloId) {
  for (const modulo of MODULOS) {
    const mm = modulo.miniModulos.find((mm) => mm.id === miniModuloId);
    if (mm) return { modulo, miniModulo: mm };
  }
  return null;
}