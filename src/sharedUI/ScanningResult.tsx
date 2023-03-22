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
  const [productExists, setProductExists] = useState<boolean>(false)

  return (
    <View style={{width: "100%", height:"100%"}}>
      {
        loading
        ?
        <Loader backgroundColor={backgroundColor}/>
        :
        visible
        ?
        <View style={{height: "100%", width:"100%", backgroundColor}}>
        { 
          (productExists === true && singleProduct) && 
          <Modal isVisible={visible}>
            <UpdatingProductStock addStock={addStock} scanOut={scanOut} backgroundColor={backgroundColor} /> 
          </Modal>
        }
        { productExists === false && !singleProduct && scanOut === false && <ProductForm newProduct={newProduct}/>}        
        </View>
        :
        <CameraView colorFrame={backgroundColor} title={scanOut ? "Consommer un produit":"Ajouter un produit"} scanOut={scanOut} setterFunction={setProductExists} setLoading={setLoading} />
      }
    </View>
  )
}

export default ScanningResult