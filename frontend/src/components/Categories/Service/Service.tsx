import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import s from "./Service.module.css";
import axiosInstance from "AxiosInstance";
import { useNavigate } from "react-router-dom";

const serviceTypes = [
  "Ремонт",
  "Уборка",
  "Доставка",
  "Репетиторство",
  "Стрижка",
];

const serviceSchema = z.object({
  serviceType: z.string().min(1, "Тип услуги обязателен"),
  experience: z.coerce
    .number()
    .positive("Опыт работы должен быть положительным числом"),
  cost: z.coerce
    .number()
    .positive("Стоимость должна быть положительным числом"),
  schedule: z.string().optional(),
  id: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const Service: React.FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: ServiceFormValues) => {
    const firstStepSessionStorage = sessionStorage.getItem("firstStepData");
    const firstStepData = JSON.parse(firstStepSessionStorage || "{}");
    try {
      if (isEditing) {
        await axiosInstance.put(`/items/${firstStepData.id}`, {
          ...firstStepData,
          ...data,
        });
      } else {
        await axiosInstance.post(`/items`, { ...firstStepData, ...data });
      }
      navigate(`/list`);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("secondStepData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      Object.keys(parsedData).forEach((key) => {
        setValue(key as keyof ServiceFormValues, parsedData[key]);
      });
    }
    return () => {
      if (!isEditing) {
        sessionStorage.removeItem("secondStepData");
      }
    };
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((values) => {
      sessionStorage.setItem("secondStepData", JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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

export default Service;
