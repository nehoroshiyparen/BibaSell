import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { PersonAdvanced } from "../../model/types/PersonAdvanced";
import { PersonApiUrl } from "..";
import { requestWithRedux } from "src/shared/api/requests/requestWithRedux";

export const uploadPersonPackApi = async (pack: PersonAdvanced[]): Promise<void> => {
    const req: ApiRequest<PersonAdvanced[], void> = {
        url: PersonApiUrl + '/pack',
        method: 'PATCH',
        data: pack
    }

    return requestWithRedux<PersonAdvanced[], void>(req)
}