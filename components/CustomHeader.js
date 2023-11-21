import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
//Custom header it take navigation option, header name 
export default function CustomHeader({ navigation, name }) {
    return (

        <View style={styles.bioContainer}>
            <TouchableOpacity onPress={() => navigation.goBack(null)}>
                <Image style={styles.Notification} source={require('../assets/left.png')} />
            </TouchableOpacity>
            <Text style={styles.nameText}>{name}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                <Image style={styles.Notification} source={require('../assets/notified.png')} />
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    bioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    Notification: {
        height: responsiveHeight(8),
        width: responsiveScreenWidth(8),
        resizeMode: 'contain'

    },
    nameText: {
        fontSize: responsiveFontSize(2),
        fontWeight: '700',
        color: '#000'
    },
}
)
