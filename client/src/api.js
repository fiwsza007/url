const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export function getToken() {
  return localStorage.getItem('token') || '';
}

export async function api(path, options = {}) {
  const headers = options.headers || {};
  if (options.auth !== false) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const data = await res.json();
      msg = data.message || msg;
    } catch {}
    throw new Error(msg);
  }
  // 204 no content
  if (res.status === 204) return null;
  return res.json();
}