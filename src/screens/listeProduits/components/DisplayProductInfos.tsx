import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useState } from 'react'
import { ActivityIndicator, Button, Chip, Switch } from 'react-native-paper'
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
  setModify: Function
}

const DisplayProductInfos: FC<DisplayProductInfosProps> = ({setModify}: DisplayProductInfosProps) => {
  const { singleProduct } = useSelector((state: RootState)=> state.productAndCategories)
  const [loading, setLoading] = useState<boolean>(false)

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
    <ScrollView>
      {
        singleProduct !==undefined &&
        <View>
          <Text style={[globalStyles.screenTitle, {marginBottom:20}]}>
            Code barre n° {singleProduct.barcodeNumber}
          </Text>
          <View style={[styles.row]}>
            <Text style={styles.textMarginRight}>
              Nom : 
            </Text>
            <Text style={styles.value}>
              {singleProduct.nom}
            </Text>
          </View>
          <View style={[styles.row]}>
            <Text style={[styles.textMarginRight]}>
              Catégorie : 
            </Text>
            <Text style={styles.value}>
              {singleProduct.category.nom}
            </Text>
          </View>
          <View style={[styles.row]}>
            <Text style={[styles.textMarginRight]}>
              Fabricant : 
            </Text>
            <Text style={styles.marque}>
              {singleProduct.marque}
            </Text>  
          </View>
          
          <View>
          {
            singleProduct.telFournisseur !== null && singleProduct.telFournisseur !== "" 
            &&
            <View style={[styles.row]}>
              <Text style={[styles.textMarginRight]} >N° de téléphone du fournisseur :</Text> 
              <Text onPress={()=>Linking.openURL(`tel:${singleProduct.telFournisseur}`)}>{insertSpacesInTel(singleProduct.telFournisseur) }</Text> 
            </View>     
          }
          {
            singleProduct.siteFournisseur !== null && singleProduct.siteFournisseur !== ""
            && 
            <View style={[styles.row]}>
              <Text style={[styles.textMarginRight]}>Site web du fournisseur :</Text> 
              <Text onPress={()=> Linking.openURL(singleProduct.siteFournisseur)}>https://{singleProduct.siteFournisseur}</Text>
            </View>
          }
          {
            singleProduct.qty <= singleProduct.stockLimite 
            &&
            <View style={[styles.row, {alignItems:"center", marginBottom:15}]}>
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
            
          </View>

          <View style={globalStyles.buttonRow}>
            <Button mode="contained" onPress={()=>goBackButton()} buttonColor="grey" labelStyle={{color:"white"}} >
              Retour
            </Button>
            <Button 
              mode="contained" 
              onPress={()=>{
                setModify(true)}
              } 
              buttonColor="#1C9CEA">
              Modifier les infos produit
            </Button>
          </View>
        </View>  
      }
      
    </ScrollView>  
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
    marginRight: 10,
    fontFamily:"Roboto-BoldItalic"
  },
  value: {
    fontFamily:"Rubik-Regular"
  },
  marque: {
    fontFamily:"Rubik-SemiBoldItalic"
  }
})