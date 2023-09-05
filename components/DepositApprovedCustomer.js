import React, { Component } from 'react';
import { StyleSheet,View,FlatList, Text,Image,TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
//clicking on this will show single deposite detail
export default function DepositApprovedByTeller({navigation,item,index }) {



    return (
        
        
        <FlatList
            data={item}
           
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    keyExtractor={(item,) => String(item)}

                    style={{ marginVertical: 2 }}

                    onPress={() => navigation.navigate('CustomerViewDepositDetail', { selectedItem: index,detail:'Monthly' })}
                >
                   
                    <View style={styles.singleDepositContainer}>
                        {item.ScannedByTeller?
                        <>
                        <Image style={styles.imageStyle} source={require('../assets/dgtl_app_completed.png')} />
                       
                        
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{...styles.text,fontWeight:'700',color:item.ScannedByTeller?'#000':'#FBCD2A'}}>{item.total.value.toFixed(2)}</Text>
                            <Text style={{...styles.text,color:item.ScannedByTeller?'#000':'#FBCD2A'}}> Deposited on {new Date(item.createdAt).toLocaleDateString()},{new Date(item.createdAt).toLocaleTimeString()}</Text>
                        </View>
                        </>
                        :<></>}
                    </View>
                </TouchableOpacity>

            )}
        />

    );

}

const styles=StyleSheet.create({
    singleDepositContainer:{
         flexDirection: 'row', 
         alignItems: 'center' 
    },
    imageStyle: {
        width: responsiveScreenWidth(10),
        height: responsiveScreenHeight(10),
        resizeMode: 'contain'
    },
    text: {
        fontSize: responsiveFontSize(1.6),
       
        color: '#000'
    }
})

