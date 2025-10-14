import { Link } from "react-router-dom"
import type { PersonAdvanced as PersonAdvancedType } from "../../model/types/PersonAdvanced"

type PersonAdvancedProps = {
    person: PersonAdvancedType
}

const PersonAdvanced:React.FC<PersonAdvancedProps> = ({ person }) => {
    return (
        <div className="w-[80%] flex flex-col gap-20 box-border pl-30 pr-30">
            <div className="w-full h-full flex gap-40">
                <div className="h-300 aspect-[194/261]">
                    <img 
                        src={person.key || "/images/persons/unknown.png"}
                        onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                        className="h-full aspect-[194/261] rounded-3xl object-cover opacity-0 transition-opacity duration-200"
                        style={{boxShadow: "0 0 20px rgba(0,0,0,0.4)"}}
                    />
                </div>
                <div className="flex flex-col gap-15">
                    <div className="text-7xl text-text font-base">
                        <span>{person.name}</span>
                    </div>
                    <div className="text-at font-base text-5xl">
                        <span>Биография</span>
                    </div>
                    <div className="text-text font-base text-4xl/15">
                        <span>{person.description}</span>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col gap-15">
                <div className="text-5xl text-at font-base">
                    Награды
                </div>
                <div>
                    <div className="flex gap-15 h-180">
                        <Link to={'/'} className="flex flex-col gap-10 items-center h-full">
                            <div className="w-100 flex-1 flex items-center">
                                <img 
                                    src="/images/rewards/ОРДЕН ЗНАК ПОЧЕТА.png"
                                    className="w-full"
                                />
                            </div>
                            <div className="text-text text-4xl font-base">
                                <span>1942</span>
                            </div>
                        </Link>
                        <Link to={'/'} className="flex flex-col gap-10 items-center h-full">
                            <div className="w-100 flex-1 flex items-center">
                                <img 
                                    src="/images/rewards/ОРДЕН КРАСНОЙ ЗВЕЗДЫ.png"
                                    className="w-full"
                                />
                            </div>
                            <div className="text-text text-4xl font-base">
                                <span>1942</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonAdvanced