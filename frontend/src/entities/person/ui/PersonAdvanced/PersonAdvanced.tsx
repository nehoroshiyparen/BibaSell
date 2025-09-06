import type { PersonAdvanced as PersonAdvancedType } from "../../model/types/PersonAdvanced"

type PersonAdvancedProps = {
    person: PersonAdvancedType
}

const PersonAdvanced:React.FC<PersonAdvancedProps> = (props) => {
    return (
        <div className="w-full flex gap-40 box-border pl-30 pr-30">
            <div className="h-300 aspect-[194/261]">
                <img 
                    src='/images/persons/unknown.png'
                    className="h-full aspect-[194/261] rounded-4xl"
                    style={{boxShadow: "0 0 20px rgba(0,0,0,0.4)"}}
                />
            </div>
            <div className="flex flex-col gap-25">
                <div className="text-7xl text-text font-base">

                </div>
            </div>
        </div>
    )
}

export default PersonAdvanced