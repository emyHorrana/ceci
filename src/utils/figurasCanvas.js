// figurasCanvas.js
// Define o CONTORNO de cada figura simples do Laboratório > Desenho livre,
// como uma função que desenha o path no contexto 2D recebido. A mesma
// função serve pra dois usos diferentes (só muda o que o chamador faz
// DEPOIS de montar o path):
//   - guia visual: ctx.stroke() -> só o contorno tracejado, pra pessoa
//     saber onde pintar
//   - máscara de acerto: ctx.fill() num canvas invisível -> vira o
//     "dentro/fora" que o DesenhoLivreGame usa pra calcular a % de
//     perfeição (ver ali)
//
// `tamanho` é o lado do canvas (quadrado). Todas as figuras cabem numa
// margem de ~15% pra não encostar na borda.

export const FIGURAS = ['circulo', 'quadrado', 'triangulo', 'estrela', 'coracao'];

export function tracarFigura(ctx, tipo, tamanho) {
    ctx.beginPath();

    switch (tipo) {
        case 'quadrado': {
            const m = tamanho * 0.2;
            ctx.rect(m, m, tamanho - m * 2, tamanho - m * 2);
            break;
        }

        case 'triangulo': {
            ctx.moveTo(tamanho * 0.5, tamanho * 0.15);
            ctx.lineTo(tamanho * 0.85, tamanho * 0.82);
            ctx.lineTo(tamanho * 0.15, tamanho * 0.82);
            ctx.closePath();
            break;
        }

        case 'estrela': {
            const cx = tamanho / 2;
            const cy = tamanho / 2;
            const rOut = tamanho * 0.38;
            const rIn = tamanho * 0.16;
            for (let i = 0; i < 10; i++) {
                const raio = i % 2 === 0 ? rOut : rIn;
                // -90° pra começar com uma ponta pra cima
                const angulo = (Math.PI / 5) * i - Math.PI / 2;
                const x = cx + raio * Math.cos(angulo);
                const y = cy + raio * Math.sin(angulo);
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            break;
        }

        case 'coracao': {
            const w = tamanho * 0.7;
            const h = tamanho * 0.6;
            const x0 = (tamanho - w) / 2;
            const y0 = tamanho * 0.22;
            ctx.moveTo(x0 + w / 2, y0 + h * 0.28);
            ctx.bezierCurveTo(x0 + w * 0.1, y0 - h * 0.15, x0 - w * 0.15, y0 + h * 0.45, x0 + w / 2, y0 + h);
            ctx.bezierCurveTo(x0 + w * 1.15, y0 + h * 0.45, x0 + w * 0.9, y0 - h * 0.15, x0 + w / 2, y0 + h * 0.28);
            ctx.closePath();
            break;
        }

        case 'circulo':
        default: {
            ctx.arc(tamanho / 2, tamanho / 2, tamanho * 0.35, 0, Math.PI * 2);
            break;
        }
    }
}

export function sortearFigura(anterior) {
    const opcoes = FIGURAS.filter((f) => f !== anterior);
    return opcoes[Math.floor(Math.random() * opcoes.length)];
}