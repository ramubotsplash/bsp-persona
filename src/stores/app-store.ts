import { create } from 'zustand';
import { api } from '@/lib/api-client';
import type { EnrichmentData, SearchQuery, SearchHistoryEntry } from '@shared/types';
interface AppState {
  isAuthenticated: boolean;
  isLoading: boolean;
  query: SearchQuery;
  enrichmentData: EnrichmentData | null;
  error: string | null;
  // History state
  history: SearchHistoryEntry[];
  isHistoryLoading: boolean;
  historyError: string | null;
}
interface AppActions {
  login: () => void;
  logout: () => void;
  setQuery: (update: Partial<SearchQuery>) => void;
  fetchEnrichmentData: () => Promise<void>;
  fetchHistory: () => Promise<void>;
}
const initialQuery: SearchQuery = {
  personName: '',
  title: '',
  companyName: '',
  additionalInfo: '',
};
export const useAppStore = create<AppState & AppActions>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  query: initialQuery,
  enrichmentData: null,
  error: null,
  history: [],
  isHistoryLoading: false,
  historyError: null,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, enrichmentData: null, query: initialQuery }),
  setQuery: (update) => set((state) => ({ query: { ...state.query, ...update } })),
  fetchEnrichmentData: async () => {
    const { query } = get();
    const isQueryEmpty = Object.values(query).every((val) => val.trim() === '');
    if (isQueryEmpty) {
      set({ error: 'At least one search field must be filled.' });
      return;
    }
    set({ isLoading: true, error: null, enrichmentData: null });
    try {
      const data = await api<EnrichmentData>('/api/enrich', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
      set({ enrichmentData: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Enrichment API failed:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },
  fetchHistory: async () => {
    set({ isHistoryLoading: true, historyError: null });
    try {
      const historyData = await api<SearchHistoryEntry[]>('/api/history');
      set({ history: historyData, isHistoryLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('History API failed:', error);
      set({ historyError: errorMessage, isHistoryLoading: false });
    }
  },
}));