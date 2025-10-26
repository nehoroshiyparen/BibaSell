import { useEffect, useRef } from "react"
import { usePerson } from "src/entities/person/hooks/usePerson"
import SearchPeople from "src/features/SearchPeople/ui/SearchPeople"
import PersonFeed from "src/widgets/PersonFeed/PersonFeed"
import EmptyFeed from "../../../shared/ui/Feed/EmptyFeed"
import { useAppDispatch } from "src/app/store/hooks"
import FeedLoad from "../../../shared/ui/Feed/FeedLoad"
import { setLoading } from "src/entities/person/model"

const PersonFeedPage = () => {
    const dispatch = useAppDispatch()
    const { useLoad, useLoadWithFilters, usePersonState } = usePerson()
    
    const { persons, filteredPersons, hasMore, isLoading, searchQuery, page } = usePersonState()
    const bottomRef = useRef<HTMLDivElement | null>(null)

    let debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const loadData = async() => {
        if (!hasMore || isLoading) return

        if (searchQuery.trim() === '') {
            await useLoad(page)
        } else {
            await useLoadWithFilters({ name: searchQuery }, page)
        }
    }

    const debounceFilters = () => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        dispatch(setLoading(true))

        debounceTimer.current = setTimeout(async() => {
            useLoadWithFilters({name: searchQuery}, page)
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

    const hasFilter = searchQuery.trim() !== ''
    const isEmpty = hasFilter && filteredPersons.length === 0

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
                                    <PersonFeed persons={hasFilter ? filteredPersons : persons}/>
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