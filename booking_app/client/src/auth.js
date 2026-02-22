const TOKEN_KEY = "booking_admin_token";

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAuthToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
  window.dispatchEvent(new Event("authchange"));
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
  window.dispatchEvent(new Event("authchange"));
}

export function isAuthed() {
  return Boolean(getAuthToken());
}

