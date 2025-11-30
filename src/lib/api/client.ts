import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { z, ZodSchema } from 'zod'
import { ApiResponse, ApiError } from '@/types'

export class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError) => {
        const responseData = error.response?.data as any
        const apiError: ApiError = {
          message: responseData?.message || error.message || 'An error occurred',
          status: error.response?.status || 500,
          errors: responseData?.errors,
        }
        return Promise.reject(apiError)
      }
    )
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private validateResponse<T>(data: unknown, schema: ZodSchema<T>): T {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.issues)
        throw new Error('Invalid response format')
      }
      throw error
    }
  }

  async get<T>(
    url: string,
    schema?: ZodSchema<T>,
    params?: Record<string, any>
  ): Promise<T> {
    const response = await this.client.get(url, { params })
    const data = response.data

    if (schema) {
      return this.validateResponse(data, schema)
    }

    return data
  }

  async post<T>(
    url: string,
    data?: any,
    schema?: ZodSchema<T>
  ): Promise<T> {
    const response = await this.client.post(url, data)
    const responseData = response.data

    if (schema) {
      return this.validateResponse(responseData, schema)
    }

    return responseData
  }

  async put<T>(
    url: string,
    data?: any,
    schema?: ZodSchema<T>
  ): Promise<T> {
    const response = await this.client.put(url, data)
    const responseData = response.data

    if (schema) {
      return this.validateResponse(responseData, schema)
    }

    return responseData
  }

  async patch<T>(
    url: string,
    data?: any,
    schema?: ZodSchema<T>
  ): Promise<T> {
    const response = await this.client.patch(url, data)
    const responseData = response.data

    if (schema) {
      return this.validateResponse(responseData, schema)
    }

    return responseData
  }

  async delete<T>(
    url: string,
    schema?: ZodSchema<T>
  ): Promise<T> {
    const response = await this.client.delete(url)
    const data = response.data

    if (schema) {
      return this.validateResponse(data, schema)
    }

    return data
  }
}

export const apiClient = new ApiClient()