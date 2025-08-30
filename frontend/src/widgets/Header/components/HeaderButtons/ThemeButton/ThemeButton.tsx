import SunIcon from "src/assets/svg/SunIcon/SunIcon"

const ThemeButton = ({}) => {
    return (
        <div className="h-[43%] aspect-square bg-text rounded-full flex justify-center items-center hover:shadow-[0_0_20px_#ffe1a9] transition-shadow duration-300 group cursor-pointer">
                <div className="transition-transform duration-500 group-hover:rotate-45">
                    <SunIcon color="#ffe5b4" size={`2.5rem`}/>
                </div>
        </div>
    )
}

export default ThemeButton