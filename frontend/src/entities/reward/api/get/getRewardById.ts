import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { RewardAdvanced } from "../../model/types/RewardAdvanced";
import { RewardApiUrl } from "..";
import { request } from "src/shared/api";

export const getRewardByIdApi = async (id: number): Promise<RewardAdvanced> => {
    const req: ApiRequest<number, RewardAdvanced> = {
        url: RewardApiUrl,
        method: 'GET',
        params: { id }
    }

    return request<number, RewardAdvanced>(req)
}