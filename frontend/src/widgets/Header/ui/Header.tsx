import { Link } from "react-router-dom"
import ThemeButton from "../components/ThemeButton"
import HeaderLogo from "../components/HeaderLogo"
import AnotherButton from "../components/AnotherButton"
import './Header.css'

const Header = () => {
    return (
        <div className="w-full h-50 grid grid-cols-[1fr_3fr_1fr] box-border pl-10 pr-10 sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px]">
            <HeaderLogo link="/"/>
            <div className="h-full flex justify-center text-5xl text-text items-center gap-15 ">
                <div>
                    <Link to={'/'}>
                        ГАЛЛЕРЕЯ ПАМЯТИ
                    </Link>
                </div>
                <div>
                    <Link to={'/'}>
                        БИБЛИОТЕКА
                    </Link>
                </div>
                <div>
                    <Link to={'/'}>
                        О НАС
                    </Link>
                </div>
            </div>
            <div className="_some-options h-full flex justify-end items-center gap-6">
                <ThemeButton/>
                <AnotherButton/>
            </div>
        </div>
    )
}

export default Header