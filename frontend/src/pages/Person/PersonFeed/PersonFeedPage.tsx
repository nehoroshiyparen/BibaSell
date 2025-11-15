import { useEffect, useRef } from "react"
import { usePerson } from "src/entities/person/hooks/usePerson"
import SearchPeople from "src/features/SearchPeople/ui/SearchPeople"
import PersonFeed from "src/features/PersonFeed/PersonFeed"
import EmptyFeed from "../../../shared/ui/Feed/EmptyFeed"
import { useAppDispatch } from "src/app/store/hooks"
import FeedLoad from "../../../shared/ui/Feed/FeedLoad"
import { setLoading } from "src/entities/person/model"

const PersonFeedPage = () => {
    const dispatch = useAppDispatch()
    const { useLoad, usePersonState } = usePerson()
    
    const { persons, hasMore, isLoading, searchQuery, page } = usePersonState()
    const bottomRef = useRef<HTMLDivElement | null>(null)

    let debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const loadData = async() => {
        if (!hasMore || isLoading) return

        const filters = searchQuery.trim() ? { name: searchQuery.trim() } : {}
        await useLoad({ page, filters })
    }

    const debounceFilters = () => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        dispatch(setLoading(true))

        debounceTimer.current = setTimeout(async () => {
            const filters = searchQuery.trim() ? { name: searchQuery.trim() } : {}
            await useLoad({ page, filters })
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
                    setTimeout(() => loadData(), 20)
                }
            },
            { root: null, rootMargin: '200px', threshold: 0 }
        )

        observer.observe(bottomRef.current)

        return () => observer.disconnect()
    }, [bottomRef.current, page, hasMore, searchQuery])

    const hasFilter = searchQuery.trim() !== ''
    const isEmpty = hasFilter && persons.length === 0

    console.log(persons)

    return (
        <div className="w-screen flex justify-center">
            <div className="w-full box-border pl-70 pr-70">
                <div className="flex flex-col gap-20 box-border pt-25 items-center">
                    <SearchPeople/>
                    
                    {isLoading ? (
                        <FeedLoad/>
                        ) : (
                            isEmpty ? (
                                <EmptyFeed searchQuery={searchQuery}/>
                            ) : (
                                <>
                                    <PersonFeed persons={persons}/>
                                    {persons && <div ref={bottomRef}/>}
                                </>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default PersonFeedPage