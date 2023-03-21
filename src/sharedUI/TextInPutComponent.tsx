import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { TextInput } from 'react-native-paper'
import { resetStringInput } from '../utils/resetStringInput'

type TextInPutComponentProps={
  setter: Function
  stateValue: string
  label: string
  width?: string|number
  keyBoard?: string
  textAffix?: string
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
}

const TextInPutComponent: FC<TextInPutComponentProps> = ({setter, stateValue, label, keyBoard, textAffix, autoCapitalize="sentences", width}: TextInPutComponentProps) => {
  return (
    <TextInput
      mode='outlined'
      placeholderTextColor="#6e6e72"
      label={label}
      value={stateValue}
      activeOutlineColor="#337171"
      outlineColor='#c4cfd4'
      onChangeText={text =>setter(text)}
      autoCapitalize={autoCapitalize}
      autoComplete="off"
      keyboardType={keyBoard === "numeric" ? "numeric" : keyBoard === "phone-pad" ? "phone-pad" : "default"}
      style={{marginBottom:15, width}}
      left={textAffix !==null ? <TextInput.Affix text={textAffix} />: null}
      right={<TextInput.Icon icon="close-circle" color='red' onPress={()=> resetStringInput(setter)}/>}
    />
  )
}

export default TextInPutComponent

TextInPutComponent.defaultProps = {
  keyBoard: null,
  textAffix : null
}

const styles = StyleSheet.create({})