import type React from "react"
import type { FeedParamProps } from "../types/FeedParamProps"
import CrossIcon from "src/assets/svg/CrossIcon/CrossIcon"

const FeedParam: React.FC<FeedParamProps> = (props) => {
    return (
        <>
            {props.isActive ?
                <div className="box-border p-5 bg-ta rounded-2xl relative">
                    <button className="absolute -right-2 -top-2 box-border p-2 rounded-full bg-as">
                        <CrossIcon size={10} color="white"/>
                    </button>
                    <span className="text-3xl font-base-light font-bold">{props.param}</span>
                </div>
                : 
                null
            } 
        </>
    )
}

export default FeedParam 