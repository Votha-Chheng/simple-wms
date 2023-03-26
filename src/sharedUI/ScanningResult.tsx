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
  const { visible } = useSelector((state: RootState)=> state.modal)
  const { singleProduct } = useSelector((state: RootState)=> state.productAndCategories)

  const [loading, setLoading] = useState<boolean>(false)
  const [productExists, setProductExists] = useState<"undetermined"|"yes"|"no">("undetermined")

  return (
    <View style={{width: "100%", height:"100%"}}>
    {
      loading
      ?
      <Loader backgroundColor={backgroundColor}/>
      :
      productExists === "no" && !singleProduct && scanOut === false
      ? 
      <ProductForm newProduct={newProduct} setProductExists={setProductExists} />
      :
      productExists === "undetermined" && !singleProduct
      ?
      <CameraView colorFrame={backgroundColor} title={scanOut ? "Consommer un produit":"Ajouter un produit"} scanOut={scanOut} setterFunction={setProductExists} setLoading={setLoading} />
      :
      null
    }
      <Modal isVisible={visible}>
        <View>
        {
          productExists === "yes" && singleProduct 
          ? <UpdatingProductStock addStock={addStock} scanOut={scanOut} backgroundColor={backgroundColor} setProductExists={setProductExists} /> 
          : null
        }    
        </View>
      </Modal>

    </View>
  )
}

export default ScanningResult