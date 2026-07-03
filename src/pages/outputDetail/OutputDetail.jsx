import React, { useState } from 'react'
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TableCus from '../../components/table/TableCus.jsx';
import { useTranslation } from 'react-i18next';
import {useDeleteOutputDetailMutation, useGetOutputDetailQuery, useUpdateOutputQtyMutation} from "../../redux/feature/hourlyOutput/outputDetailApiSlice.js";
import dayjs from 'dayjs';
import { setAlertOutputDetail, setFilterOutputDetail, setIsOpenDeleteOutputDetailDialog, setIsOpenDialogAddOrEditOutputDetail, setIsOpenSnackbarOutputDetail, setOutputDetailDataForUpdate } from '../../redux/feature/outputDetail/outputDetailSlice.js';
import useDebounce from '../../hook/useDebounce.jsx';
import { useBreakpoints } from '../../hook/useBreakpoints.jsx';
import { useGetProductionLineLookupQuery } from '../../redux/feature/productionLine/productionLineApiSlice.js';
import { useGetSizeLookupQuery } from '../../redux/feature/size/sizeApiSlice.js';
import DialogConfirmDelete from '../../components/dialog/DialogConfirmDelete.jsx';
import DialogAddEditCus from '../../components/dialog/DialogAddEditCus.jsx';
import * as Yup from 'yup';
import { Alert, Snackbar } from '@mui/material';
import LoadingComponent from '../../components/ui/LoadingComponent.jsx';


