import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {FC} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { chooseOptionsTopMenu } from '../../../store/slices/categoryMenus'

const CategoryTopMenu: FC = () => {

  const {chosenOptionMenu} = useSelector((state: RootState)=> state.categoryTopMenu)

  const dispatch = useDispatch()

  const chooseColourMenu = (menuName: string, selected: string, unselected: string)=>{
    return chosenOptionMenu === menuName ? styles[selected] : styles[unselected]
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=> dispatch(chooseOptionsTopMenu("supprimer"))} style={chooseColourMenu("supprimer", "itemMenuSelected", "itemMenu")}>
        <Text style={chooseColourMenu("supprimer", 'itemTextSelected', 'itemText')}>Supprimer</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> dispatch(chooseOptionsTopMenu("modifier"))} style={chooseColourMenu("modifier", "itemMenuSelected", "itemMenu")}>
        <Text style={chooseColourMenu("modifier", 'itemTextSelected', 'itemText')}>Modifier</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CategoryTopMenu

const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    flexDirection:"row",
    borderBottomWidth:1,
    borderBottomColor: "grey"
  },
  itemMenu: {
    paddingHorizontal:7.5,
    paddingVertical:5,
    marginHorizontal:2.5
  },
  itemMenuSelected: {
    backgroundColor:"#6fae84",
    paddingHorizontal:7.5,
    paddingVertical:5,
    borderColor: "grey",
    borderWidth:1,
    borderBottomColor: "none",
    borderBottomWidth:0,
    marginHorizontal:2.5,
    borderTopLeftRadius: 10,
    borderTopRightRadius:10
  },
  itemText: {
    fontFamily: "Rubik_300Light",
    color: "#9999a1",
    fontSize:14
  },
  itemTextSelected: {
    fontFamily: "Rubik_500Medium",
    color: "#f4f4f6",
    fontSize:15
  }
})