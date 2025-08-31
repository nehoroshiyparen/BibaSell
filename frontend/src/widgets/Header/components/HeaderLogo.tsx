import { Link } from "react-router-dom"

type Props = {
    link: string,
    onClick: () => void
}

const HeaderLogo = ({ link, onClick }: Props) => {
    return (
        <div className="_logo h-full flex overflow-hidden box-border pl-20" onClick={onClick}>
            <Link to={link} className="overflow-hidden h-full flex items-center select-none">
                <img src="/images/logo/logo.png"/>
            </Link>
        </div>
    )
}

export default HeaderLogo