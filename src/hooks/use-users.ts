import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { userSchema, createUserSchema, updateUserSchema } from '@/lib/validations/schemas'
import { User, CreateUserInput, UpdateUserInput, PaginatedResponse } from '@/types'
import { QUERY_KEYS } from '@/constants'

export const useUsers = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () =>
      apiClient.get<PaginatedResponse<User>>('/users', undefined, params),
  })
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, id],
    queryFn: () => apiClient.get<User>(`/users/${id}`, userSchema),
    enabled: !!id,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserInput) =>
      apiClient.post<User>('/users', data, userSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      apiClient.put<User>(`/users/${id}`, data, userSchema),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS, variables.id] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<User>(`/users/${id}`, userSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] })
    },
  })
}