import { StyleSheet, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetBarcode } from '../../store/slices/dataBarCode'
import ScanningResult from '../../sharedUI/ScanningResult'
import { hideModal } from '../../store/slices/modal'
import { RootState } from '../../store/store'
import { getSingleProduct } from '../../store/slices/productsAndCategories'

const ScanInScreen: FC = () => {

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
      <ScanningResult backgroundColor='green' addStock={true} newProduct={true} scanOut={false} />
    </View>
      
  
  )
}

export default ScanInScreen

const styles = StyleSheet.create({})