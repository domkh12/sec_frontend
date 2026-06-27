import React, { useState } from 'react'
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TableCus from '../../components/table/TableCus.jsx';
import { useTranslation } from 'react-i18next';
import {useDeleteOutputDetailMutation, useGetOutputDetailQuery} from "../../redux/feature/hourlyOutput/outputDetailApiSlice.js";
import dayjs from 'dayjs';
import { setFilterOutputDetail, setIsOpenDeleteOutputDetailDialog } from '../../redux/feature/outputDetail/outputDetailSlice.js';
import useDebounce from '../../hook/useDebounce.jsx';
import { useBreakpoints } from '../../hook/useBreakpoints.jsx';
import { useGetProductionLineLookupQuery } from '../../redux/feature/productionLine/productionLineApiSlice.js';
import { useGetSizeLookupQuery } from '../../redux/feature/size/sizeApiSlice.js';
import DialogConfirmDelete from '../../components/dialog/DialogConfirmDelete.jsx';


function OutputDetail() {
    // -- State -----------------------------------------------------------------------------------------
    const [id, setId] = useState(null);

  // -- selector ----------------------------------------------------------------------------
  const pageNo = useSelector((state) => state.outputDetail.pageNo);
  const pageSize = useSelector((state) => state.outputDetail.pageSize);
  const filterValue = useSelector((state) => state.outputDetail.filter);
  const debounceSearch = useDebounce(filterValue.search, 500);
  const isOpenDeleteDialog = useSelector((state) => state.outputDetail.isOpenDeleteOutputDetailDialog);
  

  // -- Query --------------------------------------------------------------------------------
  const {data: outputDetail} = useGetOutputDetailQuery({
    pageNo,
    pageSize,
    search: debounceSearch,
    lineId: filterValue.lineId,
    sizeId: filterValue.sizeId
  });

  const {data: lineData} = useGetProductionLineLookupQuery();
  const {data: sizeData} = useGetSizeLookupQuery();

  // -- mutation --------------------------------------------------------------------------------
  const [deleteOutputDetail, {isLoading: isLoadingOutputDetail}] = useDeleteOutputDetailMutation();
 
  // -- hook ---------------------------------------------------------------------------------
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const {t}       = useTranslation();
  const {isMd}    = useBreakpoints();

  // -- Handler ------------------------------------------------------------------------------

   const handleDelete = async () => {
        try {
            await deleteOutputDetail({id: id}).unwrap();
            // dispatch(setIsOpenDeleteDeptDialog(false));
            // dispatch(setAlertProductionLine({type: "success", message: "Delete successfully"}));
            // dispatch(setIsOpenSnackbarProductionLine(true));
        }catch (error) {
            // dispatch(setIsOpenDeleteDeptDialog(false));
            // dispatch(setAlertProductionLine({type: "error", message: error.data.error.description}));
            // dispatch(setIsOpenSnackbarProductionLine(true));
        }
    }

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteOutputDetailDialog(true));
        setId(row.id);
    };

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
            format: (value) => dayjs(value).format("DD-MM-YYYY")
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

  return (
    <div className='card-glass'>
      <div className="flex justify-between items-center">
          <BackButton onClick={() => navigate("/admin")}/>
      </div>
      <TableCus
            columns={columns}
            data={outputDetail}
            // handleChangePage={handleChangePage}
            // handleChangeRowsPerPage={handleChangeRowsPerPage}
            // onEdit={handleEdit}
            onDelete={handleDeleteOpen}
            isFilterActive={true}
            filterValue={filterValue}
            // isFetching={isFetching}
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
    </div>
  )
}

export default OutputDetail