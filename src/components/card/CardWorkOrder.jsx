import {useDispatch} from "react-redux";
import {setCurrentOutput} from "../../redux/feature/hourlyOutput/hourlyOutputSlice.js";
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {CircularProgress, IconButton, Popover} from "@mui/material";
import {useState} from "react";
import {useGetDefectTypeLookupQuery} from "../../redux/feature/defect-type/defectTypeApiSlice.js";

function CardWorkOrder({image, style, mo, color, output, onClick, sizes, po}){

    // -- Hook ---------------------------------------------------------------------------------
    const dispatch = useDispatch();
    const {data: defectTypes, isLoading: isLoadingDefectTypes} = useGetDefectTypeLookupQuery();

    // -- State --------------------------------------------------------------------------------
    const [defectAnchorEl, setDefectAnchorEl] = useState(null);

    // -- Handler -------------------------------------------------------------------------------

    const handSizeClick = (size) => {
        console.log(style, mo, color, image, size)
        dispatch(setCurrentOutput({
            style, mo, color, image, size, qty: 1, entryType: "output"
        }))
    }

    const handleDefectClick = (event) => {
        setDefectAnchorEl(event.currentTarget);
    }

    const handleDefectTypeClick = (defectType) => {
        dispatch(setCurrentOutput({
            style, mo, color, image, qty: 1, entryType: "defect", defectType
        }))
        setDefectAnchorEl(null);
    }

    const isDefectPickerOpen = Boolean(defectAnchorEl);

    return (
        <div className="flex h-full flex-col border border-gray-300 rounded-lg bg-white shadow-sm transition">
            <div className="relative mb-3 w-full h-32 flex mx-auto justify-center items-center overflow-hidden rounded-t-lg bg-gray-50">
                <img src={image || "/images/placeholder.png"} alt={style} className="w-full h-full object-contain" loading={"lazy"} decoding={"async"}/>
            </div>
            <div className="px-2">
                <p className="text-xs text-gray-500">{mo}</p>
                <p className="text-xs text-gray-500">{po}</p>
                <p className="font-bold text-lg text-nowrap truncate">{style}-{color}</p>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1">
                {sizes?.map(size => (
                    <button
                        key={size?.id}
                        onClick={() => handSizeClick(size)}
                        className="border border-gray-300 rounded-md text-sm py-2 font-medium transition hover:scale-102 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                        {size?.size}
                    </button>
                ))}
            </div>
            <div className="mt-auto px-1 pb-1">
                <button
                    type="button"
                    onClick={handleDefectClick}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 hover:scale-102"
                >
                    <ReportProblemRoundedIcon sx={{fontSize: 17}}/>
                    Add Defect
                </button>
            </div>
            <Popover
                open={isDefectPickerOpen}
                anchorEl={defectAnchorEl}
                onClose={() => setDefectAnchorEl(null)}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                transformOrigin={{vertical: "bottom", horizontal: "center"}}
                PaperProps={{
                    sx: {
                        width: 280,
                        borderRadius: 2,
                        border: "1px solid #fecaca",
                        boxShadow: "0 12px 32px rgba(127,29,29,0.18)",
                    }
                }}
            >
                <div className="bg-white">
                    <div className="flex items-center justify-between border-b border-red-100 px-3 py-2">
                        <div>
                            <p className="text-sm font-bold text-gray-900">Select defect type</p>
                            <p className="text-xs text-gray-500 truncate">{mo}</p>
                        </div>
                        <IconButton size="small" onClick={() => setDefectAnchorEl(null)}>
                            <CloseRoundedIcon sx={{fontSize: 18}}/>
                        </IconButton>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2">
                        {isLoadingDefectTypes ? (
                            <div className="flex items-center justify-center py-8">
                                <CircularProgress size={24}/>
                            </div>
                        ) : defectTypes?.length > 0 ? (
                            defectTypes.map((defectType) => (
                                <button
                                    key={defectType?.id}
                                    type="button"
                                    onClick={() => handleDefectTypeClick(defectType)}
                                    className="mb-1 flex w-full items-center justify-between rounded-md border border-transparent px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                >
                                    <span className="truncate">{defectType?.name}</span>
                                    <ReportProblemRoundedIcon sx={{fontSize: 16}}/>
                                </button>
                            ))
                        ) : (
                            <p className="py-6 text-center text-sm text-gray-500">No defect type found</p>
                        )}
                    </div>
                </div>
            </Popover>
        </div>
    )
}

export default CardWorkOrder;
