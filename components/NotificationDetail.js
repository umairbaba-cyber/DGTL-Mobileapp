import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
const NotificationDetail = ({ item, navigation, index }) => {

    // console.log('notification item data',item)
    return (
        <TouchableOpacity
            onPress={item.type == "newBagRequested" ? () => Linking.openURL("https://clients.digitaldeposits.app/") : item.title == "New QR codes generated" ? null : () => navigation.navigate('NotifiDetail', { item, index })}
            key={item.key}
            style={styles.notificationContainer}>
            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{ width: 50 }}>
                    {item.type == "newBagRequested" ?
                        <Image source={require('../assets/money-bag-3.png')} style={styles.notificationImage} />
                        :
                        <Image source={require('../assets/approved.png')} style={styles.notificationImage} />
                    }
                </View>
                <View style={styles.notificationBodyContainer} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        <Text style={styles.notificationTitle}>{new Date(item.updatedAt).toDateString()}</Text>
                    </View>
                    <Text style={styles.notificationDescription}>{item.body}</Text>
                </View>
            </View>
            <View style={{ backgroundColor: '#D3D3D3', height: 1, marginTop: 18, marginBottom: 5 }}></View>
        </TouchableOpacity>
    );

}
const styles = StyleSheet.create({
    notificationContainer: {
        margin:10,
        // flexDirection: 'row',

    },
    notificationBodyContainer: {
        // marginLeft: responsiveWidth(3),
        // bottom: responsiveHeight(0.6),
    },
    notificationImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    notificationTitle: {
        fontSize: responsiveFontSize(1.6),
        color: '#000',
        fontWeight: '700'
    },
    notificationDescription: {
        flexWrap: 'wrap',
        width: responsiveWidth(2),
        textAlign: 'justify',
        width: responsiveScreenWidth(70),
        color: '#000'
    }
})
export default NotificationDetail;
