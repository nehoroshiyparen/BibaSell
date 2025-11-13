import { createAsyncThunk } from "@reduxjs/toolkit"
import type { ArticlePreview } from "./types/ArticlePreview"
import { getArticlesApi } from "../api/get/getArticles"
import type { ArticleFilters } from "./types/ArticleFilters"

type FetchArticleArgs = {
    page: number,
    limit?: number,
    filters?: ArticleFilters,
}

export const fetchArticles = createAsyncThunk<ArticlePreview[], FetchArticleArgs>(
    'article/fetchArticles',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const data = await getArticlesApi(page*10, limit ?? 10)
            return data
        } catch (e) {
            if (e instanceof Error) return rejectWithValue(e.message)
            return rejectWithValue(String(e))
        }
    }
)