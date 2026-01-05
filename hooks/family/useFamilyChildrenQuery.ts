import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import { api } from '@/lib/api';

export function useFamilyChildrenQuery() {
  const { user } = useUser();

  return useQuery({
    queryKey: ['family-children', user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await api.get(`/family/children?clerkId=${user!.id}`)).data,
  });
}

