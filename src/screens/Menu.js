import React, { Component } from 'react'
import { ImageBackground, View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity, Linking, ScrollView } from 'react-native'
import { Gravatar } from 'react-native-gravatar'
import { Button, List } from 'react-native-paper'

import commonStyles from '../commonStyles'

import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'


export default class Menu extends Component {

    state = {
        expanded: false
    }

    handlePress = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        this.props.navigation.navigate('AuthOrApp')
    }

    getColor = () => {
        switch (this.props.activeItemKey) {
            case 'Today': return commonStyles.colors.today
            case 'Tomorrow': return commonStyles.colors.tomorrow
            case 'Week': return commonStyles.colors.week
            default: return commonStyles.colors.month
        }
    }

    getImage = () => {
        switch (this.props.activeItemKey) {
            case 'Today': return todayImage
            case 'Tomorrow': return tomorrowImage
            case 'Week': return weekImage
            default: return monthImage
        }
    }

    changeScreen = screenName => {
        this.props.navigation.navigate(screenName)
        this.setState({ expanded: false })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={this.getImage()} style={styles.header}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://br.gravatar.com').catch((err) => console.error(err))}>
                        <Gravatar style={styles.avatar}
                            options={{
                                email: this.props.navigation.getParam('email'),
                                secure: true
                            }} />
                    </TouchableOpacity>
                    <View style={styles.userInfo}>
                        <Text adjustsFontSizeToFit={true} style={styles.name}>
                            {this.props.navigation.getParam('name')}
                        </Text>
                        <Text adjustsFontSizeToFit={true} style={styles.email}>
                            {this.props.navigation.getParam('email')}
                        </Text>
                    </View>
                </ImageBackground>
                <View style={{ flex: 7 }}>
                    <ScrollView>
                        <List.Accordion
                            title="Período"
                            left={props => <List.Icon {...props} color={this.state.expanded ? this.getColor() : '#444'} icon="calendar-today" />}
                            titleStyle={{ color: this.state.expanded ? this.getColor() : '#444' }}
                            expanded={this.state.expanded}
                            onPress={this.handlePress}
                        >
                            <List.Item title="Hoje" onPress={() => this.changeScreen('Today')} />
                            <List.Item title="Amanhã" onPress={() => this.changeScreen('Tomorrow')} />
                            <List.Item title="Semana" onPress={() => this.changeScreen('Week')} />
                            <List.Item title="Mês" onPress={() => this.changeScreen('Month')} />
                        </List.Accordion>
                    </ScrollView>
                </View>
                <Button icon="logout" mode="contained"
                    style={[styles.logoutIcon, { backgroundColor: this.getColor() }]}
                    onPress={this.logout}>
                    SAIR
                </Button>
            </View >
        )
    }

}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flex: 3,
        paddingTop: Platform.OS === 'ios' ? 70 : StatusBar.currentHeight + 30,
    },
    avatar: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderRadius: 35,
        borderColor: '#ddd',
        margin: 10,
        backgroundColor: '#222',
    },
    userInfo: {
        marginLeft: 10,
    },
    name: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: '#fff',
        marginBottom: 5
    },
    email: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: '#ddd',
    },
    logoutIcon: {
        flex: 1,
        position: 'absolute',
        borderRadius: 5,
        bottom: 10,
        left: 10,
        backgroundColor: '#000'
    },
    logoutText: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFF'
    }
})