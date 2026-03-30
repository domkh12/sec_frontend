import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    useCreateProductMutation,
    useDeleteProductMutation, useGetProductQuery,
    useUpdateProductMutation
} from "../../redux/feature/product/productApiSlice.js";
import {useCreateCategoryMutation, useGetCategoryLookupQuery} from "../../redux/feature/category/categoryApiSlice.js";
import {useCreateColorMutation, useGetColorQuery} from "../../redux/feature/color/colorApiSlice.js";
import {useGetSizeQuery} from "../../redux/feature/size/sizeApiSlice.js";
import {
    setAlertProduct,
    setFilterProduct, setIsOpenDeleteProductDialog,
    setIsOpenDialogAddOrEditProduct, setIsOpenSnackbarProduct,
    setProductDataForUpdate
} from "../../redux/feature/product/productSlice.js";
import * as Yup from "yup";
import {Alert, Backdrop, Snackbar} from "@mui/material";
import BackButton from "../../components/ui/BackButton.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import TableCus from "../../components/table/TableCus.jsx";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";

function PurchaseList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // -- Selector --------------------------------------------------------------------------------------------

    const productDataForUpdate     = useSelector((s) => s.product.productDataForUpdate);
    const isOpen                   = useSelector((s) => s.product.isOpenDialogAddOrEditProduct);
    const isOpenSnackbar           = useSelector((s) => s.product.isOpenSnackbarProduct);
    const alertProduct             = useSelector((s) => s.product.alertProduct);
    const isOpenDeleteDialog       = useSelector((s) => s.product.isOpenDeleteProductDialog);
    const filterValue              = useSelector((s) => s.product.filter);

    // -- Mutation -----------------------------------------------------------
    const [createProduct]   = useCreateProductMutation();
    const [updateProduct]   = useUpdateProductMutation();
    const [deleteProduct]   = useDeleteProductMutation();
    const [createCategory]  = useCreateCategoryMutation();
    const [createColor]     = useCreateColorMutation();

    // -- Query ---------------------------------------------------------------
    const {data: categoryLookup}    = useGetCategoryLookupQuery();
    const {data: prodData,
        isLoading,
        isSuccess
    }                               = useGetProductQuery({
        pageNo: filterValue.pageNo,
        pageSize: filterValue.pageSize,
    });
    const {data: colorData}         = useGetColorQuery({
        pageNo: 1,
        pageSize: 999
    });
    const {data: sizeData}          = useGetSizeQuery({
        pageNo: 1,
        pageSize: 999
    });

    // -- Handler ----------------------------------------------------------------
    const handleChangePage = (event, newPage) => {
        dispatch(setFilterProduct({
            ...filterValue,
            pageNo: newPage + 1,
        }))
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterProduct({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditProduct(false));
        dispatch(setProductDataForUpdate(null));
    }

    const handleSubmit = async (values, {resetForm}) => {
        setIsSubmitting(true);
        try {
            if (productDataForUpdate) {

                await updateProduct({
                    id: productDataForUpdate.id,
                    styleNo: values.styleNo,
                    subCategoryId:  values.subCategory.childId,
                    color:     values.color,
                    size:      values.size,
                }).unwrap();
                dispatch(setAlertProduct({type: "success", message: "Update successfully"}));
                dispatch(setProductDataForUpdate(null));
            }else {
                await createProduct({
                    styleNo: values.styleNo,
                    subCategoryId:  values.subCategory.childId,
                    colorId:     values.color,
                    sizeId:      values.size,
                }).unwrap();
                dispatch(setAlertProduct({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarProduct(true));
            dispatch(setIsOpenDialogAddOrEditProduct(false));
            resetForm();
        } catch (error) {
            console.log(error);
            dispatch(setAlertProduct({type: "error", message: error?.data?.error?.description}));
            dispatch(setIsOpenSnackbarProduct(true));
        }finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditProduct(true));
        dispatch(setProductDataForUpdate({
            id: row.id,
            styleNo: row.styleNo,
            subCategoryId: row.subCategoryId,
            color: row.color,
            size: row.size,
        }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteProductDialog(true));
        setId(row.id);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteProduct({ id }).unwrap();
            dispatch(setIsOpenDeleteProductDialog(false));
            dispatch(setAlertProduct({ type: "success", message: "Delete successfully" }));
            dispatch(setIsOpenSnackbarProduct(true));
        } catch (error) {
            dispatch(setIsOpenDeleteProductDialog(false));
            dispatch(setAlertProduct({ type: "error", message: error.data.error.description }));
            dispatch(setIsOpenSnackbarProduct(true));
        } finally {
            setIsDeleting(false);
        }
    };

    // -- Validation Schema ----------------------------------------------------------------------------------
    const validationSchema = Yup.object().shape({
        styleNo:      Yup.string().required(t("validation.required")),
        // subCategory:  Yup.number().typeError(t("validation.required")).required(t("validation.required")),
        color:        Yup.array().min(1, t("validation.required")).required(t("validation.required")),
        size:         Yup.array().min(1, t("validation.required")).required(t("validation.required")),
    });

    const categorySchema = Yup.object().shape({
        name:      Yup.string().required(t("validation.required"))
    })

    const fields = [
        { name: "styleNo",     label: "table.styleNo",     type: "text" },
        {
            name: "subCategory",
            label: "category",
            type: "nestedSelect",
            options: categoryLookup,
            addNew: {
                label: "Add new category",   // text shown below the field
                title: "New Category",         // nested dialog title
                fields: [
                    { name: "name",  label: "name",  type: "text" },
                ],
                initialValues: { name: "" },
                validationSchema: categorySchema,
                onSubmit: async (values, helpers) => {
                    await createCategory({
                        name: values.name
                    }).unwrap();
                    dispatch(setAlertProduct({type: "success", message: "Create successfully"}));
                    dispatch(setIsOpenSnackbarProduct(true));
                },

            },
        },
        { name: "color",
            label: "color",
            type: "autocomplete-checkbox",
            minWidth: 130,
            fetchOptions: async () => {
                return Object.values(colorData?.entities ?? {}).map((color) => ({
                    value: color.id,
                    label: color.color,
                }));
            },
            addNew: {
                label: "Add new color",
                title: "New Color",
                fields: [
                    { name: "color",  label: "color",  type: "text" },
                ],
                initialValues: {color: ""},
                onSubmit: async (values, helpers) => {
                    try {
                        await createColor({
                            color: values.color
                        }).unwrap();
                        dispatch(setAlertProduct({type: "success", message: "Create successfully"}));
                        dispatch(setIsOpenSnackbarProduct(true));
                    }catch (error) {
                        dispatch(setAlertProduct({type: "error", message: error.data.error.description}));
                        dispatch(setIsOpenSnackbarProduct(true));
                    }
                }
            }
        },
        {
            name: "size",
            label: "size",
            type: "autocomplete-checkbox",
            minWidth: 130,
            fetchOptions: async () => {
                return Object.values(sizeData?.entities ?? {}).map((size) => ({
                    value: size.id,
                    label: size.size,
                }));
            },
            addXNew: {
                label: "Add new Size",
                title: "New Size",
                fields: [
                    { name: "size",  label: "size",  type: "text" },
                ],
                initialValues: {size: ""},
                onSubmit: async (values, helpers) => {
                    console.log(values);
                }
            }
        },
    ];

    const initialValues = {
        styleNo: "",
        subCategory:  "",
        color:     [],
        size:      [],
    };

    const columns = [
        {
            id: "styleNo",
            label: t("table.styleNo"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "size",
            label: t("size"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "subCategory",
            label: t("table.subCategory"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "color",
            label: t("color"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "status",
            label: t("table.status"),
            minWidth: 130,
            align: "left",
        },
        {
            id: "action",
            label: t("table.action"),
            minWidth: 50,
            align: "left",
        },
    ]

    let content;

    if (isLoading) content = <Backdrop open={isLoading}/>;

    if (isSuccess) content = (
        <div className="pb-10">
            <div className="card-glass">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => navigate("/admin")}/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditProduct(true))}/>
                </div>
                <TableCus columns={columns} data={prodData} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} onEdit={handleEdit} onDelete={handleDeleteOpen}/>
            </div>

            <DialogAddEditCus
                fields={fields}
                title={productDataForUpdate ? "Update Product" : "Create Product"}
                isOpen={isOpen}
                onClose={handleClose}
                isUpdate={!!productDataForUpdate}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                initialValues={productDataForUpdate ? productDataForUpdate : initialValues}
                isSubmitting={isSubmitting}
            />

            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarProduct(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarProduct(false))}
                    severity={alertProduct.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertProduct.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteProductDialog(false))} handleDelete={handleDelete} isSubmitting={isDeleting}/>
        </div>
    )

    return content;
}

export default PurchaseList;