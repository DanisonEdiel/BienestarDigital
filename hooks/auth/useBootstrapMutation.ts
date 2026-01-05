import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

export type BootstrapResponse = {
  role: 'parent' | 'child' | 'new_user';
  // Add other properties if needed
};

export const useBootstrapMutation = () => {
  return useMutation({
    mutationFn: async ({ clerkId, role }: { clerkId: string; role?: string }) => {
      const response = await api.post<BootstrapResponse>('/users/bootstrap', { clerkId, role });
      return response.data;
    },
  });
};
