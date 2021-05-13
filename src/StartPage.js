import React from 'react'
import { StyleSheet, Text, View, Image, Button } from 'react-native'
import MainPage from "./MainPage";
import { createStackNavigator } from '@react-navigation/stack';
function StartPage(navigation ) {

    const handleClick  = () => {
        return <MainPage/>
    }
    
    return (
        <View style={styles.container}>
            <Image 
                style={{width: 200, height: 100, }}
                source={require("./images/my01_icon.jpg")} />
            <Button
                title="Enter"
                onPress={() => navigation.push('MainPage')}
                >
            </Button>
            
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
})

export default StartPage;
