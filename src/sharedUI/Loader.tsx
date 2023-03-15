import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { ActivityIndicator } from 'react-native-paper'

type LoaderProps = {
  backgroundColor?: string
  spinnerColor?: string
}

const Loader: FC<LoaderProps> = ({backgroundColor, spinnerColor="white"}) => {
  return (
    <View style={{width: "100%", height:"100%", justifyContent:"center", alignItems:"center", backgroundColor}} >
      <ActivityIndicator size="large" animating={true} color={spinnerColor}/>
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({})