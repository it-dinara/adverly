import React from "react";
import { Categories, FormState } from "Types/form";
import Auto from "Categories/Auto";
import RealEstate from "Categories/RealEstate";
import Services from "Categories/Services";
import { useAppSelector } from "Redux/hooks";
import {
  UseFormWatch,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";

interface SecondStepProps {
  register: UseFormRegister<FormState>;
  errors: FieldErrors<FormState>;
  setValue?: UseFormSetValue<FormState>;
  watch: UseFormWatch<FormState>;
}

const SecondStep: React.FC<SecondStepProps> = ({ register, watch, errors }) => {
  const selectedCategory = useAppSelector((state) => state.form.category);
  let categoryForm: React.ReactElement | null = null;
  if (selectedCategory === Categories.AUTO) {
    categoryForm = <Auto register={register} watch={watch} errors={errors} />;
  } else if (selectedCategory === Categories.REAL_ESTATE) {
    categoryForm = <RealEstate register={register} errors={errors} />;
  } else if (selectedCategory === Categories.SERVICES) {
    categoryForm = <Services register={register} errors={errors} />;
  }
  return <>{categoryForm}</>;
};

export default SecondStep;
