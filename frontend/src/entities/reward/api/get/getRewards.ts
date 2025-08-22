import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { RewardPreview } from "../../model/types/RewardPerview";
import { RewardApiUrl } from "..";
import { requestWithRedux } from "src/shared/api/requests/requestWithRedux";

export const getRewardsApi = async (offset: number, limit: number): Promise<RewardPreview[]> => {
    const req: ApiRequest<undefined, RewardPreview[]> = {
        url: RewardApiUrl + `/pagination?offset=${offset}&limit=${limit}`,
        method: 'GET',
    }

    return requestWithRedux<undefined, RewardPreview[]>(req)
}