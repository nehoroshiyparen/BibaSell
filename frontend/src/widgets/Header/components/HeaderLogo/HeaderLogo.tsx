import { Link } from "react-router-dom"

type Props = {
    link: string
}

const HeaderLogo = ({ link }: Props) => {
    return (
        <div className="_logo h-full flex overflow-hidden box-border pl-20">
            <Link to={link} className="overflow-hidden h-full flex items-center select-none">
                <img src="https://gingersauce.co/wp-content/uploads/2020/12/pasted-image-0-2-3-1024x950.png" className="h-3/5"/>
            </Link>
        </div>
    )
}

export default HeaderLogo