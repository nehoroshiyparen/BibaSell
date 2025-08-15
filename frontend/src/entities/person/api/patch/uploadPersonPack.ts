import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { PersonAdvanced } from "../../model/types/PersonAdvanced";
import { personApiUrl } from "..";
import { requestWithRedux } from "src/shared/api/requests/requestWithRedux";

export const uploadPersonPackApi = async (pack: PersonAdvanced[]): Promise<undefined> => {
    const req: ApiRequest<PersonAdvanced[], undefined> = {
        url: personApiUrl + '/pack',
        method: 'PATCH',
        data: pack
    }

    return requestWithRedux<PersonAdvanced[], undefined>(req)
}