import type React from "react"
import type { ArticlePreview } from "src/entities/article/model/types/ArticlePreview"

type ArticleFeedParams = {
    articles: ArticlePreview[]
}

export const ArticleFeed: React.FC<ArticleFeedParams> = ({ articles }) => {
    return (
        <>
            <div className="">
                {articles.map(article => (
                    <div className="" key={article.id}/>
                ))}
            </div>
        </>
    )
}

export default ArticleFeed