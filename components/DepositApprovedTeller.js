import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet,View,FlatList, Text,Image,TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
//clicking on this will show single deposite detail
export default function DepositApprovedByTeller({navigation,item,index, route }) {
    
    return (
        
        
        <FlatList
            data={item}
            showsVerticalScrollIndicator={false}
           style={{flex: 1}}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    keyExtractor={(item,) => String(item)}

                    style={{ }}

                    onPress={() => navigation.navigate('TellerViewDepositDetailThisMonth', { selectedItem: index,status:'approved',item:item })}
                >
                   
                    <View style={styles.singleDepositContainer}>
                        {item.ScannedBySecondSupervisor?
                        <>
                        <Image style={styles.imageStyle} source={require('../assets/approved.png')} />
                       
                        
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{...styles.text1,fontWeight:'700',color:item.ScannedByTeller?'#000':'#FBCD2A'}}>{item.total.value.toFixed(2)}</Text>
                            <Text style={{...styles.text2,color:item.ScannedByTeller?'#000':'#FBCD2A'}}>Deposited on {moment(item.createdAt).format("YYYY/MM/DD")}, {new Date(item.createdAt).toLocaleTimeString()}</Text>
                        </View>
                        </>
                        :<></>}
                    </View>
                    <View style={{backgroundColor: '#D3D3D3', height: 1, marginTop: 18, marginBottom: 18}}></View>
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
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },
    // text: {
    //     fontSize: responsiveFontSize(1.6),
       
    //     color: '#000'
    // },
    text1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000'
    },
    text2: {
        fontSize: 13,
        color: '#36454f',
        marginTop: 2
    },
})

