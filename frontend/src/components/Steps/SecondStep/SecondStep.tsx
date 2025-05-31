import React from "react";
import { Categories, FormState } from "Types/form";
import Auto from "Categories/Auto/Auto";
import RealEstate from "Categories/RealEstate/RealEstate";
import Services from "Categories/Services/Services";
import { useAppSelector } from "Redux/hooks";
import { UseFormWatch } from "react-hook-form";

type SecondStepProps = {
  register: any;
  watch: UseFormWatch<FormState>;
  errors: any;
  [key: string]: any; // for other props like register
};

const SecondStep: React.FC<SecondStepProps> = ({ register, watch, errors }) => {
  const selectedCategory = useAppSelector(
    (state) => state.form.category
  );
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
