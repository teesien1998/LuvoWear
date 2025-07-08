import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    category: "",
    size: [],
    color: [],
    gender: "",
    brand: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    search: "",
    material: [],
    collection: "",
  },
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFiltersRedux: (state, action) => {
      state.filters = action.payload;
    },
    clearFiltersRedux: (state) => {
      state.filters = { ...initialState.filters };
    },
  },
});

export const { setFiltersRedux, clearFiltersRedux } = filterSlice.actions;
export default filterSlice.reducer;
