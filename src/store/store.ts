import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import modalReducer from "./slices/modal"
import codeBarDataTypeReducer from "./slices/dataBarCode"
import errorMessageReducer from './slices/errorMessage'
import filtersReducer from './slices/filters'
import selectedMarqueOrCategoryReducer from './slices/selectedMarqueOrCategory'
import categoryTopMenuReducer from './slices/categoryMenus'
import productsAndCategoriesReducer from './slices/productsAndCategories'


const store = configureStore({
  reducer: {
    modal: modalReducer,
    codeBarDataType : codeBarDataTypeReducer,
    errorMessage : errorMessageReducer,
    filters : filtersReducer,
    selectedMarqueOrCategory : selectedMarqueOrCategoryReducer,
    categoryTopMenu : categoryTopMenuReducer,
    productAndCategories : productsAndCategoriesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = ()=> useDispatch<AppDispatch>()

export default store