import type { ApiRequest } from "src/shared/api/types/ApiRequest";
import type { ArticlePreview } from "../../model/types/ArticlePreview";
import { ArticleApiUrl } from "..";
import { request } from "src/shared/api";
import type { ArticleFilters } from "../../model/types/ArticleFilters";

export const getArticlesApi = async (offset: number, limit: number, filters?: ArticleFilters): Promise<ArticlePreview[]> => {
    const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        ...(filters ? Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
        ) : {})
    })

    const req: ApiRequest<undefined, ArticlePreview[]> = {
            url: `${ArticleApiUrl}?${params.toString()}`,
            method: 'GET',
        }

    const data = await request<undefined, ArticlePreview[]>(req)
    return data
}