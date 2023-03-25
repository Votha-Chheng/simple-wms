import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { IconButton } from 'react-native-paper'
import CategoryTopMenu from './CategoryTopMenu'
import { showToast } from '../../../utils/showToast'
import { observeProductsList } from '../../../services/productServices'
import { findCategoryModelById } from '../../../services/categoryServices'
import ProductModel from '../../../models/ProductModel'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import CategoryModel from '../../../models/CategoryModel'
import { useDispatch } from 'react-redux'
import { resetBarcode } from '../../../store/slices/dataBarCode'
import { hideModal } from '../../../store/slices/modal'

type DeleteCategoryOptionProps = {
  categories : CategoryModel[]
}

const DeleteCategoryOption: FC<DeleteCategoryOptionProps> = ({categories}) => {
  const [productsCollection, setProductsCollection] = useState<ProductModel[]>([])

  const db = useDatabase()

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(resetBarcode())
    dispatch(hideModal())

    return(()=> {
      dispatch(resetBarcode())
      dispatch(hideModal())
    })
  }, [])

  useEffect(() => {
    observeProductsList(setProductsCollection)
  }, [db, observeProductsList])
  
  const displayCategoriesToDelete = (): CategoryModel[]=>{
    const catWithProd: string[] = productsCollection.map(product => product.categoryId)

    return categories.filter(cat => !catWithProd.includes(cat.id))
  }

  const handleDeleteCategory = async(id: string): Promise<void>=>{
    const catModel = await findCategoryModelById(id)
    
    const response = await catModel.deleteSingleCategoryModel()

    if(response){
      showToast("success", 'Catégorie supprimée', "La catégorie a été supprimée.")
    } else {
      showToast("error", 'Erreur', "Une erreur est survenue !")
    }
  }

  return (
    <FlatList
        ListHeaderComponent={
          <View>
            <CategoryTopMenu/>
            <View style={styles.warning}>
              <Text style={styles.title}>Catégories supprimables</Text>
              <Text style={styles.warningText}>
                Pour qu'une catégorie puisse être supprimée, il ne faut pas qu'elle soit déjà associée à un produit. Si c'est le cas, allez dans l'inventaire pour modifier la catégorie du produit associé.
              </Text>
            </View>

          </View>
        }
        data={displayCategoriesToDelete()}
        keyExtractor={(item) => item.id.toString()}
        renderItem = {({item}) => (
          <View style={styles.renderItem}>
            <Text style={styles.renderItemText}>{item.nom}</Text>
            <IconButton icon="delete" iconColor="grey" onPress={()=> handleDeleteCategory(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign: "center"}}>Toutes les catégories sont associées à au moins un produit.</Text>}
      />
  )
}

export default DeleteCategoryOption

const styles = StyleSheet.create({
  title: {
    marginVertical:7.5, 
    color:"black",
    fontSize:20, 
    fontFamily:"Inter-SemiBold",
    textAlign: "center",
    padding:10
  },
  warning: {
    borderWidth:2, 
    borderColor: "#b20645",
    backgroundColor:"white",
    marginBottom:25,
    marginTop:10
  },
  warningText: {
    fontSize: 14, 
    fontFamily:"Inter-Medium", 
    padding:10,
    color:"#b20645",
    lineHeight:20
  }, 
  renderItem: {
    backgroundColor:"#ffad5c" ,
    borderRadius: 5,
    borderColor: "grey",
    borderWidth:2,
    marginVertical:7.5,
    flexDirection:"row",
    alignItems:"flex-start",
    justifyContent: "space-between"
  },
  renderItemText: {
    padding: 10,
    color: "grey"
  }
})