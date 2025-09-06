import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import type { PersonAdvanced } from "../../model/types/PersonAdvanced"
import { PersonApiUrl } from ".."
import { request } from "src/shared/api"

export const getPersonBySlugApi = async (slug: string): Promise<PersonAdvanced> => {
    const req: ApiRequest<undefined, PersonAdvanced> = {
        url: PersonApiUrl + '/slug/' + slug,
        method: 'GET',
    }
    
    return request<undefined, PersonAdvanced>(req)
}