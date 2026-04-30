import {useDispatch} from "react-redux";
import {setCurrentOutput} from "../../redux/feature/hourlyOutput/hourlyOutputSlice.js";

function CardWorkOrder({image, style, mo, color, balance, onClick, sizes, po}){

    // -- Hook ---------------------------------------------------------------------------------
    const dispatch = useDispatch();

    // -- State --------------------------------------------------------------------------------


    // -- Handler -------------------------------------------------------------------------------

    const handSizeClick = (size) => {
        console.log(style, mo, color, image, size)
        dispatch(setCurrentOutput({
            style, mo, color, image, size, qty: 1
        }))
    }

    return (
        <div className="flex flex-col border border-gray-400 rounded-lg">
            <div className="mb-3 w-full h-32 flex mx-auto justify-center items-center overflow-hidden">
                <img src={image || "/images/placeholder.png"} alt={style} className="w-full h-full object-contain" loading={"lazy"} decoding={"async"}/>
            </div>
            <div className="px-2">
                <p className="text-xs text-gray-500">{mo}</p>
                <p className="text-xs text-gray-500">{po}</p>
                <p className="font-bold text-lg text-nowrap truncate">{style}-{color}</p>
            </div>
            <div className={"flex justify-between items-center px-2 py-2"}>
                <p><span className="text-emerald-600">{balance}</span> pcs</p>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1">
                {sizes?.map(size => (
                    <button
                        key={size?.id}
                        onClick={() => handSizeClick(size)}
                        className="border rounded-md text-sm hover:scale-102 transition"
                    >
                        {size?.size}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CardWorkOrder;