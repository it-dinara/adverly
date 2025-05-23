import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import s from "./Auto.module.css";
import { Categories, Car, RealEstateData } from "Types/form";
import axiosInstance from "AxiosInstance";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "Redux/hooks";
import debounce from "Utils/debounce";
import { updateData } from "Redux/slices/formSlice";

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
  id: z.number().optional(),
});

type AutoFormValues = z.infer<typeof autoCategorySchema>;

const Auto: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {isEditing, id} = useAppSelector((state) => state.form);
  const [carBrands, setCarBrands] = useState<Car[]>([]);
  const autoData = useAppSelector((state) => state.form.AUTO);
  const firstStepData = useAppSelector((state) => state.form.firstStep);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AutoFormValues>({
    resolver: zodResolver(autoCategorySchema),
    defaultValues: {},
  });

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
  // Load stored values when the component mounts
  useEffect(() => {
    if (autoData) {
      const autoDataKeys = Object.keys(autoData) as (keyof typeof autoData)[];
      autoDataKeys.forEach((key) => {
        setValue(key, autoData[key]);
      });
    }
  }, [setValue]);

  // Subscribe to form changes and update Redux accordingly
  useEffect(() => {
    const debouncedUpdate = debounce((cleanedData: AutoFormValues) => {
      dispatch(updateData({ field: "AUTO", value: cleanedData }));
    }, 1000);
    const subscription = watch((data) => {
      const cleanedData = {
        brand: data.brand ?? "",
        model: data.model ?? "",
        year: data.year as number,
        mileage: data.mileage as number,
        id: typeof data.id === "number" ? data.id : undefined,
      };
      if (cleanedData) {
        debouncedUpdate(cleanedData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: AutoFormValues) => {
    const formData = {
      ...firstStepData,
      ...data,
    };
    try {
      if (isEditing) {
        console.log("Editing item with ID:", firstStepData, "id", id);
        await axiosInstance.put(`/items/${id}`, formData);
      } else {
        await axiosInstance.post(`/items`, formData);
      }
      navigate(`/list`);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  const onInvalid = (errors: any) =>
    console.error("Validation Errors:", errors);

  const selectedBrand = watch("brand");

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit(onSubmit, (errors: any) => onInvalid(errors))}
    >
      <h2 className={s.heading}>{"Авто"}</h2>
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
                  return car.name === selectedBrand;
                })
                ?.models?.map((m) => {
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

export default Auto;
