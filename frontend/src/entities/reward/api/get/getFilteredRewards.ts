import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { RewardFilters } from "../../model/types/RewardFilters";
import type { RewardPreview } from "../../model/types/RewardPerview";
import { RewardApiUrl } from "..";
import { requestWithRedux } from "src/shared/api/requests/requestWithRedux";

export const getFilteredRewardsApi = async (filters: RewardFilters): Promise<RewardPreview[]> => {
    const req: ApiRequest<RewardFilters, RewardPreview[]> = {
        url: RewardApiUrl + '/filtered',
        method: 'POST',
        data: filters
    }

    return requestWithRedux<RewardFilters, RewardPreview[]>(req)
}