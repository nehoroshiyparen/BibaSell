import { useEffect, useState } from "react"

const LoadingScreen = ({ spinner, show }: { spinner: React.ReactElement, show: boolean }) => {
    const [opacity, setOpacity] = useState(true)
    const [display, setDisplay] = useState(true)

    useEffect(() => {
        if (show) {
            setOpacity(true)
            setDisplay(true)
        } else {
            const opacityTimeout = setTimeout(() => setOpacity(false), 200)
            const displayTimeout = setTimeout(() => setDisplay(false), 300);
            return () =>  { 
                clearTimeout(opacityTimeout)
                clearTimeout(displayTimeout)
            }
        }
    }, [show])

    if (!display) return null

    return (
        <div className={`fixed inset-0 flex items-center justify-center select-none pointer-events-none z-50 bg-[#ffe5b4] transition-opacity duration-100 ${
                opacity ? "opacity-100" : "opacity-0"}
            `}>
            <div className={`absolute inset-0 bg-[#ffd17c] opacity-40`}></div>
            <div className="relative z-10">
                <div className="absolute inset-0 z-10"></div>
                <div className="relative" draggable={false}>
                    {spinner}
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen