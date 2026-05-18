    import {
    useGetProductionLineByDepartmentNoQuery,
    useGetProductionLineLookupQuery
} from "../../redux/feature/productionLine/productionLineApiSlice.js";
    import {useGetWorkOrderQuery} from "../../redux/feature/workOrder/workOrderApiSlice.js";
    import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
    import CardWorkOrder from "../../components/card/CardWorkOrder.jsx";
    import {useDispatch, useSelector} from "react-redux";
    import {
    Alert,
    Autocomplete,
    Button,
    IconButton,
    InputAdornment,
    Pagination, Snackbar,
    TextField,
    Tooltip
} from "@mui/material";
    import { MdOutlineSearch } from "react-icons/md";
    import { FaMinusCircle } from "react-icons/fa";
    import { FaPlusCircle } from "react-icons/fa";
    import {
    setAlertHourlyOutput,
    setClearCurrentOutput,
    setDecreaseQty, setFilterHourlyOutput,
    setIncreaseQty, setIsOpenSnackbarHourlyOutput, setQtyCurrentOutputChange, setSelectedLine, setSelectedTime,
    setSelectedToLine
} from "../../redux/feature/hourlyOutput/hourlyOutputSlice.js";
    import { FaTrash } from "react-icons/fa";
    import { FaArrowRight } from "react-icons/fa6";
    import {useGetTimeLookupQuery} from "../../redux/feature/time/timeApiSlice.js";
    import {useEffect} from "react";
    import DefectTypeSelect from "../../components/select/DefectTypeSelect.jsx";
    import useDebounce from "../../hook/useDebounce.jsx";
    import {useCreateOutputDetailMutation} from "../../redux/feature/hourlyOutput/outputDetailApiSlice.js";
    import {useTranslation} from "react-i18next";

    function HourlyOutput(){
        // -- State --------------------------------------------------------------------------------

        // -- Selector -----------------------------------------------------------------------------
        const userProfile             = useSelector((s) => s.auth.profile);
        const currentOutput           = useSelector((s) => s.hourlyOutput.currentOutput);
        const filterValue             = useSelector((s) => s.hourlyOutput.filter);
        const totalOutput             = useSelector((s) => s.hourlyOutput.totalOutput);
        const totalDefect             = useSelector((s) => s.hourlyOutput.totalDefect);
        const totalRateDefect         = useSelector((s) => s.hourlyOutput.ratingDefect);
        const selectedLine            = useSelector((s) => s.hourlyOutput.selectedLine);
        const selectedTime            = useSelector((s) => s.hourlyOutput.selectedTime);
        const isOpenSnackbar          = useSelector((s) => s.hourlyOutput.isOpenSnackbarHourlyOutput);
        const alertHourlyOutput       = useSelector((s) => s.hourlyOutput.alertHourlyOutput);
        const selectedToLine          = useSelector((s) => s.hourlyOutput.selectedToLine);

        // -- Hook ---------------------------------------------------------------------------------
        const dispatch = useDispatch();
        const search               = useDebounce(filterValue?.search, 500);
        const {t} = useTranslation();

        // -- Query --------------------------------------------------------------------------------
        const {data: productionLine, isSuccess: isSuccessProductionLine} = useGetProductionLineLookupQuery();
        const {data: workOrderData, isLoading: isLoadingWO, isSuccess: isSuccessWO} = useGetWorkOrderQuery({
            pageNo: 1,
            pageSize: 20,
            search: search,
            isActive: true
        });
        const {data: timeData} = useGetTimeLookupQuery();
        const {data: lineByDeptData} = useGetProductionLineByDepartmentNoQuery(
            {no: selectedLine?.department?.processNo + 1},
            {skip: selectedLine == null || Object?.keys(selectedLine)?.length === 0}
        );

        console.log(productionLine)

        // -- Mutation -------------------------------------------------------------------------------
        const [createOutputDetail, {isLoading: isLoadingOutputDetail}] = useCreateOutputDetailMutation();

        // -- Handler -------------------------------------------------------------------------------
        const handleQtyChange = (e, item) => {
            dispatch(setQtyCurrentOutputChange({qty: Number(e.target.value), item}));
        }

        const handleTimeChange = (event, newValue) => {
            dispatch(setSelectedTime(newValue));
        }

        const handleLineByDepartmentChange = (even, newValue) => {
            dispatch(setSelectedToLine(newValue));
        }

        const handleSearchChange = (e) => {
            dispatch(setFilterHourlyOutput({
                search: e.target.value
            }));
        }

        const handleSubmit = async () => {
            let outputDetail = [];
            currentOutput.forEach(item => {
                outputDetail.push({
                    sizeId: item?.size?.id,
                    fromLineId: selectedLine?.id,
                    toLineId: selectedToLine?.id,
                    goodQty: item?.qty,
                    mo: item?.mo,
                    timeId: selectedTime?.id
                });
            });
            try {
                await createOutputDetail(outputDetail).unwrap();
                dispatch(setAlertHourlyOutput({type: "success", message: t('createSuccess')}));
                dispatch(setIsOpenSnackbarHourlyOutput(true));
                dispatch(setClearCurrentOutput());
            }catch (error){
                dispatch(setAlertHourlyOutput({type: "error", message: error?.data?.error?.description ?? "Something went wrong!"}));
                dispatch(setIsOpenSnackbarHourlyOutput(true));
            }
        }

        // -- UseEffect -----------------------------------------------------------------------------------

        useEffect(() => {
            if (isSuccessProductionLine){
                dispatch(setSelectedLine(productionLine[0]));
            }
        }, [isSuccessProductionLine]);


        let content;

        if (isLoadingWO) content = (<LoadingComponent/>);

        if (isSuccessWO) {
            const isFilled = (obj) => obj && Object.keys(obj).length > 0;
            const isDisableSubmit = (
                currentOutput?.length > 0 &&
                isFilled(selectedTime) &&
                isFilled(selectedLine) &&
                (lineByDeptData?.length > 0 ? isFilled(selectedToLine) : true)
            );

            const {ids, entities, totalPages} = workOrderData || {};

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
                                    <button
                                        key={item?.id}
                                        onClick={() => dispatch(setSelectedLine(item))}
                                        className={`flex flex-col justify-center items-center gap-1 border ${item?.id === selectedLine?.id ? "border-orange-600 border-2 text-orange-700 font-semibold bg-orange-200" : "border-gray-400"} w-20 h-18.75 
                                        py-8 rounded-xl cursor-pointer shadow-lg hover:scale-102 transition `}>
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
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="grid xl:grid-cols-5 grid-cols-3 gap-2">
                            {
                                ids?.length > 0 ? (
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
                                            po={entities[id]?.po?.po}
                                        />
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center w-full h-full col-span-5">
                                        <img src="/images/empty-box.png" alt="empty" className="w-52 h-auto"/>
                                    </div>
                                )
                            }
                            </div>
                            <div className="flex w-full justify-center mt-5">
                                {
                                    totalPages > 0 && (
                                        <Pagination count={totalPages}/>
                                    )
                                }
                            </div>
                        </div>
                        <div className="col-span-3 border border-gray-400 rounded-2xl h-full px-4 py-4 overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center shrink-0">
                                <p className="text-xl mb-3">Current output</p>
                                {
                                    currentOutput?.length > 0 && (
                                        <Tooltip title={"Clear all"}>
                                            <IconButton onClick={() => dispatch(setClearCurrentOutput())} color="error" size="small"><FaTrash/></IconButton>
                                        </Tooltip>
                                    )
                                }
                            </div>
                            <div className="mb-2">
                                <Autocomplete
                                    size="small"
                                    options={timeData}
                                    getOptionKey={(option) => option.id}
                                    getOptionLabel={(option) => option.name}
                                    onChange={handleTimeChange}
                                    renderInput={(params) => (
                                    <TextField {...params} label="Times" placeholder="Favorites" />
                                    )}
                                />
                            </div>

                            {/* Current Output */}
                            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                                {
                                    currentOutput?.length > 0 ? (
                                        currentOutput?.map((item, index) => (
                                            <div className="flex justify-between gap-2 min-w-0" key={index}>
                                                <div className="w-14 h-14 shrink-0 overflow-hidden rounded-lg">
                                                    <img src={item?.image || "/images/placeholder.png"} alt={item?.mo} className="object-cover" loading={"lazy"} decoding={"async"}/>
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
                                    ): (
                                       <div className="flex justify-center items-center h-full">
                                            <img src="/images/empty-box.png" alt="empty" loading={"lazy"} decoding={"async"} className="w-32 h-auto"/>
                                        </div>
                                    )

                                }
                            </div>
                            <div className="flex flex-col pt-3 shrink-0">
                                {
                                    lineByDeptData?.length > 0 && (
                                        <div className="mb-2">
                                            <Autocomplete
                                                size="small"
                                                options={lineByDeptData}
                                                getOptionKey={(option) => option.id}
                                                getOptionLabel={(option) => option.line}
                                                onChange={handleLineByDepartmentChange}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Line" placeholder="Line" />
                                                )}
                                            />
                                        </div>
                                    )
                                }

                                <div className="mb-2">
                                    <DefectTypeSelect/>
                                </div>
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
                                <Button variant="contained" onClick={handleSubmit} loading={isLoadingOutputDetail}
                                        disabled={!isDisableSubmit}
                                >
                                    Submit <FaArrowRight className="ml-1"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Snackbar
                        open={isOpenSnackbar}
                        autoHideDuration={6000}
                        onClose={() => dispatch(setIsOpenSnackbarHourlyOutput(false))}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert
                            onClose={() => dispatch(setIsOpenSnackbarHourlyOutput(false))}
                            severity={alertHourlyOutput.type}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {alertHourlyOutput.message}
                        </Alert>
                    </Snackbar>
                </div>
            )
        }

        return content;
    }

    export default HourlyOutput;