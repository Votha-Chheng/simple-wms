import { StyleSheet, Text, View, FlatList} from 'react-native'
import React, {FC, useState, useEffect} from 'react'
import CategoryTopMenu from './CategoryTopMenu'
import { IconButton } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { findCategoryModelById, observeCategoriesList } from '../../../services/categoryServices'
import CategoryModel from '../../../models/CategoryModel'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { hideModal, showModal } from '../../../store/slices/modal'
import { resetBarcode } from '../../../store/slices/dataBarCode'
import Loader from '../../../sharedUI/Loader'
import Modal from 'react-native-modal'
import ModifyCategoryInput from './ModifyCategoryInput'

type ModifyCategoryOptionProps = {
  categories: CategoryModel[]
}

const ModifyCategoryOption: FC<ModifyCategoryOptionProps> = ({categories}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [catInput, setCatInput] =  useState<string>(null)
  const [categoryToModify, setCategoryToModify] =  useState<CategoryModel>(null)

  const { visible } = useSelector((state: RootState)=> state.modal)

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
    if(categoryToModify !== null){
      setCatInput(categoryToModify.nom)
    }
  }, [categoryToModify])

  
  return (
    <View style={{height:'100%'}}>
    {
      loading 
      ? 
      <Loader spinnerColor='blue' />
      :
      <View>
        <FlatList
          ListHeaderComponent={
            <View>
              <CategoryTopMenu/>
              <View style={styles.warning}>
                <Text style={styles.title}>Catégories modifiables</Text>
                <Text style={styles.warningText}>
                  Quand vous modifiez le nom d'une catégorie, la modification s'appliquera sur tous les produits qui sont associés à cette même catégorie.
                </Text>
              </View>
  
            </View>
          }
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem = {({item}) => (
            <View style={{marginVertical:5}}>
              <View key={item.id} style={styles.renderItem}>
                <Text style={styles.renderItemText}>{item.nom}</Text>
                <IconButton 
                  icon="lead-pencil" 
                  iconColor="grey" 
                  onPress={()=> {
                    setCategoryToModify(item)
                    dispatch(showModal())
                  }} />
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{textAlign: "center"}}>Toutes les catégories sont associées à au moins un produit.</Text>}
        />
        <Modal isVisible={visible}>
          <ModifyCategoryInput 
            categoryToModify = {categoryToModify}
            setCategoryToModify = {setCategoryToModify}
            catInput = {catInput}
            setCatInput = {setCatInput}
            setLoading = {setLoading}
            categories = {categories}
          />
        </Modal>
      </View>
    }
    </View>
  )
}

export default ModifyCategoryOption

const styles = StyleSheet.create({
  title: {
    marginVertical:7.5, 
    fontSize:20, 
    color:"black",
    fontFamily:"Inter-SemiBold",
    textAlign: "center",
    padding:10
  },
  textInput: {
    width:'80%',
    height:20
  },
  warning: {
    borderWidth:2, 
    borderColor: "#b20645",
    backgroundColor:"white",
    marginBottom:25,
    marginTop:10
  },
  warningText: {
    fontSize: 13, 
    fontFamily:"Inter-Medium", 
    padding:10,
    color:"#b20645",
  }, 
  renderItem: {
    backgroundColor:"#a4d4b4" ,
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
    color:"grey"
  }
})