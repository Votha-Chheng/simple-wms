import { createSlice } from "@reduxjs/toolkit";

export interface DataBarCodeState {
  barcode : string
}

const initialState: DataBarCodeState = {
  barcode : null,
}

const dataBarCodeSlice = createSlice({
  name: 'dataBarCode',
  initialState,
  reducers: {
    resetBarcode: (state) => {
      state.barcode = null
    },
    getBarcode: (state, action) => {
      state.barcode = action.payload
    }
  }
})

export const {resetBarcode, getBarcode} = dataBarCodeSlice.actions

export default dataBarCodeSlice.reducer