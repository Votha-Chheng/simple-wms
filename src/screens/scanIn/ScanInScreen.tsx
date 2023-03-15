import { StyleSheet, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetBarcode } from '../../store/slices/dataBarCode'
import ScanningResult from '../../sharedUI/ScanningResult'
import { hideModal } from '../../store/slices/modal'

const ScanInScreen: FC = () => {

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(resetBarcode())
    dispatch(hideModal())

    return(()=> {
      dispatch(resetBarcode())
      dispatch(hideModal())
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