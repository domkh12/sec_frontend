import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import {Button, Dialog, TextField} from "@mui/material";
import {Form, Formik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {setIsOpenCreateTVDialog} from "../../redux/feature/tv/tvSlice.js";
import {useCreateTvMutation} from "../../redux/feature/tv/tvApiSlice.js";
import {useEffect} from "react";

function DialogAddTv(){
    const {t} = useTranslation();
    const[createTv, {isLoading, isSuccess}] = useCreateTvMutation();
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.tv.isOpenCreateTVDialog);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('validation.required')),
    });


    useEffect(() => {
        if (isSuccess){
            dispatch(setIsOpenCreateTVDialog(false));
        }
    }, [isSuccess]);

    const handleSubmit = async (values) => {
        try {
            await createTv({
                name: values.name,
            });
        } catch (error) {
            console.error("Error creating transformer:", error);
        }
    };

    return(
        <Dialog open={isOpen} onClose={() => dispatch(setIsOpenCreateTVDialog(false))} >
            <div className="p-5 rounded-lg">
                <p className="mb-4 text-xl">{t('tv.create')}</p>
                <Formik
                    initialValues={{
                        name: "",
                    }}
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
                                    <TextField label={t("name")}
                                               id="name"
                                               name="name"
                                               size="small"
                                               value={values.name}
                                               onChange={handleChange}
                                               error={errors.name && touched.name}
                                               helperText={
                                                    errors.name && touched.name ? errors.name : null
                                               }
                                    />
                                    <div className="flex justify-end items-center">
                                        <Button variant="contained" type={"submit"} loading={isLoading}>{t('buttons.addNew')}</Button>
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

export default DialogAddTv;