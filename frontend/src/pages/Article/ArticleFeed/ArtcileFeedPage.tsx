import { useEffect, useMemo, useRef } from "react"
import { useArticle } from "src/entities/article/hooks/useArticle"
import ArticleFeed from "src/features/ArticleFeed/ArticleFeed"
import FeedLoad from "src/shared/ui/Feed/FeedLoad"
import SearchArticlesPanel from "src/features/SearchArticles/ui/SearchArticlesPanel"
import type { ArticleFilters } from "src/entities/article/model/types/ArticleFilters"

const ArticleFeedPage = () => {
    const { useLoad, useArticleState } = useArticle()
    
    const { 
        articles,
        page,
        hasMore,
        isLoading,
        selectedTitleFilter,
        selectedAuthorFilter,
        selectedContentFilter,
    } = useArticleState()
    const bottomRef = useRef<HTMLDivElement | null>(null)

    const filters = useMemo<ArticleFilters>(() => ({
        title: selectedTitleFilter,
        authors: selectedAuthorFilter ? [selectedAuthorFilter] : [],
        extractedText: selectedContentFilter,
    }), [
        selectedTitleFilter,
        selectedAuthorFilter,
        selectedContentFilter
    ])

    const loadData = async() => {
        if (!hasMore || isLoading) return
        await useLoad({ offset: page, filters })
    }

    useEffect(() => {
        if (!bottomRef.current) return

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadData()
                }
            },
            { root: null, rootMargin: '200px', threshold: 0 }
        )

        observer.observe(bottomRef.current)

        return () => observer.disconnect()
    }, [bottomRef.current, page, hasMore])

    return (
        <div className="w-screen flex justify-center box-border pt-60">
            <div className="w-full pt-10 pl-30 pr-30 box-border flex gap-30 items-start relative">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-10 w-full">
                        <span className="text-[5em] font-base">СТАТЬИ</span>
                    </div>
                    <SearchArticlesPanel/>
                </div>
                <div className="flex-1 flex flex-col gap-10 items-start">
                    {
                        isLoading ? (
                            <FeedLoad/>
                        ) : (
                            <>
                                <ArticleFeed articles={articles}/>
                                {articles && <div ref={bottomRef} className="ref"/>}
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ArticleFeedPage