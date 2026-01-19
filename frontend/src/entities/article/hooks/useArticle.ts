import { useAppDispatch, useAppSelector } from "src/app/store/hooks";
import { fetchArticles } from "../model/article.thunks";
import type { RootState } from "src/app/store";
import {
  setSortType,
  setDraftAuthorFilter,
  setDraftContentFilter,
  setDraftTitleFilter,
  applyFilters,
  resetFilters,
  setSelectedArticle,
  resetSelectedArticle,
} from "../model";
import type { SortTypes } from "src/features/SearchArticles/types/SortTypes";
import type { ArticleAdvanced } from "../model/types/ArticleAdvanced";

export function useArticle() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s: RootState) => s.article);

  const loadMoreArticles = async () => {
    if (!state.hasMore || state.isLoading) return;

    await dispatch(
      fetchArticles({
        page: state.page,
        filters: state.appliedFilters,
      }),
    );
  };

  return {
    // state (осознанно отдаём, без магии)
    articles: state.articles,
    page: state.page,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    error: state.error,

    sortType: state.sortType,
    draftFilters: state.draftFilters,
    appliedFilters: state.appliedFilters,

    selectedArticle: state.selectedArticle,

    // actions
    loadMoreArticles,

    setSortType: (v: SortTypes) => dispatch(setSortType(v)),

    setDraftAuthorFilter: (v: string[]) => dispatch(setDraftAuthorFilter(v)),
    setDraftTitleFilter: (v: string) => dispatch(setDraftTitleFilter(v)),
    setDraftContentFilter: (v: string) => dispatch(setDraftContentFilter(v)),

    applyFilters: () => dispatch(applyFilters()),
    resetFilters: () => dispatch(resetFilters()),

    setSelectedArticle: (v: ArticleAdvanced) => dispatch(setSelectedArticle(v)),
    resetSelectedArticle: () => dispatch(resetSelectedArticle()),
  };
}
