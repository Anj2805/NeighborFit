import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface DashboardStats {
  totalMatches: number;
  topMatchScore: number;
  preferencesCompleted: boolean;
  recentActivity: string[];
}

interface QuickMatch {
  _id: string;
  name: string;
  city: string;
  state: string;
  matchScore: number;
  metrics: {
    safety: number;
    affordability: number;
    cleanliness: number;
    walkability: number;
    nightlife: number;
    transport: number;
  };
}

interface InsightCard {
  label: string;
  value: string;
  detail: string;
}

interface UserInsightsContextValue {
  stats: DashboardStats | null;
  matches: QuickMatch[];
  insights: InsightCard[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const UserInsightsContext = createContext<UserInsightsContextValue>({
  stats: null,
  matches: [],
  insights: [],
  loading: false,
  refresh: async () => { }
});

const clampMetric = (value?: number | null): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return Math.min(10, Math.max(0, value));
};

const normalizeMatches = (rawMatches: any[]): QuickMatch[] =>
  rawMatches
    .map((raw) => {
      const neighborhood = raw.neighborhood || raw;
      if (!neighborhood?._id) return null;
      const metrics = neighborhood.metrics || {};
      return {
        _id: neighborhood._id,
        name: neighborhood.name || 'Unknown Neighborhood',
        city: neighborhood.city || 'Unknown City',
        state: neighborhood.state || '',
        matchScore: typeof raw.matchScore === 'number'
          ? raw.matchScore
          : typeof raw.score === 'number'
            ? raw.score
            : 0,
        metrics: {
          safety: clampMetric(metrics.safety),
          affordability: clampMetric(metrics.affordability),
          cleanliness: clampMetric(metrics.cleanliness),
          walkability: clampMetric(metrics.walkability),
          nightlife: clampMetric(metrics.nightlife),
          transport: clampMetric(metrics.transport)
        }
      };
    })
    .filter((match): match is QuickMatch => Boolean(match));

const getSocketBaseUrl = () => {
  const apiBase = import.meta.env.VITE_API_URL;
  if (apiBase) {
    return apiBase.replace(/\/api\/?$/, '');
  }
  return window.location.origin;
};

export const UserInsightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [matches, setMatches] = useState<QuickMatch[]>([]);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);

  const buildInsights = useCallback((matchList: QuickMatch[], prefsComplete: boolean): InsightCard[] => {
    const topMatch = matchList[0];
    const affordability = topMatch ? `${Math.round((topMatch.metrics.affordability / 10) * 100)}%` : '—';
    const walkability = topMatch ? `${Math.round((topMatch.metrics.walkability / 10) * 100)}%` : '—';
    return [
      {
        label: 'Top Match Confidence',
        value: topMatch ? `${Math.round(topMatch.matchScore)}%` : '—',
        detail: topMatch ? `${topMatch.name} · ${topMatch.city}` : 'Complete preferences to view matches'
      },
      {
        label: 'Budget Fit Score',
        value: prefsComplete ? affordability : '—',
        detail: prefsComplete ? 'Affordability alignment' : 'Set your budget to unlock insights'
      },
      {
        label: 'Walkability Pulse',
        value: prefsComplete ? walkability : '—',
        detail: prefsComplete ? 'Walkability vs. your preferences' : 'Add commute priorities'
      },
      {
        label: 'Matches Tracked',
        value: `${matchList.length}`,
        detail: 'Top neighborhoods currently in your list'
      }
    ];
  }, []);

  const fetchInsights = useCallback(async () => {
    if (!user || !token) {
      setStats(null);
      setMatches([]);
      setInsights([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let hasPreferences = false;
      try {
        const preferencesResponse = await api.get('/preferences');
        hasPreferences = Boolean(preferencesResponse.data);
      } catch (err: any) {
        if (!(err?.response?.status === 404)) {
          throw err;
        }
      }

      let normalizedMatches: QuickMatch[] = [];
      if (hasPreferences) {
        const matchesResponse = await api.get('/neighborhoods/matches');
        normalizedMatches = normalizeMatches(matchesResponse.data.matches || []).slice(0, 3);
      }

      setStats({
        totalMatches: normalizedMatches.length,
        topMatchScore: normalizedMatches[0]?.matchScore || 0,
        preferencesCompleted: hasPreferences,
        recentActivity: [
          'Profile updated',
          normalizedMatches.length ? 'New neighborhood matches found' : 'Add more preferences for better matches',
          hasPreferences ? 'Preferences saved' : 'Preferences pending'
        ]
      });
      setMatches(normalizedMatches);
      setInsights(buildInsights(normalizedMatches, hasPreferences));
    } finally {
      setLoading(false);
    }
  }, [buildInsights, token, user]);

  useEffect(() => {
    if (!user || !token) {
      setStats(null);
      setMatches([]);
      setInsights([]);
      setLoading(false);
      return;
    }
    fetchInsights();
    const interval = setInterval(fetchInsights, 30_000);
    return () => clearInterval(interval);
  }, [fetchInsights, user, token]);

  useEffect(() => {
    if (!user || !token) return;

    const socket = io(`${getSocketBaseUrl()}/users`, {
      withCredentials: true,
      auth: { token }
    });

    socket.on('insights_updated', () => {
      fetchInsights();
    });

    return () => {
      socket.disconnect();
    };
  }, [user, token, fetchInsights]);

  const value = useMemo(() => ({
    stats,
    matches,
    insights,
    loading,
    refresh: fetchInsights
  }), [stats, matches, insights, loading, fetchInsights]);

  return (
    <UserInsightsContext.Provider value={value}>
      {children}
    </UserInsightsContext.Provider>
  );
};

export const useUserInsights = () => useContext(UserInsightsContext);
