import { useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { api } from '@/lib/api';

type Input = { childEmail: string };

export function useFamilyLinkMutation() {
  const { user } = useUser();

  return useMutation({
    mutationFn: async ({ childEmail }: Input) => {
      if (!user?.id) throw new Error('Usuario no identificado');
      const res = await api.post(`/family/link?clerkId=${user.id}`, { childEmail });
      return res.data;
    },
  });
}

