// Mecânica genérica de DIGITAÇÃO. Cobre nome, senha, e-mail, palavras
// simples, símbolos etc - qualquer mini-tópico do Módulo 2 (Teclado) e
// outros que peçam "digite algo e confirme".
//
// Em vez de criar um arquivo novo para cada mini-tópico de digitação,
// crie uma CONFIGURAÇÃO desta mecânica. Exemplos:
//
//   // digitar o nome (usado no onboarding)
//   <DigitarTextoGame reportResult={reportResult}
//     label="Como posso te chamar?"
//     placeholder="Digite seu nome aqui" />
//
//   // digitar uma palavra específica (treino de digitação básica)
//   <DigitarTextoGame reportResult={reportResult}
//     label='Digite a palavra "gato"'
//     placeholder="Digite aqui"
//     validar={(valor) => valor.toLowerCase() === 'gato'} />
//
//   // digitar um e-mail válido (digitação funcional)
//   <DigitarTextoGame reportResult={reportResult}
//     label="Digite um e-mail"
//     tipo="email"
//     validar={(valor) => /\S+@\S+\.\S+/.test(valor)} />
//
// Props:
//   reportResult (função, obrigatória) - vem do GameMoment
//   label        (string) - pergunta/instrução mostrada acima do campo
//   placeholder  (string)
//   tipo         (string, padrão 'text') - repassado pro <input type="">
//                  (ex: 'password' para treinar digitar senha)
//   validar      (função, opcional) - recebe o valor já sem espaços nas
//                  pontas e retorna true/false. Padrão: aceita qualquer
//                  texto não vazio (usado quando não há resposta
//                  "certa", só se quer captar o que a pessoa digitou).
//   mensagemErro (string, opcional) - texto de erro do campo quando a
//                  validação falha (ex: "Tenta digitar 'gato' certinho!")
//   mostrarDicaEnter (bool, padrão false) - mostra o teclado com o Enter
//                  destacado, ensinando que dá pra confirmar sem clicar
//                  no botão (o <form> já reage a Enter nativamente,
//                  isto é só a parte visual/didática). Como fica
//                  repetitivo depois que a pessoa já sabe, é opt-in por
//                  uso - liga só no primeiro contato de verdade (ex: no
//                  diagnóstico do /boas-vindas).

import { useState, useRef } from 'react';
import { TextInput } from '../../Forms/TextInput';
import { ButtonPrimary } from '../../Buttons/ButtonPrimary';
import { Teclado } from '../Teclado';
import styles from './DigitarTextoGame.module.css';

const aceitaQualquerTextoNaoVazio = (valor) => valor.length > 0;

export function DigitarTextoGame({
  reportResult,
  label,
  placeholder,
  tipo = 'text',
  validar = aceitaQualquerTextoNaoVazio,
  mensagemErro,
  mostrarDicaEnter = false,
}) {
  const [valor, setValor] = useState('');
  const [mostrarErro, setMostrarErro] = useState(false);
  // Marca o instante da primeira tecla, pra medir tempo de digitação -
  // sinal simples e pronto pro algoritmo adaptativo usar depois.
  const primeiraTeclaEm = useRef(null);

  const handleChange = (e) => {
    if (primeiraTeclaEm.current === null && e.target.value.length > 0) {
      primeiraTeclaEm.current = Date.now();
    }
    setValor(e.target.value);
    if (mostrarErro) setMostrarErro(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valorLimpo = valor.trim();
    const acertou = valorLimpo.length > 0 && validar(valorLimpo);

    if (!acertou) {
      setMostrarErro(true);
      reportResult(false);
      return;
    }

    const tempoDigitacaoMs = primeiraTeclaEm.current
      ? Date.now() - primeiraTeclaEm.current
      : null;

    reportResult(true, { valor: valorLimpo, tempoDigitacaoMs });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <TextInput
        label={label}
        value={valor}
        onChange={handleChange}
        type={tipo}
        placeholder={placeholder}
        error={mostrarErro ? (mensagemErro || 'Vamos tentar de novo?') : undefined}
        autoFocus
      />
      <ButtonPrimary type="submit" fullWidth>
        Confirmar
      </ButtonPrimary>

      {mostrarDicaEnter && (
        <div className={styles.dicaEnter}>
          <p className={styles.dicaEnterTexto}>
            Ou aperte a tecla Enter (destacada abaixo) para confirmar:
          </p>
          <Teclado teclaDestacada="enter" />
        </div>
      )}
    </form>
  );
}