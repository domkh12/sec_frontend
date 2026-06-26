import React from 'react'
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TableCus from '../../components/table/TableCus.jsx';
import { useTranslation } from 'react-i18next';
import {useGetOutputDetailQuery} from "../../redux/feature/hourlyOutput/outputDetailApiSlice.js";
import dayjs from 'dayjs';

function OutputDetail() {
  // -- selector ----------------------------------------------------------------------------
  const pageNo = useSelector((state) => state.outputDetail.pageNo);
  const pageSize = useSelector((state) => state.outputDetail.pageSize);


  // -- Query --------------------------------------------------------------------------------
  const {data: outputDetail} = useGetOutputDetailQuery({
    pageNo,
    pageSize
  });

  // -- hook ---------------------------------------------------------------------------------
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const {t}       = useTranslation();

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
            label: t("qty"),
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

  return (
    <div className='card-glass'>
      <div className="flex justify-between items-center">
          <BackButton onClick={() => navigate("/admin")}/>
          <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditColor(true))}/>
      </div>
      <TableCus
            columns={columns}
            data={outputDetail}
            // handleChangePage={handleChangePage}
            // handleChangeRowsPerPage={handleChangeRowsPerPage}
            // onEdit={handleEdit}
            // onDelete={handleDeleteOpen}
            // isFilterActive={true}
            // filterValue={filterValue}
            // isFetching={isFetching}
            // handleFilterChange={handleFilterChange}
            // searchPlaceholderText={`${t('table.color')}`}
            // onClearAllFilters={handleClearAllFilters}
        />
    </div>
  )
}

export default OutputDetail