import ArrowIcon from "src/assets/svg/ArrowIcon/ArrowIcon"
import BookIcon from "src/assets/svg/BookIcon/BookIcon"
import SearchIcon from "src/assets/svg/SearchIcon/SearchIcon"

const Article = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-35">
            <div className="_big-p text-textw-full text-center">
                <p>СТАТЬИ И ЛИТЕРАТУРА</p>
            </div>
            <div className="flex justify-around items-start">
                <div className="w-160 aspect-[6/7] relative bg-ta rounded-4xl border-[3px] border-solid border-text box-border p-10 overflow-hidden">
                    <div className="absolute z-0 w-full h-full">
                        <SearchIcon size={'100%'} color="var(--color-at)" className="scale-x-[-1] absolute left-[-10rem]"/>
                    </div>
                    <div className="relative z-1 flex flex-col justify-between h-full">
                        <div className="flex flex-col gap-8">
                            <div className="text-textfont-base text-7xl/15">
                                НАУЧНЫЕ СТАТЬИ
                            </div>
                            <div className="font-base text-4xl/14 box-border pl-6">
                                Найдите статью на интересующую тему
                            </div>
                        </div>
                        <div className="flex justify-end relative">
                            <ArrowIcon direction="right" size={'12rem'} className='relative top-20 left-10'/>
                        </div>
                    </div>
                </div>
                <div className="w-160 aspect-[6/7] relative bg-ta rounded-4xl border-[3px] border-solid border-text box-border p-10 overflow-hidden">
                    <div className="absolute z-0 w-full h-full">
                        <BookIcon size={'95%'} color="var(--color-at)" className="absolute right-[-4rem]"/>
                    </div>
                    <div className="relative z-1 flex flex-col justify-between h-full">
                        <div className="flex flex-col gap-8">
                            <div className="text-textfont-base text-7xl/15">
                                КНИГИ
                            </div>
                            <div className="font-base text-4xl/14 box-border pl-6">
                                Собрание полезных материалов по предмету истории
                            </div>
                        </div>
                        <div className="flex justify-end relative">
                            <ArrowIcon direction="right" size={'12rem'} className='relative top-20 left-10'/>
                        </div>
                    </div>
                </div>
                <div className="border-l-[3px] border-solid border-as flex max-w-200 box-border pl-15 pb-15">
                    <span className="_casual-span text-t">
                        Находите и изучайте
                        интересующие вас темы. Добавляйте
                        свои статьи, проекты и исследования.
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Article