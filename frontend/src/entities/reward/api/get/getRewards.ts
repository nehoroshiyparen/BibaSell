import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { RewardPreview } from "../../model/types/RewardPerview";
import { RewardApiUrl } from "..";
import { request } from "src/shared/api";
import type { RewardFilters } from "../../model/types/RewardFilters";

export const getRewardsApi = async (offset: number, limit: number, filters?: RewardFilters): Promise<RewardPreview[]> => {
    const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        ...(filters?.label ? { label: filters.label } : {})
    })

    const req: ApiRequest<undefined, RewardPreview[]> = {
        url: `${RewardApiUrl}?${params.toString()}`,
        method: 'GET',
    }

    const data = await request<undefined, RewardPreview[]>(req)
    return data
}