import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RewardPreview } from "./types/RewardPerview";
import { getFilteredRewardsApi, getRewardsApi } from "../api";
import type { RewardFilters } from "./types/RewardFilters";

type FetchRewradsArg = {
    page: number,
    limit?: number
}

type FetchRewardsWithFilters = {
    filters: RewardFilters,
    page: number,
    limit?: number
}

export const fetchRewards = createAsyncThunk<RewardPreview[], FetchRewradsArg>(
    'reward/fetchRewards',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const data = await getRewardsApi(page*10, limit ?? 10)
            return data
        } catch (e) {
            if (e instanceof Error) return rejectWithValue(e.message)
            return rejectWithValue(String(e))
        }
    }
)

export const fetchRewardsWithFilters = createAsyncThunk<
    RewardPreview[],
    FetchRewardsWithFilters
>('rewards/fetchRewardsWithFilters', async ({ filters, page, limit }, { rejectWithValue }) => {
    try {
        const data = await getFilteredRewardsApi(filters, page*10, limit ?? 10)
        return data
    } catch (e) {
        if (e instanceof Error) return rejectWithValue(e.message)
        return rejectWithValue(String(e))
    }
})