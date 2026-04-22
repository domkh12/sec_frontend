import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    useCreateMaterialMutation,
    useDeleteMaterialMutation, useGetMaterialReportExcelMutation, useGetMaterialStatsQuery,
    useUpdateMaterialMutation
} from "../../redux/feature/material/materialApiSlice.js";
import useDebounce from "../../hook/useDebounce.jsx";
import {
    setAlertMaterial,
    setMaterialDataForUpdate,
    setFilterMaterial, setIsOpenDeleteMaterialDialog,
    setIsOpenDialogAddOrEditMaterial, setIsOpenSnackbarMaterial, setIsFullScreenDialogStockIn,
    setIsFullScreenDialogStockOut, setStockInData, setStockOutData
} from "../../redux/feature/material/materialSlice.js";
import * as Yup from "yup";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import Seo from "../../components/seo/Seo.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import StatCards from "../../components/card/StatCards.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import {Alert, Snackbar} from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {useGetMaterialQuery} from "../../redux/feature/material/materialApiSlice.js";
import {useUploadFileMutation} from "../../redux/feature/file/fileApiSlice.js";
import { FaBoxesStacked } from "react-icons/fa6";
import { BiSolidArchiveOut } from "react-icons/bi";
import { BiSolidArchiveIn } from "react-icons/bi";
import FullScreenDialogStockIn from "../../components/dialog/FullScreenDialogStockIn.jsx";
import FullScreenDialogStockOut from "../../components/dialog/FullScreenDialogStockOut.jsx";
import {useBreakpoints} from "../../hook/useBreakpoints.jsx";
import {UNITS} from "../../config/units.js";
import useAuth from "../../hook/useAuth.jsx";

