export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
  success: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  name: string
  email: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
}

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  author: User
  createdAt: string
  updatedAt: string
}

export interface CreatePostInput {
  title: string
  content: string
}

export interface UpdatePostInput {
  title?: string
  content?: string
}