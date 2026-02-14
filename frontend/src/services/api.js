/**
 * API service for invoice validation.
 * All API calls live here; components use this module only.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const VALIDATE_PATH = '/api/v1/invoices/validate'

/**
 * @typedef {Object} ValidatePayload
 * @property {string} partita_iva
 * @property {number} imponibile
 * @property {number} aliquota_iva
 * @property {number} totale_dichiarato
 */

/**
 * @typedef {Object} ValidateResult
 * @property {boolean} valid
 * @property {number} total_calculated
 * @property {string[]} errors
 * @property {string[]} warnings
 */

/**
 * POST /api/v1/invoices/validate
 * @param {ValidatePayload} payload
 * @returns {Promise<{ ok: true, status: number, data: ValidateResult } | { ok: false, status?: number, error: string, data?: ValidateResult }>}
 */
export async function validateInvoice(payload) {
  const url = `${API_BASE.replace(/\/$/, '')}${VALIDATE_PATH}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => null)

    if (res.ok) {
      return { ok: true, status: res.status, data }
    }

    return {
      ok: false,
      status: res.status,
      error: res.status === 422 ? 'Dati non validi' : `Errore ${res.status}`,
      data: data || undefined,
    }
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'Errore di rete',
    }
  }
}
