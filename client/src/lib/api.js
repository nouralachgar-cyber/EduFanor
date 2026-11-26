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

const TOKEN_KEY = 'edu_token';
const USER_KEY = 'edu_user';

const readStorage = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (storage, key, value) => {
  try {
    if (value) storage.setItem(key, value);
    else storage.removeItem(key);
  } catch {
    /* Storage can be unavailable. */
  }
};

const removeStorage = (storage, key) => {
  try {
    storage.removeItem(key);
  } catch {
    /* Storage can be unavailable. */
  }
};

export function getStoredToken() {
  return (
    readStorage(window.localStorage, TOKEN_KEY) ||
    readStorage(window.sessionStorage, TOKEN_KEY) ||
    ''
  );
}

export function getStoredSessionStorage() {
  if (readStorage(window.localStorage, TOKEN_KEY)) return window.localStorage;
  if (readStorage(window.sessionStorage, TOKEN_KEY)) return window.sessionStorage;
  if (readStorage(window.localStorage, USER_KEY)) return window.localStorage;
  if (readStorage(window.sessionStorage, USER_KEY)) return window.sessionStorage;
  return null;
}

export function hasRememberedSession() {
  return Boolean(
    readStorage(window.localStorage, TOKEN_KEY) || readStorage(window.localStorage, USER_KEY)
  );
}

export function setStoredToken(token, remember = true) {
  const target = remember ? window.localStorage : window.sessionStorage;
  const other = remember ? window.sessionStorage : window.localStorage;
  writeStorage(target, TOKEN_KEY, token);
  removeStorage(other, TOKEN_KEY);
}

export function setStoredUser(user, remember) {
  const target =
    typeof remember === 'boolean'
      ? remember
        ? window.localStorage
        : window.sessionStorage
      : getStoredSessionStorage() || window.localStorage;
  const other = target === window.localStorage ? window.sessionStorage : window.localStorage;
  writeStorage(target, USER_KEY, user ? JSON.stringify(user) : '');
  removeStorage(other, USER_KEY);
}

export function clearStoredSession() {
  [window.localStorage, window.sessionStorage].forEach((storage) => {
    removeStorage(storage, TOKEN_KEY);
    removeStorage(storage, USER_KEY);
  });
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
      window.dispatchEvent(new CustomEvent('edu:unauthorized', { detail: { token } }));
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
