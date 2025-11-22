import { useEffect, useRef, useState } from "react"
import MoreIcon from "src/assets/svg/MoreIcon/MoreIcon"
import { useArticle } from "src/entities/article/hooks/useArticle";
import { SortTypes } from "../../types/SortTypes";
import '../../style/highlightedBackground.css'

const SearchSortButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    const { useArticleState } = useArticle()
    const { sortType, setSortType } = useArticleState()

    useEffect(() => {
        if (contentRef.current) {
            const newHeight = contentRef.current.scrollHeight;
            setHeight(newHeight);
        }
    }, [contentRef.current?.scrollHeight]);

    return (
        <div className="w-full">
            <div className="">
                <button 
                    className="font-base text-4xl text-text
                    border-b-2 border-accent-third box-border pl-3 pr-3 mb-5
                    leading-15 cursor-pointer flex gap-3 items-center"
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    <span>Метод сортировки</span>
                    <MoreIcon 
                        size={'2.5rem'} 
                        strokeWidth={24} 
                        direction={`${isOpen ? 'down' : 'right'}`}
                        color={`${isOpen ? 'var(--color-accent-third)' : 'var(--color-text)'}`}
                    />
                </button>
                <div 
                    ref={contentRef}
                    className={`w-full flex flex-col gap-5 box-border pl-5 pr-5 overflow-hidden items-start`}
                    style={{
                        height: isOpen ? `${height}px` : "0px",
                        transition: "height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)"
                    }}
                >
                    <button 
                        className={`cursor-pointer ${sortType === SortTypes.none ? '_hightlighted-background-bg' : ''}`}
                        onClick={() => setSortType(SortTypes.none)}
                    >
                        <span className="font-base-light text-2xl font-bold">
                            Без сортировки
                        </span>
                    </button>
                    <button 
                        className={`cursor-pointer ${sortType === SortTypes.alphabet ? '_hightlighted-background-bg' : ''}`}
                        onClick={() => setSortType(SortTypes.alphabet)}
                    >
                        <span className="font-base-light text-2xl font-bold">
                            В алфавитом порядке
                        </span>
                    </button>
                    <button 
                        className={`cursor-pointer ${sortType === SortTypes.new ? '_hightlighted-background-bg' : ''}`}
                        onClick={() => setSortType(SortTypes.new)}
                    >
                        <span className="font-base-light text-2xl font-bold">
                            По дате (сначала новые)
                        </span>
                    </button>
                    <button 
                        className={`cursor-pointer ${sortType === SortTypes.old ? '_hightlighted-background-bg' : ''}`}
                        onClick={() => setSortType(SortTypes.old)}
                    >
                        <span className="font-base-light text-2xl font-bold">
                            По дате (сначала старые)
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchSortButton