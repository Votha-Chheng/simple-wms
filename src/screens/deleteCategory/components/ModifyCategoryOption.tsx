import { StyleSheet, Text, View, FlatList} from 'react-native'
import React, {FC, useState, useEffect} from 'react'
import CategoryTopMenu from './CategoryTopMenu'
import { IconButton, TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { findCategoryModelById, getCategoryModelCollection, observeCategoriesList } from '../../../services/categoryServices'
import CategoryModel from '../../../models/CategoryModel'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { showToast } from '../../../utils/showToast'
import ModalView from '../../../sharedUI/ModalView'
import { hideModal, showModal } from '../../../store/slices/modal'
import TextInPutComponent from '../../../sharedUI/TextInPutComponent'
import { resetBarcode } from '../../../store/slices/dataBarCode'
import Loader from '../../../sharedUI/Loader'

const ModifyCategoryOption: FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<CategoryModel[]>([])
  const [catInput, setCatInput] =  useState<string>(null)
  const [categoryToModify, setCategoryToModify] =  useState<CategoryModel>(null)

  const { visible } = useSelector((state: RootState)=> state.modal)

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
    observeCategoriesList(setCategories)
  }, [db, observeCategoriesList])

  useEffect(() => {
    if(categoryToModify !== null){
      setCatInput(categoryToModify.nom)
    }
  }, [categoryToModify])


  const changeCategoryName = async(id: string, nameCat: string): Promise<void>=>{
    setLoading(true)
    const temp = categories.find((cat: CategoryModel)=> cat.nom === nameCat.toUpperCase().trim())

    if(temp){
      showToast("error", 'Cette catégorie existe déjà !', `Une catégorie porte déja ce nom : ${nameCat.toUpperCase().trim()}`)
      setLoading(false)

    } else {
      const category = await findCategoryModelById(id)
  
      if(category){
        const response = await category.updateCategoryName(nameCat)
        if(response === true) {
          setLoading(false)
          dispatch(hideModal())
          setCategoryToModify(null)
          setCatInput("")
          showToast("success", 'Catégorie changée', "La catégorie a change de nom !")
        } else {
          setLoading(false)
          showToast("error", 'Erreur', "Un problème est survenu.")
        }
      } else {
        setLoading(false)
        showToast("error", 'Erreur', "Un problème est survenu.")
      }

    }
  }
  
  return (
    <View style={{height:'100%'}}>
    {
      loading 
      ? 
      <Loader spinnerColor='blue' />
      :
      visible && categoryToModify
      ?
      <ModalView>
        <View key={categoryToModify.id} style={{flexDirection:"row", alignItems: 'center', marginVertical:10}}>
          <TextInPutComponent
            setter={setCatInput}
            stateValue={catInput}
            label="Changer le nom de la catégorie"
            autoCapitalize='characters'
            width='80%'
          />
          <IconButton 
            size={30} 
            icon="close-box-outline" 
            iconColor="red" 
            onPress={()=> {
              setCategoryToModify(null)
              dispatch(hideModal())
            }} 
            style={{marginRight:-15, marginLeft:0}} 
          />
          <IconButton size={30} icon="checkbox-marked-outline" iconColor="green" onPress={()=> changeCategoryName(categoryToModify.id, catInput) } />
        </View>
      </ModalView>
      :
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
    padding: 10
  }
})