import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import { RewardApiUrl } from ".."
import { requestWithRedux } from "src/shared/api/requests/requestWithRedux"

export const bulkDeleteRewardsApi = async (ids: number[]): Promise<void> => {
    const ids_string = ids.map(String).join(',')

    const req: ApiRequest<undefined, void> = {
        url: RewardApiUrl + '/pack',
        method: 'DELETE',
        params: { ids: ids_string }
    }

    return requestWithRedux<undefined, void>(req)
}