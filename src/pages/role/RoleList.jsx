import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useGetRoleQuery} from "../../redux/feature/role/roleApiSlice.js";
import {
    setFilterRole,
} from "../../redux/feature/role/roleSlice.js";
import BackButton from "../../components/ui/BackButton.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import useDebounce from "../../hook/useDebounce.jsx";
import LoadingComponent from "../../components/ui/LoadingComponent.jsx";
import Seo from "../../components/seo/Seo.jsx";

function RoleList(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const filterValue = useSelector((state) => state.role.filter);
    const searchValue = useSelector((state) => state.role.filter.search);
    const debounceSearch = useDebounce(searchValue, 500);
    const {data: roleData, isLoading, isSuccess, isFetching} = useGetRoleQuery({
        ...filterValue,
        search: debounceSearch,
    });
    console.log({isFetching});
    const handleFilterChange = (key, value) => {
        dispatch(setFilterRole({
            ...filterValue,
            [key]: value,
        }));
    }

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterRole({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterRole({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1
        }));
    };

    const columns = [
        {
            id: "id",
            label: "#",
            minWidth: 50,
            align: "left",
        },
        {
            id: "name",
            label: t("table.role"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "description",
            label: t("table.description"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "users",
            label: t("table.users"),
            minWidth: 130,
            align: "left",
        },
    ]

    let content;

    if (isLoading) content = (<LoadingComponent/>);

    if (isSuccess){
        content = (
            <div className="pb-10">
                <Seo title="Role List"/>
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
                    </div>
                    <TableCus columns={columns} data={roleData} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} searchPlaceholderText={`${t('table.role')}/${t('table.description')}`}  isFilterActive={true} handleFilterChange={handleFilterChange} filterValue={filterValue} isFetching={isFetching}/>
                </div>
            </div>
        )
    }


    return content;
}

export default RoleList;