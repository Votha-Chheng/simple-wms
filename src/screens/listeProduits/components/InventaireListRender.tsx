import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import Product from '../../../classes/Product'
import { renderColorText } from '../../../utils/renderColorText'
import globalStyles from '../../../utils/globalStyles'

type InventaireListRenderProps = {
  data: Product
  onPressFunction : Function
}

const InventaireListRender: FC<InventaireListRenderProps> = ({data, onPressFunction}: InventaireListRenderProps) => {

  return (
    <TouchableOpacity style={[styles.itemContainer, {backgroundColor: `${renderColorText(data, false, "red", "#e7efeb")}`}]} onPress={()=> onPressFunction(data.id)}>
      <View style={styles.info}>
        <Text style={[globalStyles.marque, {color: renderColorText(data, true, "#e7efeb", "#697771")}]}>{data.marque}</Text>
        <Text style={[globalStyles.nom, {color: renderColorText(data, true, "#e7efeb", "#697771")}]}>{data.nom}</Text>
        <Text style={[globalStyles.categorie, {color: renderColorText(data, true, "#e7efeb", "#697771")}]}>{data.category.nom}</Text>
      </View>
      <View style={globalStyles.infoQty}>
        <Text style={{color: renderColorText(data, true, "#e7efeb", "#697771")}}>Stock actuel</Text>
        <Text style={[globalStyles.qty, {color: renderColorText(data, true, "#e7efeb", "#697771")}]}>{data.qty}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default InventaireListRender

const styles = StyleSheet.create({
  itemContainer: {
    padding: 5,
    marginHorizontal: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius:5,
    flexDirection: "row"
  },
  info: {
    width:"75%"
  }
  
})