import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { PersonPreview } from "../../model/types/PersonPreview";
import { request } from "src/shared/api";
import { PersonApiUrl } from "..";
import type { PersonFilters } from "../../model/types/PersonFilters";
import { ConfigureQuery } from "src/shared/api/utils/ConfigureQuery";

 // Есть сомнения, куда класть эту функцию, тк на самом деле это POST запрос, но
 // он используется для получения данных. Ну и я склоняюсь к тому, что лучше оставить
 // его в папке get, тк он все же служит для получения данных 
export const getFilteredPersonsApi = async (filters: PersonFilters, offset: number = 0, limit: number = 10): Promise<PersonPreview[]> => {
    const query = ConfigureQuery({ offset, limit })

    const req: ApiRequest<PersonFilters, PersonPreview[]> = {
        url: `${PersonApiUrl}/filtered${query}`,
        method: 'POST',
        data: filters
    }

    return request<PersonFilters, PersonPreview[]>(req)
}