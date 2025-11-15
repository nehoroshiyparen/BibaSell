import Masonry from "react-masonry-css"
import type { ArticlePreview as ArticlePreviewType } from "src/entities/article/model/types/ArticlePreview"
import ArticlePreview from "src/entities/article/ui/ArticlePreview/ArticlePreview"
import FeedParamsPanel from "../FeedParamsPanel/FeedParamsPanel"
import { useArticle } from "src/entities/article/hooks/useArticle"
import EmptyFeed from "src/shared/ui/Feed/EmptyFeed"

type ArticleFeedParams = {
    articles: ArticlePreviewType[]
}

const ArticleFeed = ({ articles }: ArticleFeedParams) => {
    const breakpointColumns = {
        default: 5,
        3440: 5,
        2560: 4,
        1920: 4,
        1680: 3,
        1280: 2
    }

    const { useArticleState } = useArticle()
    const {
        isLoading,
        setTitleFilter, selectedTitleFilter, isTitleFilterEnabled, setSelectedTitleFilter,
        setAuthorFilter, selectedAuthorFilter, isAuthorFilterEnabled, setSelectedAuthorFilter,
        setContentFilter, selectedContentFilter, isContentFilterEnabled, setSelectedContentFilter
    } = useArticleState()

    const hasFilters = !!(
        selectedTitleFilter ||
        selectedAuthorFilter ||
        selectedContentFilter
    )

    const isEmpty = hasFilters && !isLoading && articles.length === 0
    
    const activeSearchParams = {
        titleFilter: {
            name: 'Название',
            param: selectedTitleFilter,
            isActive: isTitleFilterEnabled,
            clearFunc: (s: string) => { setSelectedTitleFilter(s); setTitleFilter(s) }
        },
        authorFilter: {
            name: 'Автор',
            param: selectedAuthorFilter,
            isActive: isAuthorFilterEnabled,
            clearFunc: (s: string) => { setSelectedAuthorFilter(s); setAuthorFilter(s) }
        },
        contentFilter: {
            name: 'Содержание',
            param: selectedContentFilter,
            isActive: isContentFilterEnabled,
            clearFunc: (s: string) => { setSelectedContentFilter(s); setContentFilter(s) },
        }
    }

    return (
        <div className="w-full flex flex-col gap-15">
            <FeedParamsPanel<ArticlePreviewType, typeof activeSearchParams> feedEntities={articles} params={activeSearchParams}/>
            {isEmpty ? (
                <EmptyFeed />
            ) : (
                <Masonry
                    breakpointCols={breakpointColumns}
                    className="flex gap-6"
                    columnClassName="space-y-6"
                >
                    {articles.map(article => (
                        <ArticlePreview article={article}/>
                    ))}
                </Masonry>
            )}
        </div>
    )
}

export default ArticleFeed