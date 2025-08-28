const ContentBlock = ({children}: { children: React.ReactElement }) => {
    return (
        <div className="flex justify-center w-screen">
            <div className="w-screen sm:max-w-[1280px] md:max-w-[1920px] lg:max-w-[2560px]">
                {children}
            </div>
        </div>
    )
}

export default ContentBlock