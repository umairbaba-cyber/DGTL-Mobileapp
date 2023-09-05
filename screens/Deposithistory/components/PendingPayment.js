import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { useSelector } from 'react-redux';
//clicking on this will show single deposite detail
export default function PendingPayment({ navigation, item, index, }) {
    const abbrevation = useSelector(state =>state?.Main?.User?.data?.company?.abbrevation);
    // console.log('abrevation',abbrevation)
    if (item.ScannedByTeller) {
        return <>

        </>
    } else

        return (
            <TouchableOpacity keyExtractor={(item, index) => String(index)} style={{ marginVertical: 2 }} onPress={() => navigation.navigate('TellerViewDepositDetailThisMonth', { selectedItem: index, status: 'pending',item })}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.imageStyle} source={require('../../../assets/pending.png')} /> 
                    <View style={{ marginLeft: 10, marginTop: responsiveHeight(3) }}>
                        <Text style={{ ...styles.text, fontWeight: 'bold' }}>BAG ID:<Text style={{ fontWeight: '400' }}> {abbrevation.concat(item.bagID.slice(item.bagID.length - 10 + abbrevation.length, item.bagID.length))} </Text></Text>
                        <Text style={{ ...styles.text, fontWeight: 'bold' }}>CUSTOMER ID:<Text style={{ fontWeight: '400' }}> {(item?.customer_details[0]?.name)}</Text></Text>
                        <Text style={{ color: '#FBCD2A' }}>Submitted on {new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );

}

const styles = StyleSheet.create({
    imageStyle: {
        width: responsiveScreenWidth(10),
        height: responsiveScreenHeight(10),
        resizeMode: 'contain'
    },
    text: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: '600',
        color: '#000'
    }
})

