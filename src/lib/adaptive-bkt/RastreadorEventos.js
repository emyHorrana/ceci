/*
 Captura os eventos brutos durante uma atividade/questão:
 tempo de resposta, trocas de aba, tempo parado, abandono.
 
 Uso (dentro de src/pages/Licao.jsx):

    const rastreador = new RastreadorEventos();
    rastreador.iniciar();
    // ... aluno responde a questão ...
    rastreador.finalizar();
    const dados = rastreador.obterDadosBrutos();
    // envia `dados` pro backend junto com { correct, difficulty }
 */
export class RastreadorEventos {
  constructor() {
    this.tempoInicio = 0;
    this.tempoFim = 0;
    this.trocasDeAba = 0;
    this.tempoInativo = 0; // em segundos
    this.ultimaAtividade = Date.now();
    this.abandonado = false;
    this.movimentosMouse = 0;
    this.teclasPressionadas = 0;

    this._limiarInatividadeMs = 5000; // 5s sem interação conta como início de inatividade (Podemos mudar isso depois)
    this._intervaloInatividade = null;
    this._handlerVisibilidade = this._aoMudarVisibilidade.bind(this);
    this._handlerMouse = this._aoMoverMouse.bind(this);
    this._handlerTeclado = this._aoPressionarTecla.bind(this);
  }

  iniciar() {
    this.tempoInicio = Date.now();
    this.ultimaAtividade = this.tempoInicio;
    this.escutarMouse();
    this.escutarTeclado();
    this.escutarVisibilidade();

    // varre a cada 1s se o usuário está inativo
    this._intervaloInatividade = setInterval(() => {
      const inativoMs = Date.now() - this.ultimaAtividade;
      if (inativoMs >= this._limiarInatividadeMs) {
        this.tempoInativo += 1; // soma 1s de inatividade
      }
    }, 1000);
  }

  finalizar() {
    this.tempoFim = Date.now();
    this._removerListeners();
    if (this._intervaloInatividade) clearInterval(this._intervaloInatividade);
  }

  abandonar() {
    this.abandonado = true;
    this.finalizar();
  }

  obterTempoResposta() {
    const fim = this.tempoFim || Date.now();
    return (fim - this.tempoInicio) / 1000; 
  }

  obterTempoInativo() {
    return this.tempoInativo;
  }

  obterFoco() {
    // versão "crua", o cálculo refinado de foco fica em Indicadores.js
    const total = this.obterTempoResposta() || 1;
    return Math.max(0, 1 - this.tempoInativo / total);
  }

  escutarMouse() {
    window.addEventListener('mousemove', this._handlerMouse);
  }

  escutarTeclado() {
    window.addEventListener('keydown', this._handlerTeclado);
  }

  escutarVisibilidade() {
    document.addEventListener('visibilitychange', this._handlerVisibilidade);
  }

  _aoMoverMouse() {
    this.ultimaAtividade = Date.now();
    this.movimentosMouse++;
  }

  _aoPressionarTecla() {
    this.ultimaAtividade = Date.now();
    this.teclasPressionadas++;
  }

  _aoMudarVisibilidade() {
    if (document.hidden) {
      this.trocasDeAba++;
    } else {
      this.ultimaAtividade = Date.now();
    }
  }

  _removerListeners() {
    window.removeEventListener('mousemove', this._handlerMouse);
    window.removeEventListener('keydown', this._handlerTeclado);
    document.removeEventListener('visibilitychange', this._handlerVisibilidade);
  }

  obterDadosBrutos() {
    return {
      tempoResposta: this.obterTempoResposta(),
      trocasDeAba: this.trocasDeAba,
      tempoInativo: this.tempoInativo,
      abandonado: this.abandonado,
      movimentosMouse: this.movimentosMouse,
      teclasPressionadas: this.teclasPressionadas,
    };
  }
}
