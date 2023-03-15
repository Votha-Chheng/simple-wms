import Toast from "react-native-toast-message";

export const showToast = (type: string, message1: string, message2: string): void =>{
  Toast.show({
    type,
    text1: message1,
    text2:  message2,
    topOffset: 150,
    visibilityTime:2500
  });
}