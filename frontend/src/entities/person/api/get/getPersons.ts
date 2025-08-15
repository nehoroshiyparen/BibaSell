import { request } from "src/shared/api"
import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import type { PersonPreview } from "../../model/types/PersonPreview"
import { personApiUrl } from ".."

export const getPersonsApi = async (offset: number, limit: number): Promise<PersonPreview[]> => {
    const req: ApiRequest<undefined, PersonPreview[]> = {
        url: personApiUrl + `/pagination?offset=${offset}&limit=${limit}`,
        method: 'GET',
    }

    return request<undefined, PersonPreview[]>(req)    
}