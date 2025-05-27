import React from "react";
import s from "./Services.module.css";
import axiosInstance from "AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "Redux/hooks";
import useReduxFormSync from "Hooks/useReduxFormSync";
import { defaultServicesData } from "Constants/formDefaults";
import { servicesSchema, ServicesFormValues } from "Types/form";

const serviceTypes = [
  "Ремонт",
  "Уборка",
  "Доставка",
  "Репетиторство",
  "Стрижка",
];

const Services: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useReduxFormSync<ServicesFormValues>({
    formField: "SERVICES",
    schema: servicesSchema,
    defaultValues: defaultServicesData,
  });

  const { firstStep, id, isEditing } = useAppSelector((state) => state.form);

  const onSubmit = async (data: ServicesFormValues) => {
    try {
      if (isEditing) {
        await axiosInstance.put(`/items/${id}`, {
          ...firstStep,
          ...data,
        });
      } else {
        await axiosInstance.post(`/items`, { ...firstStep, ...data });
      }
      navigate(`/list`);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
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
    </form>
  );
};

export default Services;
