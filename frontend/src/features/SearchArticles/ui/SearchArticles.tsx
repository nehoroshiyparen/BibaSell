import { useEffect, useRef, useState } from "react"
import MoreIcon from "src/assets/svg/MoreIcon/MoreIcon"
import SearchIcon from "src/assets/svg/SearchIcon/SearchIcon"
import { useArticle } from "src/entities/article/hooks/useArticle"
import { SortTypes } from "../types/SortTypes"
import '../style/highlightedBackground.css'
import SortButton from "./buttons/sortButton"
import FilterButton from "./buttons/FilterButton"

export const SearchArticles = () => {
    const { useArticleState } = useArticle()
    const { 
        sortType,
        contentFilter,
        authorFilter, 
        titleFilter, 
        setIsFilterActive
    } = useArticleState()

    const [isSortOpen, setIsSortOpen] = useState<boolean>(false)
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)

    const someFilters = Boolean(
        sortType !== SortTypes.none ||
        contentFilter ||
        authorFilter ||
        titleFilter
    )

    return (
        <div 
            className="w-full rounded-[3em] bg-bg-dim box-border p-10 flex gap-15 items-center h-40 relative"
            style={{boxShadow: "0 0 30px rgba(0,0,0,0.1)"}}
        >
            <SortButton isSortOpen={isSortOpen} setIsSortOpen={setIsSortOpen} setIsFiltersOpen={setIsFiltersOpen}/>
            <FilterButton isFiltersOpen={isFiltersOpen} setIsFiltersOpen={setIsFiltersOpen} setIsSortOpen={setIsSortOpen}/>
            <div className="h-full">
                <button 
                    className="h-full aspect-square bg-as flex items-center justify-center rounded-[50%] cursor-pointer border-2 border-at"
                    onClick={() => setIsFilterActive()}
                >
                    <SearchIcon size={'4rem'} color="var(--color-ta)"/>
                </button>
            </div>
            {someFilters &&
                <div className="">
                    жопа
                </div>
            }
        </div>
    )
}

export default SearchArticles