import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { api } from '@/lib/api';

export function useDeviceLockControl() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deviceId, locked }: { deviceId: string; locked: boolean }) => {
      if (!user?.id) throw new Error('Usuario no identificado');
      const res = await api.post(`/family/device/${deviceId}/lock?clerkId=${user.id}`, { locked });
      return res.data;
    },
    onSuccess: () => {
        // Invalidate children query to refresh status if it contains device info
        queryClient.invalidateQueries({ queryKey: ['family-children'] });
    }
  });
}
