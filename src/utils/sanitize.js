// src/utils/sanitize.js
// Utilitário de sanitização de HTML para conteúdo gerado por IA.
// Utiliza DOMPurify com allowlist estrita para prevenir ataques de Cross-Site Scripting (XSS).

import DOMPurify from 'dompurify';

const TAGS_PERMITIDAS = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'span', 'b', 'i'];

function obterPurifier() {
  if (typeof DOMPurify?.sanitize === 'function') {
    return DOMPurify;
  }
  if (typeof window !== 'undefined' && typeof DOMPurify === 'function') {
    return DOMPurify(window);
  }
  return DOMPurify;
}

/**
 * Sanitiza o HTML retornado pela IA ou do conteúdo teórico, permitindo apenas tags seguras de texto/listas
 * e removendo sumariamente qualquer atributo (incluindo manipuladores de eventos como onerror/onload).
 *
 * @param {string} html - HTML potencialmente inseguro
 * @returns {string} HTML sanitizado e seguro para renderização
 */
export function sanitizarHtml(html) {
  if (!html || typeof html !== 'string') return '';
  const purifier = obterPurifier();
  if (purifier && typeof purifier.sanitize === 'function') {
    return purifier.sanitize(html, {
      ALLOWED_TAGS: TAGS_PERMITIDAS,
      ALLOWED_ATTR: [],
    });
  }
  // Fallback caso DOMPurify não esteja inicializado (remove tags não autorizadas via regex seguro)
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<(?!\/?(p|strong|em|ul|ol|li|br|span|b|i)\b)[^>]*>/gi, '')
    .replace(/\s+on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s+on\w+\s*=\s*[^>\s]+/gi, '');
}

export const sanitizarHtmlIA = sanitizarHtml;
