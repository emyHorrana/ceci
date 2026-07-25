// Primeira interação de diagnóstico do fluxo de boas-vindas.
// Pede o nome da pessoa - parece só um campo de cadastro comum, mas é
// também a primeira leitura discreta de familiaridade com o teclado
// (tempo até a primeira tecla, se enviou vazio na primeira tentativa etc).
//
// Este arquivo serve de MODELO para os próximos jogos (arrastar cartão,
// clicar no botão certo etc): ele não sabe nada sobre GameMoment por
// dentro - só recebe reportResult e chama com (sucesso, meta) quando o
// usuário faz uma tentativa. Quem cuida de tentativas, mensagens da
// Cecília e "pular" é sempre o GameMoment por fora.
//
// Uso (dentro de um <GameMoment>):
//   {({ reportResult }) => <DigitarNomeGame reportResult={reportResult} />}

import { useState, useRef } from 'react';
import { TextInput } from '../../Forms/TextInput';
import { ButtonPrimary } from '../../Buttons/ButtonPrimary';
import styles from './DigitarNomeGame.module.css';

export function DigitarNomeGame({ reportResult }) {
  const [nome, setNome] = useState('');
  // Marca o instante da primeira tecla digitada, pra medir o tempo de
  // digitação sem depender de nenhuma lib - é só um sinal simples que já
  // deixamos pronto pro algoritmo adaptativo usar no futuro.
  const primeiraTeclaEm = useRef(null);

  const handleChange = (e) => {
    if (primeiraTeclaEm.current === null && e.target.value.length > 0) {
      primeiraTeclaEm.current = Date.now();
    }
    setNome(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nomeLimpo = nome.trim();

    if (!nomeLimpo) {
      reportResult(false);
      return;
    }

    const tempoDigitacaoMs = primeiraTeclaEm.current
      ? Date.now() - primeiraTeclaEm.current
      : null;

    reportResult(true, { nome: nomeLimpo, tempoDigitacaoMs });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <TextInput
        label="Como posso te chamar?"
        value={nome}
        onChange={handleChange}
        placeholder="Digite seu nome aqui"
        autoFocus
      />
      <ButtonPrimary type="submit" fullWidth>
        Confirmar
      </ButtonPrimary>
    </form>
  );
}