import Greeting from "../components/Greeting/Greeting"

const GreetingBlock = () => {
    return (
        <div className="flex justify-center overflow-hidden w-screen h-screen">
            <img 
                src="/images/slides/slide_1.jpg" 
                className="absolute inset-0 z-0 object-cover w-full h-full">
            </img>
            <div className="absolute inset-0  z-1 w-full h-screen gradient_bg"/>
            <div className="w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] h-[calc(100vh-100px)] z-10 relative">
                <Greeting/>
            </div>
        </div>
    )
}

export default GreetingBlock