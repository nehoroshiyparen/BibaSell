import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ArticlePreview } from "./types/ArticlePreview"
import { fetchArticles } from "./article.thunks"
import { SortTypes } from "src/features/SearchArticles/types/SortTypes"

export type ArticleState = {
    articles: ArticlePreview[],

    page: number,
    hasMore: boolean,

    searchQuery: string,

    isLoading: boolean,
    error: string | null

    sortType: SortTypes
    authorFilter: string
    titleFilter: string
    contentFilter: string

    selectedTitleFilter: string
    selectedAuthorFilter: string
    selectedContentFilter: string

    isAuthorFilterEnabled: boolean
    isTitleFilterEnabled: boolean
    isContentFilterEnabled: boolean
}

const initialState: ArticleState = {
    articles: [],

    page: 0,
    hasMore: true,

    searchQuery: '',

    isLoading: false,
    error: null,
    
    sortType: SortTypes.none,
    titleFilter: '',
    authorFilter: '',
    contentFilter: '',

    selectedTitleFilter: '',
    selectedAuthorFilter: '',
    selectedContentFilter: '',

    isAuthorFilterEnabled: false,
    isTitleFilterEnabled: false,
    isContentFilterEnabled: false,
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

        setSortType: (state, action: PayloadAction<SortTypes>) => {
            state.sortType = action.payload
        },
        setAuthorFilter: (state, action: PayloadAction<string>) => {
            state.authorFilter = action.payload
        },
        setTitleFilter: (state, action: PayloadAction<string>) => {
            state.titleFilter = action.payload
        },
        setContentFilter: (state, action: PayloadAction<string>) => {
            state.contentFilter = action.payload
        },

        setSelectedTitleFilter: (state, action: PayloadAction<string>) => {
            state.selectedTitleFilter = action.payload
            state.isTitleFilterEnabled = !!action.payload.trim()
            state.page = 0,
            state.hasMore = true
        },

        setSelectedAuthorFilter: (state, action: PayloadAction<string>) => {
            state.selectedAuthorFilter = action.payload
            state.isAuthorFilterEnabled = !!action.payload.trim()
            state.page = 0,
            state.hasMore = true
        },

        setSelectedContentFilter: (state, action: PayloadAction<string>) => {
            state.selectedContentFilter = action.payload
            state.isContentFilterEnabled = !!action.payload.trim()
            state.page = 0,
            state.hasMore = true
        },

        setIsAuthorFilterEnabled: (state, action: PayloadAction<boolean>) => {
            state.isAuthorFilterEnabled = action.payload
        },
        setIsTitleFilterEnabled: (state, action: PayloadAction<boolean>) => {
            state.isTitleFilterEnabled = action.payload
        },
        setIsContentFilterEnabled: (state, action: PayloadAction<boolean>) => {
            state.isContentFilterEnabled = action.payload
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
    setSortType,
    setAuthorFilter,
    setTitleFilter,
    setContentFilter,
    setIsAuthorFilterEnabled,
    setIsTitleFilterEnabled,
    setIsContentFilterEnabled,
    setSelectedAuthorFilter,
    setSelectedContentFilter,
    setSelectedTitleFilter,
    setLoading, setError
} = articleSlice.actions
export default articleSlice.reducer