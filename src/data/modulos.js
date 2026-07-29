/**
 * modulos.js
 * Fonte da verdade local para a estrutura de módulos e mini-módulos do CECI.
 * Não precisa estar no banco de dados - é conteúdo estático do currículo.
 *
 * Módulo 1 (Mouse), Módulo 2 (Teclado) e Módulo 3 (Hardware e Periféricos).
 * "Pergunta para refletir" virou o campo `dica` (fala da Ceci) - reforça a
 * conexão com o que a pessoa já vive fora do computador, sem soar como teste.
 *
 * Estrutura:
 *  modulos[]
 *    └── miniModulos[]
 *          └── etapas[]  ← cada etapa é uma "tela" dentro do mini-módulo
 *                            { titulo, conteudo (HTML/texto), dica? }
 */

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
            conteudo: `<p>Aqui vamos falar sobre um instrumento simples, mas muito importante para quem está começando a usar o computador: o <strong>mouse</strong>.</p>
<p>Talvez você já tenha usado um mouse antes, ainda que rapidamente, ou talvez esta seja a primeira vez que vai se aproximar dele com atenção. De qualquer forma, não se preocupe: cada movimento novo, no início, exige um pouco de prática - assim como aprender a usar um controle remoto novo ou uma máquina de lavar diferente da que você já conhecia. Com o tempo, o gesto se torna natural.</p>
<p>Vamos passo a passo. Sinta-se à vontade para repetir cada parte quantas vezes precisar.</p>`,
            dica: 'Vamos com calma - não existe pressa nesse aprendizado. 💛',
          },
          {
            titulo: 'O que é o mouse',
            conteudo: `<p>O mouse é aquele pequeno objeto que fica ao lado do teclado e que você segura com uma das mãos para "conversar" com o computador. Pense nele como um ponteiro: por meio dele, você indica ao computador o que deseja fazer, aponta para o que quer abrir ou selecionar.</p>
<p>Existem também os <strong>touchpads</strong>, que são as superfícies planas encontradas em notebooks, onde se usa o dedo em vez do mouse. O princípio é parecido, mas aqui vamos focar no mouse tradicional, aquele que se segura com a mão.</p>`,
          },
          {
            titulo: 'Conhecendo as partes do mouse',
            conteudo: `<ul>
  <li><strong>Botão esquerdo</strong>: é o botão mais usado. Serve para selecionar, abrir e confirmar ações. Fica sob o dedo indicador (para quem é destro).</li>
  <li><strong>Botão direito</strong>: abre um menu com opções extras sobre o que você clicou.</li>
  <li><strong>Roda (scroll)</strong>: fica entre os dois botões e serve para rolar a tela para cima ou para baixo.</li>
</ul>`,
          },
          {
            titulo: 'Como segurar o mouse',
            conteudo: `<p>Apoie a palma da mão suavemente sobre o mouse, deixando os dedos levemente curvados sobre os botões - sem apertar. Pense em como você seguraria um controle remoto: com firmeza o suficiente para não deixar cair, mas sem tensão.</p>
<p>Se sua mão ficar cansada ou dolorida, é sinal de que está segurando com força demais. Relaxe os ombros e o punho: essa postura mais tranquila facilita o controle e evita desconforto.</p>`,
            dica: 'Você já usou algum aparelho com botões, como um controle de TV ou um caixa eletrônico? O que foi mais fácil ou mais difícil na primeira vez?',
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
        ],
      },
      {
        id: '1-6',
        titulo: 'Coordenação e precisão',
        etapas: [
          {
            titulo: 'Juntando tudo o que você aprendeu',
            conteudo: `<p>Este último tópico não traz uma habilidade nova, mas um convite para juntar tudo o que foi aprendido - mover o cursor, clicar, dar duplo clique, rolar a tela e arrastar - em situações práticas do dia a dia, como:</p>
<ul>
  <li>Clicar em botões pequenos ou em links</li>
  <li>Fechar, maximizar ou minimizar uma janela</li>
  <li>Abrir e fechar programas</li>
  <li>Selecionar arquivos</li>
  <li>Navegar por menus</li>
  <li>Usar a barra de rolagem lateral da tela</li>
  <li>Corrigir um clique feito no lugar errado</li>
</ul>`,
          },
          {
            titulo: 'A precisão vem com a prática',
            conteudo: `<p>É natural que, no começo, a mão precise de mais tempo para apontar com exatidão em áreas pequenas da tela. Isso melhora com a prática, da mesma forma que qualquer habilidade manual - como costurar um botão ou encaixar uma chave na fechadura - fica mais precisa quanto mais vezes é repetida.</p>
<p>Se em algum momento você clicar no lugar errado, não há problema: basta clicar novamente no local correto. Errar faz parte do processo de aprender.</p>`,
          },
          {
            titulo: 'Para lembrar',
            conteudo: `<ul>
  <li>O mouse é a sua forma de "apontar e escolher" no computador.</li>
  <li>O cursor (a seta na tela) segue o movimento da sua mão.</li>
  <li>Clique simples seleciona; duplo clique abre; o botão direito mostra mais opções.</li>
  <li>A rodinha (scroll) rola a página para cima ou para baixo.</li>
  <li>Arrastar e soltar é clicar, segurar, mover e soltar no lugar certo.</li>
  <li>A precisão vem com a prática - não existe pressa nem cobrança nesse caminho.</li>
</ul>`,
            dica: 'Você está construindo, um clique de cada vez, uma habilidade que vai abrir muitas portas. Continue no seu ritmo: ele é o certo. 💛',
          },
        ],
      },
    ],
  },

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
            titulo: 'O que você vai encontrar',
            conteudo: `<ul>
  <li><strong>Letras</strong>: organizadas de um jeito que pode parecer estranho no começo (não seguem a ordem do alfabeto), mas que logo se torna familiar.</li>
  <li><strong>Números</strong>: aparecem na fileira de cima e também, em muitos teclados, em um bloco à direita.</li>
  <li><strong>Símbolos</strong>: como @ (arroba), ponto e vírgula, usados em situações específicas que veremos mais adiante.</li>
  <li><strong>Teclas grandes e pequenas</strong>: teclas maiores, como a barra de espaço e o Enter, são pensadas para serem fáceis de encontrar.</li>
</ul>`,
            dica: 'Você já usou algum teclado antes, como o de um caixa eletrônico ou de um telefone antigo? O que foi parecido ou diferente do teclado do computador?',
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
  <li>O <strong>Backspace</strong> apaga o que está antes do cursor.</li>
  <li>O <strong>Delete</strong> apaga o que está depois do cursor, ou apaga algo que você já selecionou na tela (um arquivo, por exemplo).</li>
