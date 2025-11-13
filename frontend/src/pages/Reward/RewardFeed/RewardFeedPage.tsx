import { useEffect, useRef } from "react"
import type { RootState } from "src/app/store"
import { useAppDispatch, useAppSelector } from "src/app/store/hooks"
import { useRewards } from "src/entities/reward/hooks/useRewards"
import { setLoading } from "src/entities/reward/model"
import SearchRewards from "src/features/SearchRewards/SearchRewards"
import EmptyFeed from "src/shared/ui/Feed/EmptyFeed"
import FeedLoad from "src/shared/ui/Feed/FeedLoad"
import RewardFeed from "src/features/RewardsFeed/RewardFeed"

const RewardFeedPage = () => {
    const { load, loadWithFilters } = useRewards()

    const dispatch = useAppDispatch()
    const rewards = useAppSelector((state: RootState) => state.reward.rewards)
    const filteredRewards = useAppSelector((state: RootState) => state.reward.filteredRewards)
    const page = useAppSelector((state: RootState) => state.reward.page)
    const hasMore = useAppSelector((state: RootState) => state.reward.hasMore)
    const searchQuery = useAppSelector((state: RootState) => state.reward.searchQuery)
    const isLoading = useAppSelector((state: RootState) => state.reward.isLoading)

    const hasFilter = searchQuery.trim() !== ''
    const isEmpty = hasFilter && filteredRewards.length === 0

    const bottomRef = useRef<HTMLDivElement | null>(null)
    let debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const loadData = async() => {
        if (!hasMore || isLoading) return

        if (searchQuery.trim() === '') {
            await load(page)
        } else {
            await loadWithFilters({ label: searchQuery }, page)
        }
    }

    const debounceFilters = () => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        dispatch(setLoading(true))

        debounceTimer.current = setTimeout(async() => {
            loadWithFilters({label: searchQuery}, page)
        }, 1000)
    }

    useEffect(() => {
        if (searchQuery !== '') {
            debounceFilters()
        }
    }, [searchQuery])

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
            <div className="w-full box-border pl-70 pr-70">
                <div className="flex flex-col gap-20 box-border pt-25 items-center">
                    <SearchRewards/>

                    {isLoading ? (
                            <FeedLoad/>
                        ) : (
                            isEmpty ? (
                                <EmptyFeed searchQuery={searchQuery}/>
                            ) : (
                                <>
                                    <RewardFeed rewards={hasFilter ? filteredRewards : rewards}/>
                                    {rewards && <div ref={bottomRef}/>}
                                </>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default RewardFeedPage