import { Link } from "react-router-dom"

export type MenuButtonProps = {
    label: string,
    link: string,
}

const MenuButton: React.FC<MenuButtonProps> = ({label, link}) => {
    return (
        <Link to={link} className="border-[3px] border-text border--solid box-border pt-10 pb-10 pl-30 pr-30 rounded-2xl text-center transition-all hover:bg-third-accent hover:border-third-accent hover:text-secondary-text">
            <div className="text-[5rem] font-base">
                <p>{label}</p>
            </div>
        </Link>
    )
}

export default MenuButton