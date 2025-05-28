
import { ICampaign } from '@/model/CampaignModel';
import { createSlice } from '@reduxjs/toolkit';

interface WishlistState {
    items: ICampaign[];
  }
  

const initialState:WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addOne: (state, action) => {
      const exists = state.items.some(item => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload); 
      }
    },
    addItem: (state, action) => {
      state.items = action.payload
    },
   
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
   
    clearWishlist: (state) => {
      state.items = [];
    }
  }
});


export const { addItem, addOne, removeItem, clearWishlist } = wishlistSlice.actions;


export default wishlistSlice.reducer;
