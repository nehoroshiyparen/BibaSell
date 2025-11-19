import { Link } from "react-router-dom"
import SvgMap from "src/assets/svg/SvgMap/SvgMap"

const Maps = ({}) => {
    return (
        <div className="flex flex-col gap-10 h-full justify-end box-border relative bottom-20">
            <div className="h-[65%] w-full flex gap-4">
                <div className="w-[65%] relative">
                    <SvgMap width="100%" height="100%" className="text-accent-third"/>
                    <div className="absolute top-30 right-[-50rem] _big-p">
                        <p>КАРТЫ СОБЫТИЙ</p>
                    </div>
                </div>
                <div className="flex-1 h-full relative">
                    <div className="relative top-80 _casual-span">
                        <span>
                            Откройте карты для просмотра исторических событий войны. Карты добавляются редакторами сайта, вы также можете внести правки, отправив их на нашу
                            почту <span className="text-accent-secondary">аааа@mail.ru</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <Link to={`/`} className="w-190 border-b-[3px] border-solid border-accent-secondary text-center box-border pb-4">
                    <div className="font-bold text-accent-secondary _casual-span">
                        Посмотреть карты
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Maps