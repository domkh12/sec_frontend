import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";
import { useTranslation } from "react-i18next";
import TableCus from "../../components/table/TableCus";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteDefectDetailMutation, useGetDefectDetailQuery, useUpdateDefectQtyMutation } from "../../redux/feature/defect-detail/defectDetailApiSlice";
import useDebounce from "../../hook/useDebounce";
import { setAlertDefectDetail, setDefectDetailDataForUpdate, setFilterDefectDetail, setIsOpenDeleteDefectDetailDialog, setIsOpenDialogAddOrEditDefectDetail, setIsOpenSnackbarDefectDetail } from "../../redux/feature/defect-detail/defectDetailSlice";
import { useGetProductionLineLookupQuery } from "../../redux/feature/productionLine/productionLineApiSlice";
import { useBreakpoints } from "../../hook/useBreakpoints";
import LoadingComponent from "../../components/ui/LoadingComponent";
import { useGetTimeLookupQuery } from "../../redux/feature/time/timeApiSlice";
import { setIsOpenDeleteOutputDetailDialog } from "../../redux/feature/outputDetail/outputDetailSlice";
import { useState } from "react";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete";
import { Alert, Snackbar } from "@mui/material";
import { useGetBuyerLookupQuery } from "../../redux/feature/buyer/buyerApiSlice";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import * as Yup from 'yup';
import { useGetDefectTypeLookupQuery } from "../../redux/feature/defect-type/defectTypeApiSlice";

