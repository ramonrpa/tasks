import React, { Component } from 'react'
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    StatusBar
} from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'

import { server, showError, showSuccess } from '../common'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showError: false,
    errorMessage: '',
    stageNew: false
}

export default class Auth extends Component {

    state = { ...initialState }

    signinOrsignup = _ => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            })

            showSuccess('Usuário cadastrado!')
            this.setState({ ...initialState })
        } catch (e) {
            if (e.response && e.response.data && e.response.data.detail && e.response.data.detail.startsWith("Key (email)=(")) this.setState({ showError: true, errorMessage: 'E-mail já existente!' })
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password,
            })

            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home', res.data)
        } catch (e) {
            if (e.response && e.response.data) this.setState({ showError: true, errorMessage: e.response.data })
        }
    }

    validateEmail = _ => {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.state.email)
    }

    render() {
        const validations = []
        validations.push(this.state.email && this.validateEmail())
        validations.push(this.state.password && this.state.password.length >= 6)

        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 4)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce((t, a) => t && a)

        return (
            <ImageBackground source={backgroundImage}
                style={styles.background}>
                <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />
                <View style={styles.container}>
                    <Text style={styles.title}>Tarefas</Text>
                    <View style={styles.formContainer}>
                        <Text style={styles.subtitle}>
                            {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                        </Text>
                        {this.state.stageNew &&
                            <AuthInput icon='user' placeholder='Nome'
                                value={this.state.name}
                                style={styles.input}
                                onChangeText={name => this.setState({ name })} />
                        }
                        <AuthInput icon='at' placeholder='E-mail'
                            value={this.state.email}
                            style={styles.input}
                            onChangeText={email => this.setState({ email })} />
                        <AuthInput icon='lock' placeholder='Senha'
                            value={this.state.password} showError={!this.state.stageNew ? this.state.showError : null}
                            errorMessage={!this.state.stageNew ? this.state.errorMessage : null}
                            style={styles.input} secureTextEntry={true}
                            onChangeText={password => this.setState({ password })} />
                        {this.state.stageNew &&
                            <AuthInput icon='lock'
                                placeholder='Confirmação de Senha'
                                value={this.state.confirmPassword} showError={this.state.showError}
                                errorMessage={this.state.errorMessage}
                                style={styles.input} secureTextEntry={true}
                                onChangeText={confirmPassword => this.setState({ confirmPassword })} />
                        }
                        <TouchableOpacity onPress={this.signinOrsignup}
                            disabled={!validForm}>
                            <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                                <Text style={styles.buttonText}>
                                    {this.state.stageNew ? 'Registrar' : 'Entrar'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ padding: 10 }}
                        onPress={() => this.setState({ stageNew: !this.state.stageNew, showError: null })}>
                        <Text style={styles.buttonText}>
                            {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }

}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        padding: 20,
        width: '90%',
        borderRadius: 5
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 10
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})