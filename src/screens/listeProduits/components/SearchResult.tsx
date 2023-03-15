import { StyleSheet, View } from 'react-native'
import React, { FC, useState } from 'react'
import { TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { setSearchByText } from '../../../store/slices/filters'


const SearchResult: FC = () => {

  const {searchByText} = useSelector((state : RootState) => state.filters)

  const dispatch = useDispatch()
  
  return (
    <View style={styles.container}>
      <TextInput
        label="Rechercher un mot"
        mode="outlined"
        dense={true}
        left={<TextInput.Icon icon="magnify" />}
        right={<TextInput.Icon icon="close-circle" color='red' onPress={()=> dispatch(setSearchByText(""))}/>}
        value={searchByText}
        onChangeText={(text)=>dispatch(setSearchByText(text))}
      />
    </View>
  )
}

export default SearchResult

const styles = StyleSheet.create({
  container : {
    marginHorizontal:10,
    flex:1
  }
})