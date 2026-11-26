const configuredApiBase =
      import.meta.env.vite_api_url?.trim() || import.meta.env.VITE_API_URL?.trim();
const isDev = import.meta.env.DEV;

// Normalize API base URL: remove ALL trailing slashes, then append /api.
// Also strip trailing /api if present to prevent /api/api. Supports both
// vite_api_url and VITE_API_URL environment variables.
const API_BASE = isDev || !configuredApiBase
  ? `${window.location.protocol}//${window.location.hostname}:5000/api`
  : configuredApiBase
      .replace(/\/+$/, '')    // Remove ALL trailing slashes
      .replace(/\/api$/, '')  // Remove trailing /api to prevent /api/api
      + '/api';

export function resolveAssetUrl(url) {
  if (typeof url !== 'string' || !url.startsWith('/uploads/')) return url || '';
  if (!API_BASE) return url;
  return new URL(url, API_BASE).toString();
}

export class ApiError extends Error {
  constructor(message, status, code, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

export function getStoredToken() {
  try {
    return localStorage.getItem('edu_token') || '';
  } catch {
    return '';
  }
}

export function setStoredToken(token) {
  try {
    if (token) localStorage.setItem('edu_token', token);
    else localStorage.removeItem('edu_token');
  } catch {
    /* Storage can be unavailable. */
  }
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = false, signal, headers = {} } = options;
  if (!API_BASE) {
    throw new ApiError(
      'The authentication service is not configured.',
      0,
      'API_NOT_CONFIGURED',
      null
    );
  }

  const token = getStoredToken();
  const requestHeaders = { Accept: 'application/json', ...headers };
  if (body !== undefined) requestHeaders['Content-Type'] = 'application/json';
  if (auth && token) requestHeaders.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Unable to reach the EduFanor server.', 0, 'NETWORK_ERROR', null);
  }

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth && token) {
      window.dispatchEvent(new CustomEvent('edu:unauthorized'));
    }
    throw new ApiError(
      payload?.message || `Request failed with status ${response.status}`,
      response.status,
      payload?.code,
      payload
    );
  }

  return payload;
}

export { API_BASE };
