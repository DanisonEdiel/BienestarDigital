import { api } from '@/lib/api';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';

export type UsageMetric = {
  id: number;
  user_id: string;
  app_name: string;
  duration_seconds: number;
  timestamp: string;
  category?: string;
};

export type InteractionHistoryItem = {
  id: string;
  user_id: string;
  record_date: string;
  taps_count: number;
  scroll_events: number;
  avg_scroll_speed: number | null;
};

export type WellnessRecommendation = {
  id: number;
  title: string;
  content: string;
  type: string; // e.g., 'activity', 'article'
};

export function useUsageMetrics(timeRange: 'day' | 'week' | 'month' = 'day') {
  const { user, getToken } = useUser();
  
  return useQuery({
    queryKey: ['metrics-usage', user?.id, timeRange],
    enabled: !!user?.id,
    queryFn: async () => {
      const token = await getToken();
      const { data } = await api.get<UsageMetric[]>(`/metrics/usage`, {
        params: { clerkId: user!.id, range: timeRange },
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
  });
}

export function useInteractionHistory(timeRange: 'day' | 'week' | 'month' = 'week') {
  const { user, getToken } = useUser();

  return useQuery({
    queryKey: ['metrics-interactions', user?.id, timeRange],
    enabled: !!user?.id,
    queryFn: async () => {
      const token = await getToken();
      const { data } = await api.get<InteractionHistoryItem[]>(`/metrics/interactions`, {
        params: { clerkId: user!.id, range: timeRange },
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
}

export function useWellnessRecommendations() {
  const { user, getToken } = useUser();

  return useQuery({
    queryKey: ['recommendations', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const token = await getToken();
      const { data } = await api.get<WellnessRecommendation[]>(`/recommendations`, {
        params: { clerkId: user!.id },
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
  });
}
