import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Item, Categories } from "Types/form";
import { useAppDispatch } from "Redux/hooks";
import s from "./ItemPage.module.css";
import AxiosInstance from "AxiosInstance";
import { setEditing, updateData } from "Redux/slices/formSlice";

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
        const response = await AxiosInstance.get<Item>(`/items/${itemId}`);
        const data = response.data;
        setItem(data);
        setError(null);
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
      let categoryData: keyof typeof Categories = "AUTO";
      Object.entries(Categories).forEach(([key, values]) => {
        if (values === item.category) {
          categoryData = key as keyof typeof Categories;
        }
      });
      const {
        firstStep: { name, description, location, category, id, photo } = item,
        [categoryData as keyof typeof Categories]: { ...rest } = item,
      } = item;
      dispatch(
        updateData({
          field: "firstStep",
          value: { name, description, location, category, photo },
        })
      );
      dispatch(updateData({ field: categoryData, value: rest }));
      dispatch(updateData({ field: "id", value: id }));
      // dispatch(updateData({ field: "step", value: 2 }));
    }
    dispatch(setEditing(true));
  };

  let list = Object.entries(item ?? {}).map(([type, value]) => {
    return (
      <p key={type} className={s.itemInfo}>
        <strong>{type}:</strong> {value}
      </p>
    );
  });

  let photo = item && item.auto && (
    <div className={s.imageContainer} key={"photo"}>
      <img
        className={s.image}
        alt={"photo"}
        src={
          item.photo
            ? URL.createObjectURL(item.photo)
            : "/assets/images/placeholder.png"
        }
      />
    </div>
  );

  let itemDetails = (
    <>
      <div className={s.itemDetails}>
        <h2 className={s.title}>Item Details</h2>
        {list}
        {photo}
      </div>
      <Link to={`/form`} className={s.editLink}>
        <button type="button" className={s.editButton} onClick={handleEdit}>
          Редактировать
        </button>
      </Link>
    </>
  );

  return (
    <div className={s.container}>
      {error && <p className={s.errorMessage}>{error}</p>}
      {item && !error ? itemDetails : null}
    </div>
  );
};

export default ItemPage;
