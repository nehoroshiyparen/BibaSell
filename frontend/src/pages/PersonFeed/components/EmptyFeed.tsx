type EmptyFeedProps = {
    searchQuery: string
}

const EmptyFeed:React.FC<EmptyFeedProps> = ({ searchQuery }) => {
    return (
        <div className="w-full flex flex-col items-center gap-15">
            <span className="text-4xl font-base text-text">
                Нет результатов по запросу <b>{searchQuery}</b>
            </span>
            <p className="text-8xl font-base text-text">
                ¯\_(ツ)_/¯
            </p>
        </div>
    )
}

export default EmptyFeed