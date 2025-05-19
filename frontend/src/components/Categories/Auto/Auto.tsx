import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import s from "./CategoryStepForm.module.css";
import { Categories, Car } from "Types/form";
import axiosInstance from "AxiosInstance";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const carMileage = [
  5000, 15000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000,
];

const currentYear: number = new Date().getFullYear();
const years: number[] = Array.from(
  { length: currentYear - 1900 + 1 },
  (_, i) => currentYear - i
);

const autoCategorySchema = z.object({
  brand: z.string().min(1, "Марка обязательна"),
  model: z.string().min(1, "Модель обязательна"),
  year: z.coerce.number().positive().min(1900, "Укажите год выпуска"),
  mileage: z.coerce.number().optional(),
  id: z.string().optional(),
});

type AutoFormValues = z.infer<typeof autoCategorySchema>;

const CategoryStepForm: React.FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  const navigate = useNavigate();
  const [carBrands, setCarBrands] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCarBrands = async () => {
      try {
        const { data } = await axios.get<Car[]>(`/cars.json`);
        setCarBrands(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };
    fetchCarBrands();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    resetField,
    formState: { errors },
  } = useForm<AutoFormValues>({
    resolver: zodResolver(autoCategorySchema),
    defaultValues: {},
  });

  const onSubmit = async (data: AutoFormValues) => {
    const firstStepSessionStorage = sessionStorage.getItem("firstStepData");
    const firstStepData = JSON.parse(firstStepSessionStorage || "{}");
    try {
      if (isEditing) {
        await axiosInstance.put(`/items/${firstStepData.id}`, {
          ...firstStepData,
          ...data,
        });
      } else {
        await axiosInstance.post(`/items`, { ...firstStepData, ...data });
      }
      navigate(`/list`);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  // Load stored values when the component mounts
  useEffect(() => {
    const storedData = sessionStorage.getItem("secondStepData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      Object.keys(parsedData).forEach((key) => {
        setValue(key as keyof AutoFormValues, parsedData[key]);
      });
    }
    return () => {
      // Clear sessionStorage when the component unmounts
      if (isEditing === false) {
        sessionStorage.removeItem("secondStepData");
      }
    };
  }, [setValue]);

  // Watch form values and store them in sessionStorage
  useEffect(() => {
    const subscription = watch((values) => {
      sessionStorage.setItem("secondStepData", JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onInvalid = (errors: any) =>
    console.error("Validation Errors:", errors);

  const selectedBrand = watch("brand");

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit(onSubmit, (errors: any) => onInvalid(errors))}
    >
      <h2 className={s.heading}>
        {isEditing ? "Редактирование объявления" : "Категорийный шаг"}
      </h2>
      {Categories.AUTO && (
        <>
          <div className={s.formGroup}>
            <label className={`${s.label} ${s.required}`} htmlFor="brand">
              Марка *
            </label>
            <select
              className={`${s.select} ${s.required}`}
              id="brand"
              {...register("brand")}
            >
              {/* Add a default "Не указано" option */}
              <option value={watch("brand") || ""}>
                {watch("brand") || "Не указано"}
              </option>
              {carBrands.map((car) => (
                <option key={car.id} value={car.name}>
                  {car.name}
                </option>
              ))}
            </select>
            {errors.brand && (
              <div className={s.error}>{errors.brand.message?.toString()}</div>
            )}
          </div>
          <div className={s.formGroup}>
            <label className={`${s.label} ${s.required}`} htmlFor="model">
              Модель *
            </label>
            <select
              className={`${s.select} ${s.required}`}
              id="model"
              {...register("model")}
            >
              <option value={watch("model") || ""}>
                {watch("model") || "Не указано"}
              </option>
              {/* Filter car brands based on the selected brand */}
              {carBrands
                .find((car) => {
                  console.log("Car:", car);
                  return car.name === selectedBrand;
                })
                ?.models?.map((m) => {
                  console.log("Model:", m);
                  return (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  );
                })}
            </select>
            {errors.model && (
              <div className={s.error}>{errors.model.message?.toString()}</div>
            )}
          </div>
          <div className={s.formGroup}>
            <label className={`${s.label} ${s.required}`} htmlFor="year">
              Год выпуска *
            </label>
            <select
              className={`${s.select} ${s.required}`}
              id="year"
              {...register("year")}
            >
              <option value={""}>{"Не указано"}</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && (
              <div className={s.error}>{errors.year.message?.toString()}</div>
            )}
          </div>
          <div className={s.formGroup}>
            <label className={s.label} htmlFor="mileage">
              Пробег (км)
            </label>
            <select
              className={`${s.select} ${s.required}`}
              id="mileage"
              {...register("mileage")}
            >
              <option value={""}>{"Не указано"}</option>
              {carMileage.map((mileage) => (
                <option key={mileage} value={Number(mileage)}>
                  {mileage}
                </option>
              ))}
            </select>
            {errors.mileage && (
              <div className={s.error}>
                {errors.mileage.message?.toString()}
              </div>
            )}
          </div>
        </>
      )}
      <input
        className={s.button}
        type="submit"
        value={isEditing ? "Сохранить изменения" : "Продолжить"}
      />
    </form>
  );
};

export default CategoryStepForm;
