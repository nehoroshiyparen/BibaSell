import type React from "react"
import type { ArticlePreview as ArticlePreviewType } from "../../model/types/ArticlePreview"

type ArticlePreviewProps = {
    article: ArticlePreviewType
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
    const date = new Date(article.publishedAt);

    const formatted = date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <div className="max-h-250 relative rounded-3xl border-2 border-at overflow-hidden group ">
            <div className="absolute z-10 w-full h-full flex items-end justify-start box-border p-10">
                <div className="flex flex-col gap-7 transition-transform translate-y-30 duration-500 group-hover:-translate-y-5">
                    <div>
                        <span className="text-4xl font-base text-text-secondary">
                        {article.title}
                        </span>
                    </div>

                    <div className="flex flex-col gap-7 opacity-0 translate-y-20 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <div>
                            <span className="text-2xl text-text-grey font-base-light font-bold">
                                {formatted} |
                                {article.authors.map(author => author.name).join(", ")}
                            </span>
                        </div>
                        <div className="flex gap-5 items-center">
                            <span className="font-base-light font-bold text-as text-2xl">
                                {`Подробнее ------>`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="
                absolute inset-0 
                bg-gradient-to-t from-black/70 to-transparent
                opacity-50
                transition-opacity duration-500
                group-hover:opacity-100
            "/>
            <div className="w-full h-full">
                <img 
                    src={article.preview} 
                    className="w-full h-full object-cover object-center opacity-0 transition-opacity duration-500"
                    onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                />
            </div>
        </div>
    )
}

export default ArticlePreview