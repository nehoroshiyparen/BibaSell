import type React from "react"
import type { ArticleAdvanced as ArticleAdvancedType } from "../../model/types/ArticleAdvanced"
import PdfViewer from "src/features/PdfViewer/PdfViewer"

type ArticleAdvancedProps = {
    article: ArticleAdvancedType
}

const ArticleAdvanced: React.FC<ArticleAdvancedProps> = ({ article }) => {
    const date = new Date(article.publishedAt);

    const formatted = date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <div className="flex flex-col gap-15 w-full">
            <div className="flex gap-10 w-full box-border pl-20 pt-10 pr-20">
                <div className="box-border p-8 min-w-150 w-[25%] flex flex-col gap-5 border-2 border-accent-third rounded-2xl">
                    <span className="text-3xl font-base-light font-bold">
                        <b className="font-base">Авторы: </b>{article.authors.length ? article.authors.map(author => author.name).join(', ') : 'Авторы не указаны'}
                    </span>
                    <span className="text-3xl font-base-light font-bold">
                        <b className="font-base">Дата публикации: </b>{formatted}
                    </span>
                </div>
                <div className="flex flex-col gap-10 box-border pt-5">
                    <div>
                        <span className="font-base-light font-bold text-3xl">
                            Понравилась статья? Скачайте ее для подробного изучения
                        </span>
                    </div>
                    <div className="flex gap-10 items-center">
                        <button className="box-border p-5 rounded-3xl cursor-pointer bg-article-header-bg border-2 border-article-header-bg transition-colors transition-300 hover:bg-accent-secondary">
                            <span className="font-base-light font-bold text-3xl text-text-secondary">Скачать статью</span>
                        </button>
                        <img src="/images/articles/arrow_to_button.png"/>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center items-stretch">
                <img
                    src="/images/articles/left_line.png"
                    className="max-h-full object-contain flex-shrink-0 hidden sm:block"
                />
                <PdfViewer url={article.key} />
                <img
                    src="/images/articles/right_line.png"
                    className="max-h-full object-contain flex-shrink-0 hidden sm:block"
                />
            </div>
        </div>
    )
}

export default ArticleAdvanced