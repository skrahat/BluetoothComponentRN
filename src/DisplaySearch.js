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
  
  
  // DisplaySearch function starts upon navigation to this page 
  function DisplaySearch  ({ route, navigation }){
    
    const BleManagerModule = NativeModules.BleManager;
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    var toggleState;
    const { name, searchState } = route.params;
  
    // method used to scan nearby bluetooth devices for 10 seconds 
    const startScan = () => {
      if (!isScanning) {
        BleManager.scan([], 10, true).then((results) => {
          console.log('Scanning...');
          setIsScanning(true);
        }).catch(err => {
          console.error(err);
        });
      }    
    }
    // method used to stop scanning
    const handleStopScan = () => {
      console.log('Scan is stopped');
      setIsScanning(false);
    }
    
    // method used to disconnect a device which is already connected 
    const handleDisconnectedPeripheral = (data) => {
      let peripheral = peripherals.get(data.peripheral);
      if (peripheral) {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
      console.log('Disconnected from ' + data.peripheral);
    }
  
    const handleUpdateValueForCharacteristic = (data) => {
      console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }

    // method used to obtain array of connected devices
    const retrieveConnected = () => {
      BleManager.getConnectedPeripherals([]).then((results) => {
        if (results.length == 0) {
          console.log('No connected peripherals')
        }
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          var peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          setList(Array.from(peripherals.values()));
        }
      });
    }
  
    // method used to handle devices which are detected. The RSSI signal value is then used to approximately calculate their destance
    const handleDiscoverPeripheral = (peripheral) => {
      console.log('Got ble peripheral', peripheral);
      if (!peripheral.name) {
        peripheral.name = 'No name';
        //calculating distance using formula obtained from stackoverflow, variables are yet to be further tested for accuracy
        var distance = Math.pow(10 , ((-62 - (peripheral.rssi))/(10 * 2)));
        peripheral.distance= distance.toFixed(2);
        if(distance<5){
          peripheral.range="close";
        } else {
          peripheral.range= "far";
        }
      }
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
  
    // method used to connect a device after being discovered and added to connected devices list
    const connectDevice = (peripheral) => {
      if (peripheral){
        if (peripheral.connected){
          BleManager.disconnect(peripheral.id);
        }else{
          BleManager.connect(peripheral.id).then(() => {
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              setList(Array.from(peripherals.values()));
            }
            console.log('Connected to ' + peripheral.id);
            // simple alert used to verify a device when successfully connected
            Alert.alert(
              "Connected to device",
              )
  
  
            setTimeout(() => {
  
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                console.log('Retrieved peripheral services', peripheralData);
  
                BleManager.readRSSI(peripheral.id).then((rssi) => {
                  console.log('Retrieved actual RSSI value', rssi);
                  
                  let p = peripherals.get(peripheral.id);
                  if (p) {
                    var distance = Math.pow(10 , ((-62 - (rssi))/(10 * 2)));
                    if(distance<5){
                      var x="close";
                    } else {
                      var x= "far";
                    }
                    peripherals.set(peripheral.range, x);
                    peripherals.set(peripheral.distance, distance.toFixed(2));
                    peripherals.set(peripheral.id, p);
                    setList(Array.from(peripherals.values()));
                  }                
                });                                          
              });
  
  
            }, 900);
          }).catch((error) => {
            console.log('Connection error', error);
          });
        }
      }
  
    }
  
    //method used to check whether to show connected devices or new scanned devices
    const displayDevices = () => {
        console.log(searchState);
        if (searchState){
            startScan();
        } else {
            retrieveConnected();
        }
    }
    
      // hook only runs initially(ONCE) and activates bleManagerEmitter listeners 
    useEffect(() => {
      BleManager.start({showAlert: false});
  
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
      bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
      bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
      bleManagerEmitter.addListener("BleManagerDidUpdateState", (args) => {
        //console.log(args.state);
        toggleState =args.state;
        //handleBluetoothStatus(args.state);
      });
      //calls method to run method once initially and display requested data
      displayDevices();
  
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
        console.log('unmount');
        bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan );
        bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
        bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
        bleManagerEmitter.removeListener("BleManagerDidUpdateState", (args) => {});
      })
    }, []);
  
    const renderItem = (item) => {
      const color = item.connected ? '#C1FFCF' : '#E8E7F6';
      return (
        <TouchableHighlight onPress={() => connectDevice(item) }>
          <View style={[styles.row, {backgroundColor: color, }]}>
            <Text style={{fontSize: 16, textAlign: 'center', color: '#693D3D', padding: 10, }}>Range: {item.range}</Text>
            <Text style={{fontSize: 12, textAlign: 'center', color: '#693D3D', padding: 10, }}>Distance: {item.distance}</Text>
            <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 2}}>Name: {item.name}</Text>
            <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
            <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20}}>{item.id}</Text>
          </View>
        </TouchableHighlight>
      );
    }
    //method used to seperate itims in flatlist
    const ItemSeparator = () => <View style={{
      height: 2,
      backgroundColor: "rgba(0,0,0,0.5)",
      marginLeft: 10,
      marginRight: 10,
      }}
      />
      
      //returns UI and renders all items 
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            
            <View
                style={styles.topBar}>
                  <Text style={styles.topBarText}> Devices</Text>
  
              </View> 
            <View style={styles.body}>
              
              {(list.length == 0) &&
                <View style={{flex:1, margin: 20}}>
                  <Text style={{textAlign: 'center'}}>No Devices found!</Text>
                </View>
              }
            
            </View> 
                       
          </ScrollView>
          <FlatList
              data={list}
              renderItem={({ item }) => renderItem(item) }
              ItemSeparatorComponent={ItemSeparator}
              keyExtractor={item => item.id}
            />              
        </SafeAreaView>
      </>
    );
  };
  
  const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    topBar: {
      borderTopColor: "#1C1B2A",
      borderTopWidth: 2,
      borderBottomColor: "#1C1B2A",
      borderBottomWidth: 2,
    },
    topBarText: {
      textAlign: 'center',
      color: '#fff', 
      backgroundColor: '#9087D6',
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
  
  export default DisplaySearch;