import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import s from "./RealEstate.module.css";
import axiosInstance from "AxiosInstance";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const propertyTypes = [
  "Квартира",
  "Дом",
  "Коттедж",
  "Коммерческая",
  "Земельный участок",
];

const realEstateSchema = z.object({
  propertyType: z.string().min(1, "Тип недвижимости обязателен"),
  area: z.coerce.number().positive("Площадь должна быть положительным числом"),
  rooms: z.coerce
    .number()
    .positive("Количество комнат должно быть положительным числом"),
  price: z.coerce.number().positive("Цена должна быть положительным числом"),
  id: z.string().optional(),
});

type RealEstateFormValues = z.infer<typeof realEstateSchema>;

const RealEstate: React.FC<{ isEditing?: boolean }> = ({ isEditing }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RealEstateFormValues>({
    resolver: zodResolver(realEstateSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: RealEstateFormValues) => {
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
        setValue(key as keyof RealEstateFormValues, parsedData[key]);
      });
    }
    return () => {
      if (isEditing === false) {
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
