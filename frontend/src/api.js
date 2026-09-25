// Thin fetch wrapper around the Laravel REST API (backend/).
//
// - Base URL comes from VITE_API_URL (see frontend/.env.example).
// - The Sanctum bearer token is the ONLY thing kept in localStorage; all real
//   data (projects, tasks, chat, ...) lives in the database behind the API.
// - Laravel API Resources wrap payloads in `{ data: ... }`; `unwrap` removes it
//   so callers always get the plain object/array.

const BASE_URL = (import.meta.env?.VITE_API_URL || "http://localhost:8000/api").replace(/\/$/, "");
const TOKEN_KEY = "taskflow.auth.token";

export class ApiError extends Error {
  constructor(message, status = 0, errors = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export const getToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
};

export const clearToken = () => {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

// AuthProvider registers a callback so an expired/revoked token (HTTP 401)
// from ANY request logs the user out cleanly.
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

const unwrap = (body) =>
  body && typeof body === "object" && !Array.isArray(body) && Object.keys(body).length === 1 && "data" in body
    ? body.data
    : body;

async function request(method, path, body) {
  // Build headers synchronously (before the first await) so callers like
  // logout() can fire the request and clear the token right after.
  const headers = { Accept: "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const init = { method, headers };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, init);
  } catch {
    throw new ApiError(
      "Tidak dapat terhubung ke server. Pastikan backend Laravel sudah berjalan (php artisan serve).",
      0
    );
  }

  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && token && path !== "/login") onUnauthorized?.();
    // Laravel validation errors: { message, errors: { field: [msg, ...] } }
    const firstFieldError = payload?.errors ? Object.values(payload.errors)[0]?.[0] : null;
    const message =
      firstFieldError ||
      payload?.message ||
      (res.status === 403 ? "Kamu tidak punya izin untuk aksi ini." : `Permintaan gagal (HTTP ${res.status}).`);
    throw new ApiError(message, res.status, payload?.errors || null);
  }

  return unwrap(payload);
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body ?? {}),
  put: (path, body) => request("PUT", path, body ?? {}),
  delete: (path) => request("DELETE", path),
};
