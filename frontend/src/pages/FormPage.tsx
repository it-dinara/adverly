import useReduxFormSync from "Hooks/useReduxFormSync";
import useSubmitForm from "Hooks/useSubmitForm";
import React from "react";
import { formStateSchema, FormStateValues } from "Types/form";
import FirstStep from "../components/Steps/FirstStep/FirstStep";
import SecondStep from "../components/Steps/SecondStep/SecondStep";
import s from "./FormPage.module.css";

const FormPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useReduxFormSync<FormStateValues>({
    formField: "form",
    schema: formStateSchema,
    mode: "onChange",
  });

  const onSubmit = useSubmitForm();

  const onInvalid = (errors: any) => {
    console.error("Validation Errors:", errors);
  };

  return (
    <div className={s.container}>
      <div className={s.wrap}>
        <form
          className={s.form}
          onSubmit={handleSubmit(onSubmit, (errors: any) => onInvalid(errors))}
        >
          <FirstStep
            register={register}
            watch={watch}
            errors={errors}
            setValue={setValue}
          />
          <SecondStep
            register={register}
            watch={watch}
            errors={errors}
            setValue={setValue}
          />
        </form>
      </div>
    </div>
  );
};

export default FormPage;
