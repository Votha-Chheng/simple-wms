import { createSlice } from "@reduxjs/toolkit";
import { Filters } from "../../classes/Filters";


const initialState: Filters = {
  parType : "",
  alphabetique : false,
  ordreAlphabet: null,
  dateEntree : true,
  recent: true,
  searchInput : "",
  alertStock: false,
  searchByText:"",
  unreadableBarcode: false
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    resetFilters: (state) => {
      state.parType = "",
      state.alphabetique = false,
      state.ordreAlphabet = null,
      state.dateEntree = true,
      state.recent = true,
      state.searchInput = "",
      state.alertStock = false,
      state.searchByText = "",
      state.unreadableBarcode = false
    },
    setParType : (state, action) =>{
      state.parType = action.payload
    },
    setAlphabetique : (state, action) =>{
      state.alphabetique = action.payload
    },
    setOrdreAlphabet : (state, action) =>{
      state.ordreAlphabet = action.payload
    },
    setDateEntree : (state, action) =>{
      state.dateEntree = action.payload
    },
    setRecent : (state, action) =>{
      state.recent = action.payload
    },
    setSearchInput : (state, action) =>{
      state.searchInput = action.payload
    },
    setAlertStock : (state, action) =>{
      state.alertStock = action.payload
    },
    setSearchByText : (state, action) =>{
      state.searchByText = action.payload
    },
    setUnreadableBarcode: (state, action)=> {
      state.unreadableBarcode = action.payload
    }
  }
})

export const {resetFilters, setParType, setAlphabetique, setOrdreAlphabet, setDateEntree, setRecent, setSearchInput, setAlertStock, setSearchByText, setUnreadableBarcode} = filterSlice.actions

export default filterSlice.reducer