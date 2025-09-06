import { Link } from "react-router-dom"
import ShareIcon from "src/assets/svg/ShareIcon/ShareIcon"

const Cards = () => {
    return (
        <div className="w-full h-full flex items-center">
            <div className="w-full flex justify-center gap-20 box-border h-[65vh] md:h-[70vh] lg:h-[80vh] lg:pt-14">
                <div className="flex flex-col flex-1 justify-around max-w-2/3">
                    <div className="_big-p text-t">
                        <p>305 КАРТОЧЕК</p>
                        <p>УЧАСТНИКОВ ВОВ</p>
                    </div>
                    <div className="_casual-span text-textmax-w-500">
                        <span>
                            Поделитесь фотографиями и историей  о воинском пути, боевых заслугах, подвигах, судьбе преподавателей, работников вуза и выпускников института, сражавшимся за Родину во время Великой Отечественной войны. Собранные материалы будут увековечены в  «Галерее памяти».
                            Поделитесь фотографиями и историей  о воинском пути, боевых заслугах.
                        </span>
                    </div>
                    <div className="_casual-span text-as">
                        <Link to={'/'} className="flex gap-10 font-bold">
                            <span>Добавить участника</span>
                            <ShareIcon size="4rem"/>
                        </Link>       
                    </div>
                </div>
                <div className="h-full">
                    <div className="h-full flex items-center">
                        <img src="/images/persons/cards_preview.png" className="h-full rounded-4xl" style={{boxShadow: "0 0 50px rgba(0,0,0,0.4)"}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cards