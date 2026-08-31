/**
 * unidades.js
 * Agrupa os mini-módulos existentes (data/modulos.js) em Unidades,
 * conforme a "Sugestão de Arquitetura Adaptativa" - ver documento.
 *
 * Cada Unidade possui uma bateria de desafios de fim de Unidade (checkpoint)
 * com 3 a 4 questões/desafios formativos para consolidação e veredito do BKT.
 */

import { MODULOS } from './modulos';

const MAPA_MINI_MODULOS = MODULOS.reduce((mapa, modulo) => {
  modulo.miniModulos.forEach((mm) => {
    mapa[mm.id] = mm;
  });
  return mapa;
}, {});

export const TIERS = {
  0: { label: 'Essencial', descricao: 'Mínimo pra usar a plataforma' },
  1: { label: 'Importante', descricao: 'Necessário pra tarefas comuns' },
  2: { label: 'Complementar', descricao: 'Não bloqueia o uso básico' },
};

const DEFINICOES_UNIDADES = [
  // =========================================================================
  // MÓDULO 1 - MOUSE (Tier 0: Essencial)
  // =========================================================================
  {
    id: 'U1.1', moduloId: '1', tier: 0, titulo: 'Fundamentos do mouse', prerequisitos: [], miniModuloIds: ['1-1', '1-2'],
    checkpoint: {
      titulo: 'Desafio: Fundamentos do mouse',
      questoes: [
        {
          id: 'u1-1-q1',
          tipo: 'quiz',
          titulo: 'Para que serve o botão esquerdo?',
          instructions: 'Escolha a alternativa correta.',
          jogoProps: {
            pergunta: 'Para que serve o botão esquerdo do mouse (o mais usado no dia a dia)?',
            alternativas: [
              { id: 'abrir', texto: 'Selecionar itens, abrir programas e clicar em botões', correta: true },
              { id: 'desligar', texto: 'Desligar o computador imediatamente', correta: false },
              { id: 'volume', texto: 'Aumentar o volume do som', correta: false },
            ],
          },
        },
        {
          id: 'u1-1-q2',
          tipo: 'associacao',
          titulo: 'Qual botão faz o quê?',
          instructions: 'Arraste a ação até o botão certo do mouse.',
          jogoProps: {
            item: { id: 'abrir-menu', label: 'Abrir o menu de opções extras' },
            zonas: [
              { id: 'esquerdo', label: 'Botão esquerdo', correta: false },
              { id: 'direito', label: 'Botão direito', correta: true },
            ],
          },
        },
        {
          id: 'u1-1-q3',
          tipo: 'quiz',
          titulo: 'Movimento na tela',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'O que acontece na tela quando você move o mouse sobre a mesa?',
            alternativas: [
              { id: 'setinha', texto: 'A setinha (cursor) se move na mesma direção na tela', correta: true },
              { id: 'apaga', texto: 'A tela apaga para economizar energia', correta: false },
              { id: 'digita', texto: 'O computador começa a digitar letras sozinho', correta: false },
            ],
          },
        },
        {
          id: 'u1-1-q4',
          tipo: 'quiz',
          titulo: 'Como segurar o mouse',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual é a forma mais confortável e correta de segurar o mouse?',
            alternativas: [
              { id: 'suave', texto: 'Apoiando a mão de forma leve e relaxada, sem apertar com força', correta: true },
              { id: 'forca', texto: 'Apertando com toda a força para ele não escapar', correta: false },
              { id: 'duas-maos', texto: 'Segurando com as duas mãos ao mesmo tempo', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U1.2', moduloId: '1', tier: 0, titulo: 'Cliques com timing', prerequisitos: ['U1.1'], miniModuloIds: ['1-3', '1-5'],
    checkpoint: {
      titulo: 'Desafio: Cliques com timing',
      questoes: [
        {
          id: 'u1-2-q1',
          tipo: 'associacao',
          titulo: 'Clique simples ou duplo?',
          instructions: 'Arraste a ação até o tipo de clique correto.',
          jogoProps: {
            item: { id: 'abrir-arquivo', label: 'Abrir um arquivo ou programa pelo ícone' },
            zonas: [
              { id: 'simples', label: 'Clique simples (1 toque)', correta: false },
              { id: 'duplo', label: 'Clique duplo (2 toques rápidos)', correta: true },
            ],
          },
        },
        {
          id: 'u1-2-q2',
          tipo: 'quiz',
          titulo: 'O ritmo do clique duplo',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'No clique duplo, como deve ser o ritmo entre os dois cliques?',
            alternativas: [
              { id: 'rapido', texto: 'Dois cliques rápidos e seguidos, sem mover o mouse', correta: true },
              { id: 'demorado', texto: 'Um clique agora e outro depois de 1 minuto', correta: false },
              { id: 'segurar', texto: 'Segurar o botão apertado por muito tempo', correta: false },
            ],
          },
        },
        {
          id: 'u1-2-q3',
          tipo: 'quiz',
          titulo: 'Clicando em botões da internet',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Para clicar em um link ou botão numa página da internet (como "Avançar"), qual clique usamos?',
            alternativas: [
              { id: 'simples', texto: 'Um clique simples com o botão esquerdo', correta: true },
              { id: 'duplo-direito', texto: 'Clique duplo com o botão direito', correta: false },
              { id: 'roda', texto: 'Apertar a rodinha do mouse três vezes', correta: false },
            ],
          },
        },
        {
          id: 'u1-2-q4',
          tipo: 'quiz',
          titulo: 'Posicionando o cursor',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Quando você dá um clique simples no meio de um texto, o que acontece?',
            alternativas: [
              { id: 'posiciona', texto: 'O cursor de texto fica piscando exatamente onde você clicou', correta: true },
              { id: 'apaga', texto: 'O texto inteiro é excluído', correta: false },
              { id: 'desliga', texto: 'O computador fecha o programa', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U1.3', moduloId: '1', tier: 0, titulo: 'Rolagem e precisão', prerequisitos: ['U1.2'], miniModuloIds: ['1-4', '1-6'],
    checkpoint: {
      titulo: 'Desafio: Rolagem e precisão',
      questoes: [
        {
          id: 'u1-3-q1',
          tipo: 'quiz',
          titulo: 'Rolando a página',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Você quer ver o conteúdo que está mais embaixo numa página. O que você faz?',
            alternativas: [
              { id: 'girar-baixo', texto: 'Girar a rodinha do mouse (scroll) para baixo', correta: true },
              { id: 'girar-cima', texto: 'Girar a rodinha do mouse para cima', correta: false },
              { id: 'clicar-duplo', texto: 'Dar um clique duplo no monitor', correta: false },
            ],
          },
        },
        {
          id: 'u1-3-q2',
          tipo: 'associacao',
          titulo: 'Mover itens de lugar',
          instructions: 'Arraste a ação até a técnica correta.',
          jogoProps: {
            item: { id: 'arrastar-icone', label: 'Mover um ícone de um lado para o outro' },
            zonas: [
              { id: 'arrastar', label: 'Clicar, segurar e arrastar', correta: true },
              { id: 'apenas-olhar', label: 'Apenas passar o mouse por cima', correta: false },
            ],
          },
        },
        {
          id: 'u1-3-q3',
          tipo: 'quiz',
          titulo: 'Função da rodinha (scroll)',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Para que serve a rodinha (scroll) localizada entre os dois botões do mouse?',
            alternativas: [
              { id: 'subir-descer', texto: 'Subir e descer a visualização de páginas e documentos', correta: true },
              { id: 'cores', texto: 'Mudar a cor da tela do computador', correta: false },
              { id: 'volume', texto: 'Apenas aumentar a velocidade da internet', correta: false },
            ],
          },
        },
        {
          id: 'u1-3-q4',
          tipo: 'quiz',
          titulo: 'Selecionando trecho de texto',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Quando você clica e arrasta o mouse por cima de uma frase, o que acontece?',
            alternativas: [
              { id: 'marca', texto: 'O texto fica selecionado (destacado em azul)', correta: true },
              { id: 'some', texto: 'A frase é apagada para sempre', correta: false },
              { id: 'imprime', texto: 'O computador imprime a folha automaticamente', correta: false },
            ],
          },
        },
      ],
    },
  },

  // =========================================================================
  // MÓDULO 2 - TECLADO (Tier 1: Importante)
  // =========================================================================
  {
    id: 'U2.1', moduloId: '2', tier: 1, titulo: 'Fundamentos do teclado', prerequisitos: [], miniModuloIds: ['2-1', '2-2'],
    checkpoint: {
      titulo: 'Desafio: Fundamentos do teclado',
      questoes: [
        {
          id: 'u2-1-q1',
          tipo: 'quiz',
          titulo: 'Força ao digitar',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Verdadeiro ou falso: você precisa apertar as teclas com força para o computador reconhecer.',
            alternativas: [
              { id: 'falso', texto: 'Falso, basta um toque leve e suave', correta: true },
              { id: 'verdadeiro', texto: 'Verdadeiro, precisa apertar bem forte', correta: false },
            ],
          },
        },
        {
          id: 'u2-1-q2',
          tipo: 'quiz',
          titulo: 'A tecla mais longa',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual é aquela tecla bem comprida que fica na parte de baixo do teclado?',
            alternativas: [
              { id: 'espaco', texto: 'Barra de espaço', correta: true },
              { id: 'enter', texto: 'Tecla Enter', correta: false },
              { id: 'shift', texto: 'Tecla Shift', correta: false },
            ],
          },
        },
        {
          id: 'u2-1-q3',
          tipo: 'quiz',
          titulo: 'Separando palavras',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Para que serve a barra de espaço ao escrever um texto?',
            alternativas: [
              { id: 'separar', texto: 'Inserir um espaço em branco entre uma palavra e outra', correta: true },
              { id: 'apagar', texto: 'Apagar a última palavra digitada', correta: false },
              { id: 'maiuscula', texto: 'Deixar tudo em maiúsculas', correta: false },
            ],
          },
        },
        {
          id: 'u2-1-q4',
          tipo: 'quiz',
          titulo: 'Organização das letras',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Como as letras estão organizadas no teclado do computador?',
            alternativas: [
              { id: 'qwerty', texto: 'No padrão QWERTY (letras mais comuns distribuídas para facilitar a digitação)', correta: true },
              { id: 'abc', texto: 'Em ordem alfabética exata de A até Z em linha reta', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U2.2', moduloId: '2', tier: 1, titulo: 'Escrever e confirmar', prerequisitos: ['U2.1'], miniModuloIds: ['2-3', '2-4', '2-5'],
    checkpoint: {
      titulo: 'Desafio: Escrever e confirmar',
      questoes: [
        {
          id: 'u2-2-q1',
          tipo: 'quiz',
          titulo: 'Confirmando informações',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Depois de digitar seu nome numa caixa de texto ou formulário, qual tecla você aperta para confirmar?',
            alternativas: [
              { id: 'enter', texto: 'Enter', correta: true },
              { id: 'espaco', texto: 'Barra de espaço', correta: false },
              { id: 'shift', texto: 'Shift', correta: false },
              { id: 'capslock', texto: 'Caps Lock', correta: false },
            ],
          },
        },
        {
          id: 'u2-2-q2',
          tipo: 'quiz',
          titulo: 'Pulando de linha',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Ao escrever um bilhete ou mensagem, qual tecla você aperta para pular para a linha de baixo?',
            alternativas: [
              { id: 'enter', texto: 'Tecla Enter', correta: true },
              { id: 'espaco', texto: 'Barra de espaço', correta: false },
              { id: 'esc', texto: 'Tecla Esc', correta: false },
            ],
          },
        },
        {
          id: 'u2-2-q3',
          tipo: 'quiz',
          titulo: 'O cursor que pisca',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'O que é aquele tracinho que fica piscando (|) dentro da caixa de texto?',
            alternativas: [
              { id: 'cursor', texto: 'O cursor, mostrando onde a próxima letra vai aparecer', correta: true },
              { id: 'defeito', texto: 'Um defeito na lâmpada do monitor', correta: false },
              { id: 'virus', texto: 'Um aviso de vírus no computador', correta: false },
            ],
          },
        },
        {
          id: 'u2-2-q4',
          tipo: 'quiz',
          titulo: 'Espaço entre palavras',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Para dar um espaço normal entre duas palavras, quantas vezes apertamos a barra de espaço?',
            alternativas: [
              { id: 'uma', texto: 'Apenas 1 toque', correta: true },
              { id: 'cinco', texto: '5 toques rápidos', correta: false },
              { id: 'segurar', texto: 'Segurar apertado por 10 segundos', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U2.3', moduloId: '2', tier: 1, titulo: 'Corrigindo erros', prerequisitos: ['U2.2'], miniModuloIds: ['2-6', '2-7'],
    checkpoint: {
      titulo: 'Desafio: Corrigindo erros',
      questoes: [
        {
          id: 'u2-3-q1',
          tipo: 'quiz',
          titulo: 'Apagando para trás',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Você errou uma letra e o cursor está logo DEPOIS dela. Qual tecla apaga para trás (à esquerda)?',
            alternativas: [
              { id: 'backspace', texto: 'Backspace (com a setinha para a esquerda ⌫)', correta: true },
              { id: 'enter', texto: 'Enter', correta: false },
              { id: 'espaco', texto: 'Barra de espaço', correta: false },
              { id: 'shift', texto: 'Shift', correta: false },
            ],
          },
        },
        {
          id: 'u2-3-q2',
          tipo: 'quiz',
          titulo: 'Backspace versus Delete',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual é a diferença entre as teclas Backspace e Delete?',
            alternativas: [
              { id: 'diferenca', texto: 'Backspace apaga o que está ANTES do cursor; Delete apaga o que está DEPOIS', correta: true },
              { id: 'iguais', texto: 'As duas fazem exatamente a mesma coisa sem diferença', correta: false },
              { id: 'del-desliga', texto: 'Delete serve para desligar o computador', correta: false },
            ],
          },
        },
        {
          id: 'u2-3-q3',
          tipo: 'associacao',
          titulo: 'Direção de apagar',
          instructions: 'Arraste a tecla para o tipo de apagamento que ela realiza:',
          jogoProps: {
            item: { id: 'apagar-esquerda', label: 'Apagar a letra à ESQUERDA (para trás)' },
            zonas: [
              { id: 'backspace', label: 'Tecla Backspace (⌫)', correta: true },
              { id: 'delete', label: 'Tecla Delete (Del)', correta: false },
            ],
          },
        },
        {
          id: 'u2-3-q4',
          tipo: 'quiz',
          titulo: 'Segurando a tecla de apagar',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Se você segurar a tecla Backspace apertada continuamente, o que acontece?',
            alternativas: [
              { id: 'apaga-tudo', texto: 'Ela continua apagando as letras uma a uma enquanto estiver segurada', correta: true },
              { id: 'trava', texto: 'O teclado quebra e trava o computador', correta: false },
              { id: 'duplica', texto: 'O texto se duplica na tela', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U2.4', moduloId: '2', tier: 1, titulo: 'Maiúsculas', prerequisitos: ['U2.3'], miniModuloIds: ['2-8', '2-9'],
    checkpoint: {
      titulo: 'Desafio: Maiúsculas e Minúsculas',
      questoes: [
        {
          id: 'u2-4-q1',
          tipo: 'quiz',
          titulo: 'Apenas uma letra maiúscula',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Você quer digitar SÓ a primeira letra do seu nome em maiúscula (ex: Maria). Qual tecla usar?',
            alternativas: [
              { id: 'shift', texto: 'Segurar Shift enquanto digita a primeira letra, depois soltar', correta: true },
              { id: 'capslock', texto: 'Ligar o Caps Lock e deixar ligado o tempo todo', correta: false },
              { id: 'espaco', texto: 'Apertar a barra de espaço duas vezes', correta: false },
            ],
          },
        },
        {
          id: 'u2-4-q2',
          tipo: 'quiz',
          titulo: 'Texto todo maiúsculo',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Você precisa digitar uma palavra inteira em maiúsculas (ex: ATENÇÃO). O que é mais prático?',
            alternativas: [
              { id: 'capslock', texto: 'Apertar Caps Lock (Fixa) uma vez para ativar as maiúsculas', correta: true },
              { id: 'shift-todo', texto: 'Segurar a tecla Shift sem soltar durante toda a digitação', correta: false },
              { id: 'enter', texto: 'Apertar a tecla Enter após cada letra', correta: false },
            ],
          },
        },
        {
          id: 'u2-4-q3',
          tipo: 'quiz',
          titulo: 'Luz indicadora',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Como você sabe que a tecla Caps Lock (Fixa) está ativada?',
            alternativas: [
              { id: 'luzinha', texto: 'Uma luzinha indicadora acende no próprio teclado', correta: true },
              { id: 'monitor', texto: 'O monitor começa a piscar', correta: false },
              { id: 'som', texto: 'Um alarme toca no computador', correta: false },
            ],
          },
        },
        {
          id: 'u2-4-q4',
          tipo: 'quiz',
          titulo: 'Shift com Caps Lock ligado',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Se o Caps Lock estiver LIGADO e você segurar Shift ao digitar uma letra, como ela sai?',
            alternativas: [
              { id: 'minuscula', texto: 'Sai minúscula (o Shift inverte o estado temporariamente)', correta: true },
              { id: 'apaga', texto: 'A letra não aparece na tela', correta: false },
              { id: 'numero', texto: 'Vira um número automaticamente', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U2.5', moduloId: '2', tier: 1, titulo: 'Números e símbolos', prerequisitos: ['U2.4'], miniModuloIds: ['2-10', '2-11'],
    checkpoint: {
      titulo: 'Desafio: Números e símbolos',
      questoes: [
        {
          id: 'u2-5-q1',
          tipo: 'quiz',
          titulo: 'Símbolos superiores',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Para digitar os símbolos que ficam na parte de CIMA das teclas de números (ex: !, #, $, %), o que fazemos?',
            alternativas: [
              { id: 'shift', texto: 'Seguramos a tecla Shift e apertamos o número', correta: true },
              { id: 'capslock', texto: 'Ligamos o Caps Lock', correta: false },
              { id: 'espaco', texto: 'Apertamos a barra de espaço duas vezes', correta: false },
            ],
          },
        },
        {
          id: 'u2-5-q2',
          tipo: 'quiz',
          titulo: 'Digitando o @ (arroba)',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'No teclado brasileiro (ABNT2), qual combinação digita o símbolo @ (arroba)?',
            alternativas: [
              { id: 'altgr-q', texto: 'Alt Gr + Q (ou Shift + 2 dependendo do modelo)', correta: true },
              { id: 'ctrl-q', texto: 'Ctrl + Q', correta: false },
              { id: 'so-q', texto: 'Apenas a tecla Q sozinha', correta: false },
            ],
          },
        },
        {
          id: 'u2-5-q3',
          tipo: 'quiz',
          titulo: 'Ponto de interrogação (?)',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Ao fazer uma pergunta, qual combinação costuma colocar o ponto de interrogação (?)?',
            alternativas: [
              { id: 'shift-interrogacao', texto: 'Segurar Shift e apertar a tecla com o símbolo ?', correta: true },
              { id: 'enter-duplo', texto: 'Apertar Enter duas vezes', correta: false },
              { id: 'esc', texto: 'Apertar a tecla Esc', correta: false },
            ],
          },
        },
        {
          id: 'u2-5-q4',
          tipo: 'quiz',
          titulo: 'Teclado numérico lateral',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Em teclados com bloco de números na lateral direita (tipo calculadora), qual tecla liga os números?',
            alternativas: [
              { id: 'numlock', texto: 'Num Lock (com sua respectiva luzinha acesa)', correta: true },
              { id: 'capslock', texto: 'Caps Lock', correta: false },
              { id: 'tab', texto: 'Tab', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U2.6', moduloId: '2', tier: 1, titulo: 'Teclas especiais e navegação', prerequisitos: ['U2.5'], miniModuloIds: ['2-12', '2-13'],
    checkpoint: {
      titulo: 'Desafio: Teclas especiais e navegação',
      questoes: [
        {
          id: 'u2-6-q1',
          tipo: 'quiz',
          titulo: 'Movendo o cursor pelo texto',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Você quer mover o cursor para o meio de uma palavra sem apagar nenhuma letra. O que usar?',
            alternativas: [
              { id: 'setas', texto: 'As setas de navegação (⬅ ➡ ⬆ ⬇)', correta: true },
              { id: 'backspace', texto: 'A tecla Backspace', correta: false },
              { id: 'delete', texto: 'A tecla Delete', correta: false },
              { id: 'esc', texto: 'A tecla Esc', correta: false },
            ],
          },
        },
        {
          id: 'u2-6-q2',
          tipo: 'quiz',
          titulo: 'Para que serve o Esc?',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Para que serve a tecla Esc (Escape), no canto superior esquerdo do teclado?',
            alternativas: [
              { id: 'cancelar', texto: 'Cancelar uma ação, fechar menus ou sair de telas cheias', correta: true },
              { id: 'salvar', texto: 'Salvar um arquivo', correta: false },
              { id: 'imprimir', texto: 'Mandar imprimir a página', correta: false },
            ],
          },
        },
        {
          id: 'u2-6-q3',
          tipo: 'quiz',
          titulo: 'Pulando campos com o Tab',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Ao preencher um formulário (ex: Nome, E-mail, Cidade), qual tecla pula para o próximo campo?',
            alternativas: [
              { id: 'tab', texto: 'Tecla Tab (⇥)', correta: true },
              { id: 'shift', texto: 'Tecla Shift', correta: false },
              { id: 'esc', texto: 'Tecla Esc', correta: false },
            ],
          },
        },
        {
          id: 'u2-6-q4',
          tipo: 'quiz',
          titulo: 'Setas para cima e para baixo',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'O que as setas para cima (⬆) e para baixo (⬇) fazem em um texto longo?',
            alternativas: [
              { id: 'linhas', texto: 'Movem o cursor para a linha de cima ou para a de baixo', correta: true },
              { id: 'apagam', texto: 'Apagam a tela inteira', correta: false },
              { id: 'desligam', texto: 'Desligam o monitor', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U2.7', moduloId: '2', tier: 2, titulo: 'Atalhos', prerequisitos: [], miniModuloIds: ['2-14'],
    checkpoint: {
      titulo: 'Desafio: Atalhos de teclado',
      questoes: [
        {
          id: 'u2-7-q1',
          tipo: 'quiz',
          titulo: 'Atalho para COPIAR',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Você selecionou um texto ou foto e quer COPIAR. Qual atalho usar?',
            alternativas: [
              { id: 'ctrl-c', texto: 'Ctrl + C', correta: true },
              { id: 'ctrl-v', texto: 'Ctrl + V', correta: false },
              { id: 'ctrl-z', texto: 'Ctrl + Z', correta: false },
              { id: 'ctrl-a', texto: 'Ctrl + A', correta: false },
            ],
          },
        },
        {
          id: 'u2-7-q2',
          tipo: 'quiz',
          titulo: 'Atalho para COLAR',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Depois de copiar, qual atalho você usa para COLAR no destino?',
            alternativas: [
              { id: 'ctrl-v', texto: 'Ctrl + V', correta: true },
              { id: 'ctrl-c', texto: 'Ctrl + C', correta: false },
              { id: 'ctrl-x', texto: 'Ctrl + X', correta: false },
              { id: 'ctrl-p', texto: 'Ctrl + P', correta: false },
            ],
          },
        },
        {
          id: 'u2-7-q3',
          tipo: 'quiz',
          titulo: 'Atalho para DESFAZER',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Você apagou algo sem querer e deseja DESFAZER o erro imediatamente. Qual atalho usar?',
            alternativas: [
              { id: 'ctrl-z', texto: 'Ctrl + Z', correta: true },
              { id: 'ctrl-c', texto: 'Ctrl + C', correta: false },
              { id: 'ctrl-v', texto: 'Ctrl + V', correta: false },
              { id: 'alt-f4', texto: 'Alt + F4', correta: false },
            ],
          },
        },
        {
          id: 'u2-7-q4',
          tipo: 'quiz',
          titulo: 'Como executar o atalho',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Como você pressiona as teclas de um atalho (como Ctrl + C)?',
            alternativas: [
              { id: 'segurar-tocar', texto: 'Segura a tecla Ctrl e, com ela segurada, dá um toque na letra C', correta: true },
              { id: 'aperta-solta', texto: 'Aperta Ctrl, solta, espera 1 minuto e aperta C', correta: false },
              { id: 'mouse', texto: 'Clica com o mouse no teclado físico', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U2.8', moduloId: '2', tier: 1, titulo: 'Prática funcional', prerequisitos: ['U2.6'], miniModuloIds: ['2-15'],
    checkpoint: {
      titulo: 'Desafio: Prática funcional',
      questoes: [
        {
          id: 'u2-8-q1',
          tipo: 'quiz',
          titulo: 'Iniciando uma busca no Google',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Você digitou o que queria pesquisar na barra de busca. Qual tecla confirma e inicia a pesquisa?',
            alternativas: [
              { id: 'enter', texto: 'Tecla Enter', correta: true },
              { id: 'tab', texto: 'Tecla Tab', correta: false },
              { id: 'shift', texto: 'Tecla Shift', correta: false },
              { id: 'backspace', texto: 'Tecla Backspace', correta: false },
            ],
          },
        },
        {
          id: 'u2-8-q2',
          tipo: 'quiz',
          titulo: 'Antes de começar a digitar',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Antes de digitar em uma caixa de texto na internet, o que você deve fazer?',
            alternativas: [
              { id: 'clicar-dentro', texto: 'Dar um clique com o botão esquerdo dentro da caixa para o cursor aparecer ali', correta: true },
              { id: 'sacudir-mouse', texto: 'Sacudir o mouse na mesa', correta: false },
              { id: 'desligar-tela', texto: 'Desligar a tela', correta: false },
            ],
          },
        },
        {
          id: 'u2-8-q3',
          tipo: 'quiz',
          titulo: 'Corrigindo a busca',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Se você digitou uma letra errada na pesquisa, como a corrige de forma rápida?',
            alternativas: [
              { id: 'backspace', texto: 'Usa a tecla Backspace para apagar a letra e digita a correta', correta: true },
              { id: 'reiniciar', texto: 'Desliga o computador da tomada', correta: false },
              { id: 'comprar-teclado', texto: 'Precisa comprar outro teclado', correta: false },
            ],
          },
        },
        {
          id: 'u2-8-q4',
          tipo: 'quiz',
          titulo: 'Selecionando tudo na caixa',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual atalho seleciona todo o texto de uma caixa de uma só vez para você apagar ou trocar?',
            alternativas: [
              { id: 'ctrl-a', texto: 'Ctrl + A (Selecionar Tudo)', correta: true },
              { id: 'ctrl-z', texto: 'Ctrl + Z', correta: false },
              { id: 'shift-esc', texto: 'Shift + Esc', correta: false },
            ],
          },
        },
      ],
    },
  },

  // =========================================================================
  // MÓDULO 3 - HARDWARE (Tier 2: Complementar)
  // =========================================================================
  {
    id: 'U3.1', moduloId: '3', tier: 2, titulo: 'O que é hardware e o monitor', prerequisitos: [], miniModuloIds: ['3-1', '3-2'],
    checkpoint: {
      titulo: 'Desafio: Hardware e Monitor',
      questoes: [
        {
          id: 'u3-1-q1',
          tipo: 'quiz',
          titulo: 'O que é Hardware?',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'O que é chamado de "Hardware" em um computador?',
            alternativas: [
              { id: 'fisico', texto: 'Todas as peças e partes físicas que você pode ver e tocar (tela, mouse, fios)', correta: true },
              { id: 'programas', texto: 'Os programas e jogos instalados dentro do computador', correta: false },
              { id: 'senhas', texto: 'As senhas dos seus e-mails', correta: false },
            ],
          },
        },
        {
          id: 'u3-1-q2',
          tipo: 'quiz',
          titulo: 'Papel do Monitor',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Verdadeiro ou falso: o monitor é o responsável por exibir as imagens e textos para você.',
            alternativas: [
              { id: 'verdadeiro', texto: 'Verdadeiro', correta: true },
              { id: 'falso', texto: 'Falso', correta: false },
            ],
          },
        },
        {
          id: 'u3-1-q3',
          tipo: 'quiz',
          titulo: 'Ligar e desligar o monitor',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Onde geralmente fica o botão de ligar e desligar a tela do monitor?',
            alternativas: [
              { id: 'borda', texto: 'Na borda inferior ou atrás do próprio monitor', correta: true },
              { id: 'mouse', texto: 'Embaixo do mouse', correta: false },
              { id: 'tomada', texto: 'Apenas tirando da tomada', correta: false },
            ],
          },
        },
        {
          id: 'u3-1-q4',
          tipo: 'quiz',
          titulo: 'Limpando a tela',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual é a forma correta e segura de tirar poeira da tela do monitor?',
            alternativas: [
              { id: 'pano-seco', texto: 'Usar um pano macio e seco, com o monitor desligado', correta: true },
              { id: 'agua', texto: 'Jogar água com mangueira ou balde', correta: false },
              { id: 'esponja', texto: 'Usar palha de aço e sabão em pó', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U3.2', moduloId: '3', tier: 2, titulo: 'Gabinete, ligar e desligar', prerequisitos: ['U3.1'], miniModuloIds: ['3-3', '3-9'],
    checkpoint: {
      titulo: 'Desafio: Gabinete, ligar e desligar',
      questoes: [
        {
          id: 'u3-2-q1',
          tipo: 'quiz',
          titulo: 'O que é o gabinete?',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'O que é o gabinete (frequentemente chamado de "torre" ou "CPU")?',
            alternativas: [
              { id: 'caixa', texto: 'A caixa principal que guarda o processador e as peças internas do computador', correta: true },
              { id: 'mesa', texto: 'A mesa de trabalho', correta: false },
              { id: 'caixa-som', texto: 'Uma caixa de som gigante', correta: false },
            ],
          },
        },
        {
          id: 'u3-2-q2',
          tipo: 'quiz',
          titulo: 'Desligando com segurança',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual é a forma correta e segura de desligar o computador no dia a dia?',
            alternativas: [
              { id: 'menu', texto: 'Clicar no menu Iniciar na tela e escolher a opção "Desligar"', correta: true },
              { id: 'puxar-cabo', texto: 'Puxar o cabo de energia direto da tomada', correta: false },
              { id: 'disjuntor', texto: 'Desligar o disjuntor da casa inteira', correta: false },
            ],
          },
        },
        {
          id: 'u3-2-q3',
          tipo: 'quiz',
          titulo: 'Por que não puxar da tomada?',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Por que NÃO devemos desligar o computador puxando o fio da tomada repentinamente?',
            alternativas: [
              { id: 'danos', texto: 'Porque pode corromper seus arquivos e danificar as peças internas', correta: true },
              { id: 'mouse-some', texto: 'Porque o mouse desaparece', correta: false },
              { id: 'nao-tem-problema', texto: 'Pode puxar sempre, não há nenhum perigo', correta: false },
            ],
          },
        },
        {
          id: 'u3-2-q4',
          tipo: 'quiz',
          titulo: 'Botão de ligar (Power)',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Onde fica o botão principal para ligar o computador (com o símbolo ⏻)?',
            alternativas: [
              { id: 'frente-gabinete', texto: 'Na parte frontal ou superior do gabinete', correta: true },
              { id: 'baixo-teclado', texto: 'Embaixo do teclado', correta: false },
              { id: 'roda-mouse', texto: 'Dentro da rodinha do mouse', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U3.3', moduloId: '3', tier: 2, titulo: 'Periféricos de entrada', prerequisitos: ['U3.1'], miniModuloIds: ['3-4'],
    checkpoint: {
      titulo: 'Desafio: Periféricos de entrada',
      questoes: [
        {
          id: 'u3-3-q1',
          tipo: 'quiz',
          titulo: 'O que são periféricos?',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'O que são periféricos em um computador?',
            alternativas: [
              { id: 'aparelhos', texto: 'Aparelhos conectados ao computador para enviar ou receber informações (mouse, teclado, fones)', correta: true },
              { id: 'moveis', texto: 'Tipos de móveis para o quarto', correta: false },
              { id: 'jogos', texto: 'Apenas os jogos de computador', correta: false },
            ],
          },
        },
        {
          id: 'u3-3-q2',
          tipo: 'associacao',
          titulo: 'Problema e solução',
          instructions: 'Arraste a causa para o problema correspondente:',
          jogoProps: {
            item: { id: 'pilha', label: '🔋 Pilhas descarregadas ou fracas' },
            zonas: [
              { id: 'sem-fio', label: 'Mouse ou teclado sem fio parou de responder', correta: true },
              { id: 'tela-preta', label: 'A tela do monitor ficou escura', correta: false },
            ],
          },
        },
        {
          id: 'u3-3-q3',
          tipo: 'quiz',
          titulo: 'Mouse sem fio parou de mexer',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Se você usa um mouse sem fio e a setinha parou na tela, o que você deve checar primeiro?',
            alternativas: [
              { id: 'bateria-chave', texto: 'Se a pilha não descarregou e se a chavinha Liga/Desliga embaixo dele está ligada', correta: true },
              { id: 'trocar-mesa', texto: 'Trocar a mesa de lugar', correta: false },
              { id: 'jogar-fora', texto: 'Jogar o computador no lixo', correta: false },
            ],
          },
        },
        {
          id: 'u3-3-q4',
          tipo: 'quiz',
          titulo: 'Receptor USB',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Como é chamado o pequeno conector encaixado na porta USB que recebe o sinal do mouse sem fio?',
            alternativas: [
              { id: 'receptor', texto: 'Receptor sem fio (ou adaptador USB)', correta: true },
              { id: 'chave', texto: 'Chave de fenda', correta: false },
              { id: 'lampada', texto: 'Lâmpada de leitura', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U3.4', moduloId: '3', tier: 2, titulo: 'Áudio e imagem', prerequisitos: ['U3.1'], miniModuloIds: ['3-5', '3-6', '3-7'],
    checkpoint: {
      titulo: 'Desafio: Áudio e Imagem',
      questoes: [
        {
          id: 'u3-4-q1',
          tipo: 'quiz',
          titulo: 'Luz da webcam',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Como você tem certeza de que a câmera (webcam) do computador está ligada e transmitindo imagem?',
            alternativas: [
              { id: 'luz', texto: 'Uma luzinha indicadora acende perto da lente da câmera', correta: true },
              { id: 'som', texto: 'Um som muito alto toca sem parar', correta: false },
              { id: 'tela-preta', texto: 'A tela do monitor fica vermelha', correta: false },
            ],
          },
        },
        {
          id: 'u3-4-q2',
          tipo: 'quiz',
          titulo: 'Ouvir com privacidade',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Para ouvir aulas e músicas no computador sem incomodar as pessoas ao seu redor, o que usamos?',
            alternativas: [
              { id: 'fone', texto: 'Fones de ouvido', correta: true },
              { id: 'webcam', texto: 'A webcam', correta: false },
              { id: 'microfone', texto: 'O microfone', correta: false },
            ],
          },
        },
        {
          id: 'u3-4-q3',
          tipo: 'quiz',
          titulo: 'Gravando sua voz',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual periférico é responsável por captar a sua voz durante uma chamada ou gravação?',
            alternativas: [
              { id: 'microfone', texto: 'O microfone', correta: true },
              { id: 'monitor', texto: 'O monitor', correta: false },
              { id: 'mouse', texto: 'O mouse', correta: false },
            ],
          },
        },
        {
          id: 'u3-4-q4',
          tipo: 'quiz',
          titulo: 'Ajustando o volume',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Onde podemos aumentar ou diminuir o volume do som facilmente no computador?',
            alternativas: [
              { id: 'alto-falante', texto: 'No ícone de alto-falante (🔊) perto do relógio na barra de tarefas', correta: true },
              { id: 'bater-teclado', texto: 'Batendo no teclado com força', correta: false },
              { id: 'limpar-tela', texto: 'Limpando a tela do monitor', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U3.5', moduloId: '3', tier: 2, titulo: 'Cabos e conexões', prerequisitos: ['U3.1'], miniModuloIds: ['3-8'],
    checkpoint: {
      titulo: 'Desafio: Cabos e conexões',
      questoes: [
        {
          id: 'u3-5-q1',
          tipo: 'quiz',
          titulo: 'A entrada USB',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual é a entrada retangular mais comum usada para ligar mouses, teclados e pen-drives?',
            alternativas: [
              { id: 'usb', texto: 'Entrada USB', correta: true },
              { id: 'tomada', texto: 'Tomada da parede', correta: false },
              { id: 'antena', texto: 'Entrada de antena de TV', correta: false },
            ],
          },
        },
        {
          id: 'u3-5-q2',
          tipo: 'associacao',
          titulo: 'Função de cada cabo',
          instructions: 'Arraste o cabo até a sua função principal:',
          jogoProps: {
            item: { id: 'cabo-hdmi', label: 'Transmitir imagem e som de alta qualidade para a TV ou Monitor' },
            zonas: [
              { id: 'hdmi', label: 'Cabo HDMI', correta: true },
              { id: 'energia', label: 'Cabo de Energia', correta: false },
            ],
          },
        },
        {
          id: 'u3-5-q3',
          tipo: 'quiz',
          titulo: 'Cabo de energia',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual cabo leva a eletricidade da tomada da parede até a fonte do computador?',
            alternativas: [
              { id: 'energia', texto: 'Cabo de energia (ou cabo de força)', correta: true },
              { id: 'audio', texto: 'Cabo de áudio do fone de ouvido', correta: false },
              { id: 'rede', texto: 'Cabo de rede de internet', correta: false },
            ],
          },
        },
        {
          id: 'u3-5-q4',
          tipo: 'quiz',
          titulo: 'Encaixando cabos',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Se um cabo USB não entrar de primeira no conector, o que você deve fazer?',
            alternativas: [
              { id: 'virar-lado', texto: 'Virar o conector com calma para o lado correto, sem forçar', correta: true },
              { id: 'bater-forca', texto: 'Forçar com toda a força até quebrar o conector', correta: false },
              { id: 'molhar', texto: 'Passar água no conector', correta: false },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'U3.6', moduloId: '3', tier: 2, titulo: 'Internet e cuidados com o equipamento', prerequisitos: ['U3.4', 'U3.5'], miniModuloIds: ['3-10', '3-11'],
    checkpoint: {
      titulo: 'Desafio: Internet e cuidados com o equipamento',
      questoes: [
        {
          id: 'u3-6-q1',
          tipo: 'quiz',
          titulo: 'Desconectando cabos com cuidado',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual é a forma correta de desconectar um cabo do computador?',
            alternativas: [
              { id: 'pelo-plugue', texto: 'Segurar com firmeza pela ponta de plástico (conector) e puxar reto com cuidado', correta: true },
              { id: 'pelo-fio', texto: 'Puxar pelo meio do fio com um puxão brusco', correta: false },
              { id: 'tesoura', texto: 'Cortar com tesoura', correta: false },
            ],
          },
        },
        {
          id: 'u3-6-q2',
          tipo: 'quiz',
          titulo: 'Líquidos perto do computador',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Por que devemos evitar copos cheios de água, café ou suco perto do teclado e do computador?',
            alternativas: [
              { id: 'derramar-queimar', texto: 'Porque líquidos derramados podem queimar os circuitos elétricos e estragar o equipamento', correta: true },
              { id: 'teclado-sede', texto: 'Porque o teclado não gosta de café', correta: false },
              { id: 'pode-ter', texto: 'Pode deixar o copo em cima do teclado sem nenhum risco', correta: false },
            ],
          },
        },
        {
          id: 'u3-6-q3',
          tipo: 'quiz',
          titulo: 'Wi-Fi e Cabo de Rede',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Qual é a principal diferença entre internet por Wi-Fi e por Cabo de Rede?',
            alternativas: [
              { id: 'sem-fio', texto: 'Wi-Fi funciona sem fio pelo ar; o cabo de rede conecta direto no roteador com fio', correta: true },
              { id: 'wifi-desligado', texto: 'Wi-Fi só funciona com o computador desligado', correta: false },
              { id: 'cabo-nao-usa', texto: 'Cabo de rede não serve para internet', correta: false },
            ],
          },
        },
        {
          id: 'u3-6-q4',
          tipo: 'quiz',
          titulo: 'Ventilação do computador',
          instructions: 'Escolha a resposta certa.',
          jogoProps: {
            pergunta: 'Para evitar que o computador esquente demais (superaquecimento), o que devemos fazer?',
            alternativas: [
              { id: 'saidas-ar', texto: 'Deixar as saídas de ar livres e desobstruídas, sem cobrir com almofadas ou panos', correta: true },
              { id: 'cobrir', texto: 'Cobrir o computador com um cobertor grosso enquanto usa', correta: false },
              { id: 'fechado', texto: 'Guardar dentro de uma gaveta fechada enquanto joga', correta: false },
            ],
          },
        },
      ],
    },
  },
];

export const UNIDADES = DEFINICOES_UNIDADES.map((def) => {
  const miniModulos = def.miniModuloIds
    .map((id) => MAPA_MINI_MODULOS[id])
    .filter(Boolean);

  // Normaliza o objeto de checkpoint para manter compatibilidade
  const checkpoint = def.checkpoint
    ? {
        ...def.checkpoint,
        // Garante que questoes exista como array
        questoes: def.checkpoint.questoes || [
          {
            id: `${def.id}-q1`,
            tipo: def.checkpoint.tipo,
            titulo: def.checkpoint.titulo,
            instructions: def.checkpoint.instructions,
            jogoProps: def.checkpoint.jogoProps,
          },
        ],
        // Mantém props raiz como fallback da primeira questão
        tipo: def.checkpoint.tipo || def.checkpoint.questoes?.[0]?.tipo,
        instructions: def.checkpoint.instructions || def.checkpoint.questoes?.[0]?.instructions,
        jogoProps: def.checkpoint.jogoProps || def.checkpoint.questoes?.[0]?.jogoProps,
      }
    : null;

  return {
    ...def,
    miniModulos,
    checkpoint,
  };
});

// Unidades agrupadas por módulo, na ordem de MODULOS - é o formato que
// o Dashboard consome pra renderizar Módulo → Unidade → mini-módulos.
export const UNIDADES_POR_MODULO = MODULOS.map((modulo) => ({
  moduloId: modulo.id,
  moduloEmoji: modulo.emoji,
  moduloTitulo: modulo.titulo,
  unidades: UNIDADES.filter((u) => u.moduloId === modulo.id),
}));

// A que Unidade um mini-módulo pertence
export function getUnidadeByMiniModulo(miniModuloId) {
  return UNIDADES.find((u) => u.miniModuloIds.includes(miniModuloId));
}

// Espelha FilaDePendencias.estaDominada() (server/lib/adaptive-bkt/src/) -
// uma Unidade sem jogo conta como satisfeita automaticamente (não há
// observação do BKT possível pra ela); as demais precisam de domínio
// registrado e igual/acima do limiar. Usado pra decidir quais nós da
// trilha ficam travados (ver GameTrilha.jsx).
export function estaDominada(unidadeId, dominiosPorUnidade, limiar = 0.5) {
  const unidade = UNIDADES.find((u) => u.id === unidadeId);
  if (unidade && unidade.temJogo === false) return true;
  const d = dominiosPorUnidade[unidadeId];
  return d !== undefined && d !== null && d >= limiar;
}
