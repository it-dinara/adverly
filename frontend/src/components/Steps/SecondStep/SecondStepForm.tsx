import React from "react";
import { Categories } from "Types/form";
import Auto from "Categories/Auto/Auto";
import RealEstate from "Categories/RealEstate/RealEstate";
import Services from "Categories/Service/Service";

const CategoryStepForm: React.FC = () => {
  let categoryForm = null;
  const category = sessionStorage.getItem("firstStepData");
  const parsedCategory = category ? JSON.parse(category) : null;
  const categoryName = parsedCategory?.category;

  if (categoryName === Categories.AUTO) {
    categoryForm = <Auto />;
  } else if (categoryName === Categories.REAL_ESTATE) {
    categoryForm = <RealEstate />;
  } else if (categoryName === Categories.SERVICES) {
    categoryForm = <Services />;
  }
  return <>{categoryForm}</>;
};

export default CategoryStepForm;
