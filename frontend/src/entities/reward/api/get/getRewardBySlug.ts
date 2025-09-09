import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import { RewardApiUrl } from ".."
import { request } from "src/shared/api"
import type { RewardAdvanced } from "../../model/types/RewardAdvanced"

export const getRewardBySlugApi = (slug: string): Promise<RewardAdvanced> => {
    const req: ApiRequest<undefined, RewardAdvanced> = {
        url: `${RewardApiUrl}/slug/${slug}`,
        method: 'GET',
    }

    return request<undefined, RewardAdvanced>(req)
}