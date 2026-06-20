import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { QueryKey, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

export const useApiGet = <TData = unknown, TError = unknown>(
  key: QueryKey,
  fn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: fn,
    ...options,
  })
}

type UseApiSendOptions<TData, TError, TVariables> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn' | 'onSuccess' | 'onError'
>

export const useApiSend = <TData = unknown, TError = unknown, TVariables = void>(
  fn: (variables: TVariables) => Promise<TData>,
  invalidateKey?: QueryKey[],
  options?: UseApiSendOptions<TData, TError, TVariables>,
  onSuccess?: (data: TData) => void,
) => {
  const queryClient = useQueryClient()

  return useMutation<TData, TError, TVariables>({
    mutationFn: fn,
    retry: 0,
    ...options,
    onSuccess: (data) => {
      invalidateKey?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
      onSuccess?.(data)
    },
  })
}
