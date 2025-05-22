import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import { updateStep, updatePhoto, updateData } from "Redux/slices/formSlice";
import s from "./FirstStep.module.css";
import { Categories, CategoryKeysType } from "Types/form";
import debounce from "Utils/debounce";

// Define the validation schema via Zod
const formSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().min(1, "Описание обязательно"),
  location: z.string().min(1, "Локация обязательна"),
  photo: z.instanceof(File).optional().nullable(),
  category: z.nativeEnum(Categories, { message: "Категория обязательна" }),
});

type FormValues = z.infer<typeof formSchema>;

const FirstStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const isEditing = useAppSelector((state) => state.form.isEditing);
  const firstStep = useAppSelector((state) => state.form.firstStep);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: firstStep,
    mode: "onBlur",
  });

  // Fill the form with Redux data after mounting
  useEffect(() => {
    if (firstStep) {
      (Object.keys(firstStep) as (keyof FormValues)[]).forEach((key) => {
        setValue(key, firstStep[key]);
      });
    }
  }, [setValue]);

  // Handler for file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setValue("photo", file, { shouldValidate: true });
    dispatch(updatePhoto(file));
  };

  // Subscribe to form changes and update Redux accordingly
  useEffect(() => {
    // Debounce the dispatch function so it doesn't fire on every keystroke
    const debouncedUpdate = debounce((cleanedData: FormValues) => {
      dispatch(updateData({ field: "firstStep", value: cleanedData }));
    }, 1000);

    const subscription = watch((data) => {
      // Ensure all required fields are present and not undefined
      const cleanedData = {
        name: data.name ?? "",
        description: data.description ?? "",
        location: data.location ?? "",
        photo: data.photo ?? null,
        category: data.category as CategoryKeysType, // Ensure correct type and not undefined
      };
      if (cleanedData) {
        debouncedUpdate(cleanedData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const onSubmit = (data: FormValues) => {
    dispatch(updateStep(2));
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
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
        <select className={s.select} id="category" {...register("category")}>
          <option value="">Выберите категорию *</option>
          {Object.values(Categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <div className={s.error}>{errors.category.message}</div>
        )}
      </div>
    </form>
  );
};

export default FirstStep;
