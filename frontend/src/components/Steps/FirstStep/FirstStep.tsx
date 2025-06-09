import React from "react";
import { UseFormWatch } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import { updatePhoto } from "Redux/slices/formSlice";
import { Categories, FormState } from "Types/form";
import s from "./FirstStep.module.css";

type FirstStepProps = {
  register: any;
  watch: UseFormWatch<FormState>;
  errors: any;
  setValue: any;
  [key: string]: any; // for other props like register
};

const FirstStep: React.FC<FirstStepProps> = ({
  register,
  errors,
  setValue,
}) => {
  const dispatch = useAppDispatch();
  const { isEditing } = useAppSelector((state) => state.form);

  // Handler for file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setValue("photo", file, { shouldValidate: true });
    dispatch(updatePhoto(file));
  };

  return (
    <div className={s.form}>
      <h2 className={`${s.heading} ${isEditing ? s.editing : ""}`}>
        {isEditing ? "Редактирование объявления" : "Создание объявления"}
      </h2>
      <p className={s.description}>Заполните форму</p>
      <h2 className={s.subtitle}>Основной шаг</h2>

      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="name">
          Название *
        </label>
        <input
          className={s.input}
          type="text"
          id="name"
          {...register("name")}
        />
        {errors.name && <div className={s.error}>{errors.name.message}</div>}
      </div>

      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="description">
          Описание *
        </label>
        <input
          className={s.input}
          type="text"
          id="description"
          {...register("description")}
        />
        {errors.description && (
          <div className={s.error}>{errors.description.message}</div>
        )}
      </div>

      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="location">
          Локация *
        </label>
        <input
          className={s.input}
          type="text"
          id="location"
          {...register("location")}
        />
        {errors.location && (
          <div className={s.error}>{errors.location.message}</div>
        )}
      </div>

      <div className={s.formGroup}>
        <label className={s.label} htmlFor="photo">
          Фото
        </label>
        <input
          className={s.fileInput}
          type="file"
          id="photo"
          onChange={handleFileChange}
        />
        {errors.photo && (
          <div className={s.error}>{errors.photo.message?.toString()}</div>
        )}
      </div>

      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="category">
          Категория *
        </label>
        <select
          className={s.select}
          id="category"
          {...register("category")}
          defaultValue={""}
        >
          {Object.values(Categories).map((category) => (
            <option key={category} value={category}>
              {category === Categories.DEFAULT
                ? "Выберите категорию"
                : category}
            </option>
          ))}
        </select>
        {errors?.category && (
          <div className={s.error}>{errors.category.message}</div>
        )}
      </div>
    </div>
  );
};

export default FirstStep;
