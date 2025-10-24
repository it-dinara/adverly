import {
  AutoFormValues,
  RealEstateFormValues,
  ServicesFormValues,
  Categories,
  FormStateValues,
  CommonFields,
  FirstStepFormValues,
} from "Types/form";

export const defaultCommonFields: CommonFields = {
  step: 1,
  isEditing: false,
  id: "",
};

export const defaultFirstStepData: FirstStepFormValues = {
  name: "",
  description: "",
  location: "",
  photo: null,
  category: Categories.DEFAULT, // Default category
};

// Default values for Auto category
export const defaultAutoData: AutoFormValues = {
  ...defaultFirstStepData,
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  mileage: undefined,
};

// Default values for Real Estate category
export const defaultRealEstateData: RealEstateFormValues = {
  ...defaultFirstStepData,
  propertyType: "",
  area: 0,
  rooms: 0,
  price: 0,
};

// Default values for Services category
export const defaultServicesData: ServicesFormValues = {
  ...defaultFirstStepData,
  serviceType: "",
  experience: 0,
  cost: 0,
  schedule: "",
};

// Combine all defaults into one object
export const defaultFormState: FormStateValues = {
  ...defaultFirstStepData,
  category: Categories.DEFAULT,
};
