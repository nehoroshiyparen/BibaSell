import './Home.css'
import GreetingBlock from "./ui/GreetingBlock"
import CardsBlock from "./ui/CardsBlock"
import MapsBlock from "./ui/MapsBlock"
import MDXArticleBlock from "./ui/ArticleBlock"

const Home = () => {
    return (
        <div className="flex flex-col overflow-hidden box-border pt-60">
            <GreetingBlock/>
            <CardsBlock/>
            <MapsBlock/>
            <MDXArticleBlock/>
        </div>
    )
}

export default Home