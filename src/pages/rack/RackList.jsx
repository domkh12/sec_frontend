import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton"
import { useDispatch } from "react-redux";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import Seo from "../../components/seo/Seo";
import TableCus from "../../components/table/TableCus";
import { useTranslation } from "react-i18next";


function RackList() {

  // -- Hook --------------------------------------------------------------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const columns = [
      {
          id: "image",
          label: t("qr"),
          minWidth: 130,
          align: "left",
      },
      {
          id: "code",
          label: t("code"),
          minWidth: 130,
          align: "left",
      },
      {
          id: "warehouse",
          label: t("warehouse"),
          minWidth: 130,
          align: "left",
      },
      
  ]

  return (
    <div className="pb-10">
      <Seo title="Rack List"/>
      <div className="card-glass">
        <div className="flex justify-between items-center">
          <BackButton onClick={() => navigate("/admin")}/>
          <ButtonAddNew/>
        </div>

        <TableCus
            columns={columns}
            // data={workOrderData}
            // handleChangePage={handleChangePage}
            // handleChangeRowsPerPage={handleChangeRowsPerPage}
            // onView={handleView}
            // onEdit={handleEdit}
            // onDelete={handleDeleteOpen}
            // isFilterActive={true}
            // filterValue={filterValue}
            // handleFilterChange={handleFilterChange}
            // searchPlaceholderText={`${t('MO/PO/Style')}`}
            // onClearAllFilters={handleClearAllFilters}
            // onToggleActive={(entity) => handleToggleActive(entity)}
            // tToggleActive="Toggle status"
        />

      </div>
    </div>
  )
}

export default RackList