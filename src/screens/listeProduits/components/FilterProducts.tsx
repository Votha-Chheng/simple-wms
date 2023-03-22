import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { Chip } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { resetFilters, setAlertStock, setAlphabetique, setDateEntree, setOrdreAlphabet, setParType, setRecent } from '../../../store/slices/filters'
import SearchResult from './SearchResult'
import ResultWithText from './ResultWithText'
import { selectMarqueOrCategory } from '../../../store/slices/selectedMarqueOrCategory'
import ProductModel from '../../../models/ProductModel'
import Product from '../../../classes/Product'

type FilterProductsProps = {
  products: Product[]
}

const FilterProducts: FC<FilterProductsProps> = ({products}) => {

  const { parType, alphabetique, ordreAlphabet, dateEntree, recent, alertStock, searchByText } = useSelector((state: RootState) => state.filters)

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
          mode={ (parType === "" && alertStock === false) ? 'flat': "outlined"}
          icon="cancel" 
          onPress={() => dispatch(resetFilters())}
          >
          Sans
        </Chip>
        <Chip 
          style={styles.chipStyle}
          mode={(parType === "marque" && alertStock === false) ? "flat":"outlined"} 
          icon="watermark" 
          onPress={() => {
            dispatch(setParType("marque"))
            dispatch(setOrdreAlphabet(true))
            dispatch(setAlphabetique(true))
            dispatch(setAlertStock(false))
            dispatch(selectMarqueOrCategory(null))
          }}
          >
          Marque
        </Chip>
        <Chip 
          style={styles.chipStyle}
          mode={(parType === "category" && alertStock === false) ? "flat":"outlined"}
          selected={(parType === "category" && alertStock === false)} 
          icon="shape" 
          onPress={() => {
            dispatch(setParType("category"))
            dispatch(setOrdreAlphabet(true))
            dispatch(setAlertStock(false))
            dispatch(selectMarqueOrCategory(null))
          }}
          >
          Catégorie
        </Chip>
        <Chip 
          style={styles.chipStyle}
          mode={alertStock === true ? "flat":"outlined"}
          selected={alertStock === true} 
          icon="alert-outline" 
          onPress={() => {
            dispatch(setParType(""))
            dispatch(setRecent(true))
            dispatch(setAlertStock(!alertStock))
          }}
        >
          Critique
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
          mode={
            (dateEntree === true && recent == true) && 
            (
              (parType === ""  && selectedMarqueOrCategory === null && alertStock === false) || 
              (parType === "" && alertStock === true && selectedMarqueOrCategory === null) ||
              (parType !== "" && selectedMarqueOrCategory !== null)
            )
            
            ? "flat"
            :"outlined"
          }
          icon="sort-calendar-ascending"
          disabled={
            ((parType === "marque") && (selectedMarqueOrCategory === null)) ||
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
              (parType === ""  && selectedMarqueOrCategory === null && alertStock === false) || 
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
            alertStock === false && 
            selectedMarqueOrCategory === null
            ? "flat"
            :"outlined"
          }
          disabled={
            parType === "" || 
            alertStock === true ||
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
            alertStock === false &&
            selectedMarqueOrCategory === null
            ? "flat"
            :"outlined"
          }
          disabled={
            parType === "" || 
            alertStock === true ||
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