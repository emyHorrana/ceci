// mapaDedos.js
// Mapa de "qual dedo usar" por tecla, seguindo a convenção padrão de
// digitação por toque (home row QWERTY: ASDF / JKL;). Usado só pelo
// TreinoDedosGame (Laboratório) por enquanto - fica em arquivo
// separado pra ficar fácil de reaproveitar em outro lugar depois
// (ex: uma futura lição dedicada a digitação) sem duplicar a tabela.
//
// É uma aproximação didática, não uma regra rígida - o objetivo é
// criar o hábito de "cada dedo cuida de uma região", não cobrar
// precisão milimétrica de quem está começando.

const MAPA = {
    '`': 'Mindinho esquerdo', '1': 'Mindinho esquerdo', 'q': 'Mindinho esquerdo', 'a': 'Mindinho esquerdo', 'z': 'Mindinho esquerdo',
    '2': 'Anelar esquerdo', 'w': 'Anelar esquerdo', 's': 'Anelar esquerdo', 'x': 'Anelar esquerdo',
    '3': 'Médio esquerdo', 'e': 'Médio esquerdo', 'd': 'Médio esquerdo', 'c': 'Médio esquerdo',
    '4': 'Indicador esquerdo', '5': 'Indicador esquerdo', 'r': 'Indicador esquerdo', 't': 'Indicador esquerdo',
    'f': 'Indicador esquerdo', 'g': 'Indicador esquerdo', 'v': 'Indicador esquerdo', 'b': 'Indicador esquerdo',
    '6': 'Indicador direito', '7': 'Indicador direito', 'y': 'Indicador direito', 'u': 'Indicador direito',
    'h': 'Indicador direito', 'j': 'Indicador direito', 'n': 'Indicador direito', 'm': 'Indicador direito',
    '8': 'Médio direito', 'i': 'Médio direito', 'k': 'Médio direito', ',': 'Médio direito',
    '9': 'Anelar direito', 'o': 'Anelar direito', 'l': 'Anelar direito', '.': 'Anelar direito',
    '0': 'Mindinho direito', 'p': 'Mindinho direito', ';': 'Mindinho direito', '/': 'Mindinho direito', '-': 'Mindinho direito',
    ' ': 'Polegares',
};

export function rotuloDedo(caractere) {
    if (!caractere) return null;
    return MAPA[caractere.toLowerCase()] || 'Indicador';
}