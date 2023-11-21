import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomHeader from '../../components/CustomHeader';
import NotificationDetail from '../../components/NotificationDetail';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BasePath from '../../config/BasePath';




export default function Notifications({ navigation }) {
    //used to show notification to user [array]
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        GetNotifications()
    }, [])
    //a function to get notification for  latest database
    async function GetNotifications() {
        let usertoken = await AsyncStorage.getItem('token')

        axios.get(
            BasePath+'listOfNotifications',
            {
                params: {
                    x_auth: usertoken
                }
            }
        ).then(
            (res) => {
              
                const { code, data } = res.data
                console.log('notification api data',data)
                if (code == 200) {
                    console.log('Notification',data.getNotifications)
                    setNotifications(data.getNotifications)

                } else {
                    alert('Error while getting data')
                }
            }
        ).catch(e => console.log(e));
    }

    console.log('notifications ---',JSON.stringify(notifications));
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'}/>
            <View style={{ marginHorizontal: responsiveScreenWidth(4) }}>
            <CustomHeader name={'Notifications'} navigation={navigation}/>
               
            </View>

            {notifications?.length < 1 ?
                <View style={styles.noNotificationContainer}>
                    <Text style={{color:'#000'}}>No Notification </Text>
                    <ActivityIndicator color={'#000'}/>
                </View> :

                <FlatList
                    data={notifications.reverse()}
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1, marginTop: 20}}
                    renderItem={({ item, index, separators }) => (
                        <NotificationDetail item={item} navigation={navigation} index={index}/>

                    )}
                />
            }
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    noNotificationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    notificationImage: {
        width: responsiveScreenWidth(6),
        height: responsiveHeight(6),
        resizeMode: 'contain',
        // margin: responsiveWidth(4)
    },
    notificationTitle: {
        margin: 5,
        fontSize: responsiveFontSize(4),
        color: 'green'
    },
    notificationDescription: {
        flexWrap: 'wrap',
        textAlign: 'justify',
        width: responsiveScreenWidth(80)
    }
})

const data = [

    { title: 'Bag Request', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rhoncus felis non ullamcorper porta. Pellentesque id est in urna porttitor commodo. Fusce dictum lacus massa, et lobortis massa dapibus sed. ', key: 'item1', status: 0 },
    { title: 'Deposit Alert ,Nov 13', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rhoncus felis non ullamcorper porta.Vivamus vitae finibus massa. ', key: 'item1', status: 1 },
    { title: 'Deposit Alert , Nov 15', message: ' Pellentesque id est in urna porttitor commodo. Fusce dictum lacus massa, et lobortis massa dapibus sed. Sed bibendum sit amet erat eu suscipit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus vitae finibus massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rhoncus felis non ullamcorper porta.', key: 'item1', status: 1 },

]
