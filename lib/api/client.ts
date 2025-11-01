// import { getAuthTokenAction } from "./auth";

import { getAuthTokenAction } from "./utils";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://stbackend.fly.dev/api";

type RequestOptions = RequestInit & {
  isFormData?: boolean;
};

// interface ApiResponse {
//   data?: unknown;
//   messages?: string[];
//   errors?: string[];
//   status?: number;
// }

export interface IResponse<T> {
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  data: T;
  errors: string[]; // ✅ much simpler
  messages: string[];
  ok: boolean;
  status: number;
}

async function getAuthToken() {
  if (typeof window === "undefined") {
    return false;
  } else {
    return await getAuthTokenAction();
  }
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const { headers, isFormData, ...restOptions } = options;
  const authCookie = await getAuthToken();

  const requestHeaders = new Headers({
    ...headers,
    Accept: "application/json",
  });

  if (!isFormData) {
    requestHeaders.append("Content-Type", "application/json");
  }

  if (authCookie) {
    requestHeaders.append("Cookie", authCookie);
  }

  if (authCookie) {
    requestHeaders.append("Authorization", authCookie);
  }

  const request = new Request(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
    credentials: "include",
  });

  const response = await fetch(request);
  const data = await response.json();

  return { ...data, ok: response.ok, status: response.status };
}

export const GET = (endpoint: string, options?: RequestOptions) =>
  request(endpoint, { ...options, method: "GET" });

export const POST = (
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
) =>
  request(endpoint, {
    ...options,
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const PUT = (
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
) =>
  request(endpoint, {
    ...options,
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const PATCH = (
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
) =>
  request(endpoint, {
    ...options,
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const DELETE = (
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
) =>
  request(endpoint, {
    ...options,
    method: "DELETE",
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
