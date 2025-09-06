import CrossIcon from "src/assets/svg/CrossIcon/CrossIcon"
import MenuButton from "../components/Button"

export type MenuProps = {
    label: string,
    link: string,
}[]

const Menu = ({ isOpen, onClose, options }: { isOpen: boolean, onClose: () => void, options: MenuProps }) => {
    return (
        <div className={`h-screen w-full absolute bg-bg ${isOpen ? '' : 'hidden'}`}>
            <div className="h-4/5 w-full flex flex-col justify-center items-center gap-30 relative top-1/8">
                <div className="
                    relative 
                    text-as text-4xl font-base flex items-center gap-6 cursor-pointer box-border pb-4
                    after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-1 after:w-0
                    after:bg-secondary-accent after:transition-all after:duration-300 after:ease-out 
                    after:-translate-x-1/2 after:origin-center
                    hover:after:w-full" 
                onClick={onClose}>
                    <CrossIcon size={'2rem'}/>
                    <span>ЗАКРЫТЬ</span>
                </div>
                <div className="flex flex-col items-center gap-15">
                    {options.map(option => (
                        <MenuButton label={option.label} link={option.link} key={option.label}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Menu