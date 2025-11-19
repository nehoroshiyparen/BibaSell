import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getRewardBySlugApi } from "src/entities/reward/api/get/getRewardBySlug"
import type { RewardAdvanced as RewardAdvancedType } from "src/entities/reward/model/types/RewardAdvanced"
import RewardAdvanced from "src/entities/reward/ui/RewardAdvanced"

const RewardPage = () => {
    const [reward, setReward] = useState<RewardAdvancedType | null>(null)

    const { slug } = useParams<{slug: string}>()

    useEffect(() => {
        const fetch = async() => {
            const data = await getRewardBySlugApi(slug!)
            setReward(data)
        }

        fetch()
    }, [])

    return (
        <div className="w-full flex flex-col items-center box-border pt-60">
            <div className="w-full h-50">

            </div>
            {reward 
                ? 
                <RewardAdvanced reward={reward}/>
                : null
            }
        </div>
    )
}

export default RewardPage