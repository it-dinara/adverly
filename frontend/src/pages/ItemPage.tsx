import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { setItemToEdit, CategoryKeysType } from "Redux/slices/formSlice";
import { useAppDispatch } from "Redux/hooks";
import s from "./ItemPage.module.css";

export interface Item {
  id: string;
  name: string;
  description: string;
  location: string;
  category: CategoryKeysType;
  photo?: File | null | undefined;
  [key: string]: any;
}

const ItemPage: React.FC = () => {
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const windowLocation = window.location.href;
  const itemId = windowLocation.split("/").pop();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!itemId) {
      setError("Please enter a valid item ID.");
      return;
    }
    const fetchData = async () => {
      try {
        console.log("Item ID:", itemId);
        const response = await axios.get<Item>(
          `http://127.0.0.1:3000/items/${itemId}`
        );
        const data = response.data;
        setItem(data);
        setError(null);
        console.log("item", item);
      } catch (err: any) {
        setItem(null);
        if (err.response && err.response.status === 404) {
          setError("Item not found.");
        } else {
          setError("An error occurred while fetching the item.");
        }
      }
    };
    fetchData();
  }, [itemId, dispatch]);

  const handleEdit = () => {
    if (item) {
      dispatch(setItemToEdit(item));
    }
  };

  return (
    <div className={s.container}>
      {error && <p className={s.errorMessage}>{error}</p>}
      {item && (
        <div className={s.itemDetails}>
          <h2 className={s.title}>Item Details</h2>
          {Object.entries(item ?? {}).map(([type, value]) => {
            if (type === "photo") {
              return (
                <div className={s.imageContainer} key={type}>
                  <img
                    className={s.image}
                    src={
                      value && Object.entries(value).length === 0
                        ? "/todo заглушку поставить"
                        : value
                    }
                    alt={type}
                  />
                </div>
              );
            } else {
              return (
                <p key={type} className={s.itemInfo}>
                  <strong>{type}:</strong> {value}
                </p>
              );
            }
          })}
        </div>
      )}
      <button type="button" className={s.editButton} onClick={handleEdit}>
        <Link to={`/form`} className={s.editLink}>
          Редактировать
        </Link>
      </button>
    </div>
  );
};

export default ItemPage;
