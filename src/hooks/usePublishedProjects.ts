import { projectsData } from "../data/projects";
import { getPublishedProjects } from "../services/portfolio";
import { usePortfolioData } from "./usePortfolioData";

/** Backwards-compatible project hook using the shared loading/error/fallback behavior. */
export function usePublishedProjects() {
  const state = usePortfolioData(getPublishedProjects, projectsData);
  return {
    projects: state.data,
    isLoading: state.isLoading,
    error: state.error,
    source: state.source,
  };
}
