//importing all necessary libraries and pages
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
  
  // MainPage function starts upon navigation to this page 
  function MainPage({navigation})  {

    //declaring constant variables
    const [isEnabled, setIsEnabled] = useState(false);
    var toggleState;
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);

    //method to check bluetooth status and redirect to search results
    const handleNavClick  = () => {
      //checks current bluetooth status and asks for permission to connect
      if(isEnabled ==false){
        BleManager.enableBluetooth()
          .then(() => {
            // Success code
            console.log("Success, the user confirm");
            navigation.navigate('DisplaySearch', { name: 'DisplaySearch',searchState: true })
            
          })
          .catch((error) => {
            // Failure code
            console.log("The user refuse to enable bluetooth");
          });
        }
      
  }
   //method to check bluetooth status and redirect to past connected devices
    const handleNav2Click  = () => {
      
      //checks current bluetooth status and asks for permission to connect
      if(isEnabled ==false){
        BleManager.enableBluetooth()
          .then(() => {
            // Success code
            console.log("Success, the user confirm");
            navigation.navigate('DisplaySearch', { name: 'DisplaySearch' , searchState: false})
            
          })
          .catch((error) => {
            // Failure code
            console.log("The user refuse to enable bluetooth");
          });
        }
      
  }
  
    
    
    //toggle switch which is used tp turn on bluetooth
    const toggleSwitch = () => {
      BleManager.checkState();
      setIsEnabled(previousState => !previousState);
      if(isEnabled ==false){
        BleManager.enableBluetooth()
          .then(() => {
            // Success code
            console.log("Success, the user confirm");
            
          })
          .catch((error) => {
            // Failure code
            console.log("The user refuse to enable bluetooth");
          });
        }
  
     
    }
  
    //method to toggle switch temp
    const handleBluetoothStatus = (value) => {
        toggleState =value;
        //toggleSwitchOnce();
    
    }
  
    // hook only runs initially(ONCE) and checks for for android version, followed by location permission
    useEffect(() => {
      BleManager.start({showAlert: false});
  
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
        });
      }  
      
      return (() => {
        
      })
    }, []);
  
    
  
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.bar}>
  
            
              <Image 
              style={styles.stretch}
              source={require("./images/bluetooth_icon.png")} />
  
  
              <Text style={{margin:10, fontSize: 30 , fontWeight: 'bold', color: '#ffff',}}>
                BlueApp Component v1
              </Text>
          </View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            
            <View style={styles.body}>
              <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Text>Turn on Bluetooth</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
              <View style={{margin: 20,flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Button 
                  color="#8B88A3"
                  title={'Start Scaning'}
                  onPress={() => handleNavClick() } 
                />  
                <Button 
                color="#8B88A3" 
                title="Connected Devices" 
                onPress={() => handleNav2Click() } />          
              </View>
  
            </View> 
                        
          </ScrollView>
                       
        </SafeAreaView>
      </>
    );
  };
  
  // various styles used in rendering UI
  const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    bar: {
      backgroundColor: "#9087D6", 
      flexDirection: 'row', 
      justifyContent: 'space-evenly'
    },
    engine: {
      position: 'absolute',
      right: 0,
    },
    body: {
      backgroundColor: '#E8E7F6',
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
    stretch: {
      margin: 10,
      width: 60,
      height: 40,
      resizeMode: 'contain',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });
  
  export default MainPage;