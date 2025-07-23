import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scannedBarcode: '',
  selectedProducts: null,
  scannedProducts: [],
  startDate: null,
  endDate: null,
  boxData: [],
  products: []
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setScannedBarcode: (state, action) => {
      state.scannedBarcode = action.payload;
    },
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload;
    },

    setScannedProducts: (state, action) => {
      const exists = state?.scannedProducts?.some(p => p.barcode_no === action.payload.barcode_no);
      if (!exists) {
        state?.scannedProducts.push(action.payload);
      }
    },

    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },

    setBoxData: (state, action) => {
      state.boxData = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setScannedBarcode, setSelectedProducts, setScannedProducts, setStartDate, setEndDate, setBoxData, setProducts } = productSlice.actions;

export default productSlice.reducer;
