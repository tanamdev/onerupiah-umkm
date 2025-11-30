import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { postSchema, createPostSchema } from '@/lib/validations/schemas'
import { Post, CreatePostInput, PaginatedResponse } from '@/types'
import { QUERY_KEYS } from '@/constants'

export const usePosts = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, params],
    queryFn: () =>
      apiClient.get<PaginatedResponse<Post>>('/posts', undefined, params),
  })
}

export const usePost = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, id],
    queryFn: () => apiClient.get<Post>(`/posts/${id}`, postSchema),
    enabled: !!id,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostInput) =>
      apiClient.post<Post>('/posts', data, postSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] })
    },
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePostInput> }) =>
      apiClient.put<Post>(`/posts/${id}`, data, postSchema),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS, variables.id] })
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<Post>(`/posts/${id}`, postSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] })
    },
  })
}