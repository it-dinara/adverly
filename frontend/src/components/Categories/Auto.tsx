import React, { useEffect, useState, useMemo } from "react";
import s from "./Categories.module.css";
import { Categories, Car, FormState } from "Types/form";
import axios from "axios";
import { useAppSelector } from "Redux/hooks";
import { UseFormWatch, FieldErrors, UseFormRegister } from "react-hook-form";

const carMileage = [
  5000, 15000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000,
];

const currentYear: number = new Date().getFullYear();
const years: number[] = Array.from(
  { length: currentYear - 1900 + 1 },
  (_, i) => currentYear - i
);

interface AutoProps {
  register: UseFormRegister<FormState>;
  errors: FieldErrors<FormState>;
  watch: UseFormWatch<FormState>;
}

const Auto: React.FC<AutoProps> = ({ register, watch, errors }) => {
  const { isEditing } = useAppSelector((state) => state.form);
  const [carBrands, setCarBrands] = useState<Car[]>([]);

  // Fetch car brands data once on mount
  useEffect(() => {
    const fetchCarBrands = async () => {
      try {
        const { data } = await axios.get<Car[]>("/cars.json");
        setCarBrands(data);
      } catch (error) {
        console.error("Error fetching car brands:", error);
      }
    };

    fetchCarBrands();
  }, []);

  // Extract frequently watched field values for clarity
  const selectedBrand = watch("brand") || "";
  const selectedModel = watch("model") || "";

  const models =
    carBrands.find((car) => car.name === selectedBrand)?.models || [];

  // Render functions for cleaner JSX
  const renderBrandOptions = () => (
    <>
      <option value={selectedBrand}>{selectedBrand || "Не указано"}</option>
      {carBrands.map((car) => (
        <option key={car.id} value={car.name}>
          {car.name}
        </option>
      ))}
    </>
  );

  const renderModelOptions = () => (
    <>
      <option
        value={models.find((model) => model.name === selectedModel)?.name || ""}
      >
        {selectedModel &&
        models.find((model) => model.name === selectedModel)?.name
          ? selectedModel
          : "Выберите модель"}
      </option>
      {models.map((model) => (
        <option key={model.id} value={model.name}>
          {model.name}
        </option>
      ))}
    </>
  );

  const renderYearOptions = () => (
    <>
      <option value="">{"Не указано"}</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </>
  );

  const renderMileageOptions = () => (
    <>
      <option value="">{"Не указано"}</option>
      {carMileage.map((mileage) => (
        <option key={mileage} value={mileage}>
          {mileage}
        </option>
      ))}
    </>
  );

  return (
    <div className={s.form}>
      <h2 className={s.heading}>Авто</h2>
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
              {renderBrandOptions()}
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
              {renderModelOptions()}
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
              {renderYearOptions()}
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
              {renderMileageOptions()}
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
