import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import type { MapAdvanced } from "../../model/types/MapAdvanced"
import { MapApiUrl } from ".."
import { request } from "src/shared/api"

export const getMapBySlugApi = (slug: string) => {
    const req: ApiRequest<undefined, MapAdvanced> = {
        url: MapApiUrl + '/slug' + slug,
        method: 'GET'
    }
    return request<undefined, MapAdvanced>(req)
}