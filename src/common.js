import { Alert } from 'react-native'

const server = 'http://localhost:3000'

function showError(err) {
    if (err.response && err.response.data) Alert.alert('Ops! Ocorreu um Problema!',  `${err.response.data}`)
}

function showSuccess(msg) {
    Alert.alert('Sucesso!', msg)
}

export { server, showError, showSuccess}