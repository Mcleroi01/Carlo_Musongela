import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabase";
import type { ContentState } from "../types/portfolio";
import type { PortfolioResult } from "../services/portfolio";

export function usePortfolioData<T>(
  loader: () => Promise<PortfolioResult<T>>,
  fallback: T,
): ContentState<T> {
  const [state, setState] = useState<ContentState<T>>({
    data: fallback,
    isLoading: isSupabaseConfigured,
    error: null,
    source: "static",
  });

  useEffect(() => {
    let active = true;
    if (!isSupabaseConfigured) {
      setState({ data: fallback, isLoading: false, error: null, source: "static" });
      return () => { active = false; };
    }

    setState((current) => ({ ...current, isLoading: true, error: null }));
    loader().then((result) => {
      if (!active) return;
      if (result.error) {
        setState({ data: fallback, isLoading: false, error: result.error, source: "static" });
      } else {
        setState({ data: result.data, isLoading: false, error: null, source: "supabase" });
      }
    }).catch((error: unknown) => {
      if (!active) return;
      setState({
        data: fallback,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erreur de chargement Supabase.",
        source: "static",
      });
    });

    return () => { active = false; };
  }, [fallback, loader]);

  return state;
}
