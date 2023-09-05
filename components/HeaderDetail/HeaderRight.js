import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//it is component which is used to scan qrcode
import { useSelector } from 'react-redux';


export default function HeaderRight({ navigation }) {
    //qrCodeScan is funaction which will scan qrCode and get result if successfull it will send result to next screen else throug error
   
    async function qrCodePressed() {

        navigation.navigate('QrCode')


        // const users = useSelector(state => state.Main.User.data.userData);


        // if (users) {
        //     navigation.navigate('QrCode')


        // }
        // else {
        //     alert('Please Login ')
        // }
    }
    return (
        <TouchableOpacity onPress={() => qrCodePressed()}>
            {/* <Image style={styles.QrCodeImageStyle} source={require('../../assets/qrcode.jpg')} /> */}
            <Image style={styles.QrCodeImageStyle} source={require('../../assets/dgtl_app_qr_top.png')} />

        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({


    QrCodeImageStyle: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginRight: 10,
        borderRadius:5
    }

})