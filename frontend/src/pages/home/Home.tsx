import Footer from "src/widgets/Footer/Footer"
import Article from "./components/Articles"
import Cards from "./components/Cards"
import Greeting from "./components/Greeting/Greeting"
import Maps from "./components/Map"
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