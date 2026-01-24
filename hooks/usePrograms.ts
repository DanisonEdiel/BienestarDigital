import { api } from '@/lib/api';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type Program = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string; 
  end_time: string; 
  days_of_week: number[];   is_active: boolean;
  icon?: string;
  created_at: string;
  updated_at: string;
};

export type CreateProgramDto = {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  daysOfWeek?: number[];
  isActive?: boolean;
  icon?: string;
};

export type UpdateProgramDto = Partial<CreateProgramDto>;

export function usePrograms(activeOnly?: boolean) {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['programs', user?.id, activeOnly],
    enabled: !!user?.id,
    queryFn: async () => {
      const token = await getToken();
      const { data } = await api.get<Program[]>('/programs', {
        params: { clerkId: user!.id, activeOnly },
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
}

export function useCurrentProgram() {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['programs', 'current', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const token = await getToken();
      const { data } = await api.get<Program | null>('/programs/current', {
        params: { clerkId: user!.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
}

export function useCreateProgram() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProgram: CreateProgramDto) => {
      if (!user?.id) throw new Error('User not found');
      const token = await getToken();
      const { data } = await api.post<Program>('/programs', newProgram, {
        params: { clerkId: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

export function useUpdateProgram() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProgramDto }) => {
      if (!user?.id) throw new Error('User not found');
      const token = await getToken();
      const { data: result } = await api.put<Program>(`/programs/${id}`, data, {
        params: { clerkId: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

export function useToggleProgram() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not found');
      const token = await getToken();
      const { data } = await api.patch<Program>(`/programs/${id}/toggle`, {}, {
        params: { clerkId: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

export function useDeleteProgram() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not found');
      const token = await getToken();
      await api.delete(`/programs/${id}`, {
        params: { clerkId: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}
