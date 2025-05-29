import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Item, Categories, FormState } from "Types/form";
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
      let categorySelectedData: keyof typeof Categories = "AUTO";
      // Determine the categorySelected key based on the item categorySelected
      Object.entries(Categories).forEach(([key, values]) => {
        if (values === item.categorySelected) {
          categorySelectedData = key as keyof typeof Categories;
        }
      });

      const { name, description, location, categorySelected, photo, ...rest } =
        item;
      dispatch(
        updateData({
          field: "firstStep",
          value: { name, description, location, categorySelected, photo },
        })
      );
      dispatch(
        updateData({
          field: categorySelectedData,
          value: rest as unknown as FormState[typeof categorySelectedData],
        })
      );
      dispatch(updateData({ field: "id", value: item.id }));

      // dispatch(updateData({ field: "step", value: 2 }));
    }
    dispatch(setEditing(true));
  };

  // Create a list of item details
  let list = Object.entries(item ?? {}).map(([type, value]) => {
    return (
      <p key={type} className={s.itemInfo}>
        <strong>{type}:</strong> {value}
      </p>
    );
  });

  let photo = item && item.AUTO && (
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
