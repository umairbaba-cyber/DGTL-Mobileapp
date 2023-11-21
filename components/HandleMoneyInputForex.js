import React, { Component,useState } from 'react';
import {StyleSheet, View, Text,TextInput,Image } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';

export default function HandleMoneyInput({ currency,name,ApiToHit,onChangeEQV,onChangeAmount}) {
    const [value,setValue]=useState('')
   
    return (
        <View style={ styles.Container}>
            <Text style={styles.currencyName}>{currency}</Text>
            {/* <Image style={styles.imageStyle} source={require('../assets/Arrowgray.png')} /> */}
            <TextInput keyboardType='decimal-pad' onChangeText={(t)=>onChangeAmount(t)} style={styles.inputStyle} />
            <TextInput keyboardType='decimal-pad' onChangeText={(t)=>onChangeEQV(t)} style={styles.inputStyle} />
            
            
        
        </View>
    );

}

const styles=StyleSheet.create({
    Container:{
        flexDirection: 'row',
        marginVertical:responsiveHeight( 2),
         justifyContent: 'space-around',
         alignItems:'center'
    },
    currencyName:{
        width:70,
        color:'#000',
        fontWeight:'700',
        fontSize:responsiveFontSize(2.1)
    },
    inputStyle:{
         textAlign:'center',
         backgroundColor: '#d3d3d3',
         width:responsiveScreenWidth( 30),
         color:'#000', 
         height:responsiveHeight(5)
    },
    imageStyle: {
        height: responsiveHeight(8),
        width: responsiveScreenWidth(8),
        resizeMode: 'contain'

    },
})