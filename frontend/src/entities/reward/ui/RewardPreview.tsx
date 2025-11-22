import { Link } from "react-router-dom"
import type { RewardPreview as RewardPreviewType } from "../model/types/RewardPerview"
import { useState } from "react"

type RewardPreviewProps = {
    reward: RewardPreviewType
}

const RewardPreview:React.FC<RewardPreviewProps> = ({ reward }) => {
    const [loaded, setLoaded] = useState<boolean>(false)

    return (
        <Link to={`/rewards/${reward.slug}`} className="aspect-square bg-accent-dim rounded-2xl border-solid border-[3px] border-accent-third flex justify-center items-center">
             <div className="h-full w-full box-border p-15 grid grid-rows-[1fr_auto] gap-5">
                <div className="min-h-0 min-w-0 flex items-center justify-center overflow-hidden">
                    <img
                        src={reward.key}
                        alt={reward.label}
                        onLoad={() => setLoaded(true)}
                        className={
                            `block max-h-full max-w-full object-cover opacity-0 transition-opacity duration-200
                            ${loaded ? "opacity-100" : "opacity-0"}
                        `}
                    />
                </div>
                <div className="text-center text-4xl font-base">
                    {reward.label}
                </div>
            </div>
        </Link>
    )
}

export default RewardPreview