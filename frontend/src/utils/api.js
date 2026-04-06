const BASE = '/api'

// ── Token helpers ─────────────────────────────────────────────────────────────
const getToken = () =>
  localStorage.getItem('veridex_token') ||
  sessionStorage.getItem('veridex_token') ||
  null

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
})

const handleRes = async (res) => {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  signup: (name, email, password) =>
    fetch(`${BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }).then(handleRes),

  login: (email, password, remember) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember }),
    }).then(handleRes),

  getMe: (token) =>
    fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(handleRes),
}

// ── Analysis API (JWT-protected) ──────────────────────────────────────────────
export const analysisApi = {
  scanUrl: (url) =>
    fetch(`${BASE}/analysis/url`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ url }),
    }).then(handleRes),

  scanEmail: (content) =>
    fetch(`${BASE}/analysis/email`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ content }),
    }).then(handleRes),

  getHistory: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return fetch(`${BASE}/analysis/history${q ? `?${q}` : ''}`, {
      headers: authHeaders(),
    }).then(handleRes)
  },

  deleteRecord: (id) =>
    fetch(`${BASE}/analysis/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleRes),
}

// ── Admin API ─────────────────────────────────────────────────────────────────
export const adminApi = {
  getStats: () =>
    fetch(`${BASE}/admin/stats`, { headers: authHeaders() }).then(handleRes),

  getUsers: () =>
    fetch(`${BASE}/admin/users`, { headers: authHeaders() }).then(handleRes),

  getUserDetails: (id) =>
    fetch(`${BASE}/admin/users/${id}`, { headers: authHeaders() }).then(handleRes),

  deleteUser: (id) =>
    fetch(`${BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleRes),

  getAnalyses: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return fetch(`${BASE}/admin/analyses${q ? `?${q}` : ''}`, {
      headers: authHeaders(),
    }).then(handleRes)
  },

  deleteAnalysis: (id) =>
    fetch(`${BASE}/admin/analyses/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleRes),
}

// ── Legacy public scan API (no auth) ─────────────────────────────────────────
export const scanUrl = (url) =>
  fetch(`${BASE}/scan-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  }).then(handleRes)

export const scanEmail = (content) =>
  fetch(`${BASE}/scan-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  }).then(handleRes)

export const generateReport = (scanData, type) =>
  fetch(`${BASE}/generate-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scanData, type }),
  }).then(handleRes)
