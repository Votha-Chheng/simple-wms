import { createSlice } from "@reduxjs/toolkit";

export interface SelectedMarqueOrCategory {
  selectedMarqueOrCategory: string
}

const initialState: SelectedMarqueOrCategory = {
  selectedMarqueOrCategory: undefined,
}

const selectedMarqueOrCategorySlice = createSlice({
  name: 'selectedMarqueOrCategory',
  initialState,
  reducers: {
    selectMarqueOrCategory: (state, action) => {
      state.selectedMarqueOrCategory = action.payload
    },

  }
})

export const { selectMarqueOrCategory} = selectedMarqueOrCategorySlice.actions

export default selectedMarqueOrCategorySlice.reducer