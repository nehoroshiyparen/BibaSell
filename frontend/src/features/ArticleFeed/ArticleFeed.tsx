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
        titleFilter, isTitleFilterEnabled,
        authorFilter, isAuthorFilterEnabled,
        contentFilter, isContentFilterEnabled
    } = useArticleState()
    
    const activeSearchParams = {
        titleFilter: {
            name: 'Название',
            param: titleFilter,
            isActive: isTitleFilterEnabled,
        },
        authorFilter: {
            name: 'Автор',
            param: authorFilter,
            isActive: isAuthorFilterEnabled,
        },
        contentFilter: {
            name: 'Содержание',
            param: contentFilter,
            isActive: isContentFilterEnabled,
        }
    }

    return (
        <div className="w-full flex flex-col gap-15">
            <FeedParamsPanel<ArticlePreviewType, typeof activeSearchParams> feedEntities={articles} params={activeSearchParams}/>
            <Masonry
                breakpointCols={breakpointColumns}
                className="flex gap-6"                  // контейнер колонок
                columnClassName="space-y-6"             // отступы между элементами
            >
                {articles.map(article => (
                    <ArticlePreview article={article}/>
                ))}
            </Masonry>
        </div>
    )
}

export default ArticleFeed