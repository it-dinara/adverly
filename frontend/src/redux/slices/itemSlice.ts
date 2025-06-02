import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "AxiosAdverly";

interface ItemState {
  itemDetails: ItemDetails;
  loading: boolean;
  error: string | null;
}

interface ItemDetails {
  id: string;
  title: string;
  description: string;
  image?: string;
}

const initialState: ItemState = {
  itemDetails: {
    id: "",
    title: "",
    description: "",
    image: "",
  },
  loading: false,
  error: null,
};

// Асинхронное получение данных объявления
export const fetchItem = createAsyncThunk<ItemDetails, string>(
  "Item/fetchItem",
  async (id: string): Promise<ItemDetails> => {
    console.log("suka bleat");
    const response = await axios.get<ItemDetails>(
      `${axiosInstance}/api/Items/${id}`
    );
    return response.data;
  }
);

const ItemSlice = createSlice({
  name: "Item",
  initialState,
  reducers: {
    updateItem(state, action) {
      state.itemDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItem.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.itemDetails = payload;
      })
      .addCase(fetchItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      });
  },
});

export const { updateItem } = ItemSlice.actions;
export default ItemSlice.reducer;
