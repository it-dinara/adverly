import React from "react";
import { Categories } from "Types/form";
import Auto from "Categories/Auto/Auto";
import RealEstate from "Categories/RealEstate/RealEstate";
import Services from "Categories/Services/Services";
import { useAppSelector } from "Redux/hooks";

const SecondStep: React.FC = () => {
  // const selectedCategory = useAppSelector((state) => state.form.firstStep.category);
  // let categoryForm: React.ReactElement | null = null;
  // if (selectedCategory === Categories.AUTO) {
  //   categoryForm = <Auto />;
  // } else if (selectedCategory === Categories.REAL_ESTATE) {
  //   categoryForm = <RealEstate />;
  // } else if (selectedCategory === Categories.SERVICES) {
  //   categoryForm = <Services />;
  // }
  // return <>{categoryForm}</>;
  return null;
};

export default SecondStep;
