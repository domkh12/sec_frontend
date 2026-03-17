import BackButton from "../../components/ui/BackButton.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    useCreateUserMutation, useDeleteUserMutation, useGetUserStatsQuery, useSetBlockUserMutation,
    useSetUnblockUserMutation,
    useUpdateUserMutation
} from "../../redux/feature/user/userApiSlice.js";
import * as Yup from "yup";
import {Alert, Snackbar} from "@mui/material";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {useGetUserQuery} from "../../redux/feature/user/userApiSlice.js";
import {
    setAlertUser, setFilterUser, setIdBlockUser, setIsOpenBlockUserDialog, setIsOpenDeleteUserDialog,
    setIsOpenDialogAddOrEditUser, setIsOpenSnackbarUser,
    setUserDataForUpdate
} from "../../redux/feature/user/userSlice.js";
import {useGetRoleQuery} from "../../redux/feature/role/roleApiSlice.js";
import useDebounce from "../../hook/useDebounce.jsx";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import {useGetDepartmentQuery, useGetDeptLookupQuery} from "../../redux/feature/department/departmentApiSlice.js";
import StatCards from "../../components/card/StatCards.jsx";
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import DialogConfirmBlock from "../../components/dialog/DialogConfirmBlock.jsx";

function UserList(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [id, setId] = useState(null);
    const userDataForUpdate = useSelector((state) => state.user.userDataForUpdate);
    const isOpen = useSelector((state) => state.user.isOpenDialogAddOrEditUser);
    const isOpenSnackbar = useSelector((state) => state.user.isOpenSnackbarUser);
    const alertUser = useSelector((state) => state.user.alertUser);
    const isOpenDeleteDialog = useSelector((state) => state.user.isOpenDeleteUserDialog);
    const isOpenBlockDialog = useSelector((state) => state.user.isOpenBlockUserDialog);
    const idBlockUser = useSelector((state) => state.user.idBlockUser);
    const filterValue = useSelector((state) => state.user.filter);
    const searchValue = useSelector((state) => state.user.filter.search);
    const debounceSearch = useDebounce(searchValue, 500);
    const [blockUser, {isLoading: isLoadingBlockUser}] = useSetBlockUserMutation();
    const [unblockUser] = useSetUnblockUserMutation();
    const {data: userState, isLoading: isLoadingUserStats, isSuccess: isSuccessUserStats} = useGetUserStatsQuery();
    const[createUser, {isLoading: isLoadingCreateUser}] = useCreateUserMutation();
    const [updateUser, {isLoading: isLoadingUpdateUser}] = useUpdateUserMutation();
    const [deleteUser, {isLoading: isLoadingDeleteUser}] = useDeleteUserMutation();
    const {data: deptLookupData} = useGetDeptLookupQuery();
    const {data: deptData} = useGetDepartmentQuery({
        pageNo: 1,
        pageSize: 999
    })
    const {data: userData, isLoading, isSuccess, isFetching} = useGetUserQuery({
        ...filterValue,
        search: debounceSearch,
        roleId: filterValue.role,
        departmentId: filterValue.department,
        status: filterValue.status
    });
    const {data: roleData} = useGetRoleQuery({
        pageNo: 1,
        pageSize: 999
    });

    const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterUser({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterUser(newFilter));
    }

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterUser({
            ...filterValue,
            pageNo: newPage + 1
        }));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterUser({
            ...filterValue,
            pageSize: parseInt(event.target.value, 10),
            pageNo: 1
        }));
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditUser(false));
        dispatch(setUserDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        employeeId: Yup.string()
            .required(t("validation.required")),

        firstName: Yup.string()
            .min(2, t("validation.minLength", { min: 2 }))
            .required(t("validation.required")),

        lastName: Yup.string()
            .min(2, t("validation.minLength", { min: 2 }))
            .required(t("validation.required")),

        email: Yup.string()
            .email(t("validation.invalidEmail"))
            .nullable()
            .optional(),

        phoneNumber: Yup.string()
            .matches(/^[0-9+\s\-()]{7,15}$/, t("validation.invalidPhone"))
            .required(t("validation.required")),

        username: Yup.string()
            .min(2, t("validation.minLength", { min: 2 }))
            .max(20, t("validation.maxLength", { max: 20 }))
            .matches(/^[a-zA-Z0-9_]+$/, t("validation.usernameFormat"))
            .required(t("validation.required")),

        password: userDataForUpdate
            ? Yup.string()          // not required on update
            : Yup.string()
                .min(8, t("validation.minLength", { min: 8 }))
                .matches(/[A-Z]/, t("validation.passwordUppercase"))
                .matches(/[0-9]/, t("validation.passwordNumber"))
                .required(t("validation.required")),

        confirmPassword: userDataForUpdate
            ? Yup.string()          // not required on update
            : Yup.string()
                .oneOf([Yup.ref("password"), null], t("validation.passwordMismatch"))
                .required(t("validation.required")),

        role: Yup.number().typeError(t("validation.required"))
            .required(t("validation.required")),
    });

    const handleSubmit = async (values, {resetForm}) => {
        try {
            if (userDataForUpdate) {
                await updateUser({
                    id: userDataForUpdate.id,
                    employeeId: values.employeeId,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    username: values.username,
                    password: values.password,
                    roleId: values.role,
                    lineId: values.department.lineId,
                    departmentId: values.department.deptId,
                    position: values.position,
                }).unwrap();
                dispatch(setAlertUser({type: "success", message: "Update successfully"}));
                dispatch(setUserDataForUpdate(null));
            }else {
                await createUser({
                    employeeId: values.employeeId,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    username: values.username,
                    password: values.password,
                    roleId: values.role,
                    lineId: values.department.lineId,
                    departmentId: values.department.deptId,
                    position: values.position,
                }).unwrap();
                dispatch(setAlertUser({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarUser(true));
            dispatch(setIsOpenDialogAddOrEditUser(false));
            resetForm();
        } catch (error) {
            dispatch(setAlertUser({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarUser(true));
        }
    };

    const fields = [
        { name: "employeeId", label: "table.employeeId", type: "text"},
        { name: "firstName",     label: "table.firstName",     type: "text" },
        { name: "lastName",     label: "table.lastName",     type: "text" },
        { name: "email",     label: "table.email",     type: "email" },
        { name: "phoneNumber",     label: "table.phoneNumber",     type: "text" },
        { name: "username", label: "table.username", type: "text"},
        { name: "password",         label: "table.password",         type: "password", hideOnUpdate: true },
        { name: "confirmPassword",  label: "table.confirmPassword",  type: "password", hideOnUpdate: true },
        { name: "position", label: "table.position", type: "text" },
        {
            name: "role",
            label: "table.role",
            type: "autocomplete",
            minWidth: 130,
            fetchOptions: async () => {
                return Object.values(roleData?.entities ?? {}).map((role) => ({
                    value: role.id,
                    label: role.name,
                }));
            },
        },
        {
            name: "department",
            label: "table.department",
            type: "nestedSelect",
            minWidth: 130,
            options: deptLookupData,
            fetchOptions: async () => {
                return Object.values(deptData?.entities ?? {}).map((dept) => ({
                    value: dept.id,
                    label: dept.department,
                }));
            },
        }
    ];

    // Add this after your columns definition or in a separate constant
    const filterConfig = [
        {
            id: 'role',
            label: t("table.role"),
            width: 150,
            options: [
                { value: 'all', label: t('filter.all') },
                // You can dynamically generate these from roleData
                ...(roleData?.ids?.map(id => ({
                    value: roleData.entities[id].id,
                    label: roleData.entities[id].name
                })) || [])
            ]
        },
        {
            id: 'status',
            label: t("table.status"),
            width: 150,
            options: [
                { value: 'all', label: t('filter.all') },
                { value: 'Active', label: t('Active') },
                { value: 'Inactive', label: t('Inactive') },
                { value: 'Blocked', label: t('Blocked') }
            ]
        },
        {
            id: 'department',
            label: t("table.department"),
            width: 150,
            options: [
                { value: 'all', label: t('filter.all') },
                ...(deptData?.ids?.map(id => ({
                    value: deptData.entities[id].id,
                    label: deptData.entities[id].department
                })) || [])
            ]
        }
    ];

    const handleClearAllFilters = () => {
        dispatch(setFilterUser({
            ...filterValue,
            role: "",
            status: "",
            department: "",
            search: "",
        }));
    };

    const initialValues = {
        employeeId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "",
        department: {},
        position: "",
    };

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditUser(true));
        dispatch(setUserDataForUpdate({
            id: row.id,
            employeeId: row.employeeId,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            phoneNumber: row.phoneNumber,
            username: row.username,
            role: row.roleId,
            department: {
                deptId: row.departmentId,
                lineId: row.lineId
            },
            position: row.position
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

    const handleBlock = async () => {
        await blockUser(idBlockUser).unwrap();
        dispatch(setIsOpenBlockUserDialog(false));
        dispatch(setAlertUser({type: "success", message: "Block successfully"}));
        dispatch(setIsOpenSnackbarUser(true));
    };

    const handleUnblock = async (user) => {
       await unblockUser(user.id).unwrap();
    };

    const columns = [
        {
            id: "employeeId",
            label: "employeeId",
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
            id: "phoneNumber",
            label: t("table.phoneNumber"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "position",
            label: t('table.position'),
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

    if (isLoading || isLoadingUserStats) content = (<LoadingComponent/>);

    if (isSuccess && isSuccessUserStats){
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
                    <div>
                        <StatCards cards={[
                            { label: "Total Users",  value: userState.totalUsers,  color: "violet", icon: <PeopleAltRoundedIcon fontSize="small"/> },
                            { label: "Active",      value: userState.activeUsers,   color: "emerald", icon: <WifiRoundedIcon fontSize="small"/>},
                            { label: "Inactive",  value: userState.inactiveUsers,   color: "amber", icon: <WifiOffRoundedIcon fontSize="small"/> },
                            { label: "Blocked",      value: userState.blockedUsers,   color: "red", icon: <BlockRoundedIcon fontSize="small"/> },
                        ]} />
                    </div>
                    <TableCus
                        columns={columns}
                        data={userData}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        onEdit={handleEdit}
                        onBlock={(user) => {
                            dispatch(setIdBlockUser(user.id));
                            dispatch(setIsOpenBlockUserDialog(true));
                        }}
                        onUnblock={handleUnblock}
                        onDelete={handleDeleteOpen}
                        isFilterActive={true}
                        searchPlaceholderText={`${t('table.firstName')}/${t('table.lastName')}/${t('table.phoneNumber')}/${t('table.position')}`}
                        filterValue={filterValue}
                        handleFilterChange={handleFilterChange}
                        isFetching={isFetching}
                        filterConfig={filterConfig}
                        onClearAllFilters={handleClearAllFilters}
                    />
                </div>
                <DialogAddEditCus
                    fields={fields}
                    title={userDataForUpdate ? "Update User" : "Create User"}
                    isOpen={isOpen}
                    onClose={handleClose}
                    isUpdate={!!userDataForUpdate}
                    validationSchema={validationSchema}
                    handleSubmit={handleSubmit}
                    initialValues={userDataForUpdate ? userDataForUpdate : initialValues}
                    isSubmitting={isLoadingCreateUser || isLoadingUpdateUser}
                />
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
                <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteUserDialog(false))} handleDelete={handleDelete} isSubmitting={isLoadingDeleteUser}/>
                <DialogConfirmBlock isOpen={isOpenBlockDialog} onClose={() => dispatch(setIsOpenBlockUserDialog(false))} handleBlock={handleBlock} isSubmitting={isLoadingBlockUser}/>
            </div>
        )
    }


    return content;
}

export default UserList;