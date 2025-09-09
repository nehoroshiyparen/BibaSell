import type { RootState } from "src/app/store"
import { useAppDispatch, useAppSelector } from "src/app/store/hooks"
import SearchIcon from "src/assets/svg/SearchIcon/SearchIcon"
import { setSearchQuery } from "src/entities/reward/model"

const SearchRewards = () => {
    const dispatch = useAppDispatch()
    const searchQuery = useAppSelector((state: RootState) => state.reward.searchQuery)

    return (
        <div className="flex-col gap-12 w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] flex box-border pl-10 pr-10">
            <div className="_big-p text-center">
                НАГРАДЫ
            </div>
            <div className="text-center text-text text-[2.8rem] font-base">
                Введите название награды для поиска
            </div>
            <form 
                className="w-full rounded-full bg-ta border-solid border-[3px] border-at box-border p-1 pl-3 pr-3 flex gap-5 items-center" 
                onSubmit={e => e.preventDefault()}
            >
                <SearchIcon size={'3.5rem'} color="var(--color-at)"/>
                <input 
                    id="PeopleSearch"
                    name="PeopleSearch"
                    type="text"
                    placeholder="..."
                    className="text-3xl text-ts font-base flex-1 h-full outline-none placeholder-at"
                    value={searchQuery}
                    onChange={e => dispatch(setSearchQuery(e.target.value))}
                />
            </form>
        </div>
    )
}

export default SearchRewards