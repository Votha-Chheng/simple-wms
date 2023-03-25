import { StyleSheet, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetBarcode } from '../../store/slices/dataBarCode'
import ScanningResult from '../../sharedUI/ScanningResult'
import { hideModal } from '../../store/slices/modal'
import { getSingleProduct } from '../../store/slices/productsAndCategories'

const ScanOutScreen: FC = () => {

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(resetBarcode())
    dispatch(hideModal())
    dispatch(getSingleProduct(undefined))
    
    return(()=> {
      dispatch(resetBarcode())
      dispatch(hideModal())
      dispatch(getSingleProduct(undefined))
    })
  }, [])

  return (
    <View style={{width: "100%", height:"100%"}}>
      <ScanningResult backgroundColor='orange' addStock={false} newProduct={false} scanOut={true} />
    </View>
  )
}

export default ScanOutScreen

const styles = StyleSheet.create({})