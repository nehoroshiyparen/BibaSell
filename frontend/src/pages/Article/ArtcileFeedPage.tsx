import { useEffect, useRef } from "react"
import { useArticle } from "src/entities/article/hooks/useArticle"
import ArticleFeed from "src/widgets/ArticleFeed/ArticleFeed"
import SideMenu from "./ui/SideMenu"
import SearchArticles from "src/features/SearchArticles/ui/SearchArticles"
import FeedLoad from "src/shared/ui/Feed/FeedLoad"
import EmptyFeed from "src/shared/ui/Feed/EmptyFeed"

const ArticleFeedPage = () => {
    const { useLoad, useArticleState } = useArticle()
    
    const { articles, page, hasMore, isLoading, isFilterActive } = useArticleState()
    const bottomRef = useRef<HTMLDivElement | null>(null)

    const isEmpty = isFilterActive && articles.length === 0

    const loadData = async() => {
        if (!hasMore || isLoading) return
        await useLoad(page)
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
    }, [bottomRef.current, page, hasMore, isFilterActive])

    return (
        <div className="w-screen flex justify-center">
            <div className="w-full pt-10 pl-30 pr-30 box-border flex gap-30">
                <SideMenu/>
                <div className="flex-1">
                    <div className="flex flex-col gap-10 w-full">
                        <span className="text-[5em] font-base">СТАТЬИ</span>
                        <SearchArticles/>
                    </div>
                    {
                        isLoading ? (
                            <FeedLoad/>
                        ) : (
                            isEmpty ? (
                                 <EmptyFeed />
                            ) : (
                                <>
                                    <ArticleFeed articles={articles}/>
                                    {articles && <div ref={bottomRef} className="ref"/>}
                                </>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ArticleFeedPage