import { useAppSelector, useAppDispatch } from "Redux/hooks";
import axiosInstance from "AxiosAdverly";
import { useNavigate } from "react-router-dom";
import { resetForm } from "Redux/slices/formSlice";
import { FormState } from "Types/form";

export default function useSubmitForm(): (data: FormState) => Promise<void> {
  const navigate = useNavigate();
  const { isEditing, id, firstStep } = useAppSelector((state) => state.form);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormState) => {
    try {
      if (isEditing) {
        console.log("Editing item with ID:", firstStep, "id", id);
        await axiosInstance.put(`/items/${id}`, data);
      } else {
        await axiosInstance.post(`/items`, data);
      }
      dispatch(resetForm());
      navigate(`/items`);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  return onSubmit;
}
