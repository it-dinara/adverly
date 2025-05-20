import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "Redux/hooks";
import { updateStep, updatePhoto } from "Redux/slices/formSlice";
import s from "./BasicStepForm.module.css";
import { Categories } from "Types/form";

// Определяем схему валидации формы с помощью Zod
const formSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().min(1, "Описание обязательно"),
  location: z.string().min(1, "Локация обязательна"),
  // Поле "photo" опциональное: если пользователь выбрал файл, оно должно быть экземпляром File
  photo: z.instanceof(File).optional().nullable(),
  category: z.string().min(1, "Категория обязательна"),
});

// Выводим типы на основе схемы
type FormValues = z.infer<typeof formSchema>;

const BasicStepForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const isEditing = useAppSelector((state) => state.form.isEditing);

  // Инициализируем react-hook-form с использованием zodResolver
  const formData = sessionStorage.getItem("firstStepData");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData ? JSON.parse(formData) : {}, // Set initial form default values from the store
  });

  // Обработчик выбора файла (фото)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    // Устанавливаем значение поля "photo" в форму
    setValue("photo", file, { shouldValidate: true });
    // Опционально обновляем Redux, если требуется хранение фото в глобальном состоянии
    dispatch(updatePhoto(file));
  };

  // Load stored values when the component mounts
  useEffect(() => {
    const storedData = sessionStorage.getItem("firstStepData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      Object.keys(parsedData).forEach((key) => {
        setValue(key as keyof FormValues, parsedData[key]);
      });
    }
    return () => {
      // Clear sessionStorage when the component unmounts
      if (isEditing === false) {
        sessionStorage.removeItem("firstStepData");
      }
    };
  }, [setValue]);

  // Watch form values and store them in sessionStorage
  useEffect(() => {
    const subscription = watch((data) => {
      sessionStorage.setItem("firstStepData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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

      <button className={s.button} type="submit">
        Далее
      </button>
    </form>
  );
};

export default BasicStepForm;
