// onboardingSync.js
// Descarrega pro algoritmo adaptativo (AB-BKT) os sinais comportamentais
// capturados durante /boas-vindas (ver BoasVindas.jsx), que ficam
// bufferizados em localStorage porque naquele momento ainda não existe
// userId - o onboarding acontece antes da conta ser criada.
//
// Chamar depois que Cadastro.jsx cria a conta (register() resolvido),
// já com o userId em mãos.

import { responderQuestao } from './algorithmService';

const CHAVE_ONBOARDING = 'ceci_onboarding';

export async function flushOnboardingSignals(userId) {
  let onboarding;
  try {
    onboarding = JSON.parse(window.localStorage.getItem(CHAVE_ONBOARDING) || '{}');
  } catch {
    return;
  }

  const sinaisAdaptativos = onboarding?.sinaisAdaptativos ?? [];
  if (sinaisAdaptativos.length === 0) return;

  for (const entrada of sinaisAdaptativos) {
    try {
      await responderQuestao({
        userId,
        moduleId: entrada.moduleId,
        etapaId: entrada.etapaId,
        correto: entrada.correto,
        sinais: entrada.sinais,
        tempoIdeal: entrada.tempoIdeal,
        tentativas: 1,
        tentativasAposErro: 0,
      });
    } catch (err) {
      console.error('Erro ao sincronizar sinal de onboarding:', entrada.etapaId, err);
    }
  }

  // Esvazia o buffer já enviado, pra não reenviar se a pessoa recarregar
  // essa tela ou passar pelo onboarding de novo.
  onboarding.sinaisAdaptativos = [];
  window.localStorage.setItem(CHAVE_ONBOARDING, JSON.stringify(onboarding));
}
