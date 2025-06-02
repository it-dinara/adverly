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
  setValue: any;
  [key: string]: any; // for other props like register
};

const SecondStep: React.FC<SecondStepProps> = (props) => {
  const selectedCategory = useAppSelector((state) => state.form.category);
  let categoryForm: React.ReactElement | null = null;
  if (selectedCategory === Categories.AUTO) {
    categoryForm = <Auto {...props} />;
  } else if (selectedCategory === Categories.REAL_ESTATE) {
    categoryForm = <RealEstate {...props} />;
  } else if (selectedCategory === Categories.SERVICES) {
    categoryForm = <Services {...props} />;
  }
  return <>{categoryForm}</>;
};

export default SecondStep;
