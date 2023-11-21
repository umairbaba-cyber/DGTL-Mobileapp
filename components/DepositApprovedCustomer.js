import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
//clicking on this will show single deposite detail
export default function DepositApprovedByTeller({ navigation, item, index }) {
    console.log('item ----', item);
    const [data, setData] = useState();
    const isFouced = useIsFocused();

    useEffect(() => {
        const arr = item.filter((e) => e.ScannedByTeller === true);
        setData(arr);
    }, [isFouced])

    const getIndex = (id) => {
        const index = item.findIndex((e) => e._id === id);
        if (index !== -1) {
            return index;
        } else {
            console.log(`Object with id ${id} not found in your data`);
            return 0;
        }
    }

    return (
        <FlatList
            data={data}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item)=> item._id.toString()}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    keyExtractor={(item,) => String(item)}

                    style={{  }}

                    onPress={() => navigation.navigate('CustomerViewDepositDetail', { selectedItem: getIndex(item._id), detail: 'Monthly' })}
                >

                    <View style={styles.singleDepositContainer}>
                        {item.ScannedByTeller ?
                            <>
                                <Image style={styles.imageStyle} source={require('../assets/dgtl_app_completed.png')} />

                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ ...styles.text1, fontWeight: 'bold', color: item.ScannedByTeller ? '#000' : '#FBCD2A' }}>{item.total.value.toFixed(2)}</Text>
                                    <Text style={{ ...styles.text2, color: item.ScannedByTeller ? '#000' : '#FBCD2A' }}>Deposited on {moment(item.createdAt).format('YYYY/MM/DD')}, {new Date(item.createdAt).toLocaleTimeString()}</Text>
                                </View>
                            </>
                            : <></>}
                    </View>
                    <View style={{backgroundColor: '#D3D3D3', height: 1, marginTop: 18, marginBottom: 18}}></View>
                </TouchableOpacity>

            )}
        />

    );

}

const styles = StyleSheet.create({
    singleDepositContainer: {
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
    // }
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

