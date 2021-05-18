import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartPage from './src/StartPage'
import MainPage from './src/MainPage'
import DisplaySearch from './src/DisplaySearch'

import React, {
  useState,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Switch,
  Image,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Alert,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* Rest of your app code */}
      <Stack.Navigator>
        <Stack.Screen
          name="StartPage"
          component={StartPage}
          options={{ title: 'Weclome' }}
        />
        <Stack.Screen name="MainPage" component={MainPage} options={{ title: 'MainPage', headerStyle: {
                      backgroundColor: '#E8E7F6',
                       }, }} />
        <Stack.Screen name="DisplaySearch" component={DisplaySearch} 
              options={{ title: 'Devices', headerStyle: {
                      backgroundColor: '#E8E7F6',
                       }, }} />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;