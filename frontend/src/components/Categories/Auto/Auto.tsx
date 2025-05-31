import React, { useEffect, useState } from "react";
import s from "./Auto.module.css";
import { Categories, Car, FormState } from "Types/form";
import axios from "axios";
import { useAppSelector } from "Redux/hooks";
import { UseFormWatch } from "react-hook-form";

const carMileage = [
  5000, 15000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000,
];

const currentYear: number = new Date().getFullYear();
const years: number[] = Array.from(
  { length: currentYear - 1900 + 1 },
  (_, i) => currentYear - i
);

type AutoProps = {
  register: any;
  watch: UseFormWatch<FormState>;
  errors: any;
  [key: string]: any; // for other props like register
};

const Auto: React.FC<AutoProps> = ({ register, watch, errors }) => {
  const { isEditing } = useAppSelector((state) => state.form);
  const [carBrands, setCarBrands] = useState<Car[]>([]);

  // Fetch car brands data
  useEffect(() => {
    const fetchCarBrands = async () => {
      try {
        const { data } = await axios.get<Car[]>(`/cars.json`);
        setCarBrands(data);
      } catch (error) {}
    };
    fetchCarBrands();
  }, []);

  let selectedBrand = watch("brand");

  return (
    <div className={s.form}>
      <h2 className={s.heading}>{"Авто"}</h2>
      {Categories.AUTO && (
        <>
          <div className={s.formGroup}>
            {console.log("errors", errors)}
            <label className={`${s.label} ${s.required}`} htmlFor="brand">
              Марка *
            </label>
            <select
              className={`${s.select} ${s.required}`}
              id="brand"
              {...register("brand")}
            >
              <option value={watch("brand") || ""}>
                {typeof watch("brand") === "string"
                  ? watch("brand")
                  : "Не указано"}
              </option>
              {carBrands.map((car) => (
                <option key={car.id} value={car.name}>
                  {car.name}
                </option>
              ))}
            </select>
            {errors?.brand && (
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
                {typeof watch("model") === "string"
                  ? watch("model")
                  : "Не указано"}
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
            {errors?.model && (
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
            {errors?.year && (
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
            {errors?.mileage && (
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
    </div>
  );
};

export default Auto;
