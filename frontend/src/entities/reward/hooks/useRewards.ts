import { useAppDispatch } from "src/app/store/hooks";
import { fetchRewards, fetchRewardsWithFilters } from "../model/reward.thunks";
import type { RewardFilters } from "../model/types/RewardFilters";

export function useRewards() {
    const dispatch = useAppDispatch()

    const load = async(page: number, limit?: number) => {
        try {
            await dispatch(fetchRewards({ page, limit }))
        } catch (e) {
            console.log(e)
        }
    }

    const loadWithFilters = async(filters: RewardFilters, page: number, limit?: number) => {
        try {
            await dispatch(fetchRewardsWithFilters({ filters, page, limit }))
        } catch (e) {
            console.log(e)
        }
    }

    return { load, loadWithFilters }
}