import Cards from "../components/Cards"

const CardsBlock = () => {
    return (
        <div className="flex justify-center h-[90vh] overflow-hidden">
            <div className="w-full box-border pl-[4%] pr-[4%]">
                <Cards/>
            </div>
        </div>
    )
}

export default CardsBlock