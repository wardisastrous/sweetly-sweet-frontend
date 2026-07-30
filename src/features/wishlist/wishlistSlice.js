import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ids: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, action) {
      state.ids = action.payload;
    },

    addWishlist(state, action) {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
      }
    },

    removeWishlist(state, action) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },

    clearWishlist(state) {
      state.ids = [];
    },
  },
});

export const {
  setWishlist,
  addWishlist,
  removeWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;