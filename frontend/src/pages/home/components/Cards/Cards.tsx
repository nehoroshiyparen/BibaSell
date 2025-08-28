import { Link } from "react-router-dom"
import ShareIcon from "src/shared/ui/svg/ShareIcon/ShareIcon"

const Cards = () => {
    return (
        <div className="w-full h-full flex items-center">
            <div className="w-full flex justify-center gap-20 box-border h-[65vh] md:h-[70vh] lg:h-[80vh] lg:pt-14">
                <div className="flex flex-col flex-1 justify-around max-w-2/3">
                    <div className="_big-p text-black">
                        <p>305 КАРТОЧЕК</p>
                        <p>УЧАСТНИКОВ ВОВ</p>
                    </div>
                    <div className="_casual-span text-black">
                        <span>
                            Поделитесь фотографиями и историей  о воинском пути, боевых заслугах, подвигах, судьбе преподавателей, работников вуза и выпускников института, сражавшимся за Родину во время Великой Отечественной войны. Собранные материалы будут увековечены в  «Галерее памяти».
                            Поделитесь фотографиями и историей  о воинском пути, боевых заслугах.
                        </span>
                    </div>
                    <div className="_casual-span text-[#FF6600]">
                        <Link to={'/'} className="flex gap-10 font-bold">
                            <span>Добавить участника</span>
                            <ShareIcon size="4rem"/>
                        </Link>       
                    </div>
                </div>
                <div className="h-full">
                    <div className="h-full flex items-center">
                        <img src="public/images/cards_preview.png" className="h-full rounded-4xl shadow-2xl shadow-black"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cards