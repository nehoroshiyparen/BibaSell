import { Link } from "react-router-dom"
import type { RewardPreview as RewardPreviewType } from "../model/types/RewardPerview"

type RewardPreviewProps = {
    reward: RewardPreviewType
}

const RewardPreview:React.FC<RewardPreviewProps> = ({ reward }) => {
    console.log(reward)

    return (
        <Link to={`/rewards/${reward.slug}`} className="aspect-square bg-ad rounded-2xl border-solid border-[3px] border-ta flex justify-center items-center">
             <div className="h-full w-full box-border p-15 grid grid-rows-[1fr_auto] gap-5">
                <div className="min-h-0 min-w-0 flex items-center justify-center overflow-hidden">
                    <img
                        src={`http://localhost:8080/files/${reward.image_url}`}
                        alt={reward.label}
                        className="block max-h-full max-w-full object-contain"
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