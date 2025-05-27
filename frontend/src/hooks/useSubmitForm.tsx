import { useAppSelector } from "Redux/hooks";
import axiosInstance from "AxiosInstance";
import { useNavigate } from "react-router-dom";

export default function useSubmitForm<TFormValues>(): (
  data: TFormValues
) => Promise<void> {
  const navigate = useNavigate();
  const { isEditing, id, firstStep } = useAppSelector((state) => state.form);

  const onSubmit = async (data: TFormValues) => {
    const formData = {
      ...firstStep,
      ...data,
    };
    try {
      if (isEditing) {
        console.log("Editing item with ID:", firstStep, "id", id);
        await axiosInstance.put(`/items/${id}`, formData);
      } else {
        await axiosInstance.post(`/items`, formData);
      }
      navigate(`/list`);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  return onSubmit;
}
