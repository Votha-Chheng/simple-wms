import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { Chip } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { setAlertStock, setAlphabetique, setDateEntree, setOrdreAlphabet, setParType, setRecent, setUnreadableBarcode } from '../../../store/slices/filters'
import SearchResult from './SearchResult'
import ResultWithText from './ResultWithText'
import { selectMarqueOrCategory } from '../../../store/slices/selectedMarqueOrCategory'
import ProductModel from '../../../models/ProductModel'
import Product from '../../../classes/Product'

type FilterProductsProps = {
  products: Product[]
}

const FilterProducts: FC<FilterProductsProps> = ({products}) => {

  const { parType, alphabetique, ordreAlphabet, dateEntree, recent, alertStock, searchByText, unreadableBarcode } = useSelector((state: RootState) => state.filters)

  const {selectedMarqueOrCategory} = useSelector((state: RootState)=> state.selectedMarqueOrCategory)

  const dispatch = useDispatch()

  const getAllMarqueOrCategories = (productList: Product[], keyName: "marque"|"category"): string[] =>{
    let list = [] 

    if(keyName === "marque"){
      productList.forEach((prod: ProductModel) =>{
        list =  [ ...list, prod[keyName]]
      })
    }
    
    if(keyName === "category"){
      productList.forEach((prod: ProductModel) =>{
        list =  [ ...list, prod[keyName]["nom"]]
      })
    }
    return Array.from((new Set(list))).sort()
  } 

  const filteredResultForMarqueCategory = (liste: string[], recherche: string): string []=>{
    if(recherche.length>2){
      const result = liste.filter((nom: string) => {
        nom.includes(recherche)
      })
      return result

    } else {
      return liste
    }
  }

  return (
    <View style={styles.filterContainer}>
      <Text style={{textAlign:"center", fontFamily:"Inter-SemiBold", fontSize:15, color:"#6e6e72", marginVertical:10}}>Afficher par :</Text>
      <View style={styles.filters}>
        <Chip 
          style={styles.chipStyle}
          mode={ (parType === "") ? 'flat': "outlined"}
          icon="cancel" 
          onPress={() => {
            dispatch(setParType(""))
            dispatch(selectMarqueOrCategory(null))
            dispatch(setDateEntree(true))
            dispatch(setRecent(true))
          }}
          >
          Sans
        </Chip>
        <Chip 
          style={styles.chipStyle}
          mode={(parType === "marque") ? "flat":"outlined"} 
          icon="watermark" 
          onPress={() => {
            dispatch(setParType("marque"))
            dispatch(setOrdreAlphabet(true))
            dispatch(setAlphabetique(true))
            dispatch(selectMarqueOrCategory(null))
            dispatch(setDateEntree(false))
          }}
          >
          Marque
        </Chip>
        <Chip 
          style={styles.chipStyle}
          mode={(parType === "category") ? "flat":"outlined"}
          selected={(parType === "category")} 
          icon="shape" 
          onPress={() => {
            dispatch(setParType("category"))
            dispatch(setOrdreAlphabet(true))
            dispatch(selectMarqueOrCategory(null))
            dispatch(setDateEntree(false))
          }}
          >
          Catégorie
        </Chip>
        <Chip 
          style={styles.chipStyle}
          mode={alertStock ? "flat":"outlined"}
          selected={alertStock} 
          icon="alert-outline" 
          onPress={() => {
            dispatch(setAlertStock(!alertStock))
          }}
        >
          Critique
        </Chip>
        <Chip 
          style={styles.chipStyle}
          mode={unreadableBarcode ? "flat":"outlined"}
          selected={unreadableBarcode} 
          icon="barcode-off" 
          onPress={() => {
            dispatch(setUnreadableBarcode(!unreadableBarcode))
          }}
        >
          Code-barre illisible
        </Chip>
      </View>
      <View style={{marginVertical:10, height:50}}>
      {
        parType === "" ?
        <SearchResult/> :
        <ResultWithText 
          listProduct={
            filteredResultForMarqueCategory((
                parType === "marque" ? 
                getAllMarqueOrCategories(products, "marque") : 
                getAllMarqueOrCategories(products, "category")
              ), searchByText 
            )
          }
        />
      }
      </View>
      <Text style={{textAlign:"center", fontFamily:"Inter-SemiBold", fontSize:15, color:"#6e6e72"}}>Trier selon :</Text>
      <View style={styles.filters}>
        <Chip 
          mode={(dateEntree && recent)  ? "flat":"outlined"}
          icon="sort-calendar-ascending"
          disabled={
            ((parType === "marque") && (selectedMarqueOrCategory === null)) 
            ||
            ((parType === "category") && (selectedMarqueOrCategory === null))
          }
          onPress={() => {
            dispatch(setRecent(true))
            dispatch(setDateEntree(true))
            dispatch(setAlphabetique(false))
            dispatch(setOrdreAlphabet(null))
          }}
        >
          Récents
        </Chip>
        <Chip 
          mode={
            (dateEntree === true && recent == false) && 
            (
              (parType === ""  && selectedMarqueOrCategory === null) || 
              (parType === "" && alertStock === true && selectedMarqueOrCategory === null) ||
              (parType !== "" && selectedMarqueOrCategory !== null)
            )
            ? "flat"
            :"outlined"
          }
          icon="sort-calendar-descending" 
          disabled={
            ((parType === "marque") && (selectedMarqueOrCategory === null)) ||
            ((parType === "category") && (selectedMarqueOrCategory === null))
          }
          onPress={() => {
            dispatch(setRecent(false))
            dispatch(setDateEntree(true))
            dispatch(setAlphabetique(false))
            dispatch(setOrdreAlphabet(null))
          }}
        >
          Anciens
        </Chip>
        <Chip 
          mode={
            alphabetique === true && 
            ordreAlphabet === true && 
            parType !== "" && 
            selectedMarqueOrCategory === null
            ? "flat"
            :"outlined"
          }
          disabled={
            parType === "" || 
            selectedMarqueOrCategory !== null
          }
          icon="sort-alphabetical-ascending" 
          onPress={() => {
            dispatch(setRecent(null))
            dispatch(setDateEntree(false))
            dispatch(setAlphabetique(true))
            dispatch(setOrdreAlphabet(true))
          }}
        >
          A à Z
        </Chip>
        <Chip 
          mode={
            alphabetique === true && 
            ordreAlphabet === false && 
            parType !== "" &&  
            selectedMarqueOrCategory === null
            ? "flat"
            :"outlined"
          }
          disabled={
            parType === "" || 
            selectedMarqueOrCategory !== null
          }
          icon="sort-alphabetical-descending" 
          onPress={() => {
            dispatch(setRecent(null))
            dispatch(setDateEntree(false))
            dispatch(setAlphabetique(true))
            dispatch(setOrdreAlphabet(false))
          }}
        >
          Z à A
        </Chip>
      </View>
    </View>
  )
}

export default FilterProducts

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical:5,
    marginBottom:15
  },
  filters: {
    flexWrap: "wrap",
    flexDirection: 'row',
    justifyContent: "center",
    marginBottom:5
  },
  chipSelected: {
    backgroundColor: "yellow",
  },
  chipUnchecked: {
    backgroundColor: "grey",
  },
  chipStyle: {
    marginHorizontal:2.5,
    marginVertical: 3
  }
})