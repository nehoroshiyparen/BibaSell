import Maps from "../components/Map"

const MapsBlock = () => {
    return (
        <div className="flex justify-center h-[90vh] overflow-hidden">
            <div className="w-full sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px] h-[calc(100vh-100px)]">
                <Maps/>
            </div>
        </div>
    )
}

export default MapsBlock