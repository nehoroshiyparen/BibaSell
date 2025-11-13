import { useAppDispatch } from "src/app/store/hooks";
import { fetchRewards } from "../model/reward.thunks";
import type { RewardFilters } from "../model/types/RewardFilters";

export function useRewards() {
    const dispatch = useAppDispatch()

    const load = async(params: { page: number, limit?: number, filters?: RewardFilters }) => {
        try {
            await dispatch(fetchRewards({ page: params.page, limit: params.limit, filters: params.filters}))
        } catch (e) {
            console.log(e)
        }
    }

    return { load }
}