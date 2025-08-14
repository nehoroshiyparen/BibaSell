const MainLayout = ({ children }: { children: React.ReactElement }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex h-[100px] w-screen">
                
            </div>
            <div className="flex-1 text-[5rem] font-bold">
                {children}
            </div>
        </div>
    )
}

export default MainLayout