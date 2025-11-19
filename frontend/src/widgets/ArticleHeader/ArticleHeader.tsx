import { Link } from "react-router-dom"
import { useArticle } from "src/entities/article/hooks/useArticle"

const ArticleHeader = () => {
    const { useArticleState } = useArticle()
        const {
            selectedArticle
        } = useArticleState()

    return (
        <div className="bg-article-header-bg h-120 w-full flex flex-col justify-between box-border p-20 pt-10 pb-10 items-start">
            <Link to={`../articles`} className="cursor-poiner box-border p-5 rounded-2xl bg-bg">
                <span className="text-4xl font-base-light font-bold">
                    {`<------------- Вернуться`}
                </span>
            </Link>
            <div className="">
                <span className="text-[9rem] text-text-secondary font-base">
                    {selectedArticle?.title}
                </span>
            </div>
        </div>
    )
}

export default ArticleHeader