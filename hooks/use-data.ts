import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

type Params = Record<string, unknown> | undefined;
type Id = string | number;

type UpdateInput<T> = { id: Id; data: T };

export function useData<Q, C = unknown, U = unknown>(path: string, params?: Params) {
  const queryClient = useQueryClient();
  const queryKey = [path, params ?? {}];

  const query = useQuery<Q>({
    queryKey,
    queryFn: async () => (await api.get<Q>(path, { params })).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: C) => (await api.post<Q>(path, payload)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: async (input: UpdateInput<U>) => (await api.patch<Q>(`${path}/${input.id}`, input.data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: Id) => (await api.delete(`${path}/${id}`)).data as Q,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    ...query,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    removing: deleteMutation.isPending,
  };
}