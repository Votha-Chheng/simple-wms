import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { selectMarqueOrCategory } from '../../../store/slices/selectedMarqueOrCategory'
import { Chip } from 'react-native-paper'
import { setDateEntree, setRecent } from '../../../store/slices/filters'

export type ResultWithTextProps = {
  listProduct: string []
}

const ResultWithText: FC<ResultWithTextProps> = ({listProduct}: ResultWithTextProps) => {

  const {selectedMarqueOrCategory} = useSelector((state: RootState)=> state.selectedMarqueOrCategory)

  const dispatch = useDispatch()

  const onPressToChooseItem = (item: string)=>{
    console.log(selectedMarqueOrCategory)
    if(selectedMarqueOrCategory === item){
      dispatch(selectMarqueOrCategory(null))
      dispatch(setDateEntree(false))
      dispatch(setRecent(null))

    } else {
      dispatch(selectMarqueOrCategory(item))
      dispatch(setRecent(true))
      dispatch(setDateEntree(true))  
    }
  }

  return (
    <View>
      <FlatList
        data={listProduct}
        horizontal={true}
        renderItem = {({item}) =>(
          <Chip 
            style={{backgroundColor:`${(selectedMarqueOrCategory === item) || selectedMarqueOrCategory === null ? "#bac9c4" : "#dfe1e1"}` , marginHorizontal:5, borderColor: "grey"}}
            selectedColor={`${(selectedMarqueOrCategory === item) || selectedMarqueOrCategory === null ? "#343233" : "#95959d"}`}
            selected={selectedMarqueOrCategory === item}
            onPress = {()=> onPressToChooseItem(item)}
          >
            <Text>{item.toString()}</Text>
          </Chip>
        )
      }
        keyExtractor={item => item}
      />

    </View>
  )
}

export default ResultWithText

const styles = StyleSheet.create({})