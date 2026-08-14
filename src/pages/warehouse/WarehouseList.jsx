import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";
import TableCus from "../../components/table/TableCus";
import { useTranslation } from "react-i18next";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import { useCreateWarehouseMutation, useGetWarehouseQuery } from "../../redux/feature/warehouse/warehouseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import { setIsOpenDialogAddOrEditWarehouse, setWarehouseDataForUpdate } from "../../redux/feature/warehouse/warehouseSlice";

function WarehouseList() {

    // -- Selector ----------------------------------------------------------------
    const isOpen                   = useSelector((s) => s.warehouse.isOpenDialogAddOrEditWarehouse);
    const warehouseDataForUpdate   = useSelector((s) => s.warehouse.warehouseDataForUpdate);

    // -- Query ----------------------------------------------------------------
    const {data: warehouseData} = useGetWarehouseQuery({
        refetchOnMountOrArgChange: true,
        pageNo: 1,
        pageSize: 20,

    });
    
    // -- Mutation ----------------------------------------------------------------
    const [createWarehouse, {isLoading: isLoadingCreateWarehouse}] = useCreateWarehouseMutation();

    // -- Hook --------------------------------------------------------------------
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // -- Function ----------------------------------------------------------------

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditWarehouse(false));
        dispatch(setWarehouseDataForUpdate(null));
    }

    const handleSubmit = async (values) => {
        console.log("handleSubmit", values);
        try {
            await createWarehouse(values).unwrap();
            handleClose();
        } catch (err) {
            console.error("Failed to create warehouse: ", err);
        }
    }

    const handleEdit = (warehouse) => {
        console.log("handleEdit", warehouse);
        dispatch(setIsOpenDialogAddOrEditWarehouse(true));
        dispatch(setWarehouseDataForUpdate(warehouse));
    }

    const columns = [
        {
            id: "code",
            label: t("code"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "name",
            label: t("name"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "address",
            label: t("address"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "city",
            label: t("city"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "action",
            label: t("action"),
            minWidth: 130,
            align: "center",
        }
      
    ]

    const fields = [
        { name: "code",     label: "code",     type: "text" },
        { name: "name",     label: "name",     type: "text" },
        { name: "address",  label: "address",  type: "text" },
        { name: "city",     label: "city",     type: "text" },
        
    ];

    const initialValues = {
        code: "",
        name: "",
        address: "",
        city: "",
    };


    return (
        <div className="pb-10">
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditWarehouse(true))}/>
                </div>
                <TableCus
                    columns={columns}
                    data={warehouseData}
                    // handleChangePage={handleChangePage}
                    // handleChangeRowsPerPage={handleChangeRowsPerPage}
                    // onView={handleView}
                    onEdit={handleEdit}
                    // onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    // filterValue={filterValue}
                    // handleFilterChange={handleFilterChange}
                    searchPlaceholderText={`${t('Code/Name/Address/City')}`}
                    // onClearAllFilters={handleClearAllFilters}
                    // onToggleActive={(entity) => handleToggleActive(entity)}
                    // tToggleActive="Toggle status"
                />
            </div>

            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={warehouseDataForUpdate ? "Update Warehouse" : "Create Warehouse"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        // isUpdate={!!woDataForUpdate}
                        // validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={warehouseDataForUpdate ? warehouseDataForUpdate : initialValues}
                        // isSubmitting={isLoadingUploadFile || isLoadingCreateWO || isLoadingUpdateWO}
                    />
                )
            }
            
        </div>
    )
}

export default WarehouseList;