function DefectDetail() {

    // -- State -----------------------------------------------------------------
    const [id, setId] = useState(null);
    
    // -- Selector --------------------------------------------------------------
    const alertDefectDetail           = useSelector((state) => state.defectDetail.alertDefectDetail); 
    const isOpenSnackbar              = useSelector((state) => state.defectDetail.isOpenSnackbarDefectDetail);
    const isOpenDeleteDialog          = useSelector((state) => state.defectDetail.isOpenDeleteDefectDetailDialog);
    const filterValue                 = useSelector((state) => state.defectDetail.filter);
    const debounceSearch              = useDebounce(filterValue.search, 500);
    const isOpen                      = useSelector((state) => state.defectDetail.isOpenDialogAddOrEditDefectDetail);
    const defectDetailDataForUpdate   = useSelector((state) => state.defectDetail.defectDetailDataForUpdate);
    
    // -- Hook ------------------------------------------------------------------
    const navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {isMd} = useBreakpoints();

    // -- Query -----------------------------------------------------------------
    const {data: defectDetailData
        , isLoading, isSuccess
    } = useGetDefectDetailQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: debounceSearch,
        lineId: filterValue.lineId,
        buyerId: filterValue.buyerId,
        reportDate: filterValue.reportDate,
        defectTypeId: filterValue.typeId,
    });
    
    const {data: lineData} = useGetProductionLineLookupQuery();
    const {data: buyerData} = useGetBuyerLookupQuery();
    const {data: defectTypeData} = useGetDefectTypeLookupQuery();
    console.log("defectTypeData", defectTypeData);

    // -- Mutation ---------------------------------------------------------------
    const [deleteDefectDetail, {isLoading: isLoadingDefectDetail}] = useDeleteDefectDetailMutation();
    const [updateDefectQty, {isLoading: isLoadingUpdate}] = useUpdateDefectQtyMutation();

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
                  buyerId: "",
                  reportDate: "",
              }))
          }  
          
    const handleEdit = (row) => {
            dispatch(setIsOpenDialogAddOrEditDefectDetail(true));
            dispatch(setDefectDetailDataForUpdate({
                id: row.id,
                defectQty: row.defectQty,
            }));
        };      

    const handleDeleteOpen = (row) => {
            dispatch(setIsOpenDeleteDefectDetailDialog(true));
            setId(row.id);
        };

     const handleDelete = async () => {
            try {
                await deleteDefectDetail({id: id}).unwrap();
                dispatch(setIsOpenDeleteDefectDetailDialog(false));
                dispatch(setAlertDefectDetail({type: "success", message: "Delete successfully"}));
                dispatch(setIsOpenSnackbarDefectDetail(true));
            }catch (error) {
                dispatch(setIsOpenDeleteDefectDetailDialog(false));
                dispatch(setAlertDefectDetail({type: "error", message: error.data.error.description}));
                dispatch(setIsOpenSnackbarDefectDetail(true));
            }
        }

     const handleClose = () => {
             dispatch(setIsOpenDialogAddOrEditDefectDetail(false));
             dispatch(setDefectDetailDataForUpdate(null));
         }      
     
    const handleSubmit = async (values, {resetForm}) => {
                    console.log(values);
                try{
                    if (defectDetailDataForUpdate) {
                        await updateDefectQty({
                            id: defectDetailDataForUpdate.id,
                            qty: values.defectQty
                        }).unwrap();
                        dispatch(setAlertDefectDetail({type: "success", message: "Update successfully"}));
                        dispatch(setDefectDetailDataForUpdate(null));
                        dispatch(setIsOpenSnackbarDefectDetail(true));
                        dispatch(setIsOpenDialogAddOrEditDefectDetail(false));
                        resetForm();
                    }
                    
                } catch (error) {
                    console.log(error);
                    dispatch(setAlertDefectDetail({type: "error", message: error.data.error.description}));
                    dispatch(setIsOpenSnackbarDefectDetail(true));
                }
            };
         
      const validationSchema = Yup.object().shape({
             defectQty: Yup.number().required(t("validation.required"))
         });    

    const columns = [
        {
            id: "reportDate",
            label: t("reportDate"),
            minWidth: 110,
            align: "left",
            isDescription: true,
            // cut string from 0 to space
            format: (value) => value?.slice(0, value?.indexOf(" ")),
            description: (value) => value?.slice(value?.indexOf(" ") + 1),
        },
         {
            id: "image",
            label: t("image"),
            minWidth: 110,
            align: "left",
        },
        {
            id: "mo",
            label: t("mo"),
            minWidth: 110,
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
            id: "type",
            label: t("defectType"),
            minWidth: 150,
            align: "left",
        },
        {
            id: "defectQty",
            label: t("defectQty"),
            minWidth: 90,
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
            id: 'buyerId',
            label: t("buyer"),
            width: isMd ? 150 : "100%", 
            options: [
                ...(buyerData?.map(id => ({
                    value: id.id,
                    label: id.name
                })) || [])
            ]
        },
        {
            id: 'typeId',
            label: t("defectType"),
            width: isMd ? 150 : "100%",
            options: [
                ...(defectTypeData?.map(id => ({
                    value: id.id,
                    label: id.name
                })) || [])
            ]
        },
        {
            id: "reportDate",
            label: t("reportDate"),
            type: "date",
            width: 180,
        },
    ];

    const fields = [
        { name: "defectQty",     label: "qty",     type: "number" }
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
            <DialogConfirmDelete
                        isOpen={isOpenDeleteDialog}
                        onClose={() => dispatch(setIsOpenDeleteDefectDetailDialog(false))}
                        handleDelete={handleDelete}
                        isSubmitting={isLoadingDefectDetail}
                    /> 
            <DialogAddEditCus
                fields={fields}
                title={"Update Defect Detail"}
                isOpen={isOpen}
                onClose={handleClose}
                isUpdate={true}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                isSubmitting={isLoadingUpdate}
                initialValues={{
                    defectQty: defectDetailDataForUpdate?.defectQty ?? 0
                }}/>    

            <Snackbar
                        open={isOpenSnackbar}
                        autoHideDuration={6000}
                        onClose={() => dispatch(setIsOpenSnackbarDefectDetail(false))}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert
                            onClose={() => dispatch(setIsOpenSnackbarDefectDetail(false))}
                            severity={alertDefectDetail.type}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {alertDefectDetail.message}
                        </Alert>
                    </Snackbar>
        </div>
    )

    return content;
}

export default DefectDetail;