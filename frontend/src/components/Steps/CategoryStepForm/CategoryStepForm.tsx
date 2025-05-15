import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import s from "./CategoryStepForm.module.css";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import { resetForm, updateAutoField } from "Redux/slices/formSlice";
import { Categories, Car } from "Types/form";
import axiosInstance from "AxiosInstance";
import { Form, useNavigate } from "react-router-dom";
import axios from "axios";

const carMileage = [
  5000, 15000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000,
];

const autoCategorySchema = z.object({
  category: z.literal(Categories.AUTO),
  brand: z.string().min(1, "Марка обязательна"),
  model: z.string().min(1, "Модель обязательна"),
  year: z.object({
    "year-from": z.number({ invalid_type_error: "Укажите год выпуска" }),
    "year-to": z.number().optional(),
  }),
  mileage: z.preprocess((val) => {
    return val === "" ? undefined : Number(val);
  }, z.number().optional()),
});

type AutoFormValues = z.infer<typeof autoCategorySchema>;

const CategoryStepForm: React.FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const formData = useAppSelector((state) => state.form.formData);
  const [carBrands, setCarBrands] = useState<Car[]>([]);
  const { brand, model, year, mileage } = formData.auto;
  // console.log("brand, model, year, mileage", brand, model, year, mileage);

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
    reset,
    control,
    formState: { errors },
  } = useForm<AutoFormValues>({
    resolver: zodResolver(autoCategorySchema as any),
    defaultValues: formData.auto,
  });
  // console.log("default ---values", formData);

  // useEffect(() => {
  //   reset({
  //     category:
  //       formData.category === Categories.AUTO ? Categories.AUTO : undefined,
  //     brand: brand || "asd",
  //     model: model || "qwe",
  //     year: year || { "year-from": 0, "year-to": 0 },
  //     mileage: typeof mileage === "number" ? mileage : undefined,
  //   });
  // }, [brand, model, reset]);

  const selectedBrandName = useWatch({
    control,
    name: "brand",
  });
  const selectedModelName = useWatch({
    control,
    name: "model",
  });

  useEffect(() => {
    if (selectedBrandName && selectedModelName && carBrands.length > 0) {
      const brandObj = carBrands.find((car) => car.name === selectedBrandName);
      if (brandObj) {
        const modelObj = brandObj.models.find(
          (model) => model.name === selectedModelName
        );
        if (modelObj) {
          setValue("year", {
            "year-from": Number(modelObj["year-from"]),
            "year-to": Number(modelObj["year-to"]),
          });
        }
      }
    }
  }, [selectedBrandName, selectedModelName, carBrands, setValue]);

  const onSubmit = async (data: AutoFormValues) => {
    const { auto, ...mergedData } = formData; // Деструктурируем и исключаем auto
    try {
      if (isEditing) {
        await axiosInstance.put(`/items/${formData.id}`, {
          ...mergedData,
          ...auto,
        });
      } else {
        await axiosInstance.post(`/items`, { ...mergedData, ...auto });
      }
      dispatch(resetForm());
      navigate(`/list`);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  const onChange = (data: AutoFormValues) => {
    Object.entries(data).forEach(([field, value]) => {
      dispatch(updateAutoField({ field: field as keyof typeof data, value }));
    });
  };

  return (
    <form
      className={s.form}
      onChange={handleSubmit(onChange)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className={s.heading}>
        {isEditing ? "Редактирование объявления" : "Категорийный шаг"}
      </h2>
      {formData.category === Categories.AUTO && (
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
              <option value={brand || ""}>{brand || "Выберите марку"}</option>
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
              <option value={model || ""}>{model || "Выберите модель"}</option>
              {selectedBrandName &&
                carBrands
                  .find((car) => car.name === selectedBrandName)
                  ?.models.map((model) => (
                    <option key={model.id} value={model.name}>
                      {model.name}
                    </option>
                  ))}
            </select>
            {errors.model && (
              <div className={s.error}>{errors.model.message?.toString()}</div>
            )}
          </div>
          <div className={s.formGroup}>
            <label className={`${s.label} ${s.required}`} htmlFor="year">
              Год выпуска *
            </label>
            <input
              className={`${s.input} ${s.readOnly}`}
              id="year"
              readOnly
              value={(() => {
                const yearVal = (control._formValues as AutoFormValues).year;
                if (yearVal && yearVal["year-from"]) {
                  return `${yearVal["year-from"]} - ${
                    yearVal["year-to"] === 0 ? "рестайлинг" : yearVal["year-to"]
                  }`;
                }
                return "";
              })()}
            />
            {errors.year && (
              <div className={s.error}>
                {"year-from" in errors.year
                  ? errors.year["year-from"]?.message
                  : ""}
              </div>
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
              <option value={mileage || ""}>{mileage || "Не указано"}</option>
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
      <button className={s.button} type="submit">
        {isEditing ? "Сохранить изменения" : "Продолжить"}
      </button>
    </form>
  );
};

export default CategoryStepForm;
