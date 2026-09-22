// treinoDedosFases.js
// Textos usados pelo TreinoDedosGame (Laboratório). Cada fase é só um
// objeto { id, titulo, texto } - adicionar uma fase nova é só colocar
// mais um item aqui, nada no componente precisa mudar.
//
// De propósito, os textos NÃO usam acentos (ç, ã, é...): o
// TreinoDedosGame ainda compara tecla a tecla via e.key simples, sem
// tratar "dead keys"/composição de acento - com acento, a digitação
// ficaria travada em alguns teclados/SOs. Quando isso for resolvido,
// dá pra escrever os textos com acentuação normal.
export const FASES_TREINO_DEDOS = [
    {
        id: 'receita-bolo',
        titulo: 'Fase 1 - Receita de bolo simples',
        texto: 'bata os ovos com o acucar ate clarear, junte a farinha aos poucos e mexa sem parar.',
    },
];