import { Link } from "react-router-dom"

type Props = {
    link: string
}

const HeaderLogo = ({ link }: Props) => {
    return (
        <div className="_logo h-full flex overflow-hidden box-border pl-20">
            <Link to={link} className="overflow-hidden h-full flex items-center select-none">
                <img src="/images/logo/logo.png"/>
            </Link>
        </div>
    )
}

export default HeaderLogo