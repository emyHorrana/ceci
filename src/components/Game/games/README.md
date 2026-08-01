# .✦ ہ˖ Mecânicas de jogo do CECI

Esta pasta guarda as **mecânicas reutilizáveis** (o "como jogar") e o
container `GameMoment` (o "quando/como aparece na tela"), separados dos
mini-tópicos de conteúdo (o "o quê" - isso fica no conteúdo escrito e,
depois, no banco de dados).

**Regra geral: antes de criar um arquivo de jogo novo, veja se alguma
mecânica daqui já resolve com uma configuração diferente.** A ideia é
não ter um componente por mini-tópico - são só ~30 configurações em
cima de um punhado de mecânicas.

# .✦ ہ˖  Mecânicas disponíveis

| Mecânica | Arquivo | Pra que serve | Cobre |
|---|---|---|---|
| Clicar em alvo | `ClicarAlvoGame.jsx` | Escolher a opção certa entre várias, clicando | Botão esquerdo/direito, ícones, menu contextual, duplo clique |
| Arrastar e soltar | `ArrastarSoltarGame.jsx` | Arrastar um item até o lugar certo | Mover ícones, soltar em pasta/lixeira, "arraste o cartão" |
| Digitar texto | `DigitarTextoGame.jsx` | Digitar algo e confirmar | Nome, senha, e-mail, palavras, números, símbolos |
| Rolar até um ponto | `ScrollAteUmPontoGame.jsx` | Rolar (scroll) e parar numa zona marcada | Rolar a página, controlar velocidade (zona mais estreita = mais precisão) |

## .✦ ہ˖ Como usar

Toda mecânica recebe `reportResult(sucesso, meta?)` de fora - ela
mesma não sabe nada sobre tentativas, mensagens da Ceci ou "pular"
(isso é tudo do `GameMoment`, que já cuida de tudo isso por fora).
Então o padrão de uso é sempre:

```jsx
<GameMoment title="..." instructions="...">
  {({ reportResult }) => (
    <NomeDaMecanica reportResult={reportResult} /* + config */ />
  )}
</GameMoment>
```

Cada arquivo de mecânica tem exemplos de configuração comentados no
topo - comece por ali.

## .✦ ہ˖ Exemplo de arquivo "de configuração"

`DigitarNomeGame.jsx` não é uma mecânica nova - é só a mecânica
`DigitarTextoGame` configurada pra pedir o nome. Use esse arquivo como
modelo pra criar as próximas interações específicas de cada mini-tópico
(ex: `DigitarPalavraGatoGame.jsx`, `EscolherBotaoMouseGame.jsx`).

## .✦ ہ˖ Mecânicas que ainda faltam (mesma ideia, quando forem necessárias)

- **Atalho de teclado** - pra Ctrl+C, Ctrl+V, Shift etc do Módulo 2

Quando essa for necessária, criar seguindo o mesmo formato:
recebe `reportResult`, recebe a configuração do que conta como acerto,
não sabe nada sobre tentativas/Ceci/pular.