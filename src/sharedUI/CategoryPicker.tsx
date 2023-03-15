import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useState, useRef, useEffect, SetStateAction, Dispatch } from 'react'
import { Picker } from '@react-native-picker/picker'
import { ActivityIndicator, Button, TextInput } from 'react-native-paper'
import globalStyles from '../utils/globalStyles'
import { createCategory, observeCategoriesList } from '../services/categoryServices'
import { showToast } from '../utils/showToast'
import Category from '../classes/Category'
import { database } from '../db'
import CategoryModel from '../models/CategoryModel'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategories } from '../store/slices/productsAndCategories'


interface CategoryPickerProps {
  onFocus: Function
  onBlur: Function
  focused: boolean
  categoryInput: string
  setCategoryInput: Function
  selectedCategoryName : string 
  setSelectedCategoryName : Dispatch<SetStateAction<string>>
}
const CategoryPicker: FC<CategoryPickerProps> = ({ onFocus, onBlur,focused, categoryInput, setCategoryInput, selectedCategoryName, setSelectedCategoryName }) => {

  const [loading, setLoading] = useState<boolean>(false)
  const [categoriesList, setCategoriesList] = useState<CategoryModel[]>([])

  const categoryInputRef = useRef(null)

  const db = useDatabase()

  useEffect(()=> {
    observeCategoriesList(setCategoriesList)
  }, [db])

  // const fetchAllCategories = async(): Promise<void> => {
  //   const categoriesDb = await getCategoriesCollection()

  //   if(categoriesDb.length>0){
  //     const collection = instantiateCategoriesCollection(categoriesDb)
  //     dispatch(getAllCategories(collection))
  //   } else {
  //     showToast("error", "Pas de catégorie", "La base de données semble inaccessible.")
  //   }
  // }

  // useEffect(()=> {
  //   fetchAllCategories()

  // }, [getCategoriesCollection])

  useEffect(()=>{
    if(selectedCategoryName === "Nouvelle catégorie") {
      setCategoryInput("")

      if(categoryInputRef !== null){
        categoryInputRef.current.forceFocus()
      }
    }
  }, [selectedCategoryName])

  const onValuePickerChange = (value: string) : void=>{
    setLoading(true)
    setSelectedCategoryName(value)
    setLoading(false)
  }

  const validateNewCategory = async (newCategoryName: string): Promise<void>=>{
    setLoading(true)
    const exists = await database.get<CategoryModel>("categories").query(Q.where("nom", newCategoryName))

    if(exists.length>0){
      setLoading(false)
      showToast("error", "Nom existant", `La catégorie existe déjà !`)

    } else {
      const result = await createCategory(newCategoryName.trim().toUpperCase())
  
      if(result.status === 'Success'){
        setSelectedCategoryName(result.data.nom)

        setLoading(false)
        showToast("success", "Nouvelle catégorie", `La catégorie ${result.data.nom} a été créee.`)
      }
  
      if(result.status === 'Rejected'){
        setLoading(false)
        showToast("error", "Erreur", `Une erreur est survenue.`)    
      }
    }
  }

  if(loading) return <ActivityIndicator animating={true}/>

  return (
    <View style={{borderColor: "#c4cfd4", borderWidth:2, padding:2.5, marginBottom:10}}>
      <Text style={{color:"#6e6e72", fontSize:15, marginVertical:5, marginLeft:10}}>Catégorie du produit</Text>
      {
        selectedCategoryName !== "Nouvelle catégorie" &&
        <Picker 
          mode='dialog' 
          onValueChange={(value: string)=>onValuePickerChange(value)}
          selectedValue={selectedCategoryName}
          itemStyle={{fontSize:20, padding:0, margin:0}}
          style={{backgroundColor: "#e0e0e1"}}
          placeholder="Choisir une catégorie..."
          onFocus={()=>onFocus()}
          onBlur={()=>onBlur()}
        >
          <Picker.Item label="Choisir catégorie..." enabled={!focused ? true : false} value="Choisir catégorie" color='#66666e'/>  
          <Picker.Item label="Nouvelle catégorie" value="Nouvelle catégorie" color='#292f36'/>
          {
            categoriesList && categoriesList.map((cat: Category, index: number) => {
              return (
                <Picker.Item key={index.toString()} label={cat.nom} value={cat.nom} color='#292f36' />
              )
            })
          }
        </Picker>
      }
      {
        selectedCategoryName === "Nouvelle catégorie" &&
        <View>
          <TextInput
            mode='outlined'
            label="Entrer une nouvelle catégorie"
            value={categoryInput}
            outlineColor="#621b00"
            activeOutlineColor="#a32e00"
            onChangeText={text => setCategoryInput(text.toUpperCase())}
            autoComplete="off"
            style={globalStyles.input}
            autoCapitalize="characters"
            ref={categoryInputRef}
          />
          <View style={{flexDirection:"row", width:"100%", paddingRight:3.5 }}>
            <Button
              mode='contained' 
              buttonColor="#698d68" 
              labelStyle={{fontSize:12}} 
              style={{width:"60%", marginRight:2.5, marginBottom:5 }}
              onPress={()=>validateNewCategory( categoryInput)}
            >
              Ajouter catégorie
            </Button>
            <Button 
              mode='contained' 
              buttonColor="#b64e3e" 
              labelStyle={{fontSize:12}} 
              style={{width:"40%", marginBottom:5}} 
              onPress={()=>setSelectedCategoryName((prev: string)=> prev === "Nouvelle catégorie" ? "Choisir catégorie": prev)}
            >
              Annuler
            </Button>
          </View>
        </View>        
      }  
    </View>
  )
}

export default CategoryPicker

const styles = StyleSheet.create({})