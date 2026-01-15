import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';

export type BootstrapResponse = {
  id: string; // domainUserId
  email: string;
  clerk_id: string;
  role: 'parent' | 'child' | 'new_user';
  // relations etc
};

export const useBootstrapMutation = () => {
  const { getToken } = useUser();
  return useMutation({
    mutationFn: async ({ clerkId, email, role }: { clerkId: string; email?: string; role?: string }) => {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.post<BootstrapResponse>('/users/bootstrap', { clerkId, email, role }, { headers });
      return response.data;
    },
  });
};
