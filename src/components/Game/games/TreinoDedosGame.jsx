// TreinoDedosGame.jsx
// Mecânica de digitação POR TEXTO CORRIDO, diferente do DigitarTextoGame
// (que é "digite uma resposta e confirme"). Aqui a pessoa digita uma
// passagem inteira, caractere a caractere, e vê em tempo real qual dedo
// a convenção de digitação por toque recomenda para a tecla atual (ver
// data/mapaDedos.js - rotuloDedo).
//
// PENSADO PRA CRESCER (ver data/treinoDedosFases.js)
// Cada "fase" é só um texto mais longo/difícil. Hoje só existe a Fase 1
// (receita de bolo). Fases futuras (instruções, artigo com palavras
// difíceis) são só novos itens no array de fases - este componente não
// muda nada pra isso.
//
// COMO FUNCIONA
// Escuta o teclado inteiro (window), igual PressionarTeclaGame - sem
// precisar de foco em nenhum campo. Exige o caractere CERTO pra avançar
// (não aceita backspace corrigindo por cima - se errar, o contador de
// erros sobe e a pessoa tenta a mesma letra de novo, sem punição maior
// que isso). Ao completar o texto inteiro, calcula palavras por minuto
// e precisão, e chama reportResult(true, { tempoMs, ppm, precisao }).
//
// Props:
//   reportResult (função, obrigatória)
//   texto        (string, obrigatório) - a passagem a ser digitada

import { useState, useRef, useEffect, useCallback } from 'react';
import { rotuloDedo } from '../../../data/mapaDedos';
import styles from './TreinoDedosGame.module.css';

export function TreinoDedosGame({ reportResult, texto }) {
    const [posicao, setPosicao] = useState(0);
    const [erros, setErros] = useState(0);
    const [teclaErrada, setTeclaErrada] = useState(false);
    const inicioRef = useRef(null);
    const concluidoRef = useRef(false);
    // Aponta pro <span> do caractere atual - usado só pra rolar a caixa
    // de texto automaticamente conforme a pessoa avança (ver efeito
    // abaixo). Não tem nenhuma outra função.
    const atualRef = useRef(null);

    const caractereAtual = texto[posicao];

    const finalizar = useCallback((totalErros) => {
        concluidoRef.current = true;
        const tempoMs = inicioRef.current ? Date.now() - inicioRef.current : 0;
        const palavras = texto.trim().split(/\s+/).length;
        const minutos = Math.max(tempoMs / 60000, 1 / 60); // evita divisão por ~0 num texto digitado rápido demais
        const ppm = Math.round(palavras / minutos);
        const totalTeclas = texto.length + totalErros;
        const precisao = totalTeclas > 0 ? Math.round((texto.length / totalTeclas) * 100) : 100;

        reportResult(true, { tempoMs, ppm, precisao });
    }, [texto, reportResult]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (concluidoRef.current) return;
            // Ignora teclas de controle/modificadoras - só nos interessa o
            // caractere que elas produziriam (e.key já vem como 'a', ' ', ','...)
            if (e.key.length !== 1) return;

            if (inicioRef.current === null) inicioRef.current = Date.now();

            if (e.key.toLowerCase() === caractereAtual.toLowerCase()) {
                const proxima = posicao + 1;
                if (proxima >= texto.length) {
                    setPosicao(proxima);
                    finalizar(erros);
                } else {
                    setPosicao(proxima);
                }
            } else {
                setErros((n) => n + 1);
                setTeclaErrada(true);
                setTimeout(() => setTeclaErrada(false), 250);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [caractereAtual, posicao, texto, erros, finalizar]);

    // A caixa de texto tem altura limitada (ver CSS) pra caber várias
    // linhas de uma fase longa sem esticar a página - então, conforme a
    // pessoa digita e o "cursor" (span .atual) sai da parte visível,
    // rola pra acompanhar. 'nearest' evita rolar quando já está visível
    // (senão tremeria a cada tecla certa).
    useEffect(() => {
        atualRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [posicao]);

    const dedoSugerido = rotuloDedo(caractereAtual);

    return (
        <div className={styles.wrapper}>
            <p className={styles.passagem} aria-live="off">
                {texto.split('').map((c, i) => {
                    const ehAtual = i === posicao;
                    const classe = i < posicao
                        ? styles.digitado
                        : ehAtual
                            ? `${styles.atual} ${teclaErrada ? styles.erro : ''}`
                            : styles.pendente;
                    return (
                        <span key={i} ref={ehAtual ? atualRef : null} className={classe}>{c}</span>
                    );
                })}
            </p>

            {posicao < texto.length && (
                <div className={styles.dica}>
                    <span className={styles.dicaLabel}>Use o dedo:</span>
                    <span className={styles.dicaDedo}>{dedoSugerido}</span>
                </div>
            )}

            {erros > 0 && posicao < texto.length && (
                <p className={styles.contadorErros}>Tentativas erradas: {erros}</p>
            )}
        </div>
    );
}