import Masonry from "react-masonry-css"
import type { ArticlePreview as ArticlePreviewType } from "src/entities/article/model/types/ArticlePreview"
import ArticlePreview from "src/entities/article/ui/ArticlePreview/ArticlePreview"
import FeedParamsPanel from "../FeedParamsPanel/FeedParamsPanel"
import { useArticle } from "src/entities/article/hooks/useArticle"

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
        selectedTitleFilter, isTitleFilterEnabled, setSelectedTitleFilter,
        selectedAuthorFilter, isAuthorFilterEnabled, setSelectedAuthorFilter,
        selectedContentFilter, isContentFilterEnabled, setSelectedContentFilter
    } = useArticleState()
    
    const activeSearchParams = {
        titleFilter: {
            name: 'Название',
            param: selectedTitleFilter,
            isActive: isTitleFilterEnabled,
            clearFunc: setSelectedTitleFilter,
        },
        authorFilter: {
            name: 'Автор',
            param: selectedAuthorFilter,
            isActive: isAuthorFilterEnabled,
            clearFunc: setSelectedAuthorFilter
        },
        contentFilter: {
            name: 'Содержание',
            param: selectedContentFilter,
            isActive: isContentFilterEnabled,
            clearFunc: setSelectedContentFilter,
        }
    }

    return (
        <div className="w-full flex flex-col gap-15">
            <FeedParamsPanel<ArticlePreviewType, typeof activeSearchParams> feedEntities={articles} params={activeSearchParams}/>
            <Masonry
                breakpointCols={breakpointColumns}
                className="flex gap-6"
                columnClassName="space-y-6"
            >
                {articles.map(article => (
                    <ArticlePreview article={article}/>
                ))}
            </Masonry>
        </div>
    )
}

export default ArticleFeed