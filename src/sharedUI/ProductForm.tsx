import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextInPutComponent from './TextInPutComponent'
import CategoryPicker from './CategoryPicker'
import { Button, TextInput } from 'react-native-paper'
import globalStyles from '../utils/globalStyles'
import { hideModal } from '../store/slices/modal'
import { resetBarcode } from '../store/slices/dataBarCode'
import ProductDto from '../classes/ProductDto'
import { createProduct, findProductModelById } from '../services/productServices'
import { showToast } from '../utils/showToast'
import { getSingleProduct } from '../store/slices/productsAndCategories'
import CategoryModel from '../models/CategoryModel'
import Loader from './Loader'
import { findCategoryModelByName } from '../services/categoryServices'
import ServiceResponse from '../classes/ServiceResponse'
import { displayBarcode } from '../utils/displayBarcode'

type ProductFormProps = {
  newProduct: boolean
  setProductExists?: Dispatch<SetStateAction<"undetermined"|"yes"|"no"|"unreadable">>
  productExists?: "undetermined"|"yes"|"no"|"unreadable"
  setModify?: Dispatch<SetStateAction<boolean>>
}

const ProductForm: FC<ProductFormProps> = ({newProduct, setModify, setProductExists, productExists}: ProductFormProps) => {

  const {barcode} = useSelector((state: RootState)=> state.codeBarDataType)
  const {singleProduct} = useSelector((state: RootState)=> state.productAndCategories)

  const [loading, setLoading] = useState<boolean>(false)
  const [barcodeExisting, setBarcodeExisting] = useState<string>("")
  const [barcodeManual, setBarcodeManual] = useState<string>("")
  const [marqueInput, setMarqueInput] = useState<string>("")
  const [nomInput, setNomInput] = useState<string>("")
  const [categoryInput, setCategoryInput] = useState<string>("")
  const [qtyInput, setQtyInput] = useState<string>("")
  const [stockLimite, setStockLimite] = useState<string>("")
  const [telFournisseur, setTelFournisseur] = useState<string>("")
  const [webSite, setWebSite] = useState<string>("")
  const [focused, setFocused] = useState<boolean>(false)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("Choisir catégorie")

  const dispatch = useDispatch()

  useEffect(()=> {
    if(newProduct === false){
      setBarcodeExisting(singleProduct.barcodeNumber)
      setMarqueInput(singleProduct.marque)
      setNomInput(singleProduct.nom)
      setQtyInput(singleProduct.qty.toString())
      setStockLimite(singleProduct.stockLimite.toString())
      setTelFournisseur(singleProduct.telFournisseur)
      setWebSite(singleProduct.siteFournisseur)
      setSelectedCategoryName(singleProduct.category.nom)
    }  
  }, [newProduct])
  
  const getFormBody = async (): Promise<ProductDto> => {
    const category: CategoryModel = await findCategoryModelByName(selectedCategoryName.trim())
  
    if(category){
      return {
        barcodeNumber: barcode || barcodeExisting ||`manual_${barcodeManual}`,
        marque: marqueInput,
        nom: nomInput,
        categoryId: category.id,
        qty: +qtyInput,
        stockLimite: +stockLimite,
        telFournisseur: telFournisseur,
        siteFournisseur: webSite
      }
    } else {
      showToast("error", "Erreur de formulaire", `Le formulaire semble incomplet...`)
    }
  }

  //Form validator
  const handleFormValidation = (body:ProductDto): boolean=> {
    if(!body.categoryId) return false
    if(!body.barcodeNumber || body.barcodeNumber === "" ||  body.barcodeNumber === "manual_") return false
    if(!body.nom || body.nom === "" ) return false
    if(!body.marque || body.marque === "") return false
    if(!body.qty) return false
    if(!body.stockLimite) return false

    return true
  }

  const handleCreateProduct = async(body: Promise<ProductDto>): Promise<void> =>{
    setLoading(true)
    try {
      const bodyResponse: ProductDto = await body

      if(bodyResponse){
        if(!handleFormValidation(bodyResponse)) {
          setLoading(false)
          showToast("error", "Informations manquantes", `Il manque des informations obligatoires.`)
          
        } else {
          const response: ServiceResponse = await createProduct(bodyResponse)
          
          if(response.status === "Success"){
            setProductExists("undetermined")
            dispatch(resetBarcode())
            dispatch(hideModal())
            showToast("success", `Produit créé`, `Le produit ${response.data.nom} est rentré dans l'inventaire.`)
            setLoading(false)
            dispatch(getSingleProduct(undefined))
            setBarcodeManual("")
          } else {
            showToast("error", "Erreur", `Une erreur est survenue, produit rejeté...`)
            setLoading(false)
          }
        }
      } else {
        showToast("error", "Erreur", `Il semble que des informations manquent...`)
        setLoading(false)
      }
    } catch (error) {
      showToast("error", "Erreur", `Une erreur est survenue...`)
      dispatch(getSingleProduct(undefined))
      setLoading(false)
    }
  }

  const handleUpdateProductInfos = async(id: string, body: Promise<ProductDto>): Promise<void>=> {
    setLoading(true)

    try {
      const bodyResponse: ProductDto = await body
  
      if(bodyResponse){
        if(!handleFormValidation(bodyResponse)){
          showToast("error", "Informations manquantes", `Il manque des informations obligatoires.`)
  
        } else {
          const prodModel = await findProductModelById(id)
  
          if(prodModel){
            const record = await prodModel.updateProductModelInformation(bodyResponse)
            if(record){
              dispatch(getSingleProduct(undefined))
              dispatch(resetBarcode())
              dispatch(hideModal())
              setModify(false)
              setLoading(false)
              showToast("success", `Infos du produit mis à jour`, `Le produit ${prodModel.nom} a été modifié.`)
  
              const updatedProd = await findProductModelById(prodModel.id)
  
              if(updatedProd && updatedProd.stockLimite<updatedProd.qty) {
                await updatedProd.setComandeEncours(false)
              }
              
            } else {
              setLoading(false)
              showToast("error", `Infos du produit non mises à jour`, `Le produit ${prodModel.nom} n'a pas été modifié.`)
            }
          } else {
            setLoading(false)
            showToast("error", `Mise à jour avortée`, `Le produit ${prodModel.nom} n'a été modifié.`)
          }
        }
      } else {
        setLoading(false)
        showToast("error", "Mise à jour avortée", `La mise à jour n'a pas pu se faire. Il manque peut-être des informations.`)
      } 
      
    } catch (error) {
      setLoading(false)
      showToast("error", "Mise à jour avortée", `Une erreur est survenue...`)
    }
  }



  if(loading) return <Loader spinnerColor='blue' />

  return (
    <ScrollView style={{width:"100%", backgroundColor:"#f8f4f9", padding:10}}>
      <Text style={styles.title}>{newProduct ? "Nouveau produit": "Modifier les infos produit"}</Text>
      {
        productExists === 'unreadable' &&
        <Text style={styles.warning}>
          <Text style={styles.attention}>Attention :</Text> 
          &nbsp;En cas de code-barre illisible, vous pouvez seulement rentrer un nouveau produit. <Text style={styles.attention}>Si vous voulez modifier sa quantité, modifiez-la dans l'inventaire.</Text> Dans le filtre de recherche, sélectionnez l'onglet "Code-barre illisible" pour afficher seulement les produits concernés.
        </Text>
      }
      <View style={{marginVertical:10, alignItems:"center"}}>
        {
          productExists === "unreadable"
          ?
          <View style={{width: "100%"}}>
            <TextInPutComponent
              label="Code-barre n°"
              setter={setBarcodeManual}
              stateValue={barcodeManual}
            />
          </View>
          :
          <Text style={{color:"#6e6e72"}}>Code-barre n° 
            <Text style={styles.type}>
              {displayBarcode(newProduct ? barcode: barcodeExisting)}
            </Text>
          </Text>
        }
      </View>
      {
        newProduct &&
        <Text style={{textAlign:"center", color:"#6e6e72", marginBottom:10}}>Renseignez les informations suivantes :</Text>
      }
      <SafeAreaView>
        <View style={{borderColor: "green", borderWidth:2, padding:2.5, marginBottom:10, borderRadius:10}}>
          <Text style={{color:"#6e6e72", fontSize:15, marginVertical:5, marginLeft:10}}>Informations obligatoires</Text>
          <TextInPutComponent
            label="Nom du produit"
            setter={setNomInput}
            stateValue={nomInput}
          />
          <TextInPutComponent
            setter={setMarqueInput}
            stateValue={marqueInput}
            label="Fabricant"
            autoCapitalize='characters'
          />
          <CategoryPicker
            focused={focused}
            onFocus={()=>setFocused(true)}
            onBlur={()=>setFocused(false)}
            categoryInput={categoryInput}
            setCategoryInput={setCategoryInput}
            selectedCategoryName={selectedCategoryName}
            setSelectedCategoryName={setSelectedCategoryName}
          />
          <TextInput
            mode='outlined'
            label="Quantité à rentrer"
            value={qtyInput}
            activeOutlineColor="#337171"
            outlineColor='#c4cfd4'
            onChangeText={text => setQtyInput(text)}
            onFocus={()=>setQtyInput("")}
            onBlur={()=>setQtyInput(prev => prev !== "" ? qtyInput : "1")}
            autoComplete="off"
            keyboardType="numeric"
            style={globalStyles.inpuQty}
          />

          <TextInput
            mode='outlined'
            label="Stock limite"
            value={stockLimite}
            activeOutlineColor="#a25553"
            outlineColor='#c4cfd4'
            onChangeText={text => setStockLimite(text)}
            onFocus={()=>setStockLimite("")}
            autoComplete="off"
            keyboardType="numeric"
            style={globalStyles.inpuQty}
          />
        </View>
        
        <View style={{borderColor: "#c4cfd4", borderWidth:2, padding:2.5, marginBottom:10, borderRadius:10}}>
          <Text style={{color:"#6e6e72", fontSize:15, marginVertical:5, marginLeft:10}}>Contact fournisseur (optionnels)</Text>
          <TextInput
            mode='outlined'
            label="N° de téléphone"
            value={telFournisseur}
            activeOutlineColor="#a25553"
            outlineColor='#c4cfd4'
            onChangeText={text =>{
              setTelFournisseur(text)
            }}
            autoComplete="off"
            keyboardType="numeric"
            style={globalStyles.input}
            maxLength={14}
            right={
              <TextInput.Icon 
                icon="close-circle" 
                color='red' 
                onPress={()=> {
                  setTelFournisseur("")
                }}
              />
            }
          />
          <TextInput
            mode='outlined'
            label="Site web"
            value={webSite}
            onChangeText={text => setWebSite(text)}
            onBlur = {()=> setWebSite(webSite.toLowerCase())}
            autoComplete="off"
            activeOutlineColor="#54b3f2"
            outlineColor='#54b3f2'
            style={globalStyles.input}
            left={<TextInput.Affix text="https://" />}
            right={<TextInput.Icon icon="close-circle" color='red' onPress={()=> setWebSite("")}/>}
            autoCapitalize="none"
          />
        </View> 

        <View style={globalStyles.flexRowButtons}>
          <Button
            mode='contained'
            buttonColor='red'
            icon='close'
            style={{marginHorizontal:5}}
            onPress={() => {
              setModify ? setModify(false) : null
              newProduct ? setProductExists('undetermined') : null
              dispatch(resetBarcode())
              dispatch(getSingleProduct(undefined))
            }}
          >
            Annuler
          </Button>

          <Button
            mode='contained'
            icon='check-bold'
            buttonColor='green'
            style={{marginHorizontal:5}}
            onPress={() => newProduct ?  handleCreateProduct(getFormBody()) : handleUpdateProductInfos(singleProduct.id, getFormBody())}
          >
            Valider les infos
          </Button>
        </View>
      </SafeAreaView>
    </ScrollView>
    
    )
}

export default ProductForm

const styles = StyleSheet.create({
  title : {
    fontSize : 20,
    textAlign : 'center',
    fontFamily : "Roboto_900Black",
    textTransform:'uppercase',
    marginBottom:10,
    color: "#6e6e72"
  },
  warning: {
    color: "red",
    fontSize: 16,
    padding: 5
  },
  attention: {
    fontFamily: "Roboto-Bold",
    textDecorationColor: "red",
    textDecorationLine: "underline" 
  },
  type : {
    fontFamily: "Roboto-Black"
  },
  categoryTags: {
    marginHorizontal: 5,
    paddingVertical:2.5,
    paddingHorizontal:5,
    borderRadius:5
  }
})