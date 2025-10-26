import { useAppDispatch } from "src/app/store/hooks"
import MoreIcon from "src/assets/svg/MoreIcon/MoreIcon"
import SearchIcon from "src/assets/svg/SearchIcon/SearchIcon"
import { useArticle } from "src/entities/article/hooks/useArticle"
import { setSearchQuery } from "src/entities/article/model"

export const SearchArticles = () => {
    const dispatch = useAppDispatch()
    const { useArticleState } = useArticle()
    const { searchQuery } = useArticleState()

    return (
        <div 
            className="w-full rounded-[3em] bg-bg-dim box-border p-10 flex gap-15 items-center h-40"
            style={{boxShadow: "0 0 30px rgba(0,0,0,0.1)"}}
        >
            <form className="h-full flex-1 rounded-full bg-ta border-solid border-[3px] border-at box-border p-1 pl-4 pr-4 flex gap-5 items-center">
                <SearchIcon size={'3.5rem'} color="var(--color-at)"/>
                <input 
                    id="ArticleSearch"
                    name="ArticleSearch"
                    type="text"
                    placeholder="..."
                    className="text-3xl text-ts font-base flex-1 h-full outline-none placeholder-at"
                    value={searchQuery}
                    onChange={e => dispatch(setSearchQuery(e.target.value))}
                />
            </form>
            <button className="h-full rounded-4xl bg-ta box-border p-5 flex gap-1 items-center cursor-pointer">
                <span className="font-base text-4xl">
                    Сортировать
                </span>
                <MoreIcon size={'24px'} strokeWidth={48}/>
            </button>
            <button className="h-full rounded-4xl bg-ta box-border p-5 flex gap-1 items-center cursor-pointer">
                <span className="font-base text-4xl">
                    Фильтры
                </span>
                <MoreIcon size={'24px'} strokeWidth={48}/>
            </button>
        </div>
    )
}

export default SearchArticles