type EmptyFeedProps = {
    searchQuery?: string
}

const EmptyFeed:React.FC<EmptyFeedProps> = ({ searchQuery }) => {
    return (
        <div className="w-full flex flex-col items-center gap-15">
            <span className="text-4xl font-base text-text">
                {searchQuery ? (
                    <>Нет результатов по запросу <strong>{searchQuery}</strong></>
                ) : (
                    'Нет результатов поиска'
                )}
            </span>
            <p className="text-8xl font-base text-text">
                ¯\_(ツ)_/¯
            </p>
        </div>
    )
}

export default EmptyFeed