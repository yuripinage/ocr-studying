import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import TestOCR from './TestOCR'
// import RNCameraScreen from './RNCameraScreen'

export default class App extends Component {
    render() {
        console.disableYellowBox = true
        return (
            <View style={styles.container}>
                <TestOCR />
                {/* <RNCameraScreen /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
