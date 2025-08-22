import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { RewardAdvanced } from "../../model/types/RewardAdvanced";
import { RewardApiUrl } from "..";
import { requestWithRedux } from "src/shared/api/requests/requestWithRedux";

export const getRewardByIdApi = async (id: number): Promise<RewardAdvanced> => {
    const req: ApiRequest<number, RewardAdvanced> = {
        url: RewardApiUrl,
        method: 'GET',
        params: { id }
    }

    return requestWithRedux<number, RewardAdvanced>(req)
}