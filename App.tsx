/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  StatusBar,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { BaseToast } from 'react-native-toast-message';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Provider } from 'react-redux';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import store from './src/store/store';
import NavigationScreen from './src/screens/navigation/NavigationScreen';
import { database } from './src/db';

function App(): JSX.Element {
  
  useEffect(() => {
    SplashScreen.hide()
    
  }, [])


  const width = "100%"
  const toastConfig = {
    success: (props: any) =>(
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green', width, height: 100 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 17.5,
          color:"green"
        }}
        text2Style={{
          fontSize: 15,
          color:"green"
        }}
      />
    ),
    info: (props:any) =>(
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#1D9BF0', width, height: 100  }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 17.5,
          color:"#1D9BF0"
        }}
        text2Style={{
          fontSize: 15,
          color:"#1D9BF0"
        }}
      />
    ),
    error: (props:any) =>(
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'red', width, height: 100 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          color:"red"
        }}
        text2Style={{
          fontSize: 13,
          color:"black"
        }}
      />
    )
  }

  return (
    <DatabaseProvider database={database} >
      <Provider store={store}>
        <StatusBar
          barStyle={'light-content'}
        />
        <NavigationScreen/>
        <Toast config={toastConfig}/>
      </Provider>
    </DatabaseProvider>
  );
}

export default App;