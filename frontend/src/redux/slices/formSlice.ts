import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormData, FormState, Categories} from "Types/form";

export const initialState: FormState = {
  formData: {
    name: "",
    description: "",
    location: "",
    photo: null,
    category: Categories.REAL_ESTATE,
    brand: "",
    model: "",
    year: {
      "year-from": "",
      "year-to": "",
    },
  },
  step: 1,
  isEditing: false,
};

const unifiedFormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField<T extends keyof FormData>(
      state: FormState,
      action: PayloadAction<{ field: T; value: FormData[T] }>
    ) {
      const { field, value } = action.payload;
      state.formData[field] = value;
      if (field === "category") {
        state.step = 1; // Reset step when category changes
      }
    },
    updatePhoto(state, action: PayloadAction<File | null>) {
      state.formData.photo = action.payload;
    },
    updateStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    resetForm(state) {
      state.formData = initialState.formData;
      state.step = initialState.step;
      state.isEditing = initialState.isEditing;
    },
    setFormDataForEdit(state, action: PayloadAction<FormData>) {
      state.isEditing = true;
      state.formData = action.payload;
    },
    setItemToEdit(
      state,
      action: PayloadAction<
        Pick<
          FormData,
          "id" | "name" | "description" | "location" | "photo" | "category" | "carFormData"
        >
      >
    ) {
      state.isEditing = true;
      state.step = 2;
      state.formData = action.payload;
    },
  },
});

export const {
  updateField,
  updatePhoto,
  updateStep,
  resetForm,
  setFormDataForEdit,
  setItemToEdit,
} = unifiedFormSlice.actions;

export default unifiedFormSlice.reducer;
export const selectFormData = (state: { form: FormState }) =>
  state.form.formData;