function MaterialList() {
    const [id, setId] = useState(null);

    // -- Hook --------------------------------------------------------------------------------------
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isAdmin, isManager, isWarehouse} = useAuth();
    const {t} = useTranslation();
    const isMd = useBreakpoints();

    // -- Selector ----------------------------------------------------------------------------------
    const materialDataForUpdate   = useSelector((state) => state.material.materialDataForUpdate);
    const isOpen                  = useSelector((state) => state.material.isOpenDialogAddOrEditMaterial);
    const isOpenSnackbar          = useSelector((state) => state.material.isOpenSnackbarMaterial);
    const alertMaterial           = useSelector((state) => state.material.alertMaterial);
    const isOpenDeleteDialog      = useSelector((state) => state.material.isOpenDeleteMaterialDialog);
    const[createMaterial, {isLoading: isLoadingCreateMaterial}] = useCreateMaterialMutation();
    const [updateMaterial, {isLoading: isLoadingUpdateMaterial}] = useUpdateMaterialMutation();
    const [uploadFile, {isLoading: isLoadingUploadFile}] = useUploadFileMutation();
    const filterValue = useSelector((state) => state.material.filter);
    const debounceSearch = useDebounce(filterValue.search, 500);
    const [deleteMaterial, {isLoading: isLoadingDeleteMaterial}] = useDeleteMaterialMutation();
    const [materialReportExcel, {isLoading: isLoadingGetReportMaterial}] = useGetMaterialReportExcelMutation();
    const {data: materialStats} = useGetMaterialStatsQuery();
    const {data: materialData, isLoading, isSuccess, isFetching} = useGetMaterialQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch,
        status: filterValue.status
    });

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterMaterial({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterMaterial({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditMaterial(false));
        dispatch(setMaterialDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        code: Yup.string().required(t("validation.required")),
        name: Yup.string().required(t("validation.required")),
        image: Yup.mixed()
            .nullable()
            .optional()
            .test("fileType", "Only JPG/PNG/WEBP allowed", (value) => {
                if (!value || typeof value === "string") return true; // skip if empty or URL string

                return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
            })
            .test("fileSize", "File too large (max 2MB)", (value) => {
                if (!value || typeof value === "string") return true; // skip if empty or URL string

                return value.size <= 2 * 1024 * 1024;
            }),
        unit: Yup.string().typeError(t("validation.required"))
            .required(t("validation.required")),
    });

    const handleSubmit = async (values, {resetForm}) => {
        let imageUri = null;
        if (values.image && typeof values.image !== "string") {
            const formData = new FormData();
            formData.append("file", values.image);
            try{
                const res = await uploadFile(formData).unwrap();
                imageUri = res.uri;
            }catch (error) {
                console.log(error);
                dispatch(setAlertMaterial({type: "error", message: error.data.error.description}));
                dispatch(setIsOpenSnackbarMaterial(true));
                return;
            }

        }

        try {
            if (materialDataForUpdate) {
                await updateMaterial({
                    id: materialDataForUpdate.id,
                    code: values.code,
                    name: values.name,
                    image: imageUri ? imageUri : null,
                    unit: values.unit,
                }).unwrap();
                dispatch(setAlertMaterial({type: "success", message: t("updateSuccess")}));
                dispatch(setMaterialDataForUpdate(null));
            }else {
                await createMaterial({
                    code: values.code,
                    name: values.name,
                    image: imageUri ? imageUri : null,
                    unit: values.unit,
                }).unwrap();
                dispatch(setAlertMaterial({type: "success", message: t("createSuccess")}));
            }
            dispatch(setIsOpenSnackbarMaterial(true));
            dispatch(setIsOpenDialogAddOrEditMaterial(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertMaterial({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarMaterial(true));
        }
    };

    const fields = [
        { name: "code",     label: "table.code",     type: "text" },
        { name: "name",     label: "table.material",     type: "text" },
        {   name: "unit",
            label: "table.unit",
            type: "autocomplete",
            options: UNITS.map((unit) => ({
                value: unit.value,
                label: unit.label,
            })),
        },
        {
            name: "image",
            label: "table.image",
            type: "image",
        }
    ];

    const initialValues ={
        code: "",
        name: "",
        unit: "",
        image: "",
    }

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditMaterial(true));
        dispatch(setMaterialDataForUpdate({
            id: row.id,
            code: row.code,
            name: row.name,
            unit: row.unit,
            image: row.image,
        }));
    };

    const handleDeleteOpen = async (row) => {
        dispatch(setIsOpenDeleteMaterialDialog(true));
        setId(row.id);
    };

    const handleStockIn = (row) => {
        dispatch(setIsFullScreenDialogStockIn(true));
        dispatch(setStockInData(row));
    }
    const handleStockOut = (row) => {
        dispatch(setIsFullScreenDialogStockOut(true));
        dispatch(setStockOutData(row));
    }

    const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterMaterial({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterMaterial(newFilter));
    }

    const handleDelete = async () => {
        try {
            await deleteMaterial({id: id}).unwrap();
            dispatch(setIsOpenDeleteMaterialDialog(false));
            dispatch(setAlertMaterial({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarMaterial(true));
        }catch (error) {
            dispatch(setIsOpenDeleteMaterialDialog(false));
            dispatch(setAlertMaterial({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarMaterial(true));
        }
    }

    const handleClearAllFilters = () => {
        dispatch(setFilterMaterial({
            search: "",
        }))
    }

    const filterConfig = [
        {
            id: 'status',
            label: t("table.status"),
            width: isMd ? 150 : "100%",
            options: [
                { value: 'all', label: t('filter.all') },
                { value: 'OK', label: t('OK') },
                { value: 'LOW_STOCK', label: t('LOW_STOCK') },
                { value: 'OUT_OF_STOCK', label: t('OUT_OF_STOCK') }
            ]
        },
        {
            id: 'excel',
            isLoading: isLoadingGetReportMaterial,
            onClick: async () => {
                const res = await materialReportExcel().unwrap();

                // Create blob
                const blob = new Blob([res], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                // Create URL
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = url.substring(url.lastIndexOf("/"), url.length); // file name
                document.body.appendChild(link);
                link.click();

                // Cleanup
                link.remove();
                window.URL.revokeObjectURL(url);
            }
        },
        {
            id: "unit",
            label: t("unit")
        }
    ]

    const columns = [
        {
            id: "image",
            label: t("table.image"),
            minWidth: 50,
            maxWidth: 50,
            align: "left",
        },
        {
            id: "code",
            label: t("table.code"),
            minWidth: 50,
            align: "left",
        },
        {
            id: "name",
            label: t("table.material"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "unit",
            label: t("table.unit"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "totalInput",
            label: t("table.stockIn"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "totalOutput",
            label: t("table.stockOut"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "balance",
            label: t("table.balance"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "status",
            label: t("table.status"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "action",
            label: t("table.action"),
            minWidth: 50,
            align: "left",
        },
    ]

    let content;

    if (isLoading) content = (<LoadingComponent/>);

    if (isSuccess) content = (
        <div className="pb-10">
            <Seo title="Material List"/>
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate(`${isAdmin ? "/admin" : isManager ? "/manager" : isWarehouse ? "/warehouse" : "/"}`)}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditMaterial(true))}/>
                </div>
                <div>
                    <StatCards cards={[
                        {
                            label: t("stats.totalMaterial"),
                            value: materialStats?.totalMaterial || 0,
                            color: "blue",
                            icon: <FaBoxesStacked/>
                        },
                        {
                            label: t("stats.lowStockAlert"),
                            value: materialStats?.totalLowStock || 0,
                            color: "amber",
                            icon: <BiSolidArchiveOut />
                        },
                        {
                            label: t("stats.outOfStock"),
                            // Sums all lines from the current data list
                            value: materialStats?.totalOutOfStock || 0,
                            color: "red",
                            icon: <BiSolidArchiveIn />
                        }
                    ]} />
                </div>
                <TableCus
                    columns={columns}
                    data={materialData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    isFetching={isFetching}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('table.code')}/${t('table.material')}`}
                    onClearAllFilters={handleClearAllFilters}
                    onStockIn={handleStockIn}
                    onStockOut={handleStockOut}
                    filterConfig={filterConfig}
                />
            </div>
            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={materialDataForUpdate ? "Update Material" : "Create Material"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!materialDataForUpdate}
                        validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={materialDataForUpdate ? materialDataForUpdate : initialValues}
                        isSubmitting={isLoadingCreateMaterial || isLoadingUpdateMaterial || isLoadingUploadFile}
                    />
                )
            }
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarMaterial(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarMaterial(false))}
                    severity={alertMaterial.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertMaterial.message}
                </Alert>
            </Snackbar>
            <FullScreenDialogStockIn/>
            <FullScreenDialogStockOut/>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteMaterialDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteMaterial}/>
        </div>
    )

    return content;
}

export default MaterialList;