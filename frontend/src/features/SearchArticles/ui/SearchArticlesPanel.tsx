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
        sortType
    } = useArticleState()

    const [isSubmitButtonAcitve, setIsSubmitButtonAcitve] = useState<boolean>(false)
    
    useEffect(() => {
        if (titleFilter || authorFilter || contentFilter || sortType !== SortTypes.none) {
            setIsSubmitButtonAcitve(true)
        } else {
            setIsSubmitButtonAcitve(false)
        }
    }, [titleFilter, authorFilter, contentFilter, sortType])

    return (
        <div className="flex justify-center">
            <div className="w-full max-h-auto box-border p-10 bg-ad rounded-2xl flex flex-col items-start gap-20">
                <div className="flex flex-col gap-10">
                    <SearchParamButton/>
                    <SearchSortButton/>
                </div>
                <button className={`box-border pl-6 pr-6 pt-4 pb-4 rounded-3xl border-2 ${isSubmitButtonAcitve ? 'bg-at border-as text-text cursor-pointer' : 'bg-ta border-ta text-text-grey-dim'} `}>
                    <span className='font-base text-4xl'>
                        Искать
                    </span>
                </button>
            </div>
        </div>
    )
}

export default SearchArticlesPanel