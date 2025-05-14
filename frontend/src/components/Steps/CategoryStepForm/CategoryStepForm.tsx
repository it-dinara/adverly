import React, { useEffect, useState } from "react";
import s from "./CategoryStepForm.module.css";
import { updateField, resetForm } from "Redux/slices/formSlice";
import { Categories, Car, YearRange } from "Types/form";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "AxiosInstance";


const carMileage = [
  5000, 15000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000,
];

const CategoryStepForm: React.FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  // Get form fields from Redux
  const { category, brand, year } = useAppSelector(
    (state) => state.form.formData
  );
  const formData = useAppSelector((state) => state.form.formData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Local state
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
  const [carBrands, setCarBrands] = useState<Car[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Car | null>(null);
  const [carModelYears, setCarModelYears] = useState<YearRange | null>(
    year || null
  );
  const [yearRange, setYearRange] = useState("");


  // Sync carModelYears to the Redux form state
  useEffect(() => {
    if (carModelYears) {
      dispatch(updateField({ field: "year", value: carModelYears }));
    }
  }, [carModelYears, dispatch]);

  // Update display text for the year range
  useEffect(() => {
    if (carModelYears) {
      setYearRange(
        `${carModelYears["year-from"]} - ${carModelYears["year-to"]}`
      );
    } else {
      setYearRange("");
    }
  }, [carModelYears]);

  // Fetch car brands from the JSON file
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

  // If Redux has a form brand value, update the selectedBrand upon loading carBrands
  useEffect(() => {
    if (formData.brand) {
      const brandFound =
        carBrands.find((car) => car.name === formData.brand) || null;
      setSelectedBrand(brandFound);
    }
  }, [formData.brand, carBrands]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "brand") {
      const brandSelected = carBrands.find((car) => car.name === value) || null;
      setSelectedBrand(brandSelected);
      setCarModelYears(null); // Reset model year data if brand changes
    } else if (name === "model" && selectedBrand) {
      const modelSelected = selectedBrand.models.find(
        (model) => model.name === value
      );
      if (modelSelected) {
        setCarModelYears({
          "year-from": modelSelected["year-from"],
          "year-to": modelSelected["year-to"],
        });
      }
    }
    dispatch(updateField({ field: name as keyof typeof formData, value }));
  };

  // This handler can be used for numeric inputs if needed
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as keyof typeof formData, value }));
  };

  // For creating a new entry
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { type: category, ...formData };
    try {
      const response = await axiosInstance.post<{ id: number; name: string }>(
        `/items`,
        data
      );
      setItems((prevItems) => [...prevItems, response.data]);
      dispatch(resetForm());
      navigate(`/list`);
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  // For editing an existing entry
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { type: category, ...formData };
    try {
      const response = await axiosInstance.put<{ id: number; name: string }>(
        `/items/${formData.id}`,
        data
      );
      setItems((prevItems) => [...prevItems, response.data]);
      dispatch(resetForm());
      navigate(`/list`);
    } catch (error) {
      console.error("Error updating item:", error);
      // Fallback behavior; consider improving error handling here
      handleSubmit(e);
    }
  };

  return (
    <form className={s.form} onSubmit={isEditing ? handleEdit : handleSubmit}>
      <h2 className={s.heading}>
        {isEditing ? "Редактирование объявления" : "Категорийный шаг"}
      </h2>

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
            {carBrands.map((car) => (
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
              selectedBrand.models.map((model) => (
                <option key={model.id} value={model.name}>
                  {model.name}
                </option>
              ))}
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
            {carMileage.map((mileage) => (
              <option key={mileage} value={mileage}>
                {mileage}
              </option>
            ))}
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