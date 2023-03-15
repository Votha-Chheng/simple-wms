import { createSlice } from "@reduxjs/toolkit";

export interface CategoryTopMenu {
  chosenOptionMenu: string
}

const initialState: CategoryTopMenu = {
  chosenOptionMenu: "supprimer"
}

const categoryTopMenuSlice = createSlice({
  name: 'categoryTopMenu',
  initialState,
  reducers: {
    chooseOptionsTopMenu: (state, action) => {
      state.chosenOptionMenu = action.payload
    },

  }
})

export const {chooseOptionsTopMenu} = categoryTopMenuSlice.actions

export default categoryTopMenuSlice.reducer