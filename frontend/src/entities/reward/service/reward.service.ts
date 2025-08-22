import { store } from "src/app/store"
import { bulkDeleteRewardsApi, getFilteredRewardsApi, getRewardByIdApi, getRewardsApi, bulkCreateRewardsApi } from "../api"
import type { RewardAdvanced } from "../model/types/RewardAdvanced"
import type { RewardFilters } from "../model/types/RewardFilters"
import { pushRewards, setRewards } from "../model"

export const getRewardById = async (id: number) => {
    const reward = await getRewardByIdApi(id)
    return reward
}

export const getRewards = async (offset: number, limit: number) => {
    const state = store.getState()
    const rewards = state.reward

    const fetchedRewards = await getRewardsApi(offset, limit)

    if (!rewards) {
        store.dispatch(setRewards(fetchedRewards))
    } else {
        store.dispatch(pushRewards(fetchedRewards))
    }

    return fetchedRewards
}

export const getFilteredRewards = async (filters: RewardFilters) => {
    const filteredRewards = await getFilteredRewardsApi(filters)

    store.dispatch(setRewards(filteredRewards))

    return filteredRewards
}

export const bulkCreateRewards = async (pack: RewardAdvanced[]) => {
    await bulkCreateRewardsApi(pack)
}

export const deleteRewads = async (ids: number[]) => {
    await bulkDeleteRewardsApi(ids)
}