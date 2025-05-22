// src/types/form.ts

export const Categories = {
  REAL_ESTATE: "Недвижимость",
  AUTO: "Авто",
  SERVICES: "Услуги",
} as const;

export type CategoriesType = typeof Categories;
export type CategoryKeysType = CategoriesType[keyof CategoriesType];

export interface FormState {
  firstStep: FirstStep;
  step: number;
  isEditing: boolean;
  category: CategoryKeysType;
  auto: AutoData;
  realEstate: RealEstateData;
  service: ServiceData;
}

export interface FirstStep {
  id?: string; // Added ID for identification
  name: string;
  description: string;
  location: string;
  photo?: File | null;
  category: CategoryKeysType;
  [key: string]: any;
}

export interface ServiceData {
  serviceType: string;
  experience: number;
  cost: number;
  schedule?: string;
  [key: string]: any;
}

export interface RealEstateData {
  propertyType: string;
  area: number;
  rooms: number;
  price: number;
}

export interface AutoData {
  brand: string; // Auto
  model: string;
  mileage?: number;
  year: number;
  id?: string; // Added ID for identification
}

export interface Item {
  id: string;
  name: string;
  description: string;
  location: string;
  category: CategoryKeysType;
  photo?: File | null | undefined;
  [key: string]: any;
  auto: AutoData;
}

// Define types for car data
export interface CarModel {
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
