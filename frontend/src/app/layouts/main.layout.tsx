import Header from "src/widgets/Header/Header"

const MainLayout = ({ children }: { children: React.ReactElement }) => {
    return (
        <div className="flex flex-col">
            <div className="header flex h-50 w-full fixed inset-0  z-50 justify-center">
                <Header/>
            </div>
            <div className="_container flex-1 flex justify-center">
                {children}
            </div>
        </div>
    )
}

export default MainLayout