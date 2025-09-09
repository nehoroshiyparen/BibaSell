import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { RewardFilters } from "../../model/types/RewardFilters";
import type { RewardPreview } from "../../model/types/RewardPerview";
import { RewardApiUrl } from "..";
import { ConfigureQuery } from "src/shared/api/utils/ConfigureQuery";
import { request } from "src/shared/api";

export const getFilteredRewardsApi = async (filters: RewardFilters, offset: number = 0, limit: number = 10): Promise<RewardPreview[]> => {
    const query = ConfigureQuery({ offset, limit })

        console.log(offset, limit, query)

    const req: ApiRequest<RewardFilters, RewardPreview[]> = {
        url: `${RewardApiUrl}/filtered${query}`,
        method: 'POST',
        data: filters
    }

    return request<RewardFilters, RewardPreview[]>(req)
}