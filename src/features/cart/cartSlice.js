import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], coupon: null, discount: 0 },
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
    setCoupon(state, action) {
      state.coupon = action.payload.code;
      state.discount = action.payload.discount;
    },
    clearCoupon(state) {
      state.coupon = null;
      state.discount = 0;
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
    },
  },
});

export const { setCart, setCoupon, clearCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;