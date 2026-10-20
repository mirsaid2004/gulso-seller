// Default to same-origin so requests hit the MSW handlers (baseUrl "/api/v1")
// wherever the app is deployed, not the developer's localhost.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  _retry?: boolean;
};

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  const url = `${BASE_URL}/api/v1${path}`;
  if (!params) return url;
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  );
  if (!Object.keys(filtered).length) return url;
  return `${url}?${new URLSearchParams(filtered as Record<string, string>)}`;
}

function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem("auth-store");
    if (!raw) return null;
    return JSON.parse(raw)?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

async function fetchApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body, params, _retry = false } = options;

  const isAuth = path.startsWith("/auth/");
  const token = isAuth ? null : getAccessToken();

  const res = await fetch(buildUrl(path, params), {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(!isAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !_retry && !isAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) return fetchApi<T>(path, { ...options, _retry: true });
    window.location.href = "/login";
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = await res.json();
      message = err.error?.message ?? err.message ?? message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  try {
    const raw = localStorage.getItem("auth-store");
    const refreshToken = raw ? JSON.parse(raw)?.state?.refreshToken : null;
    if (!refreshToken) return false;

    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;

    const { data } = await res.json();
    // Update store directly in localStorage so next request picks up new token
    const storeRaw = localStorage.getItem("auth-store");
    if (storeRaw) {
      const store = JSON.parse(storeRaw);
      store.state.accessToken = data.accessToken;
      store.state.refreshToken = data.refreshToken;
      localStorage.setItem("auth-store", JSON.stringify(store));
    }
    return true;
  } catch {
    return false;
  }
}

export const api = {
  get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return fetchApi<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return fetchApi<T>(path, { ...options, method: "POST", body });
  },
  put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return fetchApi<T>(path, { ...options, method: "PUT", body });
  },
  patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return fetchApi<T>(path, { ...options, method: "PATCH", body });
  },
  delete<T>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return fetchApi<T>(path, { ...options, method: "DELETE" });
  },
};
