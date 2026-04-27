function CardWorkOrder({image, style}){
    return (
        <div className="border border-gray-400 rounded-lg px-4 py-3 h-60 w-60 flex flex-col justify-center items-center overflow-auto">
            <img src={image || "/images/placeholder.png"} alt={style} className="w-32 h-32 object-cover" loading={"lazy"} decoding={"async"}/>
            <p className="font-bold text-2xl">{style}</p>
        </div>
    )
}

export default CardWorkOrder;