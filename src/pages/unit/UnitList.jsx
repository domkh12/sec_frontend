import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAlertUnit, setIsOpenDialogAddOrEditUnit, setIsOpenSnackbarUnit } from "../../redux/feature/unit/unitSlice";
import BackButton from "../../components/ui/BackButton";
import ButtonAddNew from "../../components/ui/ButtonAddNew";
import TableCus from "../../components/table/TableCus";
import { useTranslation } from "react-i18next";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus";
import { useCreateUnitMutation, useGetUnitQuery } from "../../redux/feature/unit/unitApiSlice";
import { Alert, Snackbar } from "@mui/material";
import LoadingComponent from "../../components/ui/LoadingComponent";
import useDebounce from "../../hook/useDebounce";

function UnitList() {

    // -- State ----------------------------------------------
    const isOpen                = useSelector(state => state.unit.isOpenDialogAddOrEditUnit);
    const unitDataForUpdate     = useSelector(state => state.unit.unitDataForUpdate);
    const isOpenSnackbarUnit    = useSelector(state => state.unit.isOpenSnackbarUnit);
    const alertUnit             = useSelector(state => state.unit.alertUnit);
    const filterValue           = useSelector(state => state.unit.filter);
    const search                = useDebounce(filterValue.search, 500);

    // -- Query ----------------------------------------------
    const { data: unitData, isLoading, isSuccess } = useGetUnitQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
        search: search
    });

    // -- Hook -----------------------------------------------
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // -- Mutation -------------------------------------------
    const [createUnit, { isLoading: isCreateUnitLoading }] = useCreateUnitMutation();

    // -- Function -------------------------------------------
    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditUnit(false));
    } 

    const handleSubmit = async (values) => {
        try {
            await createUnit(values).unwrap();
            dispatch(setAlertUnit({type: "success", message: "Create successfully"}));
            dispatch(setIsOpenSnackbarUnit(true));
            handleClose();
        } catch (err) {
            console.error("Failed to create unit: ", err);
            dispatch(setAlertUnit({type: "error", message: err.data?.error?.description || "Failed to create unit"}));
            dispatch(setIsOpenSnackbarUnit(true));
        }
    }

    const columns = [
        {
            id: "unitCode",
            label: t("unitCode"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "unitName",
            label: t("unitName"),
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
        { name: "unitCode",     label: "unitCode",     type: "text" },
        { name: "unitName",     label: "unitName",     type: "text" },
    ];

    const initialValues = {
        unitCode: "",
        unitName: "",
    };

    let content;

    if(isLoading) content = <LoadingComponent/>;

    if(isSuccess) content = (
        <div className="pb-10">
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditUnit(true))}/>
                </div>
                 <TableCus
                    columns={columns}
                    data={unitData}
                    // handleChangePage={handleChangePage}
                    // handleChangeRowsPerPage={handleChangeRowsPerPage}
                    // // onView={handleView}
                    // onEdit={handleEdit}
                    // onDelete={handleDeleteOpen}
                    // isFilterActive={true}
                    // filterValue={filterValue}
                    // handleFilterChange={handleFilterChange}
                    // searchPlaceholderText={`${t('Code/Name/Address/City')}`}
                    // onClearAllFilters={handleClearAllFilters}
                    // onToggleActive={(entity) => handleToggleActive(entity)}
                    // tToggleActive="Toggle status"
                />
            </div>


            {
                isOpen && (
                    <DialogAddEditCus
                        fields={fields}
                        title={unitDataForUpdate ? "Update Unit" : "Create Unit"}
                        isOpen={isOpen}
                        onClose={handleClose}
                        isUpdate={!!unitDataForUpdate}
                        // validationSchema={validationSchema}
                        handleSubmit={handleSubmit}
                        initialValues={unitDataForUpdate ? unitDataForUpdate : initialValues}
                        isSubmitting={isCreateUnitLoading}
                    />
                )
            }

            <Snackbar
                open={isOpenSnackbarUnit}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarUnit(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarUnit(false))}
                    severity={alertUnit.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertUnit.message}
                </Alert>
            </Snackbar>
        </div>
    )

    return content;
}

export default UnitList;