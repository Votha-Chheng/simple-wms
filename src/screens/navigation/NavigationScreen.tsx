import React, { FC, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { IconButton } from 'react-native-paper'
import ListeProduitsScreen from '../listeProduits/ListeProduitsScreen'
import OptionScreen from '../options/OptionScreen'
import { useDispatch, useSelector } from 'react-redux'
import { hideModal } from '../../store/slices/modal'
import ScanInScreen from '../scanIn/ScanInScreen'
import ScanOutScreen from '../scanOut/ScanOutScreen'
import { observeProductsList } from '../../services/productServices'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import ProductModel from '../../models/ProductModel'
import Product from '../../classes/Product'
import { database } from '../../db'
import { Q, Query } from '@nozbe/watermelondb'

export type RootStackParams = {
  EntrerProduits: undefined,
  ConsommerProduits: undefined
  ListeProduits: undefined
  Options: undefined
  DeleteProduct : undefined
};

const NavigationScreen:FC = () => {
  const [badge, setBadge] = useState<number>(0)

  const RootTab = createBottomTabNavigator()
  
  const dispatch = useDispatch()
  const db = useDatabase()

  const observeBadgeChange = async ()=> {
    const collection = db.get<ProductModel>("products")
    const query = collection.query(Q.where("stock_limite", Q.gte(Q.column("qty"))))
  
    return query.observeCount().subscribe((records) => {
      // Call the callback function with the updated records
      setBadge(records)
    })
  }

  useEffect(()=> {
    observeBadgeChange()
  }, [db])

  return (
    <NavigationContainer>
      <RootTab.Navigator
        initialRouteName='Rentrer'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size } ) => {
            let iconName: string
            if (route.name === 'Rentrer') {
              if( focused){
                iconName = 'arrow-down-bold'
                color = "green"
                size = 30
              } else {
                iconName = 'arrow-down-bold-outline'
                color = "grey"
                size = 20
              }    
            } else if (route.name === 'Consommer') {
              if(focused){
                iconName = 'arrow-up-bold'
                color = "orange"
                size = 30
              } else {
                iconName = 'arrow-up-bold-outline'
                color = "grey"
                size = 20
              }
            } else if (route.name === 'Inventaire') {
              iconName = 'clipboard-list-outline'
              if(focused){
                color = "purple"
                size = 25
              } else {
                color = "grey"
                size = 20
              }
            } else if (route.name === 'Options') {
              iconName = "dots-vertical"
              if(focused){
                color = "red"
                size = 25
              } else {
                color = "grey"
                size = 20
              }
            }
            // You can return any component that you like here!
            return (
              <IconButton icon={iconName} iconColor={color} size={size} animated={true}/>
            )
          },
          tabBarShowLabel:true,
          tabBarLabelPosition:"below-icon",
          tabBarActiveTintColor : (route.name === "Rentrer" ? "green" : route.name === "Consommer" ? "orange" : route.name === "Inventaire" ? "purple" : "red"),
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { height:60 },
          tabBarLabelStyle : {
            paddingBottom : 7.5,
            marginTop:-15,
            fontSize : 12,
            fontWeight: "bold",
          }
        })}
      >
        <RootTab.Screen 
          name="Rentrer" 
          children={()=> <ScanInScreen /> }
          options={{title:"Rentrer", unmountOnBlur:true, headerShown: false}}
        />
        <RootTab.Screen 
          name="Consommer" 
          children={()=> <ScanOutScreen /> }
          options={{title:"Consommer", unmountOnBlur:true, headerShown: false}}
        />
        <RootTab.Screen 
          name="Inventaire"
          children={()=> <ListeProduitsScreen /> }
          options={badge>0 ? { tabBarBadge: badge, headerShown: false } : {headerShown: false}}
        />
        <RootTab.Screen 
          name="Options" 
          children={()=> <OptionScreen /> }
          options= {{headerShown: false}}
          listeners={({navigation}) => ({
            tabPress: () => {
              dispatch(hideModal())
              navigation.navigate("Options")
            }
          }) }
        />
      </RootTab.Navigator>
    </NavigationContainer>
  )
}

export default NavigationScreen