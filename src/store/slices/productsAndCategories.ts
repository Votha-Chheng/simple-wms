import { createSlice } from "@reduxjs/toolkit";
import Product from "../../classes/Product";
import Category from "../../classes/Category";

export interface ProductAndCategoriesState {
  allProducts: Product[],
  singleProduct : Product,
  allCategories: Category[],
  singleCategory: Category
}

const initialState: ProductAndCategoriesState = {
  allProducts: undefined,
  singleProduct : undefined,
  allCategories: undefined,
  singleCategory: undefined
}

const productsAndCategoriesSlice = createSlice({
  name: 'productsAndCategories',
  initialState,
  reducers: {
    getAllProducts: (state, action) => {
      state.allProducts = action.payload
    },
    getSingleProduct : (state, action) =>{
      state.singleProduct = action.payload
    },
    getAllCategories : (state, action)=> {
      state.allCategories = action.payload
    },
    getSingleCategory : (state, action)=> {
      state.singleCategory = action.payload
    }
  }
})

export const { getAllCategories, getAllProducts, getSingleCategory, getSingleProduct } = productsAndCategoriesSlice.actions

export default productsAndCategoriesSlice.reducer