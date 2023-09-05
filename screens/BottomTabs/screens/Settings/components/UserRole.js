import React, { Component, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export default function UserRole({ role }) {

    return (
        <View style={{ marginLeft: responsiveWidth(10) }}>
            <Text style={styles.loggedinTxt}>Logged in as </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(2) }}>
                <View style={{ backgroundColor: '#d3d3d3', borderRadius: 100, width: 20, height: 20 }} />
                <Text style={{ marginLeft: responsiveWidth(4), fontSize: responsiveFontSize(2.3), color: '#000', fontWeight: '600' }}> {role == 'customer' ? 'Customer' : 'Teller/Supervisor'}</Text>
            </View>


        </View>
    );

}

const styles = StyleSheet.create({

    container:{
        marginLeft: responsiveWidth(10) 
    },
    loggedinTxt:{
        fontSize: responsiveFontSize(2.3), 
        fontWeight: '700', 
        color: '#000'
    }
})
