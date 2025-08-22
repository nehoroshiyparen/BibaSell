import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { PersonPreview } from "../../model/types/PersonPreview";
import { request } from "src/shared/api";
import { PersonApiUrl } from "..";
import type { PersonFilters } from "../../model/types/PersonFilters";

 // Есть сомнения, куда класть эту функцию, тк на самом деле это POST запрос, но
 // он используется для получения данных. Ну и я склоняюсь к тому, что лучше оставить
 // его в папке get, тк он все же служит для получения данных 
export const getFilteredPersonsApi = async (filters: PersonFilters): Promise<PersonPreview[]> => {
    const req: ApiRequest<PersonFilters, PersonPreview[]> = {
        url: PersonApiUrl + 'filtered',
        method: 'POST',
        data: filters
    }

    return request<PersonFilters, PersonPreview[]>(req)
}