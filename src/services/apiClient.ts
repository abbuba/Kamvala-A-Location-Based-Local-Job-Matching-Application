export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const BASE_URL = '/api'

/** JSON Server only runs in local dev; static deploy uses seed data instead. */
const API_ENABLED = import.meta.env.DEV

export async function apiClient<T>(
  path: string,
  options?: RequestInit & { signal?: AbortSignal },
): Promise<T> {
  if (!API_ENABLED) {
    throw new ApiError('API unavailable outside development', 503)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.statusText}`, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
