import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
//clicking on this will show single deposite detail
export default function CompletedPayment({ navigation, item, index }) {

    if (item.ScannedByTeller)
        return (
            <TouchableOpacity
                keyExtractor={(item, index) => String(index)}
                style={{ marginVertical: 2 }}
                onPress={() => navigation.navigate('TellerViewDepositDetail', { selectedItem: index, status: 'approved',item:item })}>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Image style={styles.imageStyle} source={require('../../../assets/approved.png')} />
                    <View style={{ marginLeft: 10, marginTop: responsiveHeight(0.5) }}>
                        <Text style={{ ...styles.text, fontWeight: 'bold' }}>{item.total.value.toFixed(2)}</Text>
                        <Text style={styles.text}> Deposited on {new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );

}

const styles = StyleSheet.create({
    imageStyle: {
        width: responsiveScreenWidth(8),
        height: responsiveScreenHeight(8),
        resizeMode: 'contain'
    },
    text: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: '600',
        color: '#000'
    }
})

