import type { RewardAdvanced as RewardAdvancedType } from "../model/types/RewardAdvanced"

type RewardAdvancedProps = {
    reward: RewardAdvancedType
}

const RewardAdvanced:React.FC<RewardAdvancedProps> = ({ reward }) => {
    return (
        <div className="w-[80%] flex flex-col gap-20 box-border pl-30 pr-30">
            <div className="w-full h-full flex gap-40">
                <div className="w-150 flex flex-shrink-0 justify-center items-start">
                    <img 
                        src={reward.key ? 
                            reward.key
                            :
                            '/images/persons/unknown.png'
                        } 
                        onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                        className="w-full object-cover opacity-0 transition-opacity duration-200"
                    />
                </div>
                <div className="flex flex-col gap-18">
                    <div className="text-7xl/23 text-text font-base">
                        <span>{reward.label}</span>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="text-accent-third font-base text-5xl">
                            <span>Учрежден</span>
                        </div>
                        <div className="text-text font-base text-4xl/15">
                            <span>{reward.releaseDate.toLocaleString('Ru-ru')}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="text-accent-third font-base text-5xl">
                            <span>Награждений</span>
                        </div>
                        <div className="text-text font-base text-4xl/15">
                            <span>Около {reward.count.toLocaleString('ru-RU')}</span>
                        </div>
                    </div>
                    <div className="text-text font-base text-4xl/15">
                        <span>{reward.description}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RewardAdvanced