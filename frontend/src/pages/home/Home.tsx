import Footer from "src/widgets/Footer/Footer"
import Article from "./components/Acticles/Articles"
import Cards from "./components/Cards/Cards"
import Greeting from "./components/Greeting/Greeting"
import Maps from "./components/Maps/Map"
import './Home.css'

const Home = () => {
    return (
        <div className="flex flex-col overflow-hidden">
            <section className="flex justify-center overflow-hidden w-screen h-screen">
                <img 
                    src="/images/slides/slide_1.jpg" 
                    className="absolute inset-0 z-0 object-cover w-full h-full">
                </img>
                <div className="absolute inset-0  z-1 w-full h-screen gradient_bg"/>
                <div className="w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] h-[calc(100vh-100px)] z-10 relative top-[calc(50*0.25rem)]">
                    <Greeting/>
                </div>
            </section>
            <section className="flex justify-center h-[90vh] overflow-hidden">
                <div className="w-full box-border pl-[4%] pr-[4%]">
                    <Cards/>
                </div>
            </section>
            <section className="flex justify-center h-[90vh] overflow-hidden">
                <div className="w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] h-[calc(100vh-100px)]">
                    <Maps/>
                </div>
            </section>
            <section className="flex justify-center h-[90vh] overflow-hidden">
                <div className="w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] box-border pl-30 pr-30">
                    <Article/>
                </div>
            </section>
            <Footer/>
        </div>
    )
}

export default Home