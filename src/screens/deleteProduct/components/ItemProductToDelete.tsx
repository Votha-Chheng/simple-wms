import { StyleSheet, Text, View } from 'react-native'
import React, {FC} from 'react'
import { IconButton } from 'react-native-paper'
import globalStyles from '../../../utils/globalStyles'
import Product from '../../../classes/Product'

export interface ItemProductToDeleteProps {
  data: Product
  onPressFunction: Function
}

const ItemProductToDelete: FC<ItemProductToDeleteProps> = ({data, onPressFunction}: ItemProductToDeleteProps) => {
  return (
    <View style={[styles.itemContainer]}>
      <View style={[styles.info]}>
        <Text style={[globalStyles.marque]}>{data.marque}</Text>
        <Text style={[globalStyles.nom]}>{data.nom}</Text>
        <Text style={[globalStyles.categorie]}>{data.category.nom}</Text>
      </View>
      <View style={[globalStyles.infoQty, {width: "15%"}]}>
        <Text style={{color: "#697771"}}>Stock actuel</Text>
        <Text style={[globalStyles.qty, {color: "#697771"}]}>{data.qty}</Text>
      </View>
      <View style={{width:"10%", alignSelf:"center"}}>
        <IconButton size={30} icon="delete" iconColor="red" onPress={()=> onPressFunction(data.id)}/>
      </View>
    </View>
  )
}

export default ItemProductToDelete

const styles = StyleSheet.create({
  itemContainer: {
    padding: 5,
    marginHorizontal: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius:5,
    flexDirection: "row",
    backgroundColor: "#d4d6d8"
  },
  info: {
    width:"70%",
    marginRight:0
  }
})