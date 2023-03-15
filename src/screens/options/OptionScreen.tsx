import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { FC, useEffect } from "react"
import { useDispatch } from "react-redux"
import { resetBarcode } from "../../store/slices/dataBarCode"
import { hideModal } from "../../store/slices/modal"
import DeleteCategoryScreen from "../deleteCategory/DeleteCategoryScreen"
import DeleteProductScreen from "../deleteProduct/DeleteProductScreen"
import HomeScreen from "../homeOptions/HomeOptionScreen"

const Stack = createNativeStackNavigator()

export type OptionStackParams = {
  DeleteProduct : undefined
  "Gestion des catégories": undefined
  "Supprimer des produits": undefined
};

const OptionScreen: FC = () => {

  const dispatch = useDispatch()


  useEffect(()=>{
    dispatch(hideModal())

    return()=>{
      dispatch(resetBarcode())

    }
  }, [])


  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeOptions" component={HomeScreen} options={{headerShown: false}} />
      <Stack.Screen name="Supprimer des produits" children={()=><DeleteProductScreen /> } />
      <Stack.Screen name="Gestion des catégories" children={()=><DeleteCategoryScreen />} />
    </Stack.Navigator>
  )
}

export default OptionScreen