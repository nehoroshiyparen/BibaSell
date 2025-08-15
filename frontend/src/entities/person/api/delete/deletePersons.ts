import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import { personApiUrl } from ".."
import { requestWithRedux } from "src/shared/api/requests/requestWithRedux"

export const deletePersonsApi = async (ids: number[]) => {
    const ids_string = ids.map(id => String(id)).join(',')

    const req: ApiRequest<undefined, undefined> = {
        url: personApiUrl + '/delete',
        method: 'DELETE',
        params: { ids: ids_string }
    }

    return requestWithRedux<undefined, undefined>(req)
}