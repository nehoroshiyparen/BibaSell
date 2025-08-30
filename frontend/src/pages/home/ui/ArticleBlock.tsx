import Article from "../components/Articles"

const ArticleBlock = () => {
    return (
        <div className="flex justify-center h-[90vh] overflow-hidden">
            <div className="w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] box-border pl-30 pr-30">
                <Article/>
            </div>
        </div>
    )
}

export default ArticleBlock