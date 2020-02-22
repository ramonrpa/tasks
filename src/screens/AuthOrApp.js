import React, { Component } from 'react'
import {
    View,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
    PermissionsAndroid
} from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

export default class AuthOrApp extends Component {

    async requestStoragePermission() {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Permissão concedida');
            } else {
                this.requestStoragePermission()
            }
        } catch (err) {
            console.warn("error")
        }
    }

    componentDidMount = async () => {
        const userDataJSON = await AsyncStorage.getItem('userData')
        let userData = null

        try {
            userData = JSON.parse(userDataJSON)
        } catch (e) {
            // userData não é válido
            console.log(e)
        }

        if (userData && userData.token) {
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
            this.props.navigation.navigate('Home', userData)
        } else {
            this.props.navigation.navigate('Auth')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='transparent' translucent barStyle="light-content" />
                <ActivityIndicator size='large' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    }
})