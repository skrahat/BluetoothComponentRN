import React from 'react'
import { StyleSheet, Text, View, Image, Button } from 'react-native'
import MainPage from "./MainPage";
import { createStackNavigator } from '@react-navigation/stack';

//initial function which starts as the first display
function StartPage({ navigation }) {
    //timer which automatically navigates to main page after 3 seconds 
    setTimeout(() => {
        handleClick();
        }, 3000);

    const handleClick  = () => {
        navigation.navigate('MainPage', { name: 'MainPage' })
    }
    //returns UI with my01 icon and button
    return (
        <View style={styles.container}>
            <Image 
                style={styles.imageStyle}
                source={require("./images/my01_icon.jpg")} />
            <Button
                title="continue"
                onPress={() => 
                    handleClick()
                }
                >
            </Button>
            
        </View>
    );
}

//styles
const styles = StyleSheet.create({
    imageStyle: {
        width: 200, 
        height: 100,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
})

export default StartPage;