</ul>
<p>Não é preciso decorar isso de imediato - com a prática, a diferença fica clara naturalmente.</p>`,
          },
        ],
      },
      {
        id: '2-8',
        titulo: 'Shift',
        etapas: [
          {
            titulo: 'Maiúsculas e símbolos',
            conteudo: `<p>A tecla Shift, geralmente localizada nos dois lados do teclado, tem duas funções principais:</p>
<ul>
  <li>Permite escrever <strong>letras maiúsculas</strong>: basta segurar o Shift e, ao mesmo tempo, apertar a letra desejada.</li>
  <li>Permite digitar os <strong>símbolos que ficam na parte de cima</strong> de algumas teclas (como o próprio @, em muitos teclados).</li>
</ul>
<p>O segredo para usá-la bem é a ordem: primeiro segure o Shift, depois aperte a outra tecla, mantendo as duas pressionadas por um instante e soltando em seguida.</p>`,
          },
        ],
      },
      {
        id: '2-9',
        titulo: 'Caps Lock',
        etapas: [
          {
            titulo: 'Travando as maiúsculas',
            conteudo: `<p>O Caps Lock é uma tecla que, quando ativada, faz com que todas as letras digitadas apareçam em maiúsculas, sem precisar segurar o Shift o tempo todo.</p>
<ul>
  <li>Para ativar, basta apertar a tecla uma vez.</li>
  <li>Para desativar, aperte novamente.</li>
  <li>A maioria dos teclados tem uma pequena luz que acende quando o Caps Lock está ativo.</li>
</ul>
<p>Se, ao digitar, você notar que TUDO ESTÁ SAINDO EM MAIÚSCULAS sem que você quisesse, é bem provável que o Caps Lock esteja ativado. Basta apertá-lo novamente para voltar ao normal.</p>`,
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
  <li>Pela <strong>fileira de números</strong> na parte de cima do teclado, junto das letras.</li>
  <li>Pelo <strong>teclado numérico</strong>, um bloco à direita presente em muitos teclados de computador de mesa, organizado de forma parecida com uma calculadora.</li>
</ul>
<p>Essa habilidade é útil para digitar telefones, datas e documentos como o CPF - situações comuns no dia a dia, como preencher um cadastro.</p>`,
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
  <li><strong>/</strong> (barra): aparece em endereços de internet.</li>
  <li><strong>?</strong> (interrogação): usado ao final de perguntas.</li>
  <li><strong>:</strong> e <strong>;</strong> (dois-pontos e ponto e vírgula): usados na escrita de frases.</li>
