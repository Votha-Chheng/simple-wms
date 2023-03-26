import { View } from 'react-native'
import React, { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import Modal from 'react-native-modal'
import UpdatingProductStock from './UpdatingProductStock'
import ProductForm from './ProductForm'
import CameraView from './CameraView'
import Loader from './Loader'

type ScanningResultProps = {
  backgroundColor: string
  addStock: boolean
  newProduct: boolean
  scanOut: boolean
}

const ScanningResult: FC<ScanningResultProps> = ({backgroundColor, addStock, newProduct, scanOut}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [productExists, setProductExists] = useState<"undetermined"|"yes"|"no">("undetermined")

  const { visible } = useSelector((state: RootState)=> state.modal)
  const { singleProduct } = useSelector((state: RootState)=> state.productAndCategories)

  if(loading) return <Loader backgroundColor={backgroundColor} />

  return (
    <View style={{width: "100%", height:"100%", backgroundColor}}>
    {
      productExists === "no" && singleProduct === undefined && scanOut === false  &&
      <ProductForm newProduct={newProduct} setProductExists={setProductExists} />
    }
    {
      productExists === "undetermined" && singleProduct === undefined &&
      <CameraView colorFrame={backgroundColor} title={scanOut ? "Consommer un produit" : "Ajouter un produit"} scanOut={scanOut} setterFunction={setProductExists} setLoading={setLoading} />
    }
      <Modal isVisible={visible}>
      {
        productExists === "yes" && singleProduct 
        ? <UpdatingProductStock addStock={addStock} scanOut={scanOut} backgroundColor={backgroundColor} setProductExists={setProductExists} /> 
        : <View/>
      }    
      </Modal>
    </View>
  )
}

export default ScanningResult