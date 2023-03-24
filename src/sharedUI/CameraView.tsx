import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { Camera, CameraType} from 'react-native-camera-kit'
import { useDispatch } from 'react-redux'
import { getBarcode, resetBarcode } from '../store/slices/dataBarCode'
import { database } from '../db'
import ProductModel from '../models/ProductModel'
import { Q } from '@nozbe/watermelondb'
import { hideModal, showModal } from '../store/slices/modal'
import { getSingleProduct } from '../store/slices/productsAndCategories'
import Product from '../classes/Product'
import { showToast } from '../utils/showToast'
import globalStyles from '../utils/globalStyles'

interface CameraProps {
  colorFrame: string
  title?: string 
  scanOut: boolean
  setterFunction: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
}

const CameraView: FC<CameraProps> = ({colorFrame, title, scanOut, setterFunction, setLoading}: CameraProps) => {

  const dispatch = useDispatch()

  const {height, width} = useWindowDimensions()

  const handleScanBarCode = async(event: any): Promise<void>=> {
    try {
      setLoading(true)
      dispatch(getBarcode(event.nativeEvent.codeStringValue))
      
      const result: ProductModel[] = await database.get<ProductModel>("products").query(Q.where("barcode_number", event.nativeEvent.codeStringValue))
      
      if(result.length>0){
        const prod: Product = await result[0].instantiateProductModel()

        if(prod){
          dispatch(getSingleProduct(prod))
          setterFunction("yes")
          dispatch(showModal())
          setLoading(false)
        }
      } else if(result.length<1) {
        dispatch(getSingleProduct(undefined))
        setterFunction("no")
    
        if(scanOut === true){
          dispatch(hideModal())
          dispatch(resetBarcode())
          showToast("error", "Le produit n'est pas dans l'inventaire.", "Rentrer le produit dans l'inventaire d'abord.")
          
        }
      }
      setLoading(false)    
      
    } catch (error) {
      showToast("error", "Une erreur est survenue", "Le scan du produit a échoué.")
      setLoading(false)
    }
  }

  return (
    <View style={{height:"100%"}}>
      <View style={{height:"25%", width:"100%", position: "absolute", flexDirection:"row", justifyContent:"center", backgroundColor:colorFrame}} >
        <Text style={globalStyles.scanInOutTitle}>{title}</Text>
      </View>
      <Camera 
        flashMode="on"
        torchMode="on"
        style={{ width: width, height:height/1.25, zIndex: -1 }}
        scanBarcode={true}
        showFrame={true} 
        laserColor={colorFrame} 
        frameColor={colorFrame} 
        surfaceColor="white"
        onReadCode={(event: any) => handleScanBarCode(event)}   
        cameraType={CameraType.Back}   
      />
      <View style={{height:"25%", width:"100%", position: "absolute", backgroundColor:colorFrame, left:0, bottom:0}} />
    </View>
  )
}

export default CameraView

const styles = StyleSheet.create({})