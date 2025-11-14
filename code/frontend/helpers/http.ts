export type HttpOptions = RequestInit & {
  json?: boolean;       
  baseURL?: string;     
};

const ADMIN_CONTENT_BASE =
  process.env.EXPO_PUBLIC_API_ADMIN_CONTENT_URL || ''; 

function joinUrl(base: string, path: string) {
  if (!base) return path; 
  if (!path) return base;
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path.slice(1) : path;
  return `${b}/${p}`;
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { json = true, baseURL = ADMIN_CONTENT_BASE, headers, ...rest } = options;

  const url = path.startsWith('http') ? path : joinUrl(baseURL, path);

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    credentials: 'include',
    ...rest,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = (data && (data.message || data.error)) || msg;
    } catch {
      try { msg = (await res.text()) || msg; } catch {}
    }
    throw new Error(msg);
  }

  if (!json) {
    return res as unknown as T;
  }
  return res.json();
}

export const get = <T,>(path: string, opts?: Omit<HttpOptions, 'method'|'body'>) =>
  http<T>(path, { method: 'GET', ...(opts || {}) });

export const post = <T,>(path: string, body?: any, opts?: Omit<HttpOptions, 'method'|'body'>) =>
  http<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined, ...(opts || {}) });

export const put = <T,>(path: string, body?: any, opts?: Omit<HttpOptions, 'method'|'body'>) =>
  http<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, ...(opts || {}) });

export const del = <T,>(path: string, opts?: Omit<HttpOptions, 'method'|'body'>) =>
  http<T>(path, { method: 'DELETE', ...(opts || {}) });
