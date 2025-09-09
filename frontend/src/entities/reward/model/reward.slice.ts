import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RewardPreview } from "./types/RewardPerview";
import { fetchRewards, fetchRewardsWithFilters } from "./reward.thunks";
import type { setFilteredPersons } from "src/entities/person/model";

type RewardsState = {
    rewards: RewardPreview[],
    filteredRewards: RewardPreview[],

    page: number,
    hasMore: boolean,

    searchQuery: string,

    isLoading: boolean,
    error: string | null
}

const initialState: RewardsState = {
    rewards: [],
    filteredRewards: [],

    page: 0,
    hasMore: true,

    searchQuery: '',

    isLoading: false,
    error: null
}

const rewardSlice = createSlice({
    name: 'reward',
    initialState,
    reducers: {
        setRewards: (state, action: PayloadAction<RewardPreview[]>) => {
            state.rewards = action.payload
        },
        pushRewards: (state, action: PayloadAction<RewardPreview[]>) => {
            state.rewards = [...state.rewards, ...action.payload]
        },
        resetRewards: (state) => {
            state.rewards = []
        },

        setFilteredRewards: (state, action: PayloadAction<RewardPreview[]>) => {
            state.filteredRewards = action.payload
        },
        pushFilteredRewards: (state, action: PayloadAction<RewardPreview[]>) => {
            state.filteredRewards = [...state.filteredRewards, ...action.payload]
        },
        resetFilteredRewards: (state) => {
            state.filteredRewards = []
        },

        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
            state.filteredRewards = []
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
            .addCase(fetchRewards.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchRewards.fulfilled, (state, action: PayloadAction<RewardPreview[]>) => {
                state.isLoading = false
                if (action.payload.length === 0) {
                    state.hasMore = false
                } else {
                    state.rewards = state.page === 0 ? action.payload : [...state.rewards, ...action.payload]
                    state.page += 1
                }
            })
            .addCase(fetchRewards.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        builder
            .addCase(fetchRewardsWithFilters.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchRewardsWithFilters.fulfilled, (state, action: PayloadAction<RewardPreview[]>) => {
                state.isLoading = false
                if (action.payload.length === 0) {
                    state.hasMore = false
                } else {
                    state.filteredRewards = state.filteredRewards ? action.payload : [...state.filteredRewards, ...action.payload]
                    state.page += 1
                }
            })
            .addCase(fetchRewardsWithFilters.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error as string
            })
    }
})

export const { 
    setRewards, pushRewards, resetRewards,
    setFilteredRewards, pushFilteredRewards, resetFilteredRewards,
    setSearchQuery,
    setLoading, setError,
} = rewardSlice.actions
export default rewardSlice.reducer