import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Item } from "Types/form";
import { useAppDispatch } from "Redux/hooks";
import s from "./ItemPage.module.css";
import AxiosInstance from "AxiosInstance";
import { setItemToEdit } from "Redux/slices/formSlice";

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
        const response = await AxiosInstance.get<Item>(`/items/${itemId}`);
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
  }, [itemId]);

  const handleEdit = () => {
    if (item) {
      if(item.category === "Авто") {
        item.auto = {
          category: item.category,
          brand: item.brand,
          model: item.model,
          year: {
            "year-from": item["year-from"],
            "year-to": item["year-to"],
          },
          mileage: item.mileage,
        };
      }
      const itemToEdit = {
        id: item.id,
        name: item.name,
        description: item.description,
        location: item.location,
        category: item.category,
        auto: item.auto,
      };
      dispatch(setItemToEdit(itemToEdit));
      console.log("item        ---------", item);
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
            } else if (type === "year") {
              return (
                <p key={type} className={s.itemInfo}>
                  <strong>{type}:</strong>
                  <span> {value["year-from"] + "-" + value["year-to"]}</span>
                </p>
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
