import { useNavigate } from "react-router-dom";
import Seo from "../../components/seo/Seo";
import BackButton from "../../components/ui/BackButton";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import TableCus from "../../components/table/TableCus";
import { useCreateSupplierMutation, useGetSupplierQuery } from "../../redux/feature/supplier/supplierApiSlice";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import { setIsOpenDialogAddOrEditSupplier, setSupplierDataForUpdate } from "../../redux/feature/supplier/supplierSlice";
import useDebounce from "../../hook/useDebounce";

function SupplierList() {

    // -- Selector ---------------------------------------------------------------
    const isOpen                    = useSelector(state => state.supplier.isOpenDialogAddOrEditSupplier);
    const supplierDataForUpdate     = useSelector(state => state.supplier.supplierDataForUpdate); 
    const filterValue               = useSelector(state => state.supplier.filter);

    // -- Hook ---------------------------------------------------------------
    const navigate  = useNavigate();
    const dispatch  = useDispatch();
    const {t}       = useTranslation();
    const search                    = useDebounce(filterValue.search, 500);

    // -- Query ---------------------------------------------------------------
    const {data: supplierData, isLoading, isSuccess} = useGetSupplierQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: search
    });

    // -- Mutation ---------------------------------------------------------------
    const [createSupplier, {isLoading: isLoadingCreateSupplier}] = useCreateSupplierMutation();

    

    // -- Function ---------------------------------------------------------------
    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditSupplier(false));
        dispatch(setSupplierDataForUpdate(null));
    }

    const handleSubmit = async (values) => {
        try {
            await createSupplier(values).unwrap();
            dispatch(setIsOpenDialogAddOrEditSupplier(false));
            dispatch(setSupplierDataForUpdate(null));
        } catch (error) {
            console.error("Failed to create supplier: ", error);
        }
    }

    const columns = [
        {
            id: "supplierName",
            label: t("supplierName"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "contactPerson",
            label: t("contactPerson"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "email",
            label: t("email"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "phone",
            label: t("phoneNumber"),
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
            id: "action",
            label: t("action"),
            minWidth: 130,
            align: "center",
        }
      
    ]

    const fields = [
        { name: "supplierName",     label: "supplierName",     type: "text" },
        { name: "contactPerson",     label: "contactPerson",     type: "text" },
        { name: "email",     label: "email",     type: "text" },
        { name: "phone",     label: "phone",     type: "text" },
        { name: "address",     label: "address",     type: "text" },
    ];

    const initialValues = {
        supplierName: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
    };

    return <div className="pb-10">
        <Seo title="Supplier List"/>
        <div className="card-glass">
            <div className="flex justify-between items-center">
                <BackButton onClick={() => navigate("/admin")}/>
                <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditSupplier(true))}/>
            </div>
             <TableCus
                columns={columns}
                data={supplierData}
                // handleChangePage={handleChangePage}
                // handleChangeRowsPerPage={handleChangeRowsPerPage}
                // onEdit={handleEdit}
                // onDelete={handleDeleteOpen}
                // isFilterActive={true}
                // filterValue={filterValue}
                // handleFilterChange={handleFilterChange}
                // searchPlaceholderText={`${t('unitCode')} / ${t('unitName')}`}
                // onClearAllFilters={handleClearAllFilters}
            />
         </div>
         {
            isOpen && (
                <DialogAddEditCus
                    fields={fields}
                    title={supplierDataForUpdate ? "Update Unit" : "Create Unit"}
                    isOpen={isOpen}
                    onClose={handleClose}
                    isUpdate={!!supplierDataForUpdate}
                    // validationSchema={validationSchema}
                    handleSubmit={handleSubmit}
                    initialValues={supplierDataForUpdate ? supplierDataForUpdate : initialValues}
                    // isSubmitting={isCreateUnitLoading || isUpdateUnitLoading}
                />
            )
        }
        
    </div>
}

export default SupplierList;