import {
    Autocomplete,
    Button,
    Divider, Skeleton,
    TextField,
    Typography
} from "@mui/material";
import NumberField from "../../components/ui/NumberField.jsx";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {Form, Formik} from "formik";
import {
    useGetStyleByMoMutation,
    useGetWorkOrderLookupQuery
} from "../../redux/feature/workOrder/workOrderApiSlice.js";
import {useGetSizeLookupQuery} from "../../redux/feature/size/sizeApiSlice.js";
import * as Yup from "yup";
import {textFieldStyle} from "../../config/theme.js";
import PrintIcon from '@mui/icons-material/Print';
import {useReactToPrint} from "react-to-print";
import {useEffect, useRef, useState} from "react";
import {useGetQrMutation} from "../../redux/feature/qr/qrApiSlice.js";
import {useTranslation} from "react-i18next";

function QrGenerator() {
    // -- State ------------------------------------------------------------------------------------------
    const [url, setUrl] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);

    // -- Hook -------------------------------------------------------------------------------------------
    const contentRef = useRef(null);
    const promiseResolveRef = useRef(null);
    const {t} = useTranslation();

    // -- Query ------------------------------------------------------------------------------------------
    const {data: workOrderData}      = useGetWorkOrderLookupQuery();
    const {data: sizeData}           = useGetSizeLookupQuery();


    // -- Mutation ---------------------------------------------------------------------------------------
    const [getQrCode, {isLoading}] = useGetQrMutation();
    const [styleByMo]              = useGetStyleByMoMutation();

    // -- Handler ----------------------------------------------------------------------------------------
    const handleSubmit = async (values) => {
        const res = await getQrCode({
            mo: values.mo,
            size: values.size,
            qty: values.qty,
        }).unwrap();
        const url  = URL.createObjectURL(res)
       setUrl(url);
    }
    const handlePrint = useReactToPrint({
        contentRef,
        onBeforePrint: () => {
            return new Promise((resolve) => {
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
            });
        },
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            promiseResolveRef.current = null;
            setIsPrinting(false);
        }
    });
    // const handlePrint = useReactToPrint(
    //     { contentRef }
    //
    // );

    // -- useEffect --------------------------------------------------------------------------------------
    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {
            // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
            promiseResolveRef.current();
        }
    }, [isPrinting]);


    // -- validation -------------------------------------------------------------------------------------
    const validationSchema = Yup.object().shape({
        mo: Yup.string().required(t("validation.required"))
    });

    return(
        <div className="card-glass">
            <Formik initialValues={{
                mo: "",
                size: "",
                qty: "",
                style: ""
            }}
                    enableReinitialize
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
            >
                {({values, handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched}) => {
                    const handleMoChange = async (event, newValue) => {
                        setFieldValue("mo", newValue.mo);
                        const res = await styleByMo({mo: newValue.mo}).unwrap();
                        setFieldValue("style", res.style);
                    }
                    return (
                        <Form className="grid grid-cols-4 gap-4">
                            <div className="sub-card-glass col-span-1">
                                <Typography variant="h6" color="#fff">Print</Typography>
                                <Divider sx={{color: "#fff", borderColor: "#fff", my: 2}}/>

                                <Button onClick={handlePrint} variant="contained" fullWidth startIcon={<PrintIcon/>}
                                        sx={{borderRadius: "14px"}}>
                                    Print
                                </Button>

                            </div>
                            <div className="col-span-2 flex items-start justify-center">
                                <div
                                    ref={contentRef}
                                    className="w-[300px] p-5 bg-white text-black font-sans"
                                >
                                    {/* Header: Compact Logo */}
                                    <div className="flex items-center justify-between mb-4">
                                        <img
                                            src="/images/sec_logo.png"
                                            alt="SEC"
                                            className="h-6 object-contain"
                                        />
                                        <span className="font-black text-xs tracking-widest text-gray-400">BDL-1</span>
                                    </div>

                                    {/* QR Code Section - Maximized */}
                                    <div className="flex flex-col items-center justify-center mb-6">
                                        <div className=" bg-gray-50 rounded-xl border border-gray-100">
                                            {url !== null ? (
                                                <img
                                                    src={url}
                                                    alt="qrCode"
                                                    className="w-64 h-64" // Increased size
                                                />
                                            ) : (
                                                <Skeleton variant="rectangular" width={250} height={250}/>
                                            )}

                                        </div>
                                    </div>

                                    {/* Info Section - Tightly organized below */}
                                    <div className="space-y-3">

                                        {/* Style Section - Full Width */}
                                        <div className="bg-gray-100 p-3 rounded-lg">
                                            <p className="text-[9px] uppercase font-bold text-gray-500 mb-0.5">Style</p>
                                            <p className="text-lg font-black leading-tight break-words uppercase">
                                                {values.style}
                                            </p>
                                        </div>

                                        {/* MO & Specs Grid */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="col-span-2 border-r border-gray-200 pr-2">
                                                <p className="text-[9px] uppercase font-bold text-gray-500">MO</p>
                                                <p className="font-bold text-sm">{values.mo}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] uppercase font-bold text-gray-500">Size</p>
                                                <p className="font-black text-xl">{values.size}</p>
                                            </div>
                                        </div>

                                        {/* Qty Badge */}
                                        <div
                                            className="border-t border-gray-200 pt-2 flex justify-between items-center">
                                            <span
                                                className="text-[9px] uppercase font-bold text-gray-500">Quantity</span>
                                            <span className="text-xl font-black">{values.qty} PCS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sub-card-glass col-span-1">
                                <Typography variant="h6" color="#fff">QR Code Generator</Typography>
                                <Divider sx={{color: "#fff", borderColor: "#fff", my: 2}}/>

                                <div className="flex flex-col gap-4">
                                    <Autocomplete
                                        options={workOrderData || []}
                                        getOptionLabel={(option) => option.mo || ""}
                                        value={workOrderData?.find((workOrder) => workOrder.mo === values.mo) || null}
                                        onChange={handleMoChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="MO"
                                                size="small"
                                                fullWidth
                                                sx={textFieldStyle}
                                            />
                                        )}

                                    />

                                    <Autocomplete
                                        options={sizeData || []}
                                        getOptionLabel={(option) => option.size || ""}
                                        value={sizeData?.find((size) => size.size === values.size) || null}
                                        onChange={(event, newValue) => {
                                            setFieldValue("size", newValue?.size || "");
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Size"
                                                size="small"
                                                fullWidth
                                                sx={textFieldStyle}

                                            />
                                        )}
                                    />

                                    <NumberField label="Quantity" size="small" value={values.qty}
                                                 onChange={(val) => setFieldValue("qty", val)} min={1}/>

                                    <Button type="submit" variant="contained" fullWidth startIcon={
                                        <QrCode2Icon/>
                                    }
                                            sx={{
                                                borderRadius: "14px",

                                            }}
                                    > Generate QR
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default QrGenerator;