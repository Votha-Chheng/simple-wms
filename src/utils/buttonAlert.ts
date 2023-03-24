import { Alert } from "react-native"


export const createAlertWithTwoButtons = (titre: string, messageAlert:string, onPressFunction:Function, argument?:any) : void => {

  Alert.alert(
    titre,
    messageAlert,
    [
      { 
        text: "Annuler", 
        onPress: () => {
          null
        },
        style:"cancel" 
      },
      { 
        text: "Je confirme", 
        onPress: async() => {
          onPressFunction(argument)
        },
        style: "default"
      }

    ]
  )
}