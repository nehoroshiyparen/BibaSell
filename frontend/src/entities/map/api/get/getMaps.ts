import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { MapFilters } from "../../model/types/MapFilters";
import type { MapPreview } from "../../model/types/MapPreview";
import { MapApiUrl } from "..";
import { request } from "src/shared/api";

export const getMapsApi = async (offset: number, limit: number, filters?: MapFilters): Promise<MapPreview[]> => {
    const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        ...(filters ? Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
        ) : {})
    })
    const req: ApiRequest<undefined, MapPreview[]> = {
        url: `${MapApiUrl}?${params.toString()}`,
        method: 'GET'
    }
    const data = await request<undefined, MapPreview[]>(req)
    return data
}