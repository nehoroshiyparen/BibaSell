import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RewardPreview } from "./types/RewardPerview";

const initialState: RewardPreview[] = []

const rewardSlice = createSlice({
    name: 'reward',
    initialState,
    reducers: {
        setRewards: (_, action: PayloadAction<RewardPreview[]>) => { return action.payload },
        pushRewards: (state, action: PayloadAction<RewardPreview[]>) => { return [...state, ...action.payload]},
        resetRewards: (_) => { return [] }
    }
})

export const { setRewards, pushRewards, resetRewards } = rewardSlice.actions
export default rewardSlice.reducer