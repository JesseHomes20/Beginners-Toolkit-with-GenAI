import { clearAuthToken, getAuthToken } from "./auth.js";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3001/api").replace(/\/+$/, "");

async function request(path, { method = "GET", body } = {}) {
  const token = getAuthToken();
  const headers = {
    ...(body ? { "Content-Type": "application/json" } : null),
    ...(token ? { Authorization: `Bearer ${token}` } : null)
  };

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (err) {
    const fallbackBase = API_BASE.includes("://localhost:")
      ? API_BASE.replace("://localhost:", "://127.0.0.1:")
      : null;
    if (fallbackBase) {
      try {
        res = await fetch(`${fallbackBase}${path}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined
        });
      } catch {}
    }
    if (!res) {
      throw new Error(`Cannot reach API at ${API_BASE}. Check that the server is running and CORS_ORIGIN allows this site.`);
    }
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) clearAuthToken();
    const msg = data?.error || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.details = data?.details;
    throw err;
  }
  return data?.data ?? data;
}

export function listBookings(params = {}) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "") continue;
    q.set(k, v);
  }
  const qs = q.toString();
  return request(`/bookings${qs ? `?${qs}` : ""}`);
}

export function createBooking(payload) {
  return request("/bookings", { method: "POST", body: payload });
}

export function updateBooking(id, patch) {
  return request(`/bookings/${id}`, { method: "PUT", body: patch });
}

export function deleteBooking(id) {
  return request(`/bookings/${id}`, { method: "DELETE" });
}

export function loginAdmin({ username, password }) {
  return request("/auth/login", { method: "POST", body: { username, password } });
}

