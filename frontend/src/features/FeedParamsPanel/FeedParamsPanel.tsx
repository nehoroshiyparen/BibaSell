import type { FeedParamsPanelProps } from "./types/FeedParamsProps"
import FeedParam from "./ui/FeedParam"

const FeedParamsPanel = <T, TParams extends Record<string, any>,>({ feedEntities, params }: FeedParamsPanelProps<T, TParams>)  => {
    return (
        <div className="w-full flex gap-20 box-border p-10 bg-accent-dim rounded-2xl items-center">
            <div className="text-4xl font-base">
                <span className="">Результатов поиска: </span>
                <span className="font-bold">{feedEntities.length}</span>
            </div>
            <div className="flex gap-10">
                {Object.values(params).map((param, index) => (
                    <FeedParam key={index} {...param}/>
                ))}
            </div>
        </div>
    )
}

export default FeedParamsPanel