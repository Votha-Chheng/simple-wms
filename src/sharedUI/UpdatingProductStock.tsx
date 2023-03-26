import { Text, View } from 'react-native'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import globalStyles from '../utils/globalStyles'
import { Button, TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { hideModal } from '../store/slices/modal'
import { resetBarcode } from '../store/slices/dataBarCode'
import { showToast } from '../utils/showToast'
import { getSingleProduct } from '../store/slices/productsAndCategories'
import ProductModel from '../models/ProductModel'
import { findProductModelById } from '../services/productServices'

interface UpdatingProductStockProps {
  addStock: boolean
  scanOut: boolean
  backgroundColor: string
  setProductExists: Dispatch<SetStateAction<"undetermined"|"yes"|"no">>
}

const UpdatingProductStock: FC<UpdatingProductStockProps> = ({addStock, scanOut, backgroundColor, setProductExists}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const { singleProduct } = useSelector((state: RootState)=> state.productAndCategories)

  const [newQty, setNewQty] = useState<string>("1")

  const dispatch = useDispatch()

  const validateNewStock = async()=>{
    try {
      setLoading(true)
      const record: ProductModel = await findProductModelById(singleProduct.id)
      if(record){
        
        const result = await record.updateStock(addStock, +newQty)

        if(result){
          const updatedProd: ProductModel = await findProductModelById(singleProduct.id)
          if(updatedProd){
            setLoading(false)
            showToast("success", "Stock mis à jour", `Stock actuel de ${updatedProd.nom} : ${updatedProd.qty} unités.`)
            setNewQty("1")
            dispatch(resetBarcode())
            dispatch(hideModal())
            dispatch(getSingleProduct(undefined))
            setProductExists("undetermined")

            if(updatedProd.stockLimite<updatedProd.qty){
              await updatedProd.setComandeEncours(false)
            }
          }
        }
      }
    } catch (error) {
      setLoading(false)
      showToast("error", "Un problème est survenu", "Le stock n'a pas pu être mis à jour.")
    }
  }

  const cancelNewStock = ()=>{
    dispatch(hideModal())
    dispatch(getSingleProduct(undefined))
    dispatch(resetBarcode())
    setNewQty("1")
    showToast("info", "Stock inchangé", "Mise à jour du stock annulée.")
    setProductExists("undetermined")
  }
  
  return (
    <View style={globalStyles.modalStyle}>
      <Text style={[globalStyles.screenTitle, {color: backgroundColor}]}>{scanOut ? "Retirer de l'inventaire" : "Ajouter dans l'inventaire"}</Text>
      <Text style={{textAlign:"center", marginVertical:20}}>Code-barre n° {singleProduct.barcodeNumber}</Text>
      <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", marginBottom:20}}>
        <View style={{width:"50%", paddingLeft:10}}>
          <Text style={[globalStyles.nom, {alignSelf:'flex-start'}]}>{singleProduct.nom}</Text>
          <Text style={globalStyles.marque}>{singleProduct.marque}</Text>
        </View>

        <View style={{width:"50%", flexDirection:"row", alignItems:"center"}}>
          <View style={{width:"60%", justifyContent:"center"}}>
            <Text style={{height: 50, color:"#1DA1F2", fontWeight:"bold" }}>Qté actuelle : </Text>
            <Text style={{height: 50, fontWeight:"bold", color:"grey" }}>{`Qté à ${scanOut ? "retirer":"ajouter"}` }: </Text>
            <Text style={{fontFamily:"Rubik_600SemiBold", color:"purple", fontWeight:"bold"}}>Nouveau stock : </Text>
          </View>
          <View>
            <Text style={{marginTop:5, height: 40, alignSelf: "center", fontWeight:"bold", color:"#1DA1F2"}}>{singleProduct.qty}</Text>
            <TextInput
              mode='flat'
              label=""
              value={newQty}
              activeOutlineColor="#337171"
              outlineColor='#c4cfd4'
              onChangeText={text => setNewQty(text)}
              onFocus={()=>setNewQty("")}
              autoComplete="off"
              keyboardType="numeric"
              dense={true}
              style={{marginTop:0}}
            />
            <Text style={{marginBottom:10, marginTop: 25, marginRight:10, fontFamily:"Rubik_600SemiBold", color: "purple", fontWeight:"bold", alignSelf: "center"}}>{scanOut ? singleProduct.qty - (+newQty) : singleProduct.qty + (+newQty)}</Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection:'row', justifyContent:'center'}}>
        <Button disabled={loading} mode="contained" buttonColor="#d44f0c" style={{width:"40%", marginRight:10}} onPress={()=>cancelNewStock()}>
          Annuler
        </Button>
        <Button loading={loading} disabled={loading} mode="contained" buttonColor="green" style={{width:"40%", marginLeft:10}} onPress={()=>validateNewStock()}>
          Valider
        </Button>
      </View>
    </View>
  )
}

export default UpdatingProductStock