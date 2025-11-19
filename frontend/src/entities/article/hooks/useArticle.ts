import { useAppDispatch, useAppSelector } from "src/app/store/hooks";
import { fetchArticles } from "../model/article.thunks";
import type { RootState } from "src/app/store";
import { 
    setArticles,
    pushArticles,
    resetArticles,
    setSortType,
    setAuthorFilter,
    setTitleFilter,
    setContentFilter,
    setIsAuthorFilterEnabled,
    setIsTitleFilterEnabled,
    setIsContentFilterEnabled,
    setLoading,
    setError,
    setSelectedAuthorFilter,
    setSelectedContentFilter,
    setSelectedTitleFilter,
    setSelectedArticle,
    resetSelectedArticle,
} from "../model";
import type { ArticlePreview } from "../model/types/ArticlePreview";
import type { SortTypes } from "src/features/SearchArticles/types/SortTypes";
import type { ArticleFilters } from "../model/types/ArticleFilters";
import type { ArticleAdvanced } from "../model/types/ArticleAdvanced";

export function useArticle() {
    const dispatch = useAppDispatch()

    // Default limit = 10
    const useLoad = async(params: { offset: number, limit?: number, filters?: ArticleFilters }) => {
        try {
            await dispatch(fetchArticles({ page: params.offset, limit: params.limit, filters: params.filters }))
        } catch (e) {
            console.log(e)
        }
    }

    const useArticleState = () => {
        const articles = useAppSelector((state: RootState) => state.article.articles)
        const page = useAppSelector((state: RootState) => state.article.page)
        const hasMore = useAppSelector((state: RootState) => state.article.hasMore)
        const isLoading = useAppSelector((state: RootState) => state.article.isLoading)

        const sortType = useAppSelector((state: RootState) => state.article.sortType)
        const authorFilter = useAppSelector((state: RootState) => state.article.authorFilter)
        const titleFilter = useAppSelector((state: RootState) => state.article.titleFilter)
        const contentFilter = useAppSelector((state: RootState) => state.article.contentFilter)
        const isAuthorFilterEnabled = useAppSelector((state: RootState) => state.article.isAuthorFilterEnabled)
        const isTitleFilterEnabled = useAppSelector((state: RootState) => state.article.isTitleFilterEnabled)
        const isContentFilterEnabled = useAppSelector((state: RootState) => state.article.isContentFilterEnabled)
        const selectedAuthorFilter = useAppSelector((state: RootState) => state.article.selectedAuthorFilter)
        const selectedContentFilter = useAppSelector((state: RootState) => state.article.selectedContentFilter)
        const selectedTitleFilter = useAppSelector((state: RootState) => state.article.selectedTitleFilter)

        const selectedArticle = useAppSelector((state: RootState) => state.article.selectedArticle)

        const actions = {
            setArticles: (data: ArticlePreview[]) => dispatch(setArticles(data)),
            pushArticles: (data: ArticlePreview[]) => dispatch(pushArticles(data)),
            resetArticles: () => dispatch(resetArticles()),
            setSortType: (type: SortTypes) => dispatch(setSortType(type)),
            setAuthorFilter: (value: string) => dispatch(setAuthorFilter(value)),
            setTitleFilter: (value: string) => dispatch(setTitleFilter(value)),
            setContentFilter: (value: string) => dispatch(setContentFilter(value)),
            setIsAuthorFilterEnabled: (val: boolean) => dispatch(setIsAuthorFilterEnabled(val)),
            setIsTitleFilterEnabled: (val: boolean) => dispatch(setIsTitleFilterEnabled(val)),
            setIsContentFilterEnabled: (val: boolean) => dispatch(setIsContentFilterEnabled(val)),
            setSelectedAuthorFilter: (val: string) => dispatch(setSelectedAuthorFilter(val)),
            setSelectedContentFilter: (val: string) => dispatch(setSelectedContentFilter(val)),
            setSelectedTitleFilter: (val: string) => dispatch(setSelectedTitleFilter(val)),
            setSelectedArticle: (val: ArticleAdvanced) => dispatch(setSelectedArticle(val)),
            resetSelectedArticle: () => dispatch(resetSelectedArticle()),
            setLoading: (val: boolean) => dispatch(setLoading(val)),
            setError: (val: string | null) => dispatch(setError(val)),
        }

        return {
            articles,
            page,
            hasMore,
            isLoading,
            sortType,
            authorFilter,
            titleFilter,
            contentFilter,
            isAuthorFilterEnabled,
            isTitleFilterEnabled,
            isContentFilterEnabled,
            selectedAuthorFilter,
            selectedContentFilter,
            selectedTitleFilter,
            selectedArticle,

            ...actions
        }
    }

    return { useLoad, useArticleState }
}