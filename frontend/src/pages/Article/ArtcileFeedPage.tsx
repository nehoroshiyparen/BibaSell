import { useEffect, useRef } from "react"
import { useAppDispatch } from "src/app/store/hooks"
import { useArticle } from "src/entities/article/hooks/useArticle"
import ArticleFeed from "src/widgets/ArticleFeed/ArticleFeed"
import SideMenu from "./ui/SideMenu"
import SearchArticles from "src/features/SearchArticles/ui/SearchArticles"

const ArticleFeedPage = () => {
    const dispatch = useAppDispatch()
    const { useLoad, useArticleState } = useArticle()
    
    const { articles, page, hasMore, isLoading, searchQuery } = useArticleState()
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const hasFilter = searchQuery.trim() !== ''
    const isEmpty = hasFilter && articles.length === 0

    const loadData = async() => {
        if (!hasMore || isLoading) return

        if (searchQuery.trim() === '') {
            await useLoad(page)
        }
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
    }, [bottomRef.current, page, hasMore, searchQuery])

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
                            null
                        ) : (
                            isEmpty ? (
                                'жопа'
                            ) : (
                                <>
                                    <ArticleFeed articles={articles}/>
                                    {articles && <div ref={bottomRef}/>}
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