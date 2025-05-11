import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Item {
  id: number;
  name: string;
  description: string;
  location: string;
  type: string;
  [key: string]: any; // To accommodate additional fields
}

interface ItemsState {
  items: Item[];
  currentPage: number;
  itemsPerPage: number;
  error?: string | null;
}

const initialState: ItemsState = {
  items: [],
  currentPage: 1,
  itemsPerPage: 5,
};

// Async thunk to fetch items (simulate API call)
export const fetchItems = createAsyncThunk("items/fetchItems", async () => {
  const response = await axios.get<Item[]>("http://127.0.0.1:3000/items");
  return response.data;
});

const itemsListSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(fetchItems.rejected, (state, action) => {
      state.error = action.error.message || "Failed to fetch items";
    });
  },
});

export const { setCurrentPage } = itemsListSlice.actions;
export default itemsListSlice.reducer;
