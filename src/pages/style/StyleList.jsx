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
    useCreateStyleMutation, useDeleteStyleMutation,
    useGetStyleQuery, useGetStyleStatsQuery,
    useUpdateStyleMutation
} from "../../redux/feature/style/styleApiSlice.js";
import {
    setAlertStyle, setFilterStyle,
    setIsOpenDeleteStyleDialog,
    setIsOpenDialogAddOrEditStyle,
    setIsOpenSnackbarStyle, setStyleDataForUpdate
} from "../../redux/feature/style/styleSlice.js";
import {useCreateColorMutation, useGetColorQuery} from "../../redux/feature/color/colorApiSlice.js";
import {useGetSizeQuery} from "../../redux/feature/size/sizeApiSlice.js";
import StatCards from "../../components/card/StatCards.jsx";
import { FaTshirt } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { FaFilePen } from "react-icons/fa6";
import useDebounce from "../../hook/useDebounce.jsx";
import useAuth from "../../hook/useAuth.jsx";
import {useBreakpoints} from "../../hook/useBreakpoints.jsx";

function StyleList() {
    const {t} = useTranslation();
    const [id, setId] = useState(null);
    const {isMd} = useBreakpoints();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {isManager, isAdmin} = useAuth();

    // -- Selector --------------------------------------------------------------------------------------------
    const styleDataForUpdate     = useSelector((s) => s.style.styleDataForUpdate);
    const isOpen                   = useSelector((s) => s.style.isOpenDialogAddOrEditStyle);
    const isOpenSnackbar           = useSelector((s) => s.style.isOpenSnackbarStyle);
    const alertStyle             = useSelector((s) => s.style.alertStyle);
    const isOpenDeleteDialog       = useSelector((s) => s.style.isOpenDeleteStyleDialog);
    const filterValue              = useSelector((s) => s.style.filter);

    // -- Debounce -----------------------------------------------------------
    const searchFilter             = useDebounce(filterValue.search, 500);

    // -- Mutation -----------------------------------------------------------
    const [createStyle]   = useCreateStyleMutation();
    const [updateStyle]   = useUpdateStyleMutation();
    const [deleteStyle]   = useDeleteStyleMutation();
    const [createColor]     = useCreateColorMutation();

    // -- Query --------------------------------------------------------------
    const {data: prodData,
        isLoading,
        isSuccess
    }                               = useGetStyleQuery({
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
    const {data: styleStats,
           isLoading:
           isLoadingStatStyle}     = useGetStyleStatsQuery();

    // -- Handler ----------------------------------------------------------------
    const handleChangePage = (event, newPage) => {
        dispatch(setFilterStyle({
            ...filterValue,
            pageNo: newPage + 1,
        }))
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setFilterStyle({
            ...filterValue,
            pageSize: event.target.value,
            pageNo: 1,
        }))
    };

    const handleClose = () => {
        dispatch(setIsOpenDialogAddOrEditStyle(false));
        dispatch(setStyleDataForUpdate(null));
    }

    const handleSubmit = async (values, {resetForm}) => {
        setIsSubmitting(true);
        try {
            if (styleDataForUpdate) {

                await updateStyle({
                    id: styleDataForUpdate.id,
                    styleNo: values.styleNo,
                    subCategoryId:  values.subCategory.childId,
                    colorId:     values.color,
                    sizeId:      values.size,
                }).unwrap();
                dispatch(setAlertStyle({type: "success", message: "Update successfully"}));
                dispatch(setStyleDataForUpdate(null));
            }else {
                await createStyle({
                    styleNo: values.styleNo,
                    subCategoryId:  values.subCategory.childId,
                    colorId:     values.color,
                    sizeId:      values.size,
                }).unwrap();
                dispatch(setAlertStyle({type: "success", message: "Create successfully"}));
            }
            dispatch(setIsOpenSnackbarStyle(true));
            dispatch(setIsOpenDialogAddOrEditStyle(false));
            resetForm();
        } catch (error) {
            console.log(error);
            dispatch(setAlertStyle({type: "error", message: error?.data?.error?.description}));
            dispatch(setIsOpenSnackbarStyle(true));
        }finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (row) => {
        dispatch(setIsOpenDialogAddOrEditStyle(true));
        dispatch(setStyleDataForUpdate({
            id: row.id,
            styleNo: row.styleNo,
            subCategory: {parentId: row.categoryId, childId: row.subCategoryId},
            color: row.colorId,
            size: row.sizeId,
        }));
    };

    const handleDeleteOpen = (row) => {
        dispatch(setIsOpenDeleteStyleDialog(true));
        setId(row.id);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteStyle({ id }).unwrap();
            dispatch(setIsOpenDeleteStyleDialog(false));
            dispatch(setAlertStyle({ type: "success", message: "Delete successfully" }));
            dispatch(setIsOpenSnackbarStyle(true));
        } catch (error) {
            dispatch(setIsOpenDeleteStyleDialog(false));
            dispatch(setAlertStyle({ type: "error", message: error.data.error.description }));
            dispatch(setIsOpenSnackbarStyle(true));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFilterChange = (key, value) => {
        if (value === "all") {
           return dispatch(setFilterStyle({
               ...filterValue,
               [key]: ""
           }))
        }
        dispatch(setFilterStyle({
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

    const fields = [
        { name: "styleNo",     label: "table.styleNo",     type: "text" },
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
                      dispatch(setAlertStyle({type: "success", message: "Create successfully"}));
                      dispatch(setIsOpenSnackbarStyle(true));
                  }catch (error) {
                      dispatch(setAlertStyle({type: "error", message: error.data.error.description}));
                      dispatch(setIsOpenSnackbarStyle(true));
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
                    <ButtonAddNew onClick={() => dispatch(setIsOpenDialogAddOrEditStyle(true))}/>
                </div>
                <div>
                    <StatCards
                        isLoading={isLoadingStatStyle}
                        cards={[
                            { label: "Total Styles",  value: styleStats?.totalStyleNo,  color: "violet", icon: <FaTshirt /> },
                            { label: "Active",      value: styleStats?.totalActive,   color: "emerald", icon: <FaCircleCheck/>},
                            { label: "Draft",  value: styleStats?.totalDraft,   color: "amber", icon: <FaFilePen/> },
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
                    onClearAllFilters={() => dispatch(setFilterStyle({
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
                title={styleDataForUpdate ? "Update Style" : "Create Style"}
                isOpen={isOpen}
                onClose={handleClose}
                isUpdate={!!styleDataForUpdate}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                initialValues={styleDataForUpdate ? styleDataForUpdate : initialValues}
                isSubmitting={isSubmitting}
            />

            <Snackbar
                open={isOpenSnackbar}
                autoHideDuration={6000}
                onClose={() => dispatch(setIsOpenSnackbarStyle(false))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => dispatch(setIsOpenSnackbarStyle(false))}
                    severity={alertStyle.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertStyle.message}
                </Alert>
            </Snackbar>
            <DialogConfirmDelete isOpen={isOpenDeleteDialog} onClose={() => dispatch(setIsOpenDeleteStyleDialog(false))} handleDelete={handleDelete} isSubmitting={isDeleting}/>
        </div>
    )

    return content;
}

export default StyleList