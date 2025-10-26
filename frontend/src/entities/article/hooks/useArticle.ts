import { useAppDispatch, useAppSelector } from "src/app/store/hooks";
import { fetchArticles } from "../model/article.thunks";
import type { RootState } from "src/app/store";

export function useArticle() {
    const dispatch = useAppDispatch()

    const useLoad = async(page: number, limit?: number) => {
        try {
            await dispatch(fetchArticles({ page, limit }))
        } catch (e) {
            console.log(e)
        }
    }

    const useArticleState = () => {
        const articles = useAppSelector((state: RootState) => state.article.articles)
        const page = useAppSelector((state: RootState) => state.article.page)
        const hasMore = useAppSelector((state: RootState) => state.article.hasMore)
        const searchQuery = useAppSelector((state: RootState) => state.article.searchQuery)
        const isLoading = useAppSelector((state: RootState) => state.article.isLoading)

        return {
            articles,
            page,
            hasMore,
            searchQuery,
            isLoading
        }
    }

    return { useLoad, useArticleState }
}