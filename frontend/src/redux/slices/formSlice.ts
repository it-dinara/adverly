import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormData, FormState, Categories, CategoryKeysType } from "Types/form";

export const initialState: FormState = {
  formData: {
    name: "",
    description: "",
    location: "",
    photo: null,
    category: undefined,
    auto: {
      category: Categories.AUTO,
      brand: "",
      model: "",
      year: undefined,
      mileage: undefined,
    },
  },
  step: 1,
  isEditing: false,
  category: undefined,
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
    updateAutoField<T extends keyof FormData["auto"]>(
      state: FormState,
      action: PayloadAction<{ field: T; value: FormData["auto"][T] }>
    ) {
      const { field, value } = action.payload;
      if (state.formData.auto) {
        state.formData.auto[field] = value;
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
    setItemToEdit(
      state,
      action: PayloadAction<
        Pick<
          FormData,
          | "id"
          | "name"
          | "description"
          | "location"
          | "photo"
          | "category"
          | "auto"
        >
      >
    ) {
      state.isEditing = true;
      state.step = 2;
      state.formData = action.payload;
    },
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
    setCategory(state, action: PayloadAction<CategoryKeysType>) {
      state.category = action.payload;
    },
  },
});

export const {
  updateField,
  updatePhoto,
  updateStep,
  resetForm,
  setItemToEdit,
  updateAutoField,
  setEditing,
} = unifiedFormSlice.actions;

export default unifiedFormSlice.reducer;
export const selectFormData = (state: { form: FormState }) =>
  state.form.formData;

export const selectAuto = (state: { form: FormState }) =>
  state.form.formData.auto;
