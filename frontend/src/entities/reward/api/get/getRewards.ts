import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { RewardPreview } from "../../model/types/RewardPerview";
import { RewardApiUrl } from "..";
import { request } from "src/shared/api";

export const getRewardsApi = async (offset: number, limit: number): Promise<RewardPreview[]> => {
    const req: ApiRequest<undefined, RewardPreview[]> = {
        url: RewardApiUrl + `/?offset=${offset}&limit=${limit}`,
        method: 'GET',
    }

    const data = await request<undefined, RewardPreview[]>(req)

    console.log(data)
    return data
}