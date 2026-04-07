import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    useCreateMaterialMutation,
    useDeleteMaterialMutation, useGetMaterialStatsQuery,
    useUpdateMaterialMutation
} from "../../redux/feature/material/materialApiSlice.js";
import useDebounce from "../../hook/useDebounce.jsx";
import {
    setAlertMaterial,
    setMaterialDataForUpdate,
    setFilterMaterial, setIsOpenDeleteMaterialDialog,
    setIsOpenDialogAddOrEditMaterial, setIsOpenSnackbarMaterial, setIsFullScreenDialogStockIn,
    setIsFullScreenDialogStockOut
} from "../../redux/feature/material/materialSlice.js";
import * as Yup from "yup";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import Seo from "../../components/seo/Seo.jsx";
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import StatCards from "../../components/card/StatCards.jsx";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import {Alert, Snackbar} from "@mui/material";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {useGetMaterialQuery} from "../../redux/feature/material/materialApiSlice.js";
import {useUploadFileMutation} from "../../redux/feature/file/fileApiSlice.js";
import { FaBoxesStacked } from "react-icons/fa6";
import { BiSolidArchiveOut } from "react-icons/bi";
import { BiSolidArchiveIn } from "react-icons/bi";
import { BiSolidArchive } from "react-icons/bi";
import FullScreenDialogStockIn from "../../components/dialog/FullScreenDialogStockIn.jsx";
import FullScreenDialogStockOut from "../../components/dialog/FullScreenDialogStockOut.jsx";

function MaterialList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const materialDataForUpdate = useSelector((state) => state.material.materialDataForUpdate);
    const isOpen = useSelector((state) => state.material.isOpenDialogAddOrEditMaterial);
    const isOpenSnackbar = useSelector((state) => state.material.isOpenSnackbarMaterial);
    const alertMaterial = useSelector((state) => state.material.alertMaterial);
    const isOpenDeleteDialog = useSelector((state) => state.material.isOpenDeleteMaterialDialog);
    const[createMaterial, {isLoading: isLoadingCreateMaterial}] = useCreateMaterialMutation();
    const [updateMaterial, {isLoading: isLoadingUpdateMaterial}] = useUpdateMaterialMutation();
    const [uploadFile, {isLoading: isLoadingUploadFile}] = useUploadFileMutation();
    const filterValue = useSelector((state) => state.material.filter);
    const debounceSearch = useDebounce(filterValue.search, 500);
    const [deleteMaterial, {isLoading: isLoadingDeleteMaterial}] = useDeleteMaterialMutation();
    const {data: materialStats} = useGetMaterialStatsQuery();
    const {data: materialData, isLoading, isSuccess, isFetching} = useGetMaterialQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch,
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
            .test("fileType", "Only JPG/PNG allowed", (value) => {
                if (!value) return false;
                if (typeof value === "string") return true;

                return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
            })
            .test("fileSize", "File too large (max 2MB)", (value) => {
                if (!value || typeof value === "string") return true;

                return value.size <= 2 * 1024 * 1024;
            }),
        unit: Yup.string().typeError(t("validation.required"))
            .required(t("validation.required")),
    });

    const handleSubmit = async (values, {resetForm}) => {
        let imageUri = null;
        if (values.image) {
            const formData = new FormData();
            formData.append("file", values.image);
            const res = await uploadFile(formData).unwrap();
            imageUri = res.uri;
        }
        console.log(values)
        try {
            if (materialDataForUpdate) {
                await updateMaterial({
                    id: materialDataForUpdate.id,
                    name: values.name,
                }).unwrap();
                dispatch(setAlertMaterial({type: "success", message: "Update successfully"}));
                dispatch(setMaterialDataForUpdate(null));
            }else {
                await createMaterial({
                    code: values.code,
                    name: values.name,
                    image: imageUri ? imageUri : null,
                    unit: values.unit,
                }).unwrap();
                dispatch(setAlertMaterial({type: "success", message: "Create successfully"}));
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
            options: [
                { value: "PCS", label: "Pcs" },
                { value: "KG", label: "Kg" },
                { value: "Meter", label: "M" },
            ],
        },
        {
            name: "image",
            label: "table.image",
            type: "image",
            onChange: (e) => {
                const file = e.target.files[0];
                console.log(file);
                // if (file) {
                //     const reader = new FileReader();
                //     reader.onloadend = () => {
                //         dispatch(setMaterialDataForUpdate({
                //             ...materialDataForUpdate,
                //         }))
                //     }
                // }
            }
        }
    ];

    const initialValues ={
        code: "",
        name: "",
        unit: "",
        image: null,
    }

    const handleEdit = (row) => {
        // dispatch(setIsOpenDialogAddOrEditMaterial(true));
        // dispatch(setMaterialDataForUpdate(row));
    };

    const handleDeleteOpen = (row) => {
        // dispatch(setIsOpenDeleteMaterialDialog(true));
        // setId(row.id);
    };

    const handleStockIn = (row) => {
        dispatch(setIsFullScreenDialogStockIn(true));
        console.log(row)
    }

    const handleStockOut = (row) => {
        dispatch(setIsFullScreenDialogStockOut(true));
        console.log(row)
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
                    <BackButton onClick={() => navigate("/admin")}/>
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
                            label: t("stats.totalStockIn"),
                            value: materialStats?.totalMaterial || 0,
                            color: "blue",
                            icon: <BiSolidArchiveOut />
                        },
                        {
                            label: t("stats.totalStockOut"),
                            // Sums all lines from the current data list
                            value: materialStats?.activeOrder || 0,
                            color: "violet",
                            icon: <BiSolidArchiveIn />
                        },
                        {
                            label: t("stats.balance"),
                            // Sums all workers from the current data list
                            value: materialStats?.totalPcs || 0,
                            color: "emerald",
                            icon: <BiSolidArchive/>
                        },
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
                    searchPlaceholderText={`${t('table.material')}`}
                    onClearAllFilters={handleClearAllFilters}
                    onStockIn={handleStockIn}
                    onStockOut={handleStockOut}
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