import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * GET /api/v1/statistics/summary
 */
export async function getStatisticsSummary() {
  try {
    const res = await client.get('/api/v1/statistics/summary')
    return res.data
  } catch (err) {
    console.error('Failed to fetch summary:', err)
    return null
  }
}

/**
 * GET /api/v1/statistics/timeline
 */
export async function getStatisticsTimeline(range = '7d') {
  try {
    const res = await client.get('/api/v1/statistics/timeline', { params: { range } })
    return res.data
  } catch (err) {
    console.error('Failed to fetch timeline:', err)
    return []
  }
}

/**
 * GET /api/v1/statistics/errors
 */
export async function getStatisticsErrors() {
  try {
    const res = await client.get('/api/v1/statistics/errors')
    return res.data
  } catch (err) {
    console.error('Failed to fetch errors:', err)
    return []
  }
}

/**
 * GET /api/v1/invoices/validations (Paginated)
 */
export async function getPaginatedValidations(params = {}) {
  try {
    const res = await client.get('/api/v1/invoices/validations', { params })
    return res.data
  } catch (err) {
    console.error('Failed to fetch paginated history:', err)
    return { data: [], pagination: {} }
  }
}

/**
 * GET /api/v1/invoices (Legacy/Simple)
 */
export async function getValidationHistory() {
  try {
    const res = await client.get('/api/v1/invoices')
    return res.data
  } catch (err) {
    console.error('Failed to fetch history:', err)
    return []
  }
}

/**
 * POST /api/v1/invoices/validate
 */
export async function validateInvoice(payload) {
  try {
    const res = await client.post('/api/v1/invoices/validate', payload)
    return { ok: true, status: res.status, data: res.data }
  } catch (err) {
    const res = err.response
    return {
      ok: false,
      status: res?.status,
      error: res?.status === 422 ? 'Dati non validi' : (err.message || 'Errore di rete'),
      data: res?.data,
    }
  }
}
