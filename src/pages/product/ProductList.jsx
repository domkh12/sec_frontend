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
import {
    useCreateProductMutation, useDeleteProductMutation,
    useGetProductQuery, useGetProductStatsQuery,
    useUpdateProductMutation
} from "../../redux/feature/product/productApiSlice.js";
import {
    setAlertProduct, setFilterProduct,
    setIsOpenDeleteProductDialog,
    setIsOpenDialogAddOrEditProduct,
    setIsOpenSnackbarProduct, setProductDataForUpdate
} from "../../redux/feature/product/productSlice.js";
import {
    useCreateCategoryMutation,
    useGetCategoryLookupQuery,
} from "../../redux/feature/category/categoryApiSlice.js";
import {useCreateColorMutation, useGetColorQuery} from "../../redux/feature/color/colorApiSlice.js";
import {useGetSizeQuery} from "../../redux/feature/size/sizeApiSlice.js";
import StatCards from "../../components/card/StatCards.jsx";
import { FaTshirt } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { FaFilePen } from "react-icons/fa6";
import useDebounce from "../../hook/useDebounce.jsx";
import useAuth from "../../hook/useAuth.jsx";
import {useBreakpoints} from "../../hook/useBreakpoints.jsx";
import {useGetSubCategoryQuery} from "../../redux/feature/category/subCategoryApiSlice.js";

function ProductList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const {isMd} = useBreakpoints();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {isManager, isAdmin} = useAuth();

    // -- Selector --------------------------------------------------------------------------------------------
    const productDataForUpdate     = useSelector((s) => s.product.productDataForUpdate);
    const isOpen                   = useSelector((s) => s.product.isOpenDialogAddOrEditProduct);
    const isOpenSnackbar           = useSelector((s) => s.product.isOpenSnackbarProduct);
    const alertProduct             = useSelector((s) => s.product.alertProduct);
    const isOpenDeleteDialog       = useSelector((s) => s.product.isOpenDeleteProductDialog);
    const filterValue              = useSelector((s) => s.product.filter);

    // -- Debounce -----------------------------------------------------------
    const searchFilter             = useDebounce(filterValue.search, 500);

    // -- Mutation -----------------------------------------------------------
    const [createProduct]   = useCreateProductMutation();
    const [updateProduct]   = useUpdateProductMutation();
    const [deleteProduct]   = useDeleteProductMutation();
    const [createCategory]  = useCreateCategoryMutation();
    const [createColor]     = useCreateColorMutation();

    // -- Query --------------------------------------------------------------
    const {data: categoryLookup}    = useGetCategoryLookupQuery();
    const {data: prodData,
        isLoading,
        isSuccess
    }                               = useGetProductQuery({
                                        pageNo: filterValue.pageNo,
                                        pageSize: filterValue.pageSize,
                                        search: searchFilter,
                                        status: filterValue.status,
                                        sizeId: filterValue.size,
                                        colorId: filterValue.color,
                                        subCategoryId: filterValue.subCategory,
                                    });
    const {data: colorData}         = useGetColorQuery({
                                        pageNo: 1,
                                        pageSize: 999
                                    });
    const {data: sizeData}          = useGetSizeQuery({
                                        pageNo: 1,
                                        pageSize: 999
                                    });
    const {data: productStats,
           isLoading:
           isLoadingStatProduct}     = useGetProductStatsQuery();
    const {data: subCategoryData}    = useGetSubCategoryQuery({
                                        pageNo: 1,
                                        pageSize: 99});
    console.log({subCategoryData});

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
                    colorId:     values.color,
                    sizeId:      values.size,
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
            subCategory: {parentId: row.categoryId, childId: row.subCategoryId},
            color: row.colorId,
            size: row.sizeId,
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

    const handleFilterChange = (key, value) => {
        if (value === "all") {
           return dispatch(setFilterProduct({
               ...filterValue,
               [key]: ""
           }))
        }
        dispatch(setFilterProduct({
            ...filterValue,
            [key]: value,
        }))
    }

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

    const filterConfig = [
        {
            id: "size",
            label: t("table.size"),
            width: isMd ? 150 : "100%",
            options: [
                {value: "all", label: t("filter.all")},
                ...(sizeData?.ids?.map(id => ({
                    value: sizeData.entities[id].id,
                    label: sizeData.entities[id].size
                })) || [])
            ]
        },
        {
            id: "color",
            label: t("table.color"),
            width: isMd ? 150 : "100%",
            options: [
                {value: "all", label: t("filter.all")},
                ...(colorData?.ids?.map(id => ({
                    value: colorData.entities[id].id,
                    label: colorData.entities[id].color
                })) || [])
            ]
        },
        {
            id: "subCategory",
            label: t("table.subCategory"),
            width: isMd ? 150 : "100%",
            options: [
                {value: "all", label: t("filter.all")},
                ...(subCategoryData?.ids?.map(id => ({
                    value: subCategoryData.entities[id].id,
                    label: subCategoryData.entities[id].name
                })) || [])
            ]
        },
        {
            id: "status",
            label: t("table.status"),
            width: isMd ? 150 : "100%",
            options: [
                {value: "all", label: t("filter.all")},
                { value: "Active", label: "Active" },
                { value: "Draft", label: "Draft" },
            ],
        }
    ]

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
                    <BackButton onClick={() => isAdmin ? navigate("/admin") : isManager ? navigate("/manager") : navigate("/") }/>
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditProduct(true))}/>
                </div>
                <div>
                    <StatCards
                        isLoading={isLoadingStatProduct}
                        cards={[
                            { label: "Total Styles",  value: productStats?.totalStyleNo,  color: "violet", icon: <FaTshirt /> },
                            { label: "Active",      value: productStats?.totalActive,   color: "emerald", icon: <FaCircleCheck/>},
                            { label: "Draft",  value: productStats?.totalDraft,   color: "amber", icon: <FaFilePen/> },
                        ]}
                    />
                </div>
                <TableCus
                    columns={columns}
                    data={prodData}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    onEdit={handleEdit} onDelete={handleDeleteOpen}
                    isFilterActive={true}
                    filterValue={filterValue}
                    searchPlaceholderText={`${t("table.styleNo")}`}
                    handleFilterChange={handleFilterChange}
                    filterConfig={filterConfig}
                    onClearAllFilters={() => dispatch(setFilterProduct({
                        ...filterValue,
                        search: "",
                        status: "",
                        size: "",
                        color: "",
                        subCategory: "",
                    }))}
                />
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