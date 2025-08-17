import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { RewardAdvanced } from "../../model/types/RewardAdvanced";
import { RewardApiUrl } from "..";
import { requestWithRedux } from "src/shared/api/requests/requestWithRedux";

export const uploadRewardPackApi = async (pack: RewardAdvanced[]): Promise<void> => {
    const req: ApiRequest<RewardAdvanced[], void> = {
        url: RewardApiUrl + '/pack',
        method: 'PATCH',
        data: pack
    }

    return requestWithRedux<RewardAdvanced[], void>(req)
}