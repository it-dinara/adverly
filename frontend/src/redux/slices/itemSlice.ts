import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../axios-adverly";

interface ItemState {
  item: Item;
  loading: boolean;
  error: string | null;
}

interface Item {
  id: string;
  title: string;
  description: string;
  image?: string;
}

const initialState: ItemState = {
  item: {
    id: "",
    title: "",
    description: "",
    image: "",
  },
  loading: false,
  error: null,
};

// Асинхронное получение данных объявления
export const fetchItem = createAsyncThunk<Item, string>(
  "Item/fetchItem",
  async (id: string): Promise<Item> => {
    console.log("suka bleat");
    const response = await axios.get<Item>(
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
      state.item = action.payload;
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
        state.item = payload;
      })
      .addCase(fetchItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      });
  },
});

export const { updateItem } = ItemSlice.actions;
export default ItemSlice.reducer;
