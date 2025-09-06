import './Home.css'
import GreetingBlock from "./ui/GreetingBlock"
import CardsBlock from "./ui/CardsBlock"
import MapsBlock from "./ui/MapsBlock"
import ArticleBlock from "./ui/ArticleBlock"

const Home = () => {
    return (
        <div className="flex flex-col overflow-hidden">
            <GreetingBlock/>
            <CardsBlock/>
            <MapsBlock/>
            <ArticleBlock/>
        </div>
    )
}

export default Home