import { cookies } from "next/headers";

export const getAuthTokenAction = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.AUTH_TOKEN_COOKIE || "auth_token");
  if (token) {
    return `${token.name}=${token.value}`;
  } else {
    return false;
  }
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.lcb.loc";
const API_BASE_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "/api/v1/rest";

type RequestOptions = RequestInit & {
  isFormData?: boolean;
};

export interface IResponse<T> {
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  data: T;
  errors: string[];
  messages: string[];
  ok: boolean;
  status: number;
}

async function getAuthToken() {
  if (typeof window !== "undefined") {
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

  const request = new Request(`${API_BASE_URL}${API_BASE_VERSION}${endpoint}`, {
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
