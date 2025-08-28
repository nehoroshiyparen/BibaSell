import UserIcon from "src/shared/ui/svg/UserIcon/UserIcon"

const AnotherButton = () => {
    return (
        <div className="h-[43%] aspect-square bg-[#1b1b1b] rounded-full flex justify-center items-center hover:shadow-[0_0_20px_#ffe1a9] transition-shadow duration-300 group cursor-pointer">
            <UserIcon size={`2.5rem`} color="#ffe5b4"/>
        </div>
    )
}

export default AnotherButton