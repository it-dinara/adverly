export const Categories = {
  REAL_ESTATE: "Недвижимость",
  AUTO: "Авто",
  SERVICES: "Услуги",
} as const;

export type CategoriesType = typeof Categories;
export type CategoryKeysType = CategoriesType[keyof CategoriesType] | undefined;

export interface Item {
  id: string;
  name: string;
  description: string;
  location: string;
  category: CategoryKeysType;
  photo?: File | null | undefined;
  [key: string]: any;
  auto: CarFormData;
}

export interface FormData {
  id?: string; // Added ID for identification
  name: string;
  description: string;
  location: string;
  photo?: File | null;
  category: CategoryKeysType;
  //
  propertyType?: string; // Real estate
  area?: number;
  rooms?: number;
  price?: number;
  serviceType?: string; // Services
  experience?: number;
  cost?: number;
  schedule?: string;
  [key: string]: any;
  // Auto
  auto: CarFormData;
}

export interface CarFormData {
  category: CategoriesType["AUTO"];
  brand: string; // Auto
  model: string;
  mileage?: number;
  [key: string]: any;
}

export interface FormState {
  formData: FormData;
  step: number;
  isEditing: boolean;
}

// Define types for car data
interface CarModel {
  id: string;
  name: string;
  year: number;
}

export interface Car {
  id: string;
  name: string;
  models: CarModel[];
}

export interface CarBrand {
  id: string;
  name: string;
  models: CarModel[];
}

export interface CarBrands {
  [key: string]: CarBrand[];
}

export type FilterOptionsType = {
  [key in typeof Categories as string]: {
    [key: string]: string[] | number[];
  };
};
