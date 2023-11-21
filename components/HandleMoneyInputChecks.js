import React, { Component } from 'react';
import {StyleSheet, View, Text,TextInput,Image } from 'react-native';
import {  responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

export default function HandleMoneyInput({ handleCheckNo,handleAmount,handleBank}) {

    return (
        <View style={ styles.Container}>
            {/* <Image style={styles.imageStyle} source={require('../assets/Arrowgray.png')} /> */}
            <TextInput onChangeText={(e)=>handleCheckNo(e)} style={styles.inputStyle} />
            <Image style={styles.imageStyle} source={require('../assets/rightarrow.png')} />
            <TextInput keyboardType='default' onChangeText={(e)=>handleBank(e)} style={{...styles.inputStyle,width:80}} />
            <TextInput keyboardType='decimal-pad' onChangeText={(e)=>handleAmount(e)} style={{...styles.inputStyle,width:80}} />

        </View>
    );

}

const styles=StyleSheet.create({
    Container:{
        flexDirection: 'row',
        // marginVertical:responsiveHeight( 2),
         justifyContent: 'space-around',
         alignItems:'center'
    },
    inputStyle:{
        color:'#000',
         textAlign:'center',
         backgroundColor: '#d3d3d3',
         width:responsiveScreenWidth( 30), 
         height:responsiveHeight(5)
    },

    imageStyle: {
        height: 28,
        width: 28,
        marginLeft: responsiveScreenWidth(1),
        // resizeMode: 'contain'

    },
})