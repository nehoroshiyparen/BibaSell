import MoreIcon from "src/assets/svg/MoreIcon/MoreIcon"
import { useArticle } from "src/entities/article/hooks/useArticle"
import { SortTypes } from "../../types/SortTypes"

type SortButtonProps = {
    isSortOpen: boolean,
    setIsFiltersOpen: (val: boolean) => void,
    setIsSortOpen: (val: boolean) => void,
}

const SortButton: React.FC<SortButtonProps> = ({ isSortOpen, setIsSortOpen, setIsFiltersOpen }) => {
    const { useArticleState } = useArticle()
    const { 
        sortType,
        setSortType,
    } = useArticleState()

    const toggleIsSortOpen = () => {
        setIsFiltersOpen(false)
        setIsSortOpen(!isSortOpen)
    }

    const chooseSortType = (sort: SortTypes) => {
        setSortType(sort)
    }

    return (
        <div className="">
            <button 
                className="h-full rounded-4xl bg-ta box-border p-5 flex gap-1 items-center cursor-pointer relative"
                onClick={() => toggleIsSortOpen()}
            >
                <span className="font-base text-4xl">
                   Сортировать
                </span>
                <MoreIcon size={'24px'} strokeWidth={48}/>
            </button>
            {isSortOpen &&
                <div className="absolute bg-bg-dim left-10 top-35 border-2 border-at rounded-3xl flex flex-col items-start gap-4 box-border p-7 pb-12 w-185 text-3xl font-base">
                    <div className="text-as text-4xl">
                        <span>Снача показывать</span>
                    </div>
                    <div 
                        className={`${sortType === SortTypes.none ? `_hightlighted-background-bg` : ''} box-border pb-5 pt-5 pl-5 pr-20 select-none cursor-pointer`}
                        onClick={() => chooseSortType(SortTypes.none)}
                    >
                        <span>Без сортировки</span>
                    </div>
                    <div 
                        className={`${sortType === SortTypes.new ? `_hightlighted-background-bg` : ''} box-border pb-5 pt-5 pl-5 pr-20 select-none cursor-pointer`}
                        onClick={() => chooseSortType(SortTypes.new)}
                    >
                        <span>Новые</span>
                    </div>
                    <div 
                        className={`${sortType === SortTypes.old ? `_hightlighted-background-bg` : ''} box-border pb-5 pt-5 pl-5 pr-20 select-none cursor-pointer`}
                        onClick={() => chooseSortType(SortTypes.old)}
                    >
                        <span>Старые</span>
                    </div>
                    <div 
                        className={`${sortType === SortTypes.alphabet ? `_hightlighted-background-bg` : ''} box-border pb-5 pt-5 pl-5 pr-20 select-none cursor-pointer`}
                        onClick={() => chooseSortType(SortTypes.alphabet)}
                    >
                        <span>По алфавиту</span>
                    </div>
                </div>
            }
        </div>
    )
}

export default SortButton