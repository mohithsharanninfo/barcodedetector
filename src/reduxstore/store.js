import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../reduxstore/slice';

export const store = configureStore({
  reducer: {
    product: productReducer,
  },
});