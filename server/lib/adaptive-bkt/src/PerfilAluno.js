/*
Mantém o histórico do aluno em um módulo: acertos, erros, domínio (L),
bias pessoal, e médias de tempo/foco/velocidade.
Isso é o que permite o algoritmo evoluir ao longo do semestre em vez
de recalcular tudo do zero a cada questão.
 
 */
class PerfilAluno {
  constructor(clienteSupabase, userId, moduleId) {
    this.supabase = clienteSupabase;
    this.userId = userId;
    this.moduleId = moduleId;

    // estado em memória (default = aluno novp)
    this.dominio = 0.30;
    this.biasAluno = 0;
    this.acertos = 0;
    this.erros = 0;
    this.questoes = 0;
    this.tempoMedio = 0;
    this.focoMedio = 0;
    this.velocidadeMedia = 0;
  }

  // Busca o perfil existente no Supabase, ou mantém os defaults se for aluno novo 
  async carregar() {
    const { data, error } = await this.supabase
      .from('perfis_aluno')
      .select('*')
      .eq('user_id', this.userId)
      .eq('module_id', this.moduleId)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      this.dominio = data.dominio;
      this.biasAluno = data.bias_aluno;
      this.acertos = data.acertos;
      this.erros = data.erros;
      this.questoes = data.questoes;
      this.tempoMedio = data.tempo_medio;
      this.focoMedio = data.foco_medio;
      this.velocidadeMedia = data.velocidade_media;
    }

    return this;
  }

  // Atualiza as médias móveis e contadores após uma questão respondida 
  registrarTentativa({ correto, tempoReal, foco, velocidade, novoDominio }) {
    this.questoes += 1;
    correto ? (this.acertos += 1) : (this.erros += 1);

    // média móvel simples (dá mais peso pro histórico conforme ele cresce)
    const n = this.questoes;
    this.tempoMedio = this.tempoMedio + (tempoReal - this.tempoMedio) / n;
    this.focoMedio = this.focoMedio + (foco - this.focoMedio) / n;
    this.velocidadeMedia = this.velocidadeMedia + (velocidade - this.velocidadeMedia) / n;
    this.dominio = novoDominio;

    // ajuste gradual do bias pessoal (mesma lógica do PDF do algoritmo adaptativo)
    const scoreMedio = this.acertos / this.questoes;
    if (scoreMedio > 0.8) this.biasAluno += 0.02;
    if (scoreMedio < 0.5) this.biasAluno -= 0.02;
    this.biasAluno = Math.max(-0.2, Math.min(0.2, this.biasAluno));
  }

  /** Salva o estado atual de volta no Supabase (upsert) */
  async salvar() {
    const { error } = await this.supabase.from('perfis_aluno').upsert({
      user_id: this.userId,
      module_id: this.moduleId,
      dominio: this.dominio,
      bias_aluno: this.biasAluno,
      acertos: this.acertos,
      erros: this.erros,
      questoes: this.questoes,
      tempo_medio: this.tempoMedio,
      foco_medio: this.focoMedio,
      velocidade_media: this.velocidadeMedia,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  }
}

module.exports = PerfilAluno;
