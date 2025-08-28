import AddMember from "./GreetingButtons/AddMember"

export const Greeting = () => {
    return (
        <div className="flex items-end h-full w-full box-border pb-[8rem] pl-20 pr-20">
            <div className="flex flex-col gap-15">
                <div className="_greeting-phrase text-[12rem]/[11rem] text-white">
                    <p>БЕССМЕРТНЫЙ</p>
                    <p>ПОЛК СПБГУТ</p> 
                </div>  
                <div className="_greeting-buttons flex flex-col gap-8">
                    <AddMember/>
                </div>
            </div>
            <div className="_vector-bottom">
                
            </div>
        </div>
    )
}

export default Greeting