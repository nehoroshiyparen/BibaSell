import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ArticlePreview } from "./types/ArticlePreview"
import { fetchArticles } from "./article.thunks"

type ArticleState = {
    articles: ArticlePreview[],
    filteredArticles: ArticlePreview[],

    page: number,
    hasMore: boolean,

    searchQuery: string,

    isLoading: boolean,
    error: string | null
}

const initialState: ArticleState = {
    articles: [],
    filteredArticles: [],

    page: 0,
    hasMore: true,

    searchQuery: '',

    isLoading: false,
    error: null
}

const articleSlice = createSlice({
    name: 'person',
    initialState,
    reducers: {
        setArticles: (state, action: PayloadAction<ArticlePreview[]>) => {
            state.articles = action.payload
        },
        pushArticles: (state, action: PayloadAction<ArticlePreview[]>) => {
            state.articles = [...state.articles, ...action.payload]
        },
        resetArticles: (state) => {
            state.articles = []
            state.page = 0,
            state.hasMore = true
        },

        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
            state.filteredArticles = []
            state.page = 0
            state.hasMore = true
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<ArticlePreview[]>) => {
                state.isLoading = false
                if (action.payload.length === 0) {
                    state.hasMore = false
                } else {
                    state.articles = state.page === 0 ? action.payload : [...state.articles, ...action.payload]
                    state.page += 1
                }
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    }
})

export const {
    setArticles, pushArticles, resetArticles,
    setSearchQuery,
    setLoading, setError
} = articleSlice.actions
export default articleSlice.reducer