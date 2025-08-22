import type { ApiRequest } from 'src/shared/api/types/ApiRequest'
import type { PersonAdvanced } from '../../model/types/PersonAdvanced'
import { PersonApiUrl } from '..'
import { requestWithRedux } from 'src/shared/api/requests/requestWithRedux'

export const getPersonByIdApi = async (id: number): Promise<PersonAdvanced> => {
    const req: ApiRequest<undefined, PersonAdvanced> = {
        url: PersonApiUrl,
        method: 'GET',
        params: { id }
    }
    
    return requestWithRedux<undefined, PersonAdvanced>(req)
}