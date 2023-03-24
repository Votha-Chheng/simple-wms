import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetBarcode } from '../../store/slices/dataBarCode'
import { hideModal, showModal } from '../../store/slices/modal'
import Product from '../../classes/Product'
import { RootState } from '../../store/store'
import { displayProductByFilters } from '../../utils/displayProductByFilters'
import { findProductModelById, observeProductsList, setProductsFromCollection } from '../../services/productServices'
import { getSingleProduct } from '../../store/slices/productsAndCategories'
import { showToast } from '../../utils/showToast'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import FilterProducts from './components/FilterProducts'
import InventaireListRender from './components/InventaireListRender'
import Modal from 'react-native-modal'
import DisplayProductInfos from './components/DisplayProductInfos'
import ProductModel from '../../models/ProductModel'
import Loader from '../../sharedUI/Loader'
import ProductForm from '../../sharedUI/ProductForm'
import { observeCategoriesList } from '../../services/categoryServices'
import CategoryModel from '../../models/CategoryModel'
import { selectMarqueOrCategory } from '../../store/slices/selectedMarqueOrCategory'

const ListeProduitsScreen: FC = () => {
  const [modify, setModify] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [productsCollection, setProductsCollection] = useState<ProductModel[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<CategoryModel[]>([])

  const { parType, alphabetique, ordreAlphabet, dateEntree, recent, alertStock, searchByText, searchInput } = useSelector((state: RootState) => state.filters)
  const filters = { parType, alphabetique, ordreAlphabet, dateEntree, recent, alertStock, searchByText, searchInput }

  const { visible } = useSelector((state: RootState) => state.modal)

  const {selectedMarqueOrCategory} = useSelector((state: RootState)=> state.selectedMarqueOrCategory)

  const db = useDatabase()
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(resetBarcode())
    dispatch(hideModal())
    dispatch(selectMarqueOrCategory(null))
    
    return(()=> {
      dispatch(resetBarcode())
      dispatch(hideModal())
      dispatch(selectMarqueOrCategory(null))
    })
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

  const onPressItem = async(id: string): Promise<void>=>{
    try {
      setLoading(true)
      const prodModel: ProductModel = await findProductModelById(id)

      if(prodModel){
        const prod: Product = await prodModel.instantiateProductModel()

        if(prod){
          dispatch(getSingleProduct(prod))
          setModify(false)
          setLoading(false)
          dispatch(showModal())
        }
      }      
    } catch (error) {
      showToast("error", "Une erreur est survenue", error.toString())
      setLoading(false)
    }
  }

  return (
    <View style={styles.screenContainer}>
    {
      loading 
      ?
      <Loader spinnerColor='blue'/>
      :
      modify
      ?
      <ProductForm newProduct={false} setModify={setModify}/>
      :
      <View>  
        <Modal isVisible={visible}>
          <DisplayProductInfos setModify={setModify} loading={loading}/>
        </Modal>

        <FlatList
          ListHeaderComponent={
            <FilterProducts products={products} />
          }
          data={displayProductByFilters(productsCollection, filters, selectedMarqueOrCategory, categories)}
          keyExtractor={(item: Product)=> item.id.toString()}
          renderItem = {({item}) => (
            <InventaireListRender
              data={item}
              onPressFunction={()=>onPressItem(item.id.toString())}
            />
          )}
          ListEmptyComponent={<Text style={{textAlign:"center", fontSize:20}}>Aucun produit dans l'inventaire.</Text>}
        />
      </View>
    }
    </View>
  )
}

export default ListeProduitsScreen

const styles = StyleSheet.create({
  screenContainer: {
    marginHorizontal:5
  }
})