import {
  AutoFormValues,
  RealEstateFormValues,
  ServicesFormValues,
  Categories,
  SelectedCategoryFormType,
} from "Types/form";

// Default values for Auto category
export const defaultAutoData: AutoFormValues = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  mileage: undefined,
};

// Default values for Real Estate category
export const defaultRealEstateData: RealEstateFormValues = {
  propertyType: "",
  area: 0,
  rooms: 0,
  price: 0,
};

// Default values for Services category
export const defaultServicesData: ServicesFormValues = {
  serviceType: "",
  experience: 0,
  cost: 0,
  schedule: "",
};

export const defaultFirstStepData = {
  name: "",
  description: "",
  location: "",
  photo: null,
  categorySelected: Categories.AUTO, // Default category
};

export const defaultFormData = {
  ...defaultFirstStepData,
  autoData: defaultAutoData,
  realEstateData: defaultRealEstateData,
  servicesData: defaultServicesData,
};

// Combine all defaults into one object
export const defaultFormState = {
  ...defaultFirstStepData,
  step: 1,
  isEditing: false,
  id: "",
  category: Categories.AUTO,
  selectedCategoryForm: {
    type: Categories.AUTO,
    brand: "",
    model: "",
    year: 0,
    mileage: undefined,
  },
};
