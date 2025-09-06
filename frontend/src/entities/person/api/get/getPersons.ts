import { request } from "src/shared/api"
import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import type { PersonPreview } from "../../model/types/PersonPreview"
import { PersonApiUrl } from ".."

export const getPersonsApi = async (offset: number, limit: number): Promise<PersonPreview[]> => {
    const req: ApiRequest<undefined, PersonPreview[]> = {
        url: PersonApiUrl + `/pagination?offset=${offset}&limit=${limit}`,
        method: 'GET',
    }

    const data = await request<undefined, PersonPreview[]>(req)
    return data    
}