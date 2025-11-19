import { useArticle } from "src/entities/article/hooks/useArticle"
import SearchParamButton from "./buttons/SearchParamButton"
import SearchSortButton from "./buttons/SearchSortButton"
import { useEffect, useState } from "react"
import { SortTypes } from "../types/SortTypes"

const SearchArticlesPanel = () => {
    const { useArticleState } = useArticle()
    const {
        titleFilter,
        authorFilter,
        contentFilter,
        sortType,
        setSelectedAuthorFilter,
        setSelectedContentFilter,
        setSelectedTitleFilter
    } = useArticleState()

    const [isSubmitButtonAcitve, setIsSubmitButtonAcitve] = useState<boolean>(false)
    
    useEffect(() => {
        if (titleFilter || authorFilter || contentFilter || sortType !== SortTypes.none) {
            setIsSubmitButtonAcitve(true)
        } else {
            setIsSubmitButtonAcitve(false)
        }
    }, [titleFilter, authorFilter, contentFilter, sortType])

    const applyFilters = () => {
        if (isSubmitButtonAcitve) {
            setSelectedAuthorFilter(authorFilter)
            setSelectedContentFilter(contentFilter)
            setSelectedTitleFilter(titleFilter)
        }
    }


    return (
        <div className="flex justify-center">
            <div className="w-full max-h-auto box-border p-10 bg-accent-dim rounded-2xl flex flex-col items-start gap-20">
                <div className="flex flex-col gap-10">
                    <SearchParamButton/>
                    <SearchSortButton/>
                </div>
                <button 
                    className={
                        `box-border pl-6 pr-6 pt-4 pb-4 rounded-3xl border-2 
                        ${isSubmitButtonAcitve ? 'bg-accent-third border-accent-secondary text-text cursor-pointer' : 
                        'bg-accent-first border-accent-first text-text-grey-dim'} `}
                    onClick={applyFilters}
                >
                    <span className='font-base text-4xl'>
                        Искать
                    </span>
                </button>
            </div>
        </div>
    )
}

export default SearchArticlesPanel