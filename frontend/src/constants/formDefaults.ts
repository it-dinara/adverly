import {
  AutoFormValues,
  RealEstateFormValues,
  ServicesData,
  CategoryKeysType,
} from "Types/form";

// Default values for Auto category
export const defaultAutoData: AutoFormValues = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  mileage: undefined,
  id: undefined,
};

// Default values for Real Estate category
export const defaultRealEstateData: RealEstateFormValues = {
  propertyType: "",
  area: 0,
  rooms: 0,
  price: 0,
};

// Default values for Services category
export const defaultServicesData: ServicesData = {
  serviceType: "",
  experience: 0,
  cost: 0,
  schedule: "",
};

// Combine all defaults into one object
export const defaultFormState = {
  id: undefined,
  firstStep: {
    name: "",
    description: "",
    location: "",
    photo: null,
    category: "AUTO" as CategoryKeysType, // Default category
  },
  AUTO: defaultAutoData,
  REAL_ESTATE: defaultRealEstateData,
  SERVICES: defaultServicesData,
  step: 1,
  isEditing: false,
  category: "AUTO" as CategoryKeysType, // Default category
};
