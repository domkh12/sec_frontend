import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";
import { useTranslation } from "react-i18next";
import TableCus from "../../components/table/TableCus";
import { useDispatch, useSelector } from "react-redux";
import { useGetDefectDetailQuery } from "../../redux/feature/defect-detail/defectDetailApiSlice";
import useDebounce from "../../hook/useDebounce";
import { setDefectDetailDataForUpdate, setFilterDefectDetail, setIsOpenDialogAddOrEditDefectDetail } from "../../redux/feature/defect-detail/defectDetailSlice";
import { useGetProductionLineLookupQuery } from "../../redux/feature/productionLine/productionLineApiSlice";
import { useBreakpoints } from "../../hook/useBreakpoints";
import LoadingComponent from "../../components/ui/LoadingComponent";
import { useGetTimeLookupQuery } from "../../redux/feature/time/timeApiSlice";
import { setIsOpenDeleteOutputDetailDialog } from "../../redux/feature/outputDetail/outputDetailSlice";
import { useState } from "react";

function DefectDetail() {

    // -- State -----------------------------------------------------------------
    const [id, setId] = useState(null);
    
    // -- Selector --------------------------------------------------------------
    const filterValue                 = useSelector((state) => state.defectDetail.filter);
    const debounceSearch              = useDebounce(filterValue.search, 500);

    // -- Query -----------------------------------------------------------------
    const {data: defectDetailData
        , isLoading, isSuccess
    } = useGetDefectDetailQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch
    });
    
    const {data: timeData} = useGetTimeLookupQuery();
    
    const {data: lineData} = useGetProductionLineLookupQuery();

    // -- Hook ------------------------------------------------------------------
    const navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {isMd} = useBreakpoints();

    // -- Handler ---------------------------------------------------------------
    const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterDefectDetail({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterDefectDetail(newFilter));
    }

    const handleChangePage = (event, newPage) => {
            dispatch(setFilterDefectDetail({
                ...filterValue,
                pageNo: newPage + 1,
            }));
        };

    const handleChangeRowsPerPage = (event, newValue) => {
            dispatch(setFilterDefectDetail({
                ...filterValue,
                pageNo: 1,
                pageSize: event.target.value,
            }));
        }; 
        
    const handleClearAllFilters = () => {
              dispatch(setFilterDefectDetail({
                  search: "",
                  lineId: "",
                  timeId: ""
              }))
          }  
          
    const handleEdit = (row) => {
            dispatch(setIsOpenDialogAddOrEditDefectDetail(true));
            dispatch(setDefectDetailDataForUpdate({
                id: row.id,
                qty: row.qty,
            }));
        };      

    const handleDeleteOpen = (row) => {
            dispatch(setIsOpenDeleteOutputDetailDialog(true));
            setId(row.id);
        };

    const columns = [
        {
            id: "reportDate",
            label: t("reportDate"),
            minWidth: 130,
            align: "left",
            isDescription: true,
            // cut string from 0 to space
            format: (value) => value?.slice(0, value?.indexOf(" ")),
            description: (value) => value?.slice(value?.indexOf(" ") + 1),
        },
        {
            id: "mo",
            label: t("mo"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "purchaseOrder",
            label: t("po"),
            minWidth: 130,
            align: "left",
            format: (value) => value?.po,
        },
        {
            id: "style",
            label: t("style"),
            minWidth: 130,
            align: "left",
            format: (value) => value?.styleNo,
        },
        {
            id: "buyer",
            label: t("buyer"),
            minWidth: 130,
            align: "left",
            format: (value) => value?.name,
        },
        {
            id: "defectQty",
            label: t("defectQty"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "defectDate",
            label: t("defectDate"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "time",
            label: t("time"),
            minWidth: 130,
            align: "left",
            format: (value) => value?.name,
        },
        {
            id: "line",
            label: t("line"),
            minWidth: 130,
            align: "left",
            format: (value) => value?.line,
        },
        {
            id: "action",
            label: t("action"),
            minWidth: 50,
            align: "left",
        },
    ]

    const filterConfig = [
        {
            id: 'lineId',
            label: t("productionLine"),
            width: isMd ? 150 : "100%",
            options: [
                ...(lineData?.map(id => ({
                    value: id.id,
                    label: id.line
                })) || [])
            ]
        },
        {
            id: 'timeId',
            label: t("time"),
            width: isMd ? 150 : "100%",
            options: [
                ...(timeData?.map(id => ({
                    value: id.id,
                    label: id.name
                })) || [])
            ]
        }
    ];
    
    let content;

    if(isLoading) content = <LoadingComponent/>;

    if(isSuccess) content = (
        <div className='card-glass'>
            <div className="flex justify-between items-center">
                <BackButton onClick={() => navigate("/admin")}/>
            </div>
             <TableCus
                    columns={columns}
                    data={defectDetailData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('mo')}/${t('po')}/${t('style')}`}
                    onClearAllFilters={handleClearAllFilters}
                    filterConfig={filterConfig}
                />
        </div>
    )

    return content;
}

export default DefectDetail;