function OutputDetail() {
    // -- State -----------------------------------------------------------------------------------------
    const [id, setId] = useState(null);

  // -- selector ----------------------------------------------------------------------------
  const filterValue                 = useSelector((state) => state.outputDetail.filter);
  const debounceSearch              = useDebounce(filterValue.search, 500);
  const isOpenDeleteDialog          = useSelector((state) => state.outputDetail.isOpenDeleteOutputDetailDialog);
  const outputDetailDataForUpdate   = useSelector((state) => state.outputDetail.outputDetailDataForUpdate);
  const isOpen                      = useSelector((state) => state.outputDetail.isOpenDialogAddOrEditOutputDetail);
  const alertOutputDetail           = useSelector((state) => state.outputDetail.alertOutputDetail);
  const isOpenSnackbar              = useSelector((state) => state.outputDetail.isOpenSnackbarOutputDetail);
  

  // -- Query --------------------------------------------------------------------------------
  const {data: outputDetail, isLoading, isSuccess} = useGetOutputDetailQuery({
    pageNo: filterValue.pageNo,
    pageSize: filterValue.pageSize,
    search: debounceSearch,
    lineId: filterValue.lineId,
    sizeId: filterValue.sizeId
  });

  const {data: lineData} = useGetProductionLineLookupQuery();
  const {data: sizeData} = useGetSizeLookupQuery();

  // -- mutation --------------------------------------------------------------------------------
  const [deleteOutputDetail, {isLoading: isLoadingOutputDetail}] = useDeleteOutputDetailMutation();
  const [updateOutputQty, {isLoading: isLoadingUpdateOutputQty}] = useUpdateOutputQtyMutation();
 
  // -- hook ---------------------------------------------------------------------------------
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const {t}       = useTranslation();
  const {isMd}    = useBreakpoints();

  // -- Handler ------------------------------------------------------------------------------

   const handleDelete = async () => {
        try {
            await deleteOutputDetail({id: id}).unwrap();
            dispatch(setIsOpenDeleteOutputDetailDialog(false));
            dispatch(setAlertOutputDetail({type: "success", message: "Delete successfully"}));
            dispatch(setIsOpenSnackbarOutputDetail(true));
        }catch (error) {
            dispatch(setIsOpenDeleteOutputDetailDialog(false));
            dispatch(setAlertOutputDetail({type: "error", message: error.data.error.description}));
            dispatch(setIsOpenSnackbarOutputDetail(true));
        }
    }

    const handleChangePage = (event, newPage) => {
        dispatch(setFilterOutputDetail({
            ...filterValue,
            pageNo: newPage + 1,
        }));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterOutputDetail({
            ...filterValue,
            pageNo: 1,
            pageSize: event.target.value,
        }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteOutputDetailDialog(true));
        setId(row.id);
    };

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditOutputDetail(true));
        dispatch(setOutputDetailDataForUpdate({
            id: row.id,
            qty: row.qty,
        }));
    };

    const handleSubmit = async (values, {resetForm}) => {
                console.log(values);
            try{
                if (outputDetailDataForUpdate) {
                     await updateOutputQty({
                        id: outputDetailDataForUpdate.id,
                        qty: values.qty
                    }).unwrap();
                    dispatch(setAlertOutputDetail({type: "success", message: "Update successfully"}));
                    dispatch(setOutputDetailDataForUpdate(null));
                    dispatch(setIsOpenSnackbarOutputDetail(true));
                    dispatch(setIsOpenDialogAddOrEditOutputDetail(false));
                    resetForm();
                }
                
            } catch (error) {
                console.log(error);
                dispatch(setAlertOutputDetail({type: "error", message: error.data.error.description}));
                dispatch(setIsOpenSnackbarOutputDetail(true));
            }
        };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditOutputDetail(false));
        dispatch(setOutputDetailDataForUpdate(null));
    }

     const validationSchema = Yup.object().shape({
        qty: Yup.number().required(t("validation.required"))
    });

  const handleFilterChange = (key, value) => {
        if (value === "all") {
            return dispatch(setFilterOutputDetail({
                ...filterValue,
                [key]: "",
            }));
        }
        const newFilter = {
            ...filterValue,
            [key]: value,
        }
        dispatch(setFilterOutputDetail(newFilter));
    }

    const handleClearAllFilters = () => {
          dispatch(setFilterOutputDetail({
              search: "",
              lineId: "",
              sizeId: ""
          }))
      }

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
            id: "size",
            label: t("size"),
            minWidth: 130,
            align: "left",
            format: (value) => value?.size,
        },
        {
            id: "qty",
            label: t("goodQty"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "outputDate",
            label: t("outputDate"),
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
            id: 'sizeId',
            label: t("size"),
            width: isMd ? 150 : "100%",
            options: [
                ...(sizeData?.map(id => ({
                    value: id.id,
                    label: id.size
                })) || [])
            ]
        }
    ];

    const fields = [
        { name: "qty",     label: "qty",     type: "number" }
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
            data={outputDetail}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onEdit={handleEdit}
            onDelete={handleDeleteOpen}
            isFilterActive={true}
            filterValue={filterValue}
            handleFilterChange={handleFilterChange}
            searchPlaceholderText={`${t('mo')}`}
            onClearAllFilters={handleClearAllFilters}
            filterConfig={filterConfig}
        />

        <DialogConfirmDelete
                        isOpen={isOpenDeleteDialog}
                        onClose={() => dispatch(setIsOpenDeleteOutputDetailDialog(false))}
                        handleDelete={handleDelete}
                        isSubmitting={isLoadingOutputDetail}
                    />
        <DialogAddEditCus
            fields={fields}
            title={"Update Output Detail"}
            isOpen={isOpen}
            onClose={handleClose}
            isUpdate={true}
            validationSchema={validationSchema}
            handleSubmit={handleSubmit}
            isSubmitting={isLoadingUpdateOutputQty}
            initialValues={!outputDetailDataForUpdate ? {qty: 0} : {qty: outputDetailDataForUpdate?.qty}}/>
        <Snackbar
            open={isOpenSnackbar}
            autoHideDuration={6000}
            onClose={() => dispatch(setIsOpenSnackbarOutputDetail(false))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={() => dispatch(setIsOpenSnackbarOutputDetail(false))}
                severity={alertOutputDetail.type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertOutputDetail.message}
            </Alert>
        </Snackbar>
    </div>
    )
    return content;
}

export default OutputDetail