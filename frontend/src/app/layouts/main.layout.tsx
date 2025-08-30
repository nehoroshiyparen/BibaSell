import Footer from "src/widgets/Footer/Footer"
import Header from "src/widgets/Header/ui/Header"

const MainLayout = ({ children }: { children: React.ReactElement }) => {
    return (
        <div className="flex flex-col">
            <div className="header flex h-60 w-full fixed inset-0  z-50 justify-center header_gradient">
                <Header/>
            </div>
            <div className="_container flex-1 flex justify-center">
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default MainLayout