</ul>
<p>Não é necessário memorizar a posição de todos de uma vez - com o uso repetido em situações reais, como digitar seu próprio e-mail, a localização vai se tornando familiar.</p>`,
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
  <li><strong>ESC</strong>: geralmente cancela uma ação ou fecha uma janela menor.</li>
  <li><strong>TAB</strong>: move o cursor para o próximo campo em um formulário, por exemplo.</li>
  <li><strong>Ctrl e Alt</strong>: usadas em conjunto com outras teclas para atalhos.</li>
  <li><strong>Windows</strong>: abre o menu principal do computador.</li>
  <li><strong>Setas direcionais</strong>: movem o cursor para cima, para baixo, para a esquerda ou para a direita dentro de um texto.</li>
</ul>`,
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
  <li>As setas direcionais movem o cursor pelo texto, letra por letra ou linha por linha.</li>
  <li>É possível selecionar um trecho de texto combinando o Shift com as setas.</li>
  <li>Existem atalhos para ir diretamente ao início ou ao final de uma linha.</li>
</ul>`,
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
  <li>Digitar um e-mail</li>
  <li>Preencher um endereço</li>
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
            titulo: 'Para lembrar',
            conteudo: `<ul>
  <li>O teclado é organizado em letras, números, símbolos e teclas especiais.</li>
  <li>Um toque leve nas teclas já é suficiente - não é preciso força.</li>
  <li>Backspace apaga para trás; Delete apaga para frente.</li>
  <li>Shift escreve maiúsculas; Caps Lock mantém tudo em maiúsculas até ser desativado.</li>
  <li>Os atalhos tornam algumas tarefas mais rápidas, mas podem ser aprendidos com calma.</li>
</ul>`,
            dica: 'Cada palavra digitada é um passo a mais na sua autonomia. Continue praticando no seu ritmo - a confiança vem da repetição, não da pressa. 💛',
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
<p>"Hardware" é o nome dado a tudo aquilo que é físico no computador: as peças que você pode tocar, ver e segurar - diferente do que aparece na tela, que chamamos de "digital" ou "software".</p>
<p>Pense assim: o hardware é como o corpo do computador, e os programas são como os pensamentos e ações que esse corpo realiza. O monitor, o teclado, o mouse, as caixas de som - tudo isso é hardware.</p>`,
            dica: 'Em sua casa, quais equipamentos você já reconhece como parte do computador? Talvez você já conheça mais peças do que imagina.',
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
  <li><strong>Ligar o monitor</strong>: geralmente existe um botão específico, separado do botão que liga o computador todo.</li>
  <li><strong>Ajustar a posição</strong>: vale a pena posicionar o monitor na altura dos olhos, para evitar desconforto no pescoço.</li>
  <li><strong>Entender o que aparece na tela</strong>: ícones, janelas e textos mudam a cada clique ou tecla digitada.</li>
</ul>`,
          },
        ],
      },
      {
        id: '3-3',
        titulo: 'Gabinete/CPU',
        etapas: [
          {
            titulo: 'O "cérebro" da máquina',
            conteudo: `<p>O gabinete (também chamado de CPU) é a caixa que guarda as peças internas do computador - é como o "cérebro" da máquina, guardado dentro de uma estrutura protegida.</p>
<p>Vale a pena reconhecer o botão de ligar, geralmente localizado na parte da frente do gabinete. Um cuidado importante: evite desligar o gabinete de forma incorreta, como tirando o cabo de energia diretamente da tomada enquanto o computador está em uso.</p>`,
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
        ],
      },
      {
        id: '3-6',
        titulo: 'Fones de ouvido',
        etapas: [
          {
            titulo: 'Som de forma individual',
            conteudo: `<p>Os fones de ouvido cumprem uma função parecida com a das caixas de som, mas de forma mais individual e discreta - úteis, por exemplo, para ouvir uma videochamada sem incomodar outras pessoas na casa.</p>
<p>Existem diferentes tipos de conexão, dependendo do modelo: alguns usam um cabo com entrada específica, outros se conectam sem fio.</p>`,
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
<p>Um cuidado importante: muitos aparelhos têm uma pequena luz que acende quando a câmera ou o microfone estão em uso - vale a pena conferir essa luz, pra ter mais tranquilidade sobre sua privacidade.</p>`,
          },
        ],
      },
      {
        id: '3-8',
        titulo: 'Cabos e conexões',
        etapas: [
          {
            titulo: 'Aos poucos, sem pressa',
            conteudo: `<p>Existem diversos tipos de cabos e conexões diferentes no universo dos computadores, cada um com uma função específica - não é necessário conhecer todos de uma vez. Aos poucos, à medida que for usando o computador no dia a dia, você vai naturalmente identificando qual cabo serve para qual finalidade.</p>`,
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
  <li><strong>Identificar quando travou</strong>: se a tela parar de responder por um tempo, vale esperar um pouco antes de tomar qualquer decisão mais drástica.</li>
</ul>`,
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
  <li>Se páginas não carregam ou mensagens não são enviadas, pode ser sinal de que a conexão caiu - algo que acontece até com os usuários mais experientes.</li>
</ul>`,
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