import type { ApiRequest } from "src/shared/api/types/ApiRequest"
import type { ArticleAdvanced } from "../../model/types/ArticleAdvanced"
import { ArticleApiUrl } from ".."
import { request } from "src/shared/api"

export const getArticleBySlugApi = (slug: string) => {
    const req: ApiRequest<undefined, ArticleAdvanced> = {
        url: ArticleApiUrl + '/slug/' + slug,
        method: 'GET'
    }

    return request<undefined, ArticleAdvanced>(req)
}