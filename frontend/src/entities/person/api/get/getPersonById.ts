import type { ApiRequest } from 'src/shared/api/types/ApiRequest'
import type { PersonAdvanced } from '../../model/types/PersonAdvanced'
import { PersonApiUrl } from '..'
import { requestWithRedux } from 'src/shared/api/requests/requestWithRedux'
import type { AppDispatch } from 'src/app/store'
import { request } from 'src/shared/api'

export const getPersonByIdApi = async (id: number, dispatch: AppDispatch): Promise<PersonAdvanced> => {
    const req: ApiRequest<undefined, PersonAdvanced> = {
        url: PersonApiUrl + '/' + id,
        method: 'GET',
    }
    
    return request<undefined, PersonAdvanced>(req)
}