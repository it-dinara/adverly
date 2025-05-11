import React, { useState, useEffect } from "react";
import axios from "axios";
import BasicStepForm from "../components/Steps/BasicStepForm/BasicStepForm";
import CategoryStepForm from "../components/Steps/CategoryStepForm/CategoryStepForm";
import { useAppSelector } from "Redux/hooks";
import { Link } from "react-router-dom";
import s from "./FormPage.module.css";

const FormPage = () => {
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);

  const isEditing = useAppSelector((state) => state.form.isEditing);
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
  const step = useAppSelector((state) => state.form.step);

  return (
    <div className={s.container}>
      <BasicStepForm isEditing={isEditing} />
      {step === 2 && <CategoryStepForm isEditing={isEditing} />}

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
