import { useEffect, useRef } from "react";
import MoreIcon from "src/assets/svg/MoreIcon/MoreIcon";
import { useArticle } from "src/entities/article/hooks/useArticle";

type FilterButtonProps = {
    isFiltersOpen: boolean,
    setIsFiltersOpen: (val: boolean) => void,
    setIsSortOpen: (val: boolean) => void
}

const FilterButton: React.FC<FilterButtonProps> = ({ isFiltersOpen, setIsFiltersOpen, setIsSortOpen }) => {
    const { useArticleState } = useArticle()
    const {
        contentFilter, isContentFilterEnabled,
        authorFilter, isAuthorFilterEnabled,
        titleFilter, isTitleFilterEnabled,
        setAuthorFilter,
        setTitleFilter, setContentFilter,
        setIsAuthorFilterEnabled, setIsTitleFilterEnabled, 
        setIsContentFilterEnabled,
    } = useArticleState()

    const contentRef = useRef<HTMLTextAreaElement>(null);

    const toggleIsFiltersOpen = () => {
        setIsSortOpen(false)
        setIsFiltersOpen(!isFiltersOpen)
    }

    useEffect(() => {
        if (isContentFilterEnabled && contentRef.current) {
            const textarea = contentRef.current;
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }, [isContentFilterEnabled, contentFilter]);

    return (
        <div className="">
            <button 
                className="h-full rounded-4xl bg-ta box-border p-5 flex gap-1 items-center cursor-pointer"
                onClick={() => toggleIsFiltersOpen()}
            >
                <span className="font-base text-4xl">
                    Фильтры
                </span>
                <MoreIcon size={'24px'} strokeWidth={48}/>
            </button>
            {isFiltersOpen && 
                <div className="absolute bg-bg-dim left-10 top-35 border-2 border-at rounded-3xl flex flex-col gap-4 box-border p-7 pb-12 w-340 text-3xl font-base">
                    <div className="text-4xl text-as">
                        <span>Поиск по</span>
                    </div>
                    <ol className="flex flex-col gap-4">
                        <li>
                            <label className="flex justify-between items-center cursor-pointer box-border pb-5 pt-5 pl-5 select-none">
                                <span>Автору</span>
                                <input 
                                    type="checkbox" 
                                    name="sortBy" 
                                    value="author" 
                                    className="absolute opacity-0 w-0 h-0 peer"
                                    checked={isAuthorFilterEnabled}
                                    onChange={() => setIsAuthorFilterEnabled(!isAuthorFilterEnabled)}
                                />
                                    <span className="w-8 h-8 border-2 border-gray-400 rounded-lg flex items-center justify-center
                                        peer-checked:bg-at peer-checked:border-at transition-colors"/>
                            </label>
                            {isAuthorFilterEnabled && 
                                <div className="w-4/5 box-border p-5 border-b-2 border-at">
                                    <input 
                                        className="outline-none w-full text-as" 
                                        value={authorFilter} 
                                        onChange={(e) => setAuthorFilter(e.target.value)}
                                    />
                                </div>
                            }
                        </li>
                        <li>
                            <label className="flex justify-between items-center cursor-pointer box-border pb-5 pt-5 pl-5 select-none">
                                <span>Названию</span>
                                <input
                                    type="checkbox" 
                                    name="sortBy" 
                                    value="title" 
                                    className="absolute opacity-0 w-0 h-0 peer" 
                                    checked={isTitleFilterEnabled}
                                    onChange={() => setIsTitleFilterEnabled(!isTitleFilterEnabled)}
                                />
                                <span className="w-8 h-8 border-2 border-gray-400 rounded-lg flex items-center justify-center
                                    peer-checked:bg-at peer-checked:border-at transition-colors"/>
                            </label>
                            {isTitleFilterEnabled &&
                                <div className="w-4/5 box-border p-5 border-b-2 border-at">
                                    <input 
                                        className="outline-none w-full text-as" 
                                        value={titleFilter} 
                                        onChange={(e) => setTitleFilter(e.target.value)}
                                    />
                                </div>
                            }
                        </li>
                        <li>
                            <label className="flex justify-between items-center cursor-pointer box-border pt-5 pl-5 select-none">
                                <span>Содержанию</span>
                                <input 
                                    type="checkbox" 
                                    name="sortBy" value="content" 
                                    className="absolute opacity-0 w-0 h-0 peer" 
                                    checked={isContentFilterEnabled}
                                    onChange={() => setIsContentFilterEnabled(!isContentFilterEnabled)}
                                />
                                <span className="w-8 h-8 border-2 border-gray-400 rounded-lg flex items-center justify-center
                                    peer-checked:bg-at peer-checked:border-at transition-colors"/>
                            </label>
                            {isContentFilterEnabled && 
                                <div className="w-4/5 box-border pt-5 pl-5 pr-5 border-b-2 border-at">
                                    <textarea 
                                        className="outline-none w-full text-as resize-none" 
                                        value={contentFilter} 
                                        ref={contentRef}
                                        onChange={(e) => {
                                            const value = e.target.value.slice(0, 500);
                                            setContentFilter(value);

                                            const textarea = e.target;
                                            textarea.style.height = "auto";
                                            textarea.style.height = textarea.scrollHeight + "px";
                                        }}
                                    />
                                </div>
                            }
                        </li>
                    </ol>
                </div> 
            }
        </div>
    )
}

export default FilterButton