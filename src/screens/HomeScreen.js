//HomeScreen.js react-native component

import React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {

    const styles = StyleSheet.create({
            
            container: {
    
                flex: 1,
    
                alignItems: 'center',
    
                justifyContent: 'center',
    
            },
    
            textStyle: {
    
                fontSize: 20,
    
                marginBottom: 20,
    
            },
    
        });

    return (

        <View style={styles.container}>

            <Text style={styles.textStyle}>Home Screen</Text>

            <Button

                title="Go to Game Screen"

                onPress={() => navigation.navigate('GameScreen')}

            />

        </View>
    );

}

export default HomeScreen;