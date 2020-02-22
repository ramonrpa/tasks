import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { HelperText } from 'react-native-paper'

export default props => {
    return (
        <View style={{alignItems: 'center'}}>
            <View style={[styles.container, props.style]}>
                <Icon name={props.icon} size={20} style={styles.icon} />
                <TextInput {...props} style={styles.input} />
            </View>
            {props.showError &&
                <HelperText
                    type="error"
                    style={{color: '#F00'}}
                    visible={props.showError}>
                    Error: {props.errorMessage}
                </HelperText>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        color: '#333',
        marginLeft: 20
    },
    input: {
        marginLeft: 20,
        width: '70%'
    }
})