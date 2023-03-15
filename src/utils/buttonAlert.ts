import { Alert } from "react-native"


export const createAlertWithTwoButtons = (titre: string, messageAlert:string, onPressFunction:any, args:any[]) : void => {

  function callbackStarter () {
    const arg = [...arguments].concat(args)
    onPressFunction(...arg)
    console.log(arg)
  }

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
        onPress: () => {
          callbackStarter()
        },
        style: "default"
      }

    ]
  )
}