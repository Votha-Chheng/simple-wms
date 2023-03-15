import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { RootState } from '../../store/store'
import { getSingleProduct } from '../../store/slices/productsAndCategories'
import { deleteAllTablesAsync, deleteProductsWithoutCascadeAsync, observeProductsList, setProductsFromCollection } from '../../services/productServices'
import { showToast } from '../../utils/showToast'
import FilterProducts from '../listeProduits/components/FilterProducts'
import { Button } from 'react-native-paper'
import { createAlertWithTwoButtons } from '../../utils/buttonAlert'
import { displayProductByFilters } from '../../utils/displayProductByFilters'
import Product from '../../classes/Product'
import ItemProductToDelete from './components/ItemProductToDelete'
import { observeCategoriesList } from '../../services/categoryServices'
import CategoryModel from '../../models/CategoryModel'
import ProductModel from '../../models/ProductModel'
import Loader from '../../sharedUI/Loader'

const DeleteProductScreen: FC = () => {
  const {selectedMarqueOrCategory} = useSelector((state: RootState)=> state.selectedMarqueOrCategory)
  const filters = useSelector((state: RootState)=> state.filters)

  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<CategoryModel[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productsCollection, setProductsCollection] = useState<ProductModel[]>([])

  const dispatch = useDispatch()
  const db = useDatabase()

  useEffect(() => {
    dispatch(getSingleProduct(null))

    return () => {
      dispatch(getSingleProduct(null))
    }
  }, [])

  
  useEffect(() => {
    observeProductsList(setProductsCollection)
  }, [db, observeProductsList])

  useEffect(() => {
    observeCategoriesList(setCategories)
  }, [db, observeCategoriesList])

  useEffect(()=> {
    setProductsFromCollection(setLoading, setProducts)
  }, [productsCollection])
  

  const deleteAllObjects = async()=>{
    const result = await deleteAllTablesAsync()
    if(result.status === "Rejected") {
      showToast("error", 'Erreur', "Un problème est survenu.")
    }
    if(result.status === "Success") {
      showToast("success", 'Inventaire vide !', "Il n'y a plus rien dans l'inventaire.")
    }
  }


  if(loading) return <Loader spinnerColor='red' />

  return (
    <View>
      <FlatList
        ListHeaderComponent={
          <FilterProducts products={products}/>
        }
        ListFooterComponent={
          products.length>1 &&
          <Button 
            buttonColor="red" 
            mode='contained' 
            style={{marginBottom:15, width:'90%', alignSelf:"center"}} 
            onPress={()=>createAlertWithTwoButtons("Attention !", "Vous êtes sur le point de supprimer tous les produit de l'inventaire !", deleteAllObjects, null)}>
            Supprimer tous les produits
          </Button>
        }
        data={displayProductByFilters(productsCollection, filters, selectedMarqueOrCategory, categories)}
        keyExtractor={(item: Product) => item.id.toString()}
        renderItem = {({item}) => (
          <ItemProductToDelete
            data={item}
            onPressFunction={()=> {
              createAlertWithTwoButtons(`Vous êtes sur le point de supprimer le produit : ${item.nom}`, "Confirmer pour supprimer définitivement le produit.", deleteProductsWithoutCascadeAsync, [item.id])
            }}
          />
        )}
        ListEmptyComponent={<Text style={{textAlign:"center", marginBottom:20}} >Aucun produit trouvé</Text>
      }  
      />
    </View>
  )
}

export default DeleteProductScreen

const styles = StyleSheet.create({})