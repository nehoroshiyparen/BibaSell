import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import type { ArticleAdvanced } from "../../model/types/ArticleAdvanced"
import { ArticleApiUrl } from ".."
import { request } from "src/shared/api"

export const getArticleByIdApi = (id: number) => {
    const req: ApiRequest<undefined, ArticleAdvanced> = {
        url: ArticleApiUrl + '/' + id,
        method: 'GET'
    }
    return request<undefined, ArticleAdvanced>(req)
}