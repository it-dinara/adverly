import React from "react";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import {
  updateField,
  updatePhoto,
  updateStep,
} from "Redux/slices/formSlice";
import s from "./BasicStepForm.module.css";
import { Categories } from "Types/form";

const BasicStepForm: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
  const formData = useAppSelector((state) => state.form.formData);
  const dispatch = useAppDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name as keyof typeof formData, value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    dispatch(updatePhoto(files ? files[0] : null));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateStep(2));
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <h2 className={`${s.heading} ${isEditing ? s.editing : null}`}>
        {isEditing ? `Редактирование объявления` : `Создание объявления`}
      </h2>
      <p className={s.description}>
        {" "}
        jkjkjhsdkfjhkjshdfkjhskjfhданные о вашем об
      </p>
      <h2 className={s.subtitle}>Основной шаг</h2>

      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="name">
          Название *
        </label>
        <input
          className={s.input}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="description">
          Описание *
        </label>
        <input
          className={s.input}
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="location">
          Локация *
        </label>
        <input
          className={s.input}
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className={s.formGroup}>
        <label className={s.label} htmlFor="photo">
          Фото
        </label>
        <input
          className={s.fileInput}
          type="file"
          id="photo"
          name="photo"
          onChange={handleFileChange}
        />
      </div>

      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="category">
          Категория *
        </label>
        <select
          className={s.select}
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Выберите категорию *</option>
          <option value={Categories.REAL_ESTATE}>
            {Categories.REAL_ESTATE}
          </option>
          <option value={Categories.AUTO}>{Categories.AUTO}</option>
          <option value={Categories.SERVICES}>{Categories.SERVICES}</option>
        </select>
      </div>
    </form>
  );
};

export default BasicStepForm;
