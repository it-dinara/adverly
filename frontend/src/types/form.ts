import { z } from "zod";

export const Categories = {
  REAL_ESTATE: "Недвижимость",
  AUTO: "Авто",
  SERVICES: "Услуги",
} as const;

export type CategoriesType = typeof Categories;
export type FormsTypes = (keyof CategoriesType) | "firstStep";
export type CategoryKeysType = CategoriesType[keyof CategoriesType];

export interface FormState {
  id: string | undefined;
  step: number;
  isEditing: boolean;
  category?: CategoryKeysType;
  firstStep: FirstStep;
  AUTO: AutoFormValues;
  REAL_ESTATE: RealEstateFormValues;
  SERVICES: ServicesData;
}

export const firstStepFormSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().min(1, "Описание обязательно"),
  location: z.string().min(1, "Локация обязательна"),
  photo: z.instanceof(File).optional().nullable(),
  category: z.nativeEnum(Categories, { message: "Категория обязательна" }),
  id: z.number().optional(),
});

export type FirstStepFormValues = z.infer<typeof firstStepFormSchema>;

export const autoCategorySchema = z.object({
  brand: z.string().min(1, "Марка обязательна"),
  model: z.string().min(1, "Модель обязательна"),
  year: z.coerce.number().positive().min(1900, "Укажите год выпуска"),
  mileage: z.coerce.number().optional(),
  id: z.number().optional(),
});

export type AutoFormValues = z.infer<typeof autoCategorySchema>;

export const realEstateSchema = z.object({
  propertyType: z.string().min(1, "Тип недвижимости обязателен"),
  area: z.coerce.number().positive("Площадь должна быть положительным числом"),
  rooms: z.coerce
    .number()
    .positive("Количество комнат должно быть положительным числом"),
  price: z.coerce.number().positive("Цена должна быть положительным числом"),
  id: z.number().optional(),
});

export type RealEstateFormValues = z.infer<typeof realEstateSchema>;

export const servicesSchema = z.object({
  serviceType: z.string().min(1, "Тип услуги обязателен"),
  experience: z.coerce
    .number()
    .positive("Опыт работы должен быть положительным числом"),
  cost: z.coerce
    .number()
    .positive("Стоимость должна быть положительным числом"),
  schedule: z.string().optional(),
  id: z.number().optional(),
});

export type ServicesFormValues = z.infer<typeof servicesSchema>;

export interface FirstStep {
  name: string;
  description: string;
  location: string;
  photo?: File | null;
  category: CategoryKeysType;
  [key: string]: any;
}

export interface ServicesData {
  serviceType: string;
  experience: number;
  cost: number;
  schedule?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  location: string;
  category: CategoryKeysType;
  photo?: File | null | undefined;
  firstStep: FirstStep;
  AUTO?: AutoFormValues;
  REAL_ESTATE?: RealEstateFormValues;
  SERVICES?: ServicesData;
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
