import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ArticlePreview } from "./types/ArticlePreview";
import { fetchArticles } from "./article.thunks";
import { SortTypes } from "src/features/SearchArticles/types/SortTypes";
import type { ArticleAdvanced } from "./types/ArticleAdvanced";
import type { ArticleFilters } from "./types/ArticleFilters";

export type ArticleState = {
  articles: ArticlePreview[];

  page: number;
  hasMore: boolean;

  searchQuery: string;

  isLoading: boolean;
  error: string | null;

  sortType: SortTypes;

  draftFilters: ArticleFilters;
  appliedFilters: ArticleFilters;

  selectedArticle: ArticleAdvanced | null;
};

const emptyFilters: ArticleFilters = {
  authors: [],
  title: "",
  extractedText: "",
};

const initialState: ArticleState = {
  articles: [],

  page: 0,
  hasMore: true,

  searchQuery: "",

  isLoading: false,
  error: null,

  sortType: SortTypes.none,

  draftFilters: { ...emptyFilters },
  appliedFilters: { ...emptyFilters },

  selectedArticle: null,
};

const resetPaginationState = (state: ArticleState) => {
  state.articles = [];
  state.page = 0;
  state.hasMore = true;
};

const articleSlice = createSlice({
  name: "pdfArticles",
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<ArticlePreview[]>) => {
      state.articles = action.payload;
    },
    pushArticles: (state, action: PayloadAction<ArticlePreview[]>) => {
      state.articles = [...state.articles, ...action.payload];
    },
    resetPagination(state) {
      state.articles = [];
      state.page = 0;
      state.hasMore = true;
    },
    resetArticles: (state) => {
      resetPaginationState(state);
    },

    setSortType: (state, action: PayloadAction<SortTypes>) => {
      state.sortType = action.payload;
    },

    setDraftAuthorFilter(state, action: PayloadAction<string[]>) {
      state.draftFilters.authors = action.payload;
    },

    setDraftTitleFilter(state, action: PayloadAction<string>) {
      state.draftFilters.title = action.payload;
    },

    setDraftContentFilter(state, action: PayloadAction<string>) {
      state.draftFilters.extractedText = action.payload;
    },

    applyFilters(state) {
      state.appliedFilters = { ...state.draftFilters };
      resetPaginationState(state);
    },

    resetFilters(state) {
      state.draftFilters = { ...emptyFilters };
      state.appliedFilters = { ...emptyFilters };
      resetPaginationState(state);
    },

    setSelectedArticle: (state, action: PayloadAction<ArticleAdvanced>) => {
      state.selectedArticle = action.payload;
    },
    resetSelectedArticle: (state) => {
      state.selectedArticle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchArticles.fulfilled,
        (state, action: PayloadAction<ArticlePreview[]>) => {
          state.isLoading = false;

          if (action.payload.length === 0) {
            state.hasMore = false;
          } else {
            state.articles =
              state.page === 0
                ? action.payload
                : [...state.articles, ...action.payload];

            state.page += 1;
          }
        },
      )
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setArticles,
  pushArticles,
  resetArticles,
  setSortType,
  setDraftAuthorFilter,
  setDraftContentFilter,
  setDraftTitleFilter,
  setSelectedArticle,
  applyFilters,
  resetFilters,
  resetSelectedArticle,
} = articleSlice.actions;
export default articleSlice.reducer;
