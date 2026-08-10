import { useDispatch } from "react-redux";
import BackButton from "../../components/ui/BackButton";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import { useNavigate } from "react-router-dom";
import { BsQrCode } from "react-icons/bs";
import TableCus from "../../components/table/TableCus";
import { useTranslation } from "react-i18next";
function WhBundle() {

    // -- Hooks -------------------------------------------------------------------------------
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const columns = [
         {
            id: "image",
            label: t("image"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "internalQrCode",
            label: t("internalQrCode"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "line",
            label: t("line"),
            minWidth: 130,
            align: "left",
            format: (line) => line?.lineNo
        },
        {
            id: "poNumber",
            label: t("poNumber"),
            minWidth: 110,
            align: "left",
        },
        {
            id: "styleSize",
            label: t("styleSize"),
            minWidth: 110,
            align: "left",
        },
        {
            id: "lotNumber",
            label: t("lotNumber"),
            minWidth: 120,
            align: "left",
        },
        {
            id: "generatedDate",
            label: t("generatedDate"),
            minWidth: 120,
            align: "left",
            format: (date) => date ? dayjs(date).format("DD-MM-YYYY") : ""
        },
        {
            id: "status",
            label: t("status"),
            minWidth: 100,
            align: "left",
        },
        {
            id: "action",
            label: t("table.action"),
            minWidth: 50,
            align: "left",
        },
    ]
    

    return (
        <div className="pb-10">
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditPurchaseOrder(true))} title={"Generate WH Bundle"} icon={<BsQrCode className="w-4 h-4 text-white/90" />}/>
                </div>

                <TableCus
                    columns={columns}
                    // data={prodData}
                    // handleChangePage={handleChangePage}
                    // handleChangeRowsPerPage={handleChangeRowsPerPage}
                    // onEdit={handleEdit}
                    // onDelete={handleDeleteOpen}
                    // isFilterActive={true}
                    // filterValue={filterValue}
                    // searchPlaceholderText={`${t("po")}`}
                    // filterConfig={filterConfig}
                    // handleFilterChange={handleFilterChange}
                    // onClearAllFilters={handleClearAllFilters}
                />
            </div>
        </div>
    )
}

export default WhBundle;