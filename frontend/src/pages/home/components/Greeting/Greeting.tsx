import AddMember from "./buttons/AddMember"
import FindMember from "./buttons/FindMember"

export const Greeting = () => {
    return (
        <div className="flex items-end justify-between h-full w-full box-border pb-[8rem] pl-20 pr-20">
            <div className="flex flex-col gap-15">
                <div className="_greeting-phrase _big-p text-[12rem]/[11rem] text-ts">
                    <p>БЕССМЕРТНЫЙ</p>
                    <p>ПОЛК СПБГУТ</p> 
                </div>  
                <div className="_greeting-buttons flex flex-col gap-8">
                    <AddMember/>
                    <FindMember/>
                </div>
            </div>
        </div>
    )
}

export default Greeting