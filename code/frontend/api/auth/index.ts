type ApiResult<T> = { token?: string; data?: T; message?: string };

// User auth base
const USER_AUTH_BASE =
  process.env.EXPO_PUBLIC_API_USER_AUTH_URL ||
  "http://localhost:3000/api/client/auth";

// Admin auth base
const ADMIN_AUTH_BASE =
  process.env.EXPO_PUBLIC_API_ADMIN_AUTH_URL ||
  "http://localhost:3000/api/admin/auth";

async function postJSON<T>(path: string, body: any, baseURL: string): Promise<ApiResult<T>> {
  const res = await fetch(`${baseURL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch { json = { message: text }; }

  if (!res.ok) return { message: json?.message || `Request failed (${res.status})` };
  return json;
}

// USER
export function userRegister(payload: {
  email: string;
  password: string;
  fullName?: string;
  level?: "N5" | "N4" | "N3" | "N2" | "N1";
}) {
  return postJSON<{ user: any }>("/register", payload, USER_AUTH_BASE);
}

export function userLogin(payload: { email: string; password: string }) {
  return postJSON<{ user: any }>("/login", payload, USER_AUTH_BASE);
}

// ADMIN
export function adminLogin(payload: { email: string; password: string }) {
  return postJSON<{ admin: any }>("/login", payload, ADMIN_AUTH_BASE);
}