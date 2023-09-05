import React, { Component } from 'react';
import {StyleSheet, View, Text,TextInput,Image, Platform } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';

//it takes name and return a callback function from textinput 
//Entered text a call back which return whatever user has entered
export default function HandleMoneyInput({ name,onChangeText}) {
    function CheckNumber(text){
        if(isNaN(text)){
            alert('Enter a Valid amount')
        }else{
            onChangeText(text)
        }
    }
    return (
        <View style={ styles.Container}>
            <Text style={styles.amountName}>{name}</Text>
            <Image style={styles.imageStyle} source={require('../assets/rightarrow.png')} />
            <TextInput keyboardType='decimal-pad' onChangeText={(text)=>{CheckNumber(text),console.log(text)}} style={styles.inputStyle} />
        </View>
    );

}

const styles=StyleSheet.create({
    Container:{
        flexDirection: 'row',
        marginVertical:responsiveHeight( 0.5),
         justifyContent: 'space-between',
         marginHorizontal:responsiveWidth(5),
         alignItems:'center',
         
         
    },
    amountName:{
        width:90,
        color:'#000',
        fontWeight:'700',
        fontSize:responsiveFontSize(2.1)
    },
    inputStyle:{
         textAlign:'center',
         color:'#000',
         backgroundColor: '#d3d3d3',
         width:responsiveScreenWidth( 30),
         height:responsiveScreenHeight(5)
    },
    imageStyle: {
        height: responsiveHeight(8),
        width: responsiveScreenWidth(8),
        resizeMode: 'contain'

    },
})