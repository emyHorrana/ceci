/**
 * modulos.js
 * Fonte da verdade local para a estrutura de módulos e mini-módulos do CECI.
 * Não precisa estar no banco de dados — é conteúdo estático do currículo.
 *
 * Estrutura:
 *  modulos[]
 *    └── miniModulos[]
 *          └── etapas[]   ← cada etapa é uma "tela" dentro do mini-módulo
 *                            { titulo, conteudo (HTML/texto), dica? }
 */

export const MODULOS = [
  {
    id: '1',
    emoji: '🖱️',
    titulo: 'Uso do Mouse',
    descricao: 'Aprenda a usar o mouse para navegar no computador.',
    miniModulos: [
      {
        id: '1-1',
        titulo: 'Reconhecendo o mouse',
        etapas: [
          {
            titulo: 'O que é um mouse?',
            conteudo: `<p>O <strong>mouse</strong> é um aparelho que fica na sua mão e ajuda você a "apontar" para coisas na tela do computador.</p>
<p>Pense nele como um dedo extra, só que em cima da mesa!</p>`,
            dica: 'Segure o mouse com a mão dominante, sem apertar forte. Relaxe os dedos!',
          },
          {
            titulo: 'Para que serve o mouse?',
            conteudo: `<p>Com o mouse você consegue:</p>
<ul>
  <li>📂 Abrir pastas e programas</li>
  <li>✍️ Clicar em botões e links</li>
  <li>🔃 Rolar a página para cima e para baixo</li>
</ul>
<p>Tudo isso movendo o mouse pela mesa e clicando nos botões dele.</p>`,
            dica: 'Experimente mover o mouse devagar e veja a setinha se mexer na tela!',
          },
          {
            titulo: 'Identificação dos botões',
            conteudo: `<p>O mouse tem <strong>dois botões</strong> principais:</p>
<ul>
  <li>🟦 <strong>Botão esquerdo</strong>: o mais usado. Serve para selecionar e abrir.</li>
  <li>🟩 <strong>Botão direito</strong>: abre um menu de opções extras.</li>
</ul>
<p>No meio há uma rodinha chamada <strong>scroll</strong>, que faz a tela subir e descer.</p>`,
            dica: 'Quando não souber o que fazer, tente clicar com o botão ESQUERDO primeiro.',
          },
        ],
      },
      {
        id: '1-2',
        titulo: 'Clicando e arrastando',
        etapas: [
          {
            titulo: 'Como clicar corretamente',
            conteudo: `<p>Clicar significa pressionar e soltar <strong>rapidamente</strong> o botão do mouse.</p>
<p>Dois cliques rápidos seguidos = <strong>duplo clique</strong>, que abre arquivos e programas.</p>`,
            dica: 'Um clique seleciona. Dois cliques abre. Pratique devagar!',
          },
          {
            titulo: 'Arrastando objetos',
            conteudo: `<p>Para <strong>arrastar</strong>: segure o botão esquerdo apertado enquanto move o mouse.</p>
<p>Solte o botão quando chegar no lugar certo.</p>
<p>Isso serve para mover ícones, arquivos e janelas na tela.</p>`,
            dica: 'Se arrastar sem querer, pressione Ctrl+Z para desfazer!',
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
            titulo: 'O que é o teclado?',
            conteudo: `<p>O <strong>teclado</strong> é um conjunto de teclas que você usa para escrever no computador.</p>
<p>É como uma máquina de escrever, mas muito mais poderosa!</p>`,
            dica: 'Não precisa apertar as teclas com força. Um toque leve já funciona.',
          },
          {
            titulo: 'Para que serve o teclado?',
            conteudo: `<p>Com o teclado você pode:</p>
<ul>
  <li>✉️ Escrever mensagens e e-mails</li>
  <li>🔍 Pesquisar na internet</li>
  <li>📝 Criar documentos e textos</li>
  <li>⌨️ Usar atalhos que facilitam o trabalho</li>
</ul>`,
            dica: 'Comece digitando seu nome! É um ótimo exercício para iniciantes.',
          },
          {
            titulo: 'Identificação das teclas principais',
            conteudo: `<p>As teclas mais importantes para começar:</p>
<ul>
  <li>⬜ <strong>Espaço</strong>: a barra comprida embaixo. Coloca espaço entre palavras.</li>
  <li>↵ <strong>Enter</strong>: confirma ações e pula para nova linha.</li>
  <li>⌫ <strong>Backspace</strong>: apaga a letra antes do cursor.</li>
</ul>`,
            dica: 'Procure essas três teclas antes de começar a digitar. Elas são suas melhores amigas!',
          },
        ],
      },
    ],
  },

  {
    id: '3',
    emoji: '🔌',
    titulo: 'Hardware e Periféricos',
    descricao: 'Entenda as partes físicas do computador.',
    miniModulos: [
      {
        id: '3-1',
        titulo: 'O que é hardware?',
        etapas: [
          {
            titulo: 'Hardware: a parte que você toca',
            conteudo: `<p><strong>Hardware</strong> são todas as partes físicas do computador — tudo que você pode <em>tocar</em>.</p>
<p>Exemplos: monitor, teclado, mouse, impressora, pen drive.</p>`,
            dica: 'Se você pode segurar na mão, é hardware!',
          },
          {
            titulo: 'Hardware × Software',
            conteudo: `<p>O computador tem duas partes principais:</p>
<ul>
  <li>🔩 <strong>Hardware</strong>: o que é físico (o corpo do computador)</li>
  <li>💿 <strong>Software</strong>: os programas e o sistema (a mente do computador)</li>
</ul>
<p>Um não funciona bem sem o outro!</p>`,
            dica: 'Pense assim: hardware é o livro, software é o texto dentro do livro.',
          },
          {
            titulo: 'Identificando os equipamentos',
            conteudo: `<p>Num computador completo você normalmente encontra:</p>
<ul>
  <li>🖥️ <strong>Monitor</strong>: a tela onde você vê tudo</li>
  <li>🖱️ <strong>Mouse</strong>: para navegar</li>
  <li>⌨️ <strong>Teclado</strong>: para digitar</li>
  <li>🖨️ <strong>Impressora</strong> (opcional): para imprimir documentos</li>
  <li>💻 <strong>CPU / Notebook</strong>: o "cérebro" que processa tudo</li>
</ul>`,
            dica: 'Olhe ao redor! Quais desses equipamentos você reconhece agora?',
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