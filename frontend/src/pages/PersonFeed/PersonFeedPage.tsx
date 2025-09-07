import { useEffect, useRef } from "react"
import { usePersons } from "src/entities/person/hooks/usePersons"
import SearchPeople from "src/features/SearchPeople/ui/SearchPeople"
import PersonFeed from "src/widgets/PersonFeed/PersonFeed"
import EmptyFeed from "./components/EmptyFeed"
import { useAppDispatch, useAppSelector } from "src/app/store/hooks"
import type { RootState } from "src/app/store"
import FeedLoad from "./components/FeedLoad"
import { setLoading } from "src/entities/person/model"
import { startLoading, stopLoading } from "src/app/store/slices/loader.slice"

const PersonFeedPage = () => {
    const dispatch = useAppDispatch()
    const { load, loadWithFilters } = usePersons()

    const persons = useAppSelector((state: RootState) => state.person.persons)
    const filteredPersons = useAppSelector((state: RootState) => state.person.filteredPersons)
    const page = useAppSelector((state: RootState) => state.person.page)
    const hasMore = useAppSelector((state: RootState) => state.person.hasMore) 
    const searchQuery = useAppSelector((state: RootState) => state.person.searchQuery)
    const isLoading = useAppSelector((state: RootState) => state.person.isLoading)
    
    const loadingRef = useRef(false)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    let debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const loadMore = async() => {
        if (!hasMore || isLoading) return

        if (searchQuery.trim() === '') {
            await load(page)
        } else {
            await loadWithFilters({ name: searchQuery }, page)
        }
    }

    const debounceFilters = () => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        dispatch(setLoading(true))

        debounceTimer.current = setTimeout(async() => {
            loadWithFilters({name: searchQuery}, page)
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
                    loadMore()
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