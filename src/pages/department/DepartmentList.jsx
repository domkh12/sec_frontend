import {Alert, Backdrop, Snackbar} from "@mui/material";
import {useTranslation} from "react-i18next";
import BackButton from "../../components/ui/BackButton.jsx";
import {useNavigate} from "react-router-dom";
import CardList from "../../components/ui/CardList.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import {
    useCreateDepartmentMutation,
    useDeleteDepartmentMutation,
    useGetDepartmentQuery, useUpdateDepartmentMutation
} from "../../redux/feature/department/departmentApiSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {
    setAlertDept,
    setDepartmentDataForUpdate, setIsOpenDeleteDeptDialog,
    setIsOpenDialogAddOrEditDepartment, setIsOpenSnackbarDepartment,
    setPageNoDepartment,
    setPageSizeDepartment
} from "../../redux/feature/department/departmentSlice.js";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import * as Yup from "yup";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {useState} from "react";

function DepartmentList(){
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const pageNo = useSelector((state) => state.department.pageNo);
    const pageSize = useSelector((state) => state.department.pageSize);
    const departmentDataForUpdate = useSelector((state) => state.department.departmentDataForUpdate);
    const isOpen = useSelector((state) => state.department.isOpenDialogAddOrEditDepartment);
    const isOpenSnackbar = useSelector((state) => state.department.isOpenSnackbarDepartment);
    const alertDept = useSelector((state) => state.department.alertDept);
    const isOpenDeleteDialog = useSelector((state) => state.department.isOpenDeleteDeptDialog);
    const[createDept] = useCreateDepartmentMutation();
    const [updateDept] = useUpdateDepartmentMutation();
    const [deleteDept] = useDeleteDepartmentMutation();
    const {data: deptData, isLoading, isSuccess} = useGetDepartmentQuery({
        pageNo: pageNo,
        pageSize: pageSize
    });

    const handleChangePage = (event, newPage) => {
        dispatch(setPageNoDepartment(newPage + 1));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setPageSizeDepartment(event.target.value));
        dispatch(setPageNoDepartment(1));
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditDepartment(false));
        dispatch(setDepartmentDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        department: Yup.string().required(t("validation.required"))
    });

    const handleSubmit = async (values, {resetForm}) => {
        try {
            if (departmentDataForUpdate) {
                 await updateDept({
                    id: departmentDataForUpdate.id,
                    department: values.department,
                }).unwrap();
                dispatch(setAlertDept({type: "success", message: "Update successfully"}));
                dispatch(setDepartmentDataForUpdate(null));
            }else {
                await createDept({
                    department: values.department,
                }).unwrap();
                dispatch(setAlertDept({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarDepartment(true));
            dispatch(setIsOpenDialogAddOrEditDepartment(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertDept({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarDepartment(true));
        }
    };

    const fields = [
        { name: "department",     label: "table.department",     type: "text" },
    ];

    const initialValues ={
        department: ""
    }

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditDepartment(true));
        dispatch(setDepartmentDataForUpdate(row));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteDeptDialog(true));
        setId(row.id);
    };

    const handleDelete = async () => {
        console.log(id);
        try {
            await deleteDept({id: id}).unwrap();
            dispatch(setIsOpenDeleteDeptDialog(false));
            dispatch(setAlertDept({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarDepartment(true));
        }catch (error) {
            dispatch(setIsOpenDeleteDeptDialog(false));
            dispatch(setAlertDept({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarDepartment(true));
        }
    }

    const columns = [
        {
            id: "id",
            label: t("id"),
            minWidth: 50,
            align: "left",
        },
        {
            id: "department",
            label: t("department.title"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "updatedAt",
            label: t("table.updatedAt"),
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

    if (isLoading) content = <Backdrop open={isLoading}/>;

    if (isSuccess) content = (
        <div className="pb-10">
            <div className={`
                    relative z-10 gap-2
                    px-5 py-2.5 m-2
                    rounded-xl overflow-hidden
                    border border-white/25
                    bg-white/10
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.25)]
                    backdrop-blur-md
                    transition-all duration-200 ease-out
                `}>
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditDepartment(true))}/>
                </div>
                <TableCus columns={columns} data={deptData} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} onEdit={handleEdit} onDelete={handleDeleteOpen}/>
            </div>
            <DialogAddEditCus
                fields={fields}
                title={departmentDataForUpdate ? "Update Department" : "Create Department"}
                isOpen={isOpen}
                onClose={handleClose}
                isUpdate={!!departmentDataForUpdate}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                initialValues={departmentDataForUpdate ? departmentDataForUpdate : initialValues}/>
            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarDepartment(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarDepartment(false))}
                    severity={alertDept.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertDept.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteDeptDialog(false))} handleDelete={handleDelete}/>
        </div>
    )

    return content;
}

export default DepartmentList;