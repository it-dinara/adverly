import React from "react";
import s from "./Services.module.css";
import { useAppSelector } from "Redux/hooks";

const serviceTypes = [
  "Ремонт",
  "Уборка",
  "Доставка",
  "Репетиторство",
  "Стрижка",
];

type ServicesProps = {
  register: any;
  errors: any;
  [key: string]: any; // for other props like register
};

const Services: React.FC<ServicesProps> = ({ register, errors }) => {
  const { isEditing } = useAppSelector((state) => state.form);

  return (
    <div className={s.form}>
      <h2 className={s.heading}>{"Услуги"}</h2>
      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="serviceType">
          Тип услуги *
        </label>
        <select
          className={`${s.select} ${s.required}`}
          id="serviceType"
          {...register("serviceType")}
        >
          <option value={""}>{"Не указано"}</option>
          {serviceTypes.map((serviceType) => (
            <option key={serviceType} value={serviceType}>
              {serviceType}
            </option>
          ))}
        </select>
        {errors.serviceType && (
          <div className={s.error}>
            {errors.serviceType.message?.toString()}
          </div>
        )}
      </div>
      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="experience">
          Опыт работы (лет) *
        </label>
        <input
          className={`${s.input} ${s.required}`}
          id="experience"
          type="number"
          {...register("experience")}
        />
        {errors.experience && (
          <div className={s.error}>{errors.experience.message?.toString()}</div>
        )}
      </div>
      <div className={s.formGroup}>
        <label className={`${s.label} ${s.required}`} htmlFor="cost">
          Стоимость *
        </label>
        <input
          className={`${s.input} ${s.required}`}
          id="cost"
          type="number"
          {...register("cost")}
        />
        {errors.cost && (
          <div className={s.error}>{errors.cost.message?.toString()}</div>
        )}
      </div>
      <div className={s.formGroup}>
        <label className={s.label} htmlFor="schedule">
          График работы (опционально)
        </label>
        <input
          className={s.input}
          id="schedule"
          type="text"
          {...register("schedule")}
          placeholder="Например: Пн-Пт 9:00 - 18:00"
        />
      </div>
      <input
        className={s.button}
        type="submit"
        value={isEditing ? "Сохранить изменения" : "Продолжить"}
      />
    </div>
  );
};

export default Services;
