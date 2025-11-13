import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RewardPreview } from "./types/RewardPerview";
import { getRewardsApi } from "../api";
import type { RewardFilters } from "./types/RewardFilters";

type FetchRewradsArg = {
    page: number,
    limit?: number,
    filters?: RewardFilters,
}

export const fetchRewards = createAsyncThunk<RewardPreview[], FetchRewradsArg>(
    'reward/fetchRewards',
    async ({ page, limit, filters }, { rejectWithValue }) => {
        try {
            const data = await getRewardsApi(page*10, limit ?? 10, filters)
            return data
        } catch (e) {
            if (e instanceof Error) return rejectWithValue(e.message)
            return rejectWithValue(String(e))
        }
    }
)