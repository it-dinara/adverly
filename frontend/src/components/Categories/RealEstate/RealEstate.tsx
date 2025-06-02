import React from "react";
import s from "./RealEstate.module.css";
import { useAppSelector } from "Redux/hooks";

const propertyTypes = [
  "Квартира",
  "Дом",
  "Коттедж",
  "Коммерческая",
  "Земельный участок",
];

type RealEstateProps = {
  register: any;
  errors: any;
  [key: string]: any; // for other props like register
};

const RealEstate: React.FC<RealEstateProps> = ({ register, errors }) => {
  const { isEditing } = useAppSelector((state) => state.form);

  return (
    <div className={s.form}>
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
    </div>
  );
};

export default RealEstate;
