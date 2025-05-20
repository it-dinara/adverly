import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Item } from "Types/form";
import { useAppDispatch } from "Redux/hooks";
import s from "./ItemPage.module.css";
import AxiosInstance from "AxiosInstance";
import { setEditing } from "Redux/slices/formSlice";

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
    let firstStepData = {};
    let secondStepData = {};
    if (item) {
      firstStepData = {
        id: item.id,
        name: item.name,
        description: item.description,
        location: item.location,
        category: item.category,
        auto: item.auto,
      };
      sessionStorage.setItem("firstStepData", JSON.stringify(firstStepData));
      console.log("firstStepData", firstStepData);
      if (item.category === "Авто") {
        secondStepData = {
          brand: item.brand,
          model: item.model,
          year: item.year,
          mileage: item.mileage,
        };
        sessionStorage.setItem(
          "secondStepData",
          JSON.stringify(secondStepData)
        );
      }
    }
    dispatch(setEditing(true));
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
                        ? "/assets/images/placeholder.png"
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
      <Link to={`/form`} className={s.editLink}>
        <button type="button" className={s.editButton} onClick={handleEdit}>
          Редактировать
        </button>
      </Link>
    </div>
  );
};

export default ItemPage;
