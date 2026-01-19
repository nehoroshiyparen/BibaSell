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

  const setDraftTitle = (title: string) => dispatch(setDraftTitleFilter(title));
  const setDraftAuthor = (authors: string[]) =>
    dispatch(setDraftAuthorFilter(authors));
  const setDraftContent = (content: string) =>
    dispatch(setDraftContentFilter(content));

  const applyDraftFilters = () => dispatch(applyFilters());
  const resetAllFilters = () => dispatch(resetFilters());

  return {
    // state
    ...state,

    // actions
    loadMoreArticles,
    setDraftTitle,
    setDraftAuthor,
    setDraftContent,
    applyDraftFilters,
    resetAllFilters,
    setSortType: (sort: SortTypes) => dispatch(setSortType(sort)),
    setSelectedArticle: (article: ArticleAdvanced) =>
      dispatch(setSelectedArticle(article)),
    resetSelectedArticle: () => dispatch(resetSelectedArticle()),
  };
}
