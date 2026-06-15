import * as Yup from "yup";
import {Button, Dialog, TextField} from "@mui/material";
import {Form, Formik} from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setIsOpenEditStockQty } from "../../redux/feature/material/materialSlice";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
function DialogEditStockQty() {

    // -- State ------------------------------------------------------------------------------------------
     const [value, setValue]    = useState(dayjs());

    // -- Selectors --------------------------------------------------------------------------------------
    const isOpen = useSelector((state) => state.material.isOpenEditStockQtyDialog);
    const updateStockQtyData = useSelector((state) => state.material.updateStockQtyData);
    console.log(updateStockQtyData);

    // -- Hooks -------------------------------------------------------------------------------------------
    const {t} = useTranslation();
    const dispatch = useDispatch();

    // -- Handlers ---------------------------------------------------------------------------------------

    const validationSchema = Yup.object().shape({
        qty: Yup.string().required(t("validation.required")),
    });

    const handleSubmit = (values) => {
        console.log(values);
    }

    return(
            <Dialog open={isOpen} onClose={() => dispatch(setIsOpenEditStockQty(false))} sx={{ "& .MuiDialog-paper": { borderRadius: 4 } }}>
                <div className="p-5 rounded-lg min-w-[400px]">
                    <p className="mb-4 text-xl">Update Stock</p>
                    <Formik
                        initialValues={{
                            qty: updateStockQtyData?.qtyInput || "",
                            dateInput: updateStockQtyData?.dateInput
                                        ? dayjs(updateStockQtyData.dateInput, "DD/MMM/YYYY hh:mmA")
                                        : null,
                        }}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({
                              values,
                              touched,
                              errors,
                              handleChange,
                              handleBlur,
                              setFieldValue
                          }) => {
    
                            return (
                                <Form className="pb-8">
                                    <div className="flex flex-col gap-4">
                                        <TextField label={t("Qty")}
                                                   id="qty"
                                                   name="qty"
                                                   size="small"
                                                   value={values.qty}
                                                   onChange={handleChange}
                                                   error={errors.qty && touched.qty}
                                                   helperText={
                                                        errors.qty && touched.qty ? errors.qty : null
                                                   }
                                        />

                                        {/* DATE PICKER FIX */}
                                        <DatePicker
                                            label="Date of Stock In"
                                            value={values.dateInput}
                                            format="DD/MMM/YYYY"
                                            onChange={(newValue) => {
                                                setFieldValue("dateInput", newValue);
                                                setValue(newValue); // keep your local state if needed
                                            }}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: true,
                                                    error: touched.dateInput && Boolean(errors.dateInput),
                                                    helperText: touched.dateInput && errors.dateInput
                                                }
                                            }}
                                        />

                                        <div className="flex justify-end items-center">
                                            <Button variant="contained" type={"submit"} loading={""}>{t('update')}</Button>
                                        </div>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </Dialog>
        )
}

export default DialogEditStockQty;