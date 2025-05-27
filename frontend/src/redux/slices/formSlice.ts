import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormState } from "Types/form";
import { defaultFormState } from "../../constants/formDefaults";

export const initialState: FormState = defaultFormState;

const unifiedFormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateData<T extends keyof FormState>(
      state: FormState,
      action: PayloadAction<{ field: T; value: FormState[T] }>
    ) {
      const { field, value } = action.payload;
      state[field] = value;
      if (field === "category") {
        state.step = 1; // Reset step if the category changes
      }
    },
    // Update the photo field
    updatePhoto(state, action: PayloadAction<File | null>) {
      state.firstStep.photo = action.payload;
    },
    // Update the current step number
    updateStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    // Reset all form values to their initial state
    resetForm() {
      return initialState;
    },
    // Toggle the editing mode
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
  },
});

export const { updateData, updatePhoto, updateStep, resetForm, setEditing } =
  unifiedFormSlice.actions;

export default unifiedFormSlice.reducer;

// Selectors for accessing form data and nested "auto" data
export const selectFirstStep = (state: { form: FormState }) =>
  state.form.firstStep;
