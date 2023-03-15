import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { Modal, Portal, Provider } from 'react-native-paper'
import globalStyles from '../utils/globalStyles'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

type ModalProps = {
  children: JSX.Element
}

const ModalView: FC<ModalProps> = ({children}) => {
  const {visible} = useSelector((state: RootState)=> state.modal)

  return (
    <Provider>
      <Portal>
        <Modal visible={visible} dismissable={false} contentContainerStyle={globalStyles.modalStyle}>
          {children}
        </Modal>   
      </Portal>
    </Provider>  
  )
}

export default ModalView

const styles = StyleSheet.create({})