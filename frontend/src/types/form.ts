import { z } from "zod";

export const Categories = {
  REAL_ESTATE: "Недвижимость",
  AUTO: "Авто",
  SERVICES: "Услуги",
} as const;

export type CategoriesType = typeof Categories;
export type CategoryKeysType = CategoriesType[keyof CategoriesType];
export type FormsTypes = keyof CategoriesType | "firstStep";

export interface FormState extends FormDataValues {
  step: number;
  isEditing: boolean;
  id: string;
  [key: string]: any;
}

export const firstStepFormSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().min(1, "Описание обязательно"),
  location: z.string().min(1, "Локация обязательна"),
  photo: z.instanceof(File).optional().nullable(),
  category: z.nativeEnum(Categories, {
    message: "Категория обязательна",
  }),
});

export type FirstStepFormValues = z.infer<typeof firstStepFormSchema>;

export const autoFormSchema = z.object({
  brand: z.string().min(1, "Марка обязательна"),
  model: z.string().min(1, "Модель обязательна"),
  year: z.coerce.number().positive().min(1900, "Укажите год выпуска"),
  mileage: z.coerce.number().optional(),
});

export type AutoFormValues = z.infer<typeof autoFormSchema>;

export const realEstateFormSchema = z.object({
  propertyType: z.string().min(1, "Тип недвижимости обязателен"),
  area: z.coerce.number().positive("Площадь должна быть положительным числом"),
  rooms: z.coerce
    .number()
    .positive("Количество комнат должно быть положительным числом"),
  price: z.coerce.number().positive("Цена должна быть положительным числом"),
});

export type RealEstateFormValues = z.infer<typeof realEstateFormSchema>;

export const servicesFormSchema = z.object({
  serviceType: z.string().min(1, "Тип услуги обязателен"),
  experience: z.coerce
    .number()
    .positive("Опыт работы должен быть положительным числом"),
  cost: z.coerce
    .number()
    .positive("Стоимость должна быть положительным числом"),
  schedule: z.string().optional(),
});

export type ServicesFormValues = z.infer<typeof servicesFormSchema>;

export const selectedCategoryForm = z.discriminatedUnion("type", [
  z.object({ type: z.literal(Categories.AUTO), ...autoFormSchema.shape }),
  z.object({
    type: z.literal(Categories.REAL_ESTATE),
    ...realEstateFormSchema.shape,
  }),
  z.object({
    type: z.literal(Categories.SERVICES),
    ...servicesFormSchema.shape,
  }),
]);

export type SelectedCategoryFormType = z.infer<typeof selectedCategoryForm>;

export const formDataSchema = firstStepFormSchema.extend({
  selectedCategoryForm,
});

export type FormDataValues = z.infer<typeof formDataSchema>;

export interface Item {
  id: string;
  name: string;
  description: string;
  location: string;
  category: CategoryKeysType;
  photo?: File | null;
  firstStep: FirstStepFormValues;
  AUTO?: AutoFormValues;
  REAL_ESTATE?: RealEstateFormValues;
  SERVICES?: ServicesFormValues;
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
