import { Linking, StyleSheet, Text, View } from 'react-native'
import React, { FC, Dispatch, SetStateAction } from 'react'
import { ActivityIndicator, Button, IconButton, Switch } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { hideModal } from '../../../store/slices/modal'
import { getSingleProduct } from '../../../store/slices/productsAndCategories'
import { RootState } from '../../../store/store'
import { showToast } from '../../../utils/showToast'
import globalStyles from '../../../utils/globalStyles'
import { insertSpacesInTel } from '../../../utils/insertSpacesInTel'
import { findProductModelById } from '../../../services/productServices'
import ProductModel from '../../../models/ProductModel'

type DisplayProductInfosProps = {
  setModify: Dispatch<SetStateAction<boolean>>
  loading: boolean
}

const DisplayProductInfos: FC<DisplayProductInfosProps> = ({setModify, loading}: DisplayProductInfosProps) => {
  const { singleProduct } = useSelector((state: RootState)=> state.productAndCategories)

  const dispatch = useDispatch()

  const goBackButton = ()=>{
    dispatch(hideModal())
    dispatch(getSingleProduct(undefined))
  }

  const changeCommandeEnCours = async(id: string)=>{
    try {
      const record: ProductModel = await findProductModelById(id)

      if(record){
        await record.toggleComandeEncours()
        const productUpdated = await record.instantiateProductModel()
        if(productUpdated){
          dispatch(getSingleProduct(productUpdated))
        } else {
          showToast("error", "Echec", "Veuillez recommencer l'opération.")
        }
      } else {
        showToast("error", "Echec", "Veuillez recommencer l'opération.")
      }
    } catch (error) {
      showToast("error", "Echec", "Veuillez recommencer l'opération.")

    }  
  }

  return (
    <View style={globalStyles.modalStyle}>
      {
        singleProduct !==undefined &&
        <View>
          <Text style={[globalStyles.screenTitle, {marginBottom:20}]}>
            Code barre n° {singleProduct.barcodeNumber}
          </Text>
          <Text style={styles.textMarginRight}>
            Nom : 
            <Text style={styles.value}> {singleProduct.nom}</Text>
          </Text>
          <Text style={[styles.textMarginRight]}>
            Catégorie : 
            <Text style={styles.value}> {singleProduct.category.nom}</Text>
          </Text>
          <Text style={[styles.textMarginRight]}>
            Fabricant : 
            <Text style={styles.marque}> {singleProduct.marque}</Text>  
          </Text>
          {
            singleProduct.telFournisseur !== null && singleProduct.telFournisseur !== "" &&
            <View>
              <Text style={[styles.textMarginRight, {alignItems:"flex-end", marginBottom:-5}]} >
                Téléphone du fournisseur : 
              </Text> 
              <View style={{flexDirection:"row", alignItems:'center', marginLeft:25}}>
                <IconButton style={{padding:0}} size={18} icon="phone" iconColor='green' onPress={()=>Linking.openURL(`tel:${singleProduct.telFournisseur}`)}/>
                <Text style={[styles.value]}> {insertSpacesInTel(singleProduct.telFournisseur)}</Text>   
              </View>   
            </View>
          }
          {
            singleProduct.siteFournisseur !== null && singleProduct.siteFournisseur !== ""
            && 
            <View>
              <Text style={[styles.textMarginRight]}>Site web du fournisseur :</Text>   
              <Text style={[styles.value, {marginLeft:30, marginTop:5}]} onPress={()=> Linking.openURL("https://"+singleProduct.siteFournisseur)}> https://{singleProduct.siteFournisseur}</Text>
            </View>

          }
          {
            singleProduct.qty <= singleProduct.stockLimite 
            &&
            <View style={[styles.row, {alignItems:"center", marginVertical:15}]}>
              <Text style={[styles.textMarginRight, {marginHorizontal:5}]}>Commande du produit en cours ? :</Text> 
              {
                loading
                ?
                <ActivityIndicator animating={true} color="blue" />
                :
                <View style={[globalStyles.flexRow, {alignItems:"center"}]}>
                  <Text style={!singleProduct.commandeEncours? {fontFamily:"Roboto-Black", color:"red"}:{fontFamily:"Inter-Light", color:"gray" }}>Non</Text>
                  <Switch
                    value={singleProduct.commandeEncours}
                    onValueChange={()=> changeCommandeEnCours(singleProduct.id)}
                    color='orange'
                    />
                  <Text style={singleProduct.commandeEncours? {fontFamily:"Roboto-Black", color:"orange"}:{fontFamily:"Inter-Light", color:"gray" }}>Oui</Text>

                </View>
              }
            </View>
          }

          <View style={globalStyles.buttonRow}>
            <Button 
              mode="contained" 
              onPress={()=>goBackButton()} 
              buttonColor="grey" 
              labelStyle={{color:"white"}} 
            >
              Retour
            </Button>
            <Button 
              mode="contained" 
              buttonColor="#1C9CEA"
              labelStyle={{color:"white"}} 
              onPress={()=>{
                setModify(true)
                dispatch(hideModal())
              }}
            >
              Modifier les infos produit
            </Button>
          </View>
        </View>  
      }
      
    </View>  
  )
}

export default DisplayProductInfos

const styles = StyleSheet.create({
  row: {
    flexDirection:"row",
    marginVertical:5,
    marginHorizontal:5,
    alignItems:"flex-end"
  },
  textMarginRight: {
    marginHorizontal: 10,
    marginVertical:2.5,
    fontFamily:"Roboto-BoldItalic",
    color:"#6e6e72"
  },
  value: {
    fontFamily:"Rubik-Regular",
    color:"#6e6e72"
  },
  marque: {
    fontFamily:"Rubik-SemiBoldItalic",
    color:"#6e6e72"
  }
})