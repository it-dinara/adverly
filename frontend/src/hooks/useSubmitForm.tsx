import { useAppSelector, useAppDispatch } from "Redux/hooks";
import axiosInstance from "AxiosInstance";
import { useNavigate } from "react-router-dom";
import { resetForm } from "Redux/slices/formSlice";
import { FormDataValues } from "Types/form";

export default function useSubmitForm(): (
  data: FormDataValues
) => Promise<void> {
  const navigate = useNavigate();
  const { isEditing, id, firstStep } = useAppSelector((state) => state.form);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormDataValues) => {
    const {
      name,
      description,
      location,
      photo,
      category,
      selectedCategoryForm,
    } = data;
    const formData = {
      name,
      description,
      location,
      photo,
      category,
      ...selectedCategoryForm,
    };
    try {
      if (isEditing) {
        console.log("Editing item with ID:", firstStep, "id", id);
        await axiosInstance.put(`/items/${id}`, formData);
      } else {
        await axiosInstance.post(`/items`, formData);
      }
      dispatch(resetForm());
      navigate(`/list`);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  return onSubmit;
}
