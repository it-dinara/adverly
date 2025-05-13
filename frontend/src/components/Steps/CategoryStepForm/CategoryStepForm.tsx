import React, { useEffect, useState } from "react";
import s from "./CategoryStepForm.module.css";
import { Categories, updateField, resetForm } from "Redux/slices/formSlice";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const carMileage = [
  5000, 15000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000,
];

const CategoryStepForm: React.FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  const { category, brand, year } = useAppSelector(
    (state) => state.form.formData
  );
  const formData = useAppSelector((state) => state.form.formData);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
  const [carBrands, setCarBrands] = useState<any>([]);
  const [selectedBrand, setSelectedBrand] = useState<any>(brand || "");
  const [carModelYears, setCarModelYears] = useState<any>(year);
  const [yearRange, setYearRange] = useState("");

  useEffect(() => {
    if (carModelYears) {
      dispatch(updateField({ field: "year", value: carModelYears }));
    }
  }, [carModelYears]); // 🔹 Обновляет Redux только после изменения carModelYears

  useEffect(() => {
    console.log("years", carModelYears, yearRange);
    const years = carModelYears;
    if (years?.["year-from"]) {
      setYearRange(`${years["year-from"]} - ${years["year-to"]}`);
    } else {
      setYearRange(""); // Очистка, если данные отсутствуют
    }
  }, [carModelYears]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/cars.json`);
        const data = response.data;
        setCarBrands(data);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.brand) {
      const selectedBrand = carBrands.find((car: any) => {
        return car.name === formData.brand;
      });
      selectedBrand && setSelectedBrand(selectedBrand);
    }
  }, [formData.brand, carBrands]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "brand") {
      const selectedBrand = carBrands.find((car: any) => car.name === value);
      if (selectedBrand) {
        setSelectedBrand(selectedBrand);
      }
      setCarModelYears([]);
    }
    if (name === "model" && selectedBrand) {
      const selectedModel = selectedBrand.models.find(
        (model: any) => model.name === value
      );
      if (selectedModel) {
        console.log("s,dkfslkdfksfd");
        setCarModelYears({
          "year-from": selectedModel["year-from"],
          "year-to": selectedModel["year-to"],
        });
      }
    }
    dispatch(updateField({ field: name as keyof typeof formData, value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as keyof typeof formData, value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { type: category, ...formData };
    try {
      const response = await axios.post<{ id: number; name: string }>(
        `http://127.0.0.1:3000/items`,
        data
      );
      setItems([...items, response.data]);
      dispatch(resetForm());
      navigate(`/list`);
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { type: category, ...formData };
    console.log("Form edited:", data, isEditing, formData.id);
    try {
      const response = await axios.put<{ id: number; name: string }>(
        `http://127.0.1:3000/items/${formData.id}`,
        data
      );
      console.log("Item edited:", response.data);
      setItems([...items, response.data]);
      dispatch(resetForm());
      navigate(`/list`);
    } catch (error) {
      console.error("Error updating item:", error);
      handleSubmit(e);
    }
  };

  return (
    <form className={s.form} onSubmit={isEditing ? handleEdit : handleSubmit}>
      <h2 className={s.heading}>
        {isEditing ? "Редактирование объявления" : "Категорийный шаг"}
      </h2>

      {/* Auto */}
      {category === Categories.AUTO && (
        <>
          <label className={`${s.label} ${s.required}`} htmlFor="brand">
            Марка *
          </label>
          <select
            className={`${s.select} ${s.required}`}
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          >
            <option value="">Выберите марку</option>
            {carBrands.map((car: any) => (
              <option key={car.id} value={car.name}>
                {car.name}
              </option>
            ))}
          </select>

          <label className={`${s.label} ${s.required}`} htmlFor="model">
            Модель *
          </label>
          <select
            className={`${s.select} ${s.required}`}
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
          >
            <option value="">Выберите модель</option>
            {selectedBrand &&
              selectedBrand.models?.map((model: any) => {
                return (
                  <option key={model.id} value={model.name}>
                    {model.name}
                  </option>
                );
              })}
          </select>

          <label className={`${s.label} ${s.required}`} htmlFor="year">
            Год выпуска *
          </label>
          <input
            className={`${s.select} ${s.required}`}
            id="year"
            name="year"
            value={yearRange}
            onChange={handleChange}
            required
          />
          <label className={s.label} htmlFor="mileage">
            Пробег (км)
          </label>
          <select
            className={`${s.select} ${s.required}`}
            id="mileage"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
          >
            <option value="">Не указано</option>
            {carMileage.map((mileage: any) => {
              return (
                <option key={mileage} value={mileage}>
                  {mileage}
                </option>
              );
            })}
          </select>
        </>
      )}

      <button className={s.button} type="submit">
        {isEditing ? "Сохранить изменения" : "Продолжить"}
      </button>
    </form>
  );
};

export default CategoryStepForm;
