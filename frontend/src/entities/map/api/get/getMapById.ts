import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import type { MapAdvanced } from "../../model/types/MapAdvanced"
import { MapApiUrl } from ".."
import { request } from "src/shared/api"

export const getMapByIdApi = (id: number) => {
    const req: ApiRequest<undefined, MapAdvanced> = {
        url: MapApiUrl + '/' + id,
        method: 'GET'
    }
    return request<undefined, MapAdvanced>(req)
}