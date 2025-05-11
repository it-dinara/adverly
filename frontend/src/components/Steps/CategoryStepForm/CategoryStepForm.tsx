import React, { useEffect, useState } from "react";
import s from "./CategoryStepForm.module.css";
import { Categories, updateField, resetForm } from "Redux/slices/formSlice";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Item } from "../../../pages/ItemPage";

const CategoryStepForm: React.FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  const { category } = useAppSelector((state) => state.form.formData);
  const formData = useAppSelector((state) => state.form.formData);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    console.log("CategoryStepForm useEffect triggered");
  }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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
    console.log("Form submitted:", data);
    if (isEditing && formData.id) {
      try {
        const response = await axios.put<{ id: number; name: string }>(
          `http://127.0.1:3000/items/${formData.id}`,
          data
        );
        console.log("Item updated:", response.data);
        setItems([...items, response.data]);
        dispatch(resetForm());
        navigate(`/list`);
      } catch (error) {
        console.error("Error updating item:", error);
        handleSubmit(e);
      }
    }
  };

  return (
    <form className={s.form} onSubmit={isEditing ? handleEdit : handleSubmit}>
      <h2 className={s.heading}>
        {isEditing ? "Редактирование объявления" : "Категорийный шаг"}
      </h2>

      {/* Real Estate */}
      {category === Categories.REAL_ESTATE && (
        <>
          <label className={`${s.label} ${s.required}`} htmlFor="propertyType">
            Тип недвижимости *
          </label>
          <select
            className={`${s.select} ${s.required}`}
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
          >
            <option value="">Выберите тип недвижимости</option>
            <option value="Квартира">Квартира</option>
            <option value="Дом">Дом</option>
            <option value="Коттедж">Коттедж</option>
          </select>

          <label className={`${s.label} ${s.required}`} htmlFor="area">
            Площадь (кв. м) *
          </label>
          <input
            className={`${s.input} ${s.required}`}
            type="number"
            id="area"
            name="area"
            value={formData.area || ""}
            onChange={handleNumberChange}
            required
          />

          <label className={`${s.label} ${s.required}`} htmlFor="rooms">
            Количество комнат *
          </label>
          <input
            className={`${s.input} ${s.required}`}
            type="number"
            id="rooms"
            name="rooms"
            value={formData.rooms || ""}
            onChange={handleNumberChange}
            required
          />

          <label className={`${s.label} ${s.required}`} htmlFor="price">
            Цена *
          </label>
          <input
            className={`${s.input} ${s.required}`}
            type="number"
            id="price"
            name="price"
            value={formData.price || ""}
            onChange={handleNumberChange}
            required
          />
        </>
      )}

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
            value={formData.brand || ""}
            onChange={handleChange}
            required
          >
            <option value="">Выберите марку</option>
            <option value="Toyota">Toyota</option>
            <option value="BMW">BMW</option>
            <option value="Honda">Honda</option>
          </select>

          <label className={`${s.label} ${s.required}`} htmlFor="model">
            Модель *
          </label>
          <input
            className={`${s.input} ${s.required}`}
            type="text"
            id="model"
            name="model"
            value={formData.model || ""}
            onChange={handleChange}
            required
          />

          <label className={`${s.label} ${s.required}`} htmlFor="year">
            Год выпуска *
          </label>
          <input
            className={`${s.input} ${s.required}`}
            type="number"
            id="year"
            name="year"
            value={formData.year || ""}
            onChange={handleNumberChange}
            required
          />

          <label className={s.label} htmlFor="mileage">
            Пробег (км)
          </label>
          <input
            className={s.input}
            type="number"
            id="mileage"
            name="mileage"
            value={formData.mileage || ""}
            onChange={handleNumberChange}
          />
        </>
      )}

      {/* Services */}
      {category === Categories.SERVICES && (
        <>
          <label className={`${s.label} ${s.required}`} htmlFor="serviceType">
            Тип услуги *
          </label>
          <select
            className={s.select}
            id="serviceType"
            name="serviceType"
            value={formData.serviceType || ""}
            onChange={handleChange}
            required
          >
            <option value="">Выберите тип услуги</option>
            <option value="Ремонт">Ремонт</option>
            <option value="Уборка">Уборка</option>
            <option value="Доставка">Доставка</option>
          </select>

          <label className={`${s.label} ${s.required}`} htmlFor="experience">
            Опыт работы (лет) *
          </label>
          <input
            className={`${s.input} ${s.required}`}
            type="number"
            id="experience"
            name="experience"
            value={formData.experience || ""}
            onChange={handleNumberChange}
            required
          />

          <label className={`${s.label} ${s.required}`} htmlFor="cost">
            Стоимость *
          </label>
          <input
            className={`${s.input} ${s.required}`}
            type="number"
            id="cost"
            name="cost"
            value={formData.cost || ""}
            onChange={handleNumberChange}
            required
          />

          <label className={s.label} htmlFor="schedule">
            График работы
          </label>
          <input
            className={s.input}
            type="text"
            id="schedule"
            name="schedule"
            value={formData.schedule || ""}
            onChange={handleChange}
          />
        </>
      )}

      <button className={s.button} type="submit">
        {isEditing ? "Сохранить изменения" : "Продолжить"}
      </button>
    </form>
  );
};

export default CategoryStepForm;
