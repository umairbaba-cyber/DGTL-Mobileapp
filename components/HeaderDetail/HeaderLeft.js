import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions'
import { useDispatch, useSelector } from 'react-redux';

//it is component which is used to scan qrcode 
export default function BarCodeScan({}) {
    const users = useSelector(state =>state?.Main?.User);
    const companyImg = users?.data?.company?.image
    // console.log('this is user redux',users)

    return (
        <View style={styles.logoContainerStyle}>
            <Image 
            style={{width:60,height:60,resizeMode:'cover',borderRadius:10,marginLeft:10}} 
            source={{uri: companyImg }}/>

            {/* <Image style={{width:100,height:50,resizeMode:'contain'}} source={require('../../assets/LeftHeaderImage.png')}/> */}
        </View>
    );

}

const styles = StyleSheet.create({

    logoContainerStyle: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        height: responsiveHeight(8)

    },
    logoStyle: {
        width: 50,
        height: 40,
        borderRadius: 100,
        backgroundColor: '#000'
    },
    logoTextStyle: {
        fontWeight: '900',
        marginLeft: 10,
        color: '#000',
    },



})