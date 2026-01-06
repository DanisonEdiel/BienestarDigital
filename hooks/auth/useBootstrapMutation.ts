import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

export type BootstrapResponse = {
  id: string; // domainUserId
  email: string;
  clerk_id: string;
  role: 'parent' | 'child' | 'new_user';
  // relations etc
};

export const useBootstrapMutation = () => {
  return useMutation({
    mutationFn: async ({ clerkId, email, role }: { clerkId: string; email?: string; role?: string }) => {
      const response = await api.post<BootstrapResponse>('/users/bootstrap', { clerkId, email, role });
      return response.data;
    },
  });
};
