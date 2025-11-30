export const API_ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
} as const

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const QUERY_KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  AUTH: 'auth',
} as const