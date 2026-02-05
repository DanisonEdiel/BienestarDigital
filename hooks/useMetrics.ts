import { api } from '@/lib/api';
import { useAuth, useUser } from '@clerk/clerk-expo';
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
  type: string; //'activity', 'article', etc.
};

export type ScreenTimeSummary = {
  usageDate: string;
  dailyLimitSeconds: number;
  strictness: string | null;
  usedSeconds: number;
  remainingSeconds: number;
  usedPercent: number;
  warningLevel: 'none' | 'warning' | 'critical';
};

export type EmotionSummary = {
  level: 'low' | 'medium' | 'high';
  label: string;
  emotion: string | null;
  confidence: number;
  recordDate: string | null;
};

export function useUsageMetrics(timeRange: 'day' | 'week' | 'month' = 'day') {
  const { user } = useUser();
  const { getToken } = useAuth();
  
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
  const { user } = useUser();
  const { getToken } = useAuth();

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
  const { user } = useUser();
  const { getToken } = useAuth();

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

export function useScreenTimeSummary() {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['screen-time-summary', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await api.get<ScreenTimeSummary>(`/metrics/screen-time-summary`, {
        params: { clerkId: user!.id },
        headers,
      });

      return data;
    },
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

export function useEmotionSummary() {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['emotion-summary', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await api.get<EmotionSummary>(`/emotions/summary`, {
        params: { clerkId: user!.id },
        headers,
      });

      return data;
    },
    staleTime: 30_000,
  });
}

export type BlockingRisk = {
  percent: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  usedPercent: number;
  totalInteractions: number;
  emotionLevel: 'low' | 'medium' | 'high';
  usageDate: string;
};

export function useBlockingRisk() {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['blocking-risk', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await api.get<BlockingRisk>(`/metrics/blocking-risk`, {
        params: { clerkId: user!.id },
        headers,
      });

      return data;
    },
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}
