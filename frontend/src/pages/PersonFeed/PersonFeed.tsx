import SearchPeople from "src/features/SearchPeople/ui/SearchPeople"

const PersonFeed = () => {
    return (
        <div className="h-screen w-screen flex justify-center">
            <div className="w-full box-border pl-70 pr-70">
                <div className="flex flex-col gap-20 box-border pt-25 items-center">
                    <div className="flex-col gap-12 w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] flex box-border pl-10 pr-10">
                        <div className="_big-p text-center">
                            УЧАСТНИКИ ВОЙНЫ
                        </div>
                        <div className="text-center text-text text-[2.8rem] font-base">
                                Введите имя чтобы найти своего героя
                        </div>
                        <SearchPeople/>
                    </div>
                    <div className="feed">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonFeed