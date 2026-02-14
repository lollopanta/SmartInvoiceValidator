/**
 * API service for invoice validation.
 * All API calls live here; components use this module only.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const HISTORY_PATH = '/api/v1/invoices'
const VALIDATE_PATH = '/api/v1/invoices/validate'

/**
 * @typedef {Object} HistoryRecord
 * @property {string} id
 * @property {string} partita_iva
 * @property {number} imponibile
 * @property {boolean} valid
 * @property {string} created
 */

/**
 * GET /api/v1/invoices
 * @returns {Promise<HistoryRecord[]>}
 */
export async function getValidationHistory() {
  const url = `${API_BASE.replace(/\/$/, '')}${HISTORY_PATH}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('Failed to fetch history:', err)
    return []
  }
}

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
