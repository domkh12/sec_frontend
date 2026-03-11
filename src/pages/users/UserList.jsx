import BackButton from "../../components/ui/BackButton.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    useCreateUserMutation, useDeleteUserMutation,
    useUpdateUserMutation
} from "../../redux/feature/user/userApiSlice.js";
import {useGetDepartmentQuery} from "../../redux/feature/department/departmentApiSlice.js";
import * as Yup from "yup";
import {Alert, Backdrop, Snackbar} from "@mui/material";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {useGetUserQuery} from "../../redux/feature/user/userApiSlice.js";
import {
    setAlertUser, setIsOpenDeleteUserDialog,
    setIsOpenDialogAddOrEditUser, setIsOpenSnackbarUser,
    setPageNoUser,
    setPageSizeUser,
    setUserDataForUpdate
} from "../../redux/feature/user/userSlice.js";
import {useGetRoleQuery} from "../../redux/feature/role/roleApiSlice.js";

function UserList(){
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const pageNo = useSelector((state) => state.user.pageNo);
    const pageSize = useSelector((state) => state.user.pageSize);
    const userDataForUpdate = useSelector((state) => state.user.userDataForUpdate);
    const isOpen = useSelector((state) => state.user.isOpenDialogAddOrEditUser);
    const isOpenSnackbar = useSelector((state) => state.user.isOpenSnackbarUser);
    const alertUser = useSelector((state) => state.user.alertUser);
    const isOpenDeleteDialog = useSelector((state) => state.user.isOpenDeleteUserDialog);
    const[createUser] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const {data: userData, isLoading, isSuccess} = useGetUserQuery({
        pageNo: pageNo,
        pageSize: pageSize
    });
    const {data: deptData} = useGetDepartmentQuery({
        pageNo: 1,
        pageSize: 999
    });
    const {data: roleData} = useGetRoleQuery({
        pageNo: 1,
        pageSize: 999
    });

    const handleChangePage = (event, newPage) => {
        dispatch(setPageNoUser(newPage + 1));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setPageSizeUser(event.target.value));
        dispatch(setPageNoUser(1));
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditUser(false));
        dispatch(setUserDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        line: Yup.string().required(t("validation.required")),
        userId: Yup.number().required(t("validation.required")),
    });

    const handleSubmit = async (values, {resetForm}) => {
        try {
            // if (userDataForUpdate) {
            //     await updateUser({
            //         id: userDataForUpdate.id,
            //         line: values.line,
            //         userId: values.userId,
            //     }).unwrap();
            //     dispatch(setAlertUser({type: "success", message: "Update successfully"}));
            //     dispatch(setUserDataForUpdate(null));
            // }else {
            //     await createUser({
            //         line: values.line,
            //         userId: values.userId
            //     }).unwrap();
            //     dispatch(setAlertUser({type: "success", message: "Create successfully"}));
            // }
            dispatch(setIsOpenSnackbarUser(true));
            dispatch(setIsOpenDialogAddOrEditUser(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertUser({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarUser(true));
        }
    };

    const fields = [
        { name: "employee_id",     label: "table.employeeId",     type: "text" },
        { name: "firstName",     label: "table.firstName",     type: "text" },
        { name: "lastName",     label: "table.lastName",     type: "text" },
        { name: "email",     label: "table.email",     type: "email" },
        { name: "status",     label: "table.status",     type: "email" },
        { name: "phoneNumber",     label: "table.phoneNumber",     type: "text" },
    ];

    const initialValues ={
        line: "",
        userId: "",
    }

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditUser(true));
        dispatch(setUserDataForUpdate({
            id: row.id,
            line: row.line,
            userId: row.userId,
        }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteUserDialog(true));
        setId(row.id);
    };

    const handleDelete = async () => {
        console.log(id);
        try {
            await deleteUser({id: id}).unwrap();
            dispatch(setIsOpenDeleteUserDialog(false));
            dispatch(setAlertUser({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarUser(true));
        }catch (error) {
            dispatch(setIsOpenDeleteUserDialog(false));
            dispatch(setAlertUser({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarUser(true));
        }
    }

    const columns = [
        {
            id: "id",
            label: "#",
            minWidth: 50,
            align: "left",
        },
        {
            id: "firstName",
            label: t("table.firstName"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "lastName",
            label: t("table.lastName"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "email",
            label: t("table.email"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "role",
            label: t("table.role"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "department",
            label: t("table.department"),
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
            id: "lastLogin",
            label: t("table.lastLogin"),
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

    if (isSuccess){
        console.log(roleData)
        content = (
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
                        <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditUser(true))}/>
                    </div>
                    <TableCus columns={columns} data={userData} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} onEdit={handleEdit} onDelete={handleDeleteOpen}/>
                </div>
                <DialogAddEditCus
                    fields={fields}
                    title={userDataForUpdate ? "Update User" : "Create User"}
                    isOpen={isOpen}
                    onClose={handleClose}
                    isUpdate={!!userDataForUpdate}
                    validationSchema={validationSchema}
                    handleSubmit={handleSubmit}
                    initialValues={userDataForUpdate ? userDataForUpdate : initialValues}/>
                <Snackbar
                    open={isOpenSnackbar}
                    autoHideDuration={6000}
                    onClose={() => dispatch(setIsOpenSnackbarUser(false))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => dispatch(setIsOpenSnackbarUser(false))}
                        severity={alertUser.type}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {alertUser.message}
                    </Alert>
                </Snackbar>
                <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteUserDialog(false))} handleDelete={handleDelete}/>
            </div>
        )
    }


    return content;
}

export default UserList;