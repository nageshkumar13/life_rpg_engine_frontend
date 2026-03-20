import { useAuthStore } from "@/store/auth-store";
import { getStoredAccessToken } from "@/lib/session";

const DEFAULT_API_BASE_URL = "/api/v1";

type JsonBody = Record<string, unknown> | unknown[];
type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: BodyInit | JsonBody | null;
};

type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | undefined>;
};

const apiBaseUrlFromEnv = (import.meta as ImportMetaWithEnv).env?.VITE_API_BASE_URL;

export const API_BASE_URL = (apiBaseUrlFromEnv ?? DEFAULT_API_BASE_URL).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

function buildErrorMessage(status: number, payload: unknown) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object" && "detail" in payload) {
    const detail = Reflect.get(payload, "detail");

    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }

    if (Array.isArray(detail) && detail.length) {
      return detail
        .map((item) => {
          if (item && typeof item === "object" && "msg" in item) {
            return String(Reflect.get(item, "msg"));
          }

          return JSON.stringify(item);
        })
        .join(", ");
    }
  }

  return `Request failed (${status})`;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? text : null;
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  let body = init.body;
  const token = getStoredAccessToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (body && typeof body === "object" && !(body instanceof FormData) && !(body instanceof URLSearchParams) && !(body instanceof Blob)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    body,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401 && token && !path.startsWith("/auth/login") && !path.startsWith("/auth/signup")) {
      useAuthStore.getState().clearSession();
    }

    throw new ApiError(response.status, buildErrorMessage(response.status, payload));
  }

  return payload as T;
}
