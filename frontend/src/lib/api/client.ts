const API_URL = import.meta.env.VITE_API_URL || '/api'

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options

  let url = `${API_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({
      error: 'Request failed',
    }))) as { error?: string; message?: string; code?: string }

    const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`

    const error = new Error(errorMessage) as Error & {
      status?: number
      code?: string
    }
    // Attach status code and error code for better error handling
    error.status = response.status
    error.code = errorData.code

    // Intercept 401 Unauthorized errors
    const ignoredEndpoints = ['/auth/login', '/auth/logout'];
    const shouldDispatch = !ignoredEndpoints.some(path => endpoint.includes(path));

    if (response.status === 401 && shouldDispatch) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    throw error
  }

  return response.json()
}

