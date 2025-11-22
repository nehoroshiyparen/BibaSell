const CatSpinner = ({ width, height }: { width: number, height: number }) => {
    return (
        <img src={'/gifs/spinning-cat.gif'} alt="loading..." width={width} height={height} className='select-none pointer-events-none' draggable={false}/>
    )
}

export default CatSpinner