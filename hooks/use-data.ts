import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUser } from '@clerk/clerk-expo';

type Params = Record<string, unknown> | undefined;
type Id = string | number;

type UpdateInput<T> = { id: Id; data: T };

export function useData<Q, C = unknown, U = unknown>(path: string, params?: Params) {
  const queryClient = useQueryClient();
  const { getToken } = useUser();
  const queryKey = [path, params ?? {}];

  const query = useQuery<Q>({
    queryKey,
    queryFn: async () => {
      const token = await getToken();
      return (await api.get<Q>(path, { 
        params,
        headers: { Authorization: `Bearer ${token}` }
      })).data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: C) => {
      const token = await getToken();
      return (await api.post<Q>(path, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })).data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: async (input: UpdateInput<U>) => {
      const token = await getToken();
      return (await api.patch<Q>(`${path}/${input.id}`, input.data, {
        headers: { Authorization: `Bearer ${token}` }
      })).data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: Id) => {
      const token = await getToken();
      return (await api.delete(`${path}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })).data as Q;
    },
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