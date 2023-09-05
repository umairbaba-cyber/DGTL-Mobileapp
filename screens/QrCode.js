import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text,TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpdateQrDetail } from '../redux/Action';
import BasePath from '../config/BasePath';


export default function QrCode({ navigation, route }) {
    const [userToken, setUserToekn] = useState('')
    const dispatch = useDispatch()
    const users = useSelector(state => state.Main.User.data?.userData);
    console.log('UU',users)
    useEffect(() => {
        GetToken()
    }, [])
    async function GetToken() {
        let usertoken = await AsyncStorage.getItem('token')
        setUserToekn(usertoken)
    }
    const handleCameraStatus = ({ cameraStatus }) => {
        if (cameraStatus !== 'AUTHORIZED') {
            Alert.alert(
                'Camera Not Authorized',
                'Please grant camera permission to use the QR scanner.',
                [{ text: 'OK', onPress: () => navigation.goBack() }],
                { cancelable: false }
            );
        }
    };


    onSuccess = async (e) => {
        //customer,client,bag

        const data = e.data.split(',')
        const qr_detail = {
            customerID: data[0],
            clientID: data[1],
            bagID: data[2]
        }
        //if qr bag id match with scanned
         // this route.params?.BagID is coming from TellerBagProcessedPending screen inside Deposithistory folder
        if (route.params?.BagID) {
            if (route.params?.BagID != qr_detail.bagID) {
                alert('Bag id does not match')
                return
            } else {

                scanQrCode(qr_detail)
            }

        } else {
         
            scanQrCode(qr_detail)
            //scan code
        }


       


    };

    async function scanQrCode(qr) {
   
        await axios.post(BasePath+'customerScanQR',
            {

                customerID: qr.customerID,
                clientID: qr.clientID,
                bagID: qr.bagID

            }, {
            params: {
                x_auth: userToken
            }
        }
        ).then(res => {
         

            const { data, code } = res.data
           
            let check=data.accountType
            console.log('this is data after qr',data)
       
            dispatch(UpdateQrDetail(data))

            if (code == 200) {
                if ( res.data.data?.accoutType == "customer") {

                    navigation.replace('Deposit')
                } else {
                    navigation.replace('TellerVerifyDeposit')
                }
            } else {

            }

        }).catch((e) => {
            alert(e.response.data.message)
           
        })
    }

    const handleBackButton = () => {
        navigation.goBack(); 
    };

    return (

        <View style={styles.container}>
             
            <QRCodeScanner
                onRead={this.onSuccess}
                flashMode={RNCamera.Constants.FlashMode.torch}
                showMarker={true}
            />
            <TouchableOpacity style={styles.backButton} onPress={()=>handleBackButton()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        </View>

    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: 'blue',
        backgroundColor: 'transparent'
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
        zIndex: 10,
      },
      backButtonText: {
        color: 'black',
        fontSize: 16,
      },
})

