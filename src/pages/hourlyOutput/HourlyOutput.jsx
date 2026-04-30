    import {useGetProductionLineLookupQuery} from "../../redux/feature/productionLine/productionLineApiSlice.js";
    import {useGetWorkOrderQuery} from "../../redux/feature/workOrder/workOrderApiSlice.js";
    import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
    import CardWorkOrder from "../../components/card/CardWorkOrder.jsx";
    import {useDispatch, useSelector} from "react-redux";
    import {Autocomplete, Button, IconButton, InputAdornment, Pagination, TextField, Tooltip} from "@mui/material";
    import { MdOutlineSearch } from "react-icons/md";
    import { FaMinusCircle } from "react-icons/fa";
    import { FaPlusCircle } from "react-icons/fa";
    import {
    setClearCurrentOutput,
    setDecreaseQty,
    setIncreaseQty, setQtyCurrentOutputChange
} from "../../redux/feature/hourlyOutput/hourlyOutputSlice.js";
    import useDebounce from "../../hook/useDebounce.jsx";
    import { FaTrash } from "react-icons/fa";
    import { FaArrowRight } from "react-icons/fa6";

    function HourlyOutput(){
        // -- State --------------------------------------------------------------------------------

        // -- Selector -----------------------------------------------------------------------------
        const userProfile = useSelector((s) => s.auth.profile);
        const currentOutput = useSelector((s) => s.hourlyOutput.currentOutput);
        // const filterValue = useSelector((s) => s.hourlyOutput.filterValue);
        const totalOutput = useSelector((s) => s.hourlyOutput.totalOutput);
        const totalDefect = useSelector((s) => s.hourlyOutput.totalDefect);
        const totalRateDefect = useSelector((s) => s.hourlyOutput.ratingDefect);
        // -- Hook ---------------------------------------------------------------------------------
        const dispatch = useDispatch();
        // const search = useDebounce(filterValue.search, 500);
        // console.log(search)

        // -- Query --------------------------------------------------------------------------------
        const {data: productionLine} = useGetProductionLineLookupQuery();
        const {data: workOrderData, isLoading: isLoadingWO, isSuccess: isSuccessWO} = useGetWorkOrderQuery({
            pageNo: 1,
            pageSize: 20
        });

        // -- Handler -------------------------------------------------------------------------------
        const handleQtyChange = (e, item) => {
            dispatch(setQtyCurrentOutputChange({qty: Number(e.target.value), item}));
        }

        let content;

        if (isLoadingWO) content = (<LoadingComponent/>);

        if (isSuccessWO) {

            const {ids, entities, totalPages} = workOrderData || {};
            console.log(totalPages)
            const d = new Date();
            const formattedDate = `${d.toLocaleDateString()}`

            // -- Handler -------------------------------------------------------------------------------
            const handleCardClick = (e) => {
                ids?.map(id => {
                    console.log(entities[id].mo === e)
                })
            }
            content = (
                <div className="bg-gray-100 absolute top-0 left-0 h-full w-full">
                    <div className="pt-20 grid grid-cols-12 overflow-auto h-full w-full">
                        <div className="col-span-1 flex flex-col gap-2 justify-start items-center pb-10 overflow-auto">
                            {
                                productionLine?.map(item => (
                                    <button key={item?.id} className="flex flex-col justify-center items-center gap-1 border border-gray-400 w-20 h-18.75 py-8 rounded-xl cursor-pointer shadow-lg hover:scale-102 transition">
                                        <img src={item?.image || "/images/placeholder.png"} alt={item?.line} decoding={"async"} loading={"lazy"} width={"35%"} height={"100%"}/>
                                        <p className="text-sm">{item?.line}</p>
                                    </button>
                                ))
                            }
                        </div>
                        <div className="col-span-8 p-5 border border-gray-400 rounded-2xl ">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <p className="text-2xl">Welcome, {userProfile?.nameEn}</p>
                                    <p>{formattedDate}</p>
                                </div>
                                <TextField
                                    size="small"
                                    placeholder={"Search"}
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start"><MdOutlineSearch className="w-5 h-5"/></InputAdornment>,
                                        },
                                    }}
                                />
                            </div>
                            <div className="grid lg:grid-cols-5 grid-cols-3 gap-2">
                            {
                                ids?.map(id => (
                                    <CardWorkOrder
                                        key={id}
                                        image={entities[id]?.image}
                                        style={entities[id]?.style}
                                        mo={entities[id]?.mo}
                                        color={entities[id]?.color?.color}
                                        balance={entities[id]?.balance}
                                        onClick={handleCardClick}
                                        sizes={entities[id].sizes}
                                        po={entities[id]?.po}
                                    />
                                ))
                            }
                            </div>
                            <div className="flex w-full justify-center mt-5">
                            <Pagination count={totalPages}/>
                            </div>
                        </div>
                        <div className="col-span-3 border border-gray-400 rounded-2xl h-full px-4 py-4 overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center shrink-0">
                                <p className="text-xl mb-3">Current output</p>
                                <Tooltip title={"Clear all"}>
                                    <IconButton onClick={() => dispatch(setClearCurrentOutput())} color="error" size="small"><FaTrash/></IconButton>
                                </Tooltip>
                            </div>
                            <div>
                                <Autocomplete
                                    size="small"
                                    renderInput={(params) => (
                                    <TextField {...params} label="Times" placeholder="Favorites" />
                                    )}
                                              // options={}
                                />
                            </div>
                            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                                {
                                    currentOutput?.map((item, index) => (
                                            <div className="flex justify-between gap-2 min-w-0" key={index}>
                                                <div className="w-14 h-14 shrink-0 overflow-hidden rounded-lg">
                                                    <img src={item?.image} alt={item?.mo} className="object-cover" loading={"lazy"} decoding={"async"}/>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-md truncate ">{item?.style}-{item?.color}</p>
                                                    <p className="text-sm text-gray-500">{item?.mo}</p>
                                                    <p className="text-purple-600 text-lg ">{item?.size?.size}</p>
                                                </div>
                                                <div className="flex justify-center items-center">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => dispatch(setDecreaseQty(item))}>
                                                        <FaMinusCircle/>
                                                    </IconButton>
                                                    <TextField
                                                        size="small"
                                                        value={item?.qty}
                                                        type="number"
                                                        onChange={(e) => handleQtyChange(e, item)}
                                                        inputProps={{
                                                            min: 0,
                                                            step: 1
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        sx={{
                                                            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                                                                WebkitAppearance: "none",
                                                                margin: 0,
                                                            },
                                                            "& input[type=number]": {
                                                                appearance: "textfield", // ✅ modern replacement
                                                            },
                                                            "& .MuiInputBase-input": {
                                                                textAlign: "center",
                                                                px: 0,
                                                            },
                                                            width: "40px"
                                                        }}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => dispatch(setIncreaseQty(item))}>
                                                        <FaPlusCircle/>
                                                    </IconButton>
                                                </div>
                                            </div>
                                    ))
                                }
                            </div>
                            <div className="flex flex-col pt-3 shrink-0">
                                <div className="grid grid-cols-3 gap-2">
                                    <p className="text-md mb-3 bg-gray-300 rounded-md text-left p-2">
                                        Output <br/>
                                        <span className="text-2xl text-emerald-600 font-semibold">{totalOutput}</span>
                                    </p>
                                    <p className="text-md mb-3 bg-gray-300 rounded-md text-left p-2">
                                        Defect <br/>
                                        <span className="text-2xl text-red-600 font-semibold">{totalDefect}</span>
                                    </p>
                                    <p className="text-md mb-3 bg-gray-300 rounded-md text-left p-2">
                                        Rate <br/>
                                        <span className="text-2xl text-orange-600 font-semibold">{totalRateDefect}%</span>
                                    </p>
                                </div>
                                <Button variant="contained">Submit <FaArrowRight className="ml-1"/></Button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return content;
    }

    export default HourlyOutput;