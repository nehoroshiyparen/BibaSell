import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { ArticlePreview } from "../../model/types/ArticlePreview";
import { ArticleApiUrl } from "..";
import { request } from "src/shared/api";

export const getArticlesApi = async (offset: number, limit: number): Promise<ArticlePreview[]> => {
    const req: ApiRequest<undefined, ArticlePreview[]> = {
        url: ArticleApiUrl + `?offset=${offset}&limit=${limit}`,
        method: 'GET',
    }

    const data = await request<undefined, ArticlePreview[]>(req)
    return data
}