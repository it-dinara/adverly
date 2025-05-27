import React from "react";
import s from "./RealEstate.module.css";
import axiosInstance from "AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "Redux/hooks";
import useReduxFormSync from "Hooks/useReduxFormSync";
import { realEstateSchema, RealEstateFormValues } from "Types/form";
import { defaultRealEstateData } from "Constants/formDefaults";

const propertyTypes = [
  "Квартира",
  "Дом",
  "Коттедж",
  "Коммерческая",
  "Земельный участок",
];

const RealEstate: React.FC = () => {
  const navigate = useNavigate();
  const { isEditing, id, firstStep } = useAppSelector((state) => state.form);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useReduxFormSync({
    formField: "REAL_ESTATE",
    schema: realEstateSchema,
    defaultValues: defaultRealEstateData,
  });

  const onSubmit = async (data: RealEstateFormValues) => {
    const formData = {
      ...firstStep,
      ...data,
    };
    try {
      if (isEditing) {
        await axiosInstance.put(`/items/${id}`, formData);
      } else {
        await axiosInstance.post(`/items`, formData);
      }
      navigate(`/list`);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={s.heading}>{"Недвижимость"}</h2>
      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="propertyType">
          Тип недвижимости *
        </label>
        <select
          className={`${s.select} ${s.required}`}
          id="propertyType"
          {...register("propertyType")}
        >
          <option value={""}>{"Не указано"}</option>
          {propertyTypes.map((propertyType) => (
            <option key={propertyType} value={propertyType}>
              {propertyType}
            </option>
          ))}
        </select>
        {errors.propertyType && (
          <div className={s.error}>
            {errors.propertyType.message?.toString()}
          </div>
        )}
      </div>
      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="area">
          Площадь (кв. м) *
        </label>
        <input
          className={`${s.input} ${s.required}`}
          id="area"
          type="number"
          {...register("area")}
        />
        {errors.area && (
          <div className={s.error}>{errors.area.message?.toString()}</div>
        )}
      </div>
      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="rooms">
          Количество комнат *
        </label>
        <input
          className={`${s.input} ${s.required}`}
          id="rooms"
          type="number"
          {...register("rooms")}
        />
        {errors.rooms && (
          <div className={s.error}>{errors.rooms.message?.toString()}</div>
        )}
      </div>
      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="price">
          Цена *
        </label>
        <input
          className={`${s.input} ${s.required}`}
          id="price"
          type="number"
          {...register("price")}
        />
        {errors.price && (
          <div className={s.error}>{errors.price.message?.toString()}</div>
        )}
      </div>
      <input
        className={s.button}
        type="submit"
        value={isEditing ? "Сохранить изменения" : "Продолжить"}
      />
    </form>
  );
};

export default RealEstate;
