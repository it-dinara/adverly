import React, { useState, useEffect } from "react";
import axios from "axios";
import FirstStep from "../components/Steps/FirstStep/FirstStep";
import SecondStep from "../components/Steps/SecondStep/SecondStep";
import { useAppSelector } from "Redux/hooks";
import { Link } from "react-router-dom";
import s from "./FormPage.module.css";
import useReduxFormSync from "Hooks/useReduxFormSync";
import useSubmitForm from "Hooks/useSubmitForm";
import { formDataSchema, FormDataValues } from "Types/form";
import Auto from "Categories/Auto/Auto";

const FormPage = () => {
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
  const { form } = useAppSelector((state) => state.form);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control,
  } = useReduxFormSync<FormDataValues>({
    formField: "form",
    schema: formDataSchema,
    mode: "onChange",
  });

  const onSubmit = useSubmitForm();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get<{ id: number; name: string }[]>(
        `http://127.0.0.1:3000/items`
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await axios.delete(`http://127.0.0.1:3000/items/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Validation Errors:", errors.selectedCategoryForm);
  };

  return (
    <div className={s.container}>
      <div className={s.wrap}>
        <form
          onSubmit={handleSubmit(onSubmit, (errors: any) => onInvalid(errors))}
        >
          <FirstStep
            register={register}
            watch={watch}
            errors={errors}
            setValue={setValue}
          />
          <Auto register={register} watch={watch} errors={errors} />
        </form>
      </div>

      <h2>{items.length > 0 && `Items`}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/items/${item.id}`}>{item.name}</Link>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormPage;
