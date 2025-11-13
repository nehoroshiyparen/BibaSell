import { request } from "src/shared/api"
import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import type { PersonPreview } from "../../model/types/PersonPreview"
import { PersonApiUrl } from ".."
import type { PersonFilters } from "../../model/types/PersonFilters"

export const getPersonsApi = async (offset: number, limit: number, filters?: PersonFilters): Promise<PersonPreview[]> => {
    const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        ...(filters ? Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
        ) : {})
    })

    const req: ApiRequest<undefined, PersonPreview[]> = {
        url: `${PersonApiUrl}?${params.toString()}`,
        method: 'GET',
    }

    const data = await request<undefined, PersonPreview[]>(req)
    return data  
}