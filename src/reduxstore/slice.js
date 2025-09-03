import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scannedBarcode: '',
  selectedProducts: null,
  scannedProducts: [],
  boxData: [],
  products: [],
  picklistNo: '',
  branchcode: 'BOS',
  barcodeRender:'',
  viewBoxData: []
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

    setBoxData: (state, action) => {
      state.boxData = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setPicklistNo: (state, action) => {
      state.picklistNo = action.payload;
    },
    setBranchCode: (state, action) => {
      state.branchcode = action.payload;
    },

     setBracodeRender: (state, action) => {
      state.barcodeRender = action.payload;
    },
     setViewBoxData: (state, action) => {
      state.viewBoxData = action.payload;
    },
  },
});

export const {
  setScannedBarcode,
  setSelectedProducts,
  setScannedProducts,
  setBoxData,
  setProducts,
  setPicklistNo,
  setBranchCode,
  setBracodeRender,
  setViewBoxData
} = productSlice.actions;

export default productSlice.reducer;
