import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
//clicking on this will show single deposite detail
export default function CompletedPayment({ navigation, item, index }) {

    if (item.ScannedBySecondSupervisor)
        return (
            <TouchableOpacity
                keyExtractor={(item, index) => String(index)}
                style={{ marginVertical: 2 }}
                onPress={() => navigation.navigate('TellerViewDepositDetail', { selectedItem: index, status: 'approved',item:item })}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={styles.imageStyle} source={require('../../../assets/approved.png')} />
                    <View style={{ marginLeft: 10, marginTop: responsiveHeight(0.5) }}>
                        <Text style={{ ...styles.text1, fontWeight: 'bold' }}>{item.total.value.toFixed(2)}</Text>
                        <Text style={styles.text2}>Deposited on {moment(item.createdAt).format("YYYY/MM/DD")}</Text>
                    </View>
                </View>
                <View style={{backgroundColor: '#D3D3D3', height: 1, marginTop: 18, marginBottom: 18}}></View>
            </TouchableOpacity>
        );

}

const styles = StyleSheet.create({
    imageStyle: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },
    text1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    text2: {
        color: '#36454f'
    }
})

