import ThemeButton from "../components/ThemeButton"
import HeaderLogo from "../components/HeaderLogo"
import AnotherButton from "../components/AnotherButton"
import './Header.css'
import Menu from "src/widgets/Menu/ui/Menu"
import { useEffect, useState } from "react"
import type { MenuProps } from "src/widgets/Menu/ui/Menu"
import { gallery, library } from "../routes/index"
import { useLocation } from "react-router-dom"

const Header = () => {
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const [menuOptions, setMenuOptions] = useState<MenuProps>([{label: '', link: ''}])
    
    const location = useLocation()

    const handleMenuClick = (options: MenuProps) => {
        if (menuIsOpen && menuOptions === options) {
            setMenuIsOpen(false);
        } else {
            setMenuOptions(options);
            setMenuIsOpen(true);
        }
    };

    useEffect(() => {
        setMenuIsOpen(false);
    }, [location.pathname]);
    
    return (
        <>
            <div className="header flex h-60 w-full fixed inset-0 z-50 justify-center header_gradient">
                <header className="header flex h-60 w-full fixed inset-0 z-50 justify-center header_gradient">
                    <div className="w-full h-50 grid grid-cols-[1fr_3fr_1fr] box-border pl-10 pr-10 sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px]">
                        <HeaderLogo link="/" onClick={() => setMenuIsOpen(false)}/>
                        <div className="h-full flex justify-center text-5xl text-text items-center gap-15 ">
                            <button className="cursor-pointer box-border p-5 pl-8 pr-8 rounded-3xl bg-[#ffffff00] transition-colors transition-200 hover:bg-header-buttons" onClick={() => handleMenuClick(gallery)}>
                                <span>
                                    ГАЛЛЕРЕЯ ПАМЯТИ
                                </span>
                            </button>
                            <button className="cursor-pointer  box-border p-5 pl-8 pr-8 rounded-3xl bg-[#ffffff00] transition-colors transition-200 hover:bg-header-buttons" onClick={() => handleMenuClick(library)}>               
                                <span>
                                    БИБЛИОТЕКА
                                </span>
                            </button>
                            <button className="cursor-pointer box-border p-5 pl-8 pr-8 rounded-3xl bg-[#ffffff00] transition-colors transition-200 hover:bg-header-buttons">
                                <span>
                                    О НАС
                                </span>
                            </button>
                        </div>
                        <div className="_some-options h-full flex justify-end items-center gap-6">
                            <ThemeButton/>
                            <AnotherButton/>
                        </div>
                    </div>
                </header>
                <Menu isOpen={menuIsOpen} onClose={() => setMenuIsOpen(false)} options={menuOptions}/>
            </div>
        </>
    )
}

export default Header