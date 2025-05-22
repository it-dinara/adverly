// src/redux/slices/formSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FirstStep,
  FormState,
  Categories,
  AutoData,
  RealEstateData,
  ServiceData,
} from "Types/form";

export const initialState: FormState = {
  firstStep: {
    id: undefined,
    name: "",
    description: "",
    location: "",
    photo: null,
    category: Categories.AUTO, // Use a single default value
  },
  auto: {
    brand: "",
    model: "",
    year: 0,
    mileage: undefined,
  },
  realEstate: {
    propertyType: "",
    area: 0,
    rooms: 0,
    price: 0,
  },
  service: {
    serviceType: "",
    experience: 0,
    cost: 0,
    schedule: "",
  },
  step: 1,
  isEditing: false,
  category: Categories.AUTO, // Default category
};

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
    resetForm(state) {
      state.firstStep = initialState.firstStep;
      state.step = initialState.step;
      state.isEditing = initialState.isEditing;
    },
    // Set an item for editing (only using a subset of FirstStep keys)
    setItemToEdit(
      state,
      action: PayloadAction<
        Pick<
          FirstStep,
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
      state.firstStep = action.payload as FirstStep;
    },
    // Toggle the editing mode
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
  },
});

export const {
  updateData,
  updatePhoto,
  updateStep,
  resetForm,
  setItemToEdit,
  setEditing,
} = unifiedFormSlice.actions;

export default unifiedFormSlice.reducer;

// Selectors for accessing form data and nested "auto" data
export const selectFirstStep = (state: { form: FormState }) =>
  state.form.firstStep;
