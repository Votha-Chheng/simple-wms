import { Linking, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper';
import React, { FC, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionStackParams } from '../options/OptionScreen';
import { createAlertWithTwoButtons } from '../../utils/buttonAlert';
import { deleteAllTablesAsync } from '../../services/productServices';
import PrivacyPolicy from '../privacyPolicy/PrivacyPolicy';

const HomeOptionScreen : FC = () => {
  const [displayPrivacy, setDisplayPrivacy] = useState<boolean>(false)
  const navigation = useNavigation<NativeStackNavigationProp<OptionStackParams>>()

  if(displayPrivacy) {
    return <PrivacyPolicy setDisplayPrivacy={setDisplayPrivacy}/>

  } else return (
    <View style={styles.container}>
      <Button 
        icon="arrow-down-bold" 
        buttonColor='red' 
        mode="contained" 
        onPress={() => navigation.navigate("Supprimer des produits")}
        style={styles.buttonStyle}
      >
        Supprimer des produits
      </Button>
      <Button 
        icon="arrow-down-bold" 
        buttonColor='#1DA1F2' 
        mode="contained" 
        onPress={() => navigation.navigate("Gestion des catégories")}
        style={styles.buttonStyle}
      >
        Gérer les catégories
      </Button>
      <Button 
        icon="arrow-down-bold" 
        buttonColor='black' 
        mode="contained" 
        onPress={() =>createAlertWithTwoButtons("Votre inventaire sera vide.", "Il n'y aura plus aucun produit ni catégorie dans votre inventaire. Êtes-vous sûr de vouloir tout faire disparaître ?", deleteAllTablesAsync, null)}
        style={styles.buttonStyle}
      >
        Réinitialiser l'inventaire
      </Button>
      <Button 
        icon="arrow-down-bold" 
        buttonColor='black' 
        mode="contained" 
        onPress={() => setDisplayPrivacy(true)}
        style={styles.buttonStyle}
      >
        Politique de confidentialité
      </Button>
    </View>
  )
}

export default HomeOptionScreen

const styles = StyleSheet.create({
  modalStyle : {
    backgroundColor: 'white', 
    paddingVertical: 10,
    fontWeight: '900',
    height:"100%",
  },
  container : {
    height:"100%",
    flex:1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  buttonStyle: {
    marginHorizontal:25,
    marginVertical:20,
    width:"80%",
    borderRadius:30
  }
})
