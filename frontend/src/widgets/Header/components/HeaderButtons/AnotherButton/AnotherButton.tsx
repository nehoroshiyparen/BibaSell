import UserIcon from "src/assets/svg/UserIcon/UserIcon"

const AnotherButton = () => {
    return (
        <div className="h-[43%] aspect-square bg-text rounded-full flex justify-center items-center hover:shadow-[0_0_20px_#ffe1a9] transition-shadow duration-300 group cursor-pointer">
            <UserIcon size={`2.5rem`} color="#ffe5b4"/>
        </div>
    )
}

export default AnotherButton