import { StyleSheet, View } from 'react-native'
import React, { FC, Dispatch, SetStateAction } from 'react'
import TextInPutComponent from '../../../sharedUI/TextInPutComponent'
import { IconButton } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { hideModal } from '../../../store/slices/modal'
import { showToast } from '../../../utils/showToast'
import { findCategoryModelById } from '../../../services/categoryServices'
import CategoryModel from '../../../models/CategoryModel'

type ModifyCategoryInputProps = {
  categoryToModify: CategoryModel
  setCategoryToModify: Dispatch<SetStateAction<CategoryModel>>
  catInput: string
  setCatInput: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
  categories: CategoryModel[]
}

const ModifyCategoryInput: FC<ModifyCategoryInputProps> = ({ categoryToModify, setCategoryToModify, catInput, setCatInput, setLoading, categories}) => {

  const dispatch = useDispatch()

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
    <View style={{flexDirection:"row", alignItems: 'center', paddingHorizontal:10, paddingVertical:15, backgroundColor:"white", borderRadius:10}}>
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
  )
}

export default ModifyCategoryInput

const styles = StyleSheet.create({})