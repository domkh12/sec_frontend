import {Alert, Backdrop, Snackbar} from "@mui/material";
import {useTranslation} from "react-i18next";
import BackButton from "../../components/ui/BackButton.jsx";
import {useNavigate} from "react-router-dom";
import TableCus from "../../components/table/TableCus.jsx";
import {useDispatch, useSelector} from "react-redux";
import DialogAddEditCus from "../../components/dialog/DialogAddEditCus.jsx";
import ButtonAddNew from "../../components/ui/ButtonAddNew.jsx";
import * as Yup from "yup";
import DialogConfirmDelete from "../../components/dialog/DialogConfirmDelete.jsx";
import {useState} from "react";
import { setPageNoProductionLine, setPageSizeProductionLine } from "../../redux/feature/productionLine/productionLineSlice.js";
import {
    useCreateProductMutation, useDeleteProductMutation,
    useGetProductQuery,
    useUpdateProductMutation
} from "../../redux/feature/product/productApiSlice.js";
import {
    setAlertProduct,
    setIsOpenDeleteProductDialog,
    setIsOpenDialogAddOrEditProduct,
    setIsOpenSnackbarProduct, setProductDataForUpdate
} from "../../redux/feature/product/productSlice.js";
import {
    useCreateCategoryMutation,
    useGetCategoryLookupQuery,
} from "../../redux/feature/category/categoryApiSlice.js";
import {useGetColorQuery} from "../../redux/feature/color/colorApiSlice.js";
import {useGetSizeQuery} from "../../redux/feature/size/sizeApiSlice.js";

function ProductList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const pageNo = useSelector((state) => state.product.pageNo);
    const pageSize = useSelector((state) => state.product.pageSize);
    const productDataForUpdate = useSelector((state) => state.product.productDataForUpdate);
    const isOpen = useSelector((state) => state.product.isOpenDialogAddOrEditProduct);
    const isOpenSnackbar = useSelector((state) => state.product.isOpenSnackbarProduct);
    const alertProduct = useSelector((state) => state.product.alertProduct);
    const isOpenDeleteDialog = useSelector((state) => state.product.isOpenDeleteProductDialog);
    const[createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [createCategory] = useCreateCategoryMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {data: categoryLookup} = useGetCategoryLookupQuery();
    const {data: prodData, isLoading, isSuccess} = useGetProductQuery({
        pageNo: pageNo,
        pageSize: pageSize
    });
    const {data: colorData} = useGetColorQuery({
        pageNo: 1,
        pageSize: 999
    });
    const {data: sizeData} = useGetSizeQuery({
        pageNo: 1,
        pageSize: 999
    });
    
    const handleChangePage = (event, newPage) => {
        dispatch(setPageNoProductionLine(newPage + 1));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setPageSizeProductionLine(event.target.value));
        dispatch(setPageNoProductionLine(1));
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditProduct(false));
        dispatch(setProductDataForUpdate(null));
    }

    const validationSchema = Yup.object().shape({
        styleNo:   Yup.string().required(t("validation.required")),
        // category:  Yup.number().required(t("validation.required")),
        color:     Yup.array().min(1, t("validation.required")).required(t("validation.required")),
        size:      Yup.array().min(1, t("validation.required")).required(t("validation.required")),
    });

    const categorySchema = Yup.object().shape({
        name:      Yup.string().required(t("validation.required"))
    })

    const handleSubmit = async (values, {resetForm}) => {
        setIsSubmitting(true);
        console.log(values);
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
                console.log(values);
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

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditProduct(true));
        dispatch(setProductDataForUpdate({
            id: row.id,
            code: row.code,
            styleName: row.styleName,
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

export default ProductList