import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { responsiveFontSize, responsiveHeight, responsiveWidth, } from 'react-native-responsive-dimensions';
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { validateEmail } from '../../validations/validation';
import BasePath from '../../config/BasePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { GetUserData } from '../../redux/Action';

export default function SetPinScreen({ navigation, route }) {
    const {
        data,
        screen,
    } = route.params;

    const [pin, setPin] = useState('')
    const [showPin, setShowPin] = useState(false)
    const [confirmPin, setConfirmPin] = useState('')
    const [showConfirmPin, setShowConfirmPin] = useState(false)
    const [alreadySavedPin, setAlreadySavePin] = useState(0)
    const [isForgetVisible, setForgetVisible] = useState(false)

    const isFocued = useIsFocused();
    const disPatch = useDispatch()
    useEffect(() => {
        getSavedPin();
    }, [isFocued])

    console.log(data);

    const getSavedPin = async () => {
        try {
            const pin = await AsyncStorage.getItem("pinCode");
            const biometric = await AsyncStorage.getItem("biometric");
            const pinInt = Number(pin);
            console.log('savedPin>>>>', pinInt, biometric);
            if (pinInt !== 0) {
                setAlreadySavePin(pinInt)
            }
        } catch (error) {
            console.log('FetchingPinError: ', error);
        }
    }

    async function savePin() {
        try {
            if (pin === confirmPin) {
                AsyncStorage.setItem('pinCode', (pin).toString())
                navigation.goBack();
            } else {
                alert('Your entered pines does not match')
            }
        } catch (error) {
            console.log('SavingPinError: ', error);
        }
    }

    console.log("alreadySavedPin ---->", alreadySavedPin,);

    const login = async () => {
        console.log(pin, alreadySavedPin);
        if (screen === 'login') {
            if (parseInt(pin, 10) === alreadySavedPin) {
                await AsyncStorage.setItem('token', data.data?.token);
                disPatch(GetUserData(data));
                navigation.replace('Home');
            } else {
                alert('Wrong Pin Code!')
                setForgetVisible(true)
            }
        } else {
            if (parseInt(pin, 10) === alreadySavedPin) {
                navigation.replace('Home');
            } else {
                alert('Wrong Pin Code!')
            }
        }
    }

    return (
        <View style={styles.loginContainer}>
            <TouchableOpacity style={{ padding: 10, }} onPress={() => navigation.goBack()}>
                <Image source={require('../../assets/backarrow.png')} style={{ width: 25, height: 18, }} />
            </TouchableOpacity>
            <KeyboardAwareScrollView style={styles.keyboardAvoidingContainer}>
                <View style={styles.headerView}>
                    {alreadySavedPin !== 0 ?
                        <Text style={styles.welcomeText}>Enter Pin to Login</Text>
                        : <Text style={styles.welcomeText}>Set Pin to Login</Text>
                    }
                </View>

                <View>
                    {alreadySavedPin === 0 &&
                        <Text style={{ marginLeft: responsiveWidth(10), color: '#000', fontSize: 15, fontWeight: 'bold' }}>Enter your 4 digit pin.</Text>
                    }
                    <View
                        style={{
                            flexDirection: 'row',
                            borderWidth: 1,
                            marginHorizontal: 40,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '80%',
                            alignSelf: 'center',
                            marginTop: 15,
                        }}>
                        <TextInput
                            value={pin}
                            onChangeText={e => {
                                if (e.length < 5) {
                                    setPin(e)
                                }
                            }}
                            style={styles.inputStyle}
                            placeholderTextColor="#000"
                            placeholder={alreadySavedPin !== 0 ? "Enter your 4 digit pin" : "Enter Pin Code"}
                            keyboardType='number-pad'
                            secureTextEntry={showPin ? false : true}
                        />
                        <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                            <Image
                                source={
                                    showPin
                                        ? require('../../assets/dgtl_app_showpassword.png')
                                        : require('../../assets/dgtl_app_hidepassword.png')
                                }
                                style={{
                                    width: 20,
                                    height: 20,
                                    marginRight: 10,
                                    tintColor: 'black',
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>

                    {alreadySavedPin === 0 &&
                        <View
                            style={{
                                flexDirection: 'row',
                                borderWidth: 1,
                                marginHorizontal: 40,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '80%',
                                marginTop: 15,
                                alignSelf: 'center',
                            }}>
                            <TextInput
                                value={confirmPin}
                                onChangeText={e => {
                                    if (e.length < 5) {
                                        setConfirmPin(e)
                                    }
                                }}
                                style={styles.inputStyle}
                                placeholderTextColor="#000"
                                placeholder="Confirm Pin Code"
                                keyboardType='number-pad'
                                secureTextEntry={showConfirmPin ? false : true}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPin(!showConfirmPin)}>
                                <Image
                                    source={
                                        showConfirmPin
                                            ? require('../../assets/dgtl_app_showpassword.png')
                                            : require('../../assets/dgtl_app_hidepassword.png')
                                    }
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 10,
                                        tintColor: 'black',
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    }

                    {alreadySavedPin !== 0 &&
                        <View style={{ flexDirection: 'row', marginLeft: responsiveWidth(10) }}>
                            <Text
                                style={styles.forgetPin}>Do you want to reset your pin. </Text>
                            <Text
                                style={[styles.forgetPin, { textDecorationLine: 'underline', }]}
                                onPress={() => {
                                    Alert.alert("Alert", "Do you want to remove your pin. Then you will be able to login with your email and password", [
                                        {
                                            text: 'Cancel',
                                            onPress: () => { },
                                        },
                                        {
                                            text: 'OK', onPress: async () => {
                                                await AsyncStorage.removeItem('biometric')
                                                await AsyncStorage.removeItem('pinCode')
                                                navigation.navigate('Login')
                                            }
                                        },
                                    ])
                                }}
                            >Click here</Text>
                        </View>
                    }


                    {
                        alreadySavedPin !== 0 ?
                            <TouchableOpacity
                                onPress={() => login()}
                                style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>Login</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity
                                onPress={() => savePin()}
                                style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>Save</Text>
                            </TouchableOpacity>
                    }
                </View>

            </KeyboardAwareScrollView>
            <Toast position='top' />
        </View>
    );

}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff',

    },
    keyboardAvoidingContainer: {
        flex: 1,
        marginTop: responsiveHeight(20)
    },
    headerView: {
        marginTop: responsiveHeight(5),
        marginBottom: responsiveFontSize(8),
    },
    welcomeText: {
        textAlign: 'center',
        fontSize: responsiveFontSize(2.5),
        color: '#000',
        fontWeight: '900'
    },
    inputStyle: {
        color: 'black',
        width: '80%',
        alignSelf: 'center',
        paddingHorizontal: 10,
        height: 45,
    },
    forgetPin: {
        color: '#000',
        marginTop: responsiveHeight(2),
    },
    loginButtonText: {
        color: '#18193F',
        fontSize: responsiveFontSize(2),
    },
    forgotPasswordText: {
        color: '#3badfb',
        marginLeft: '10%',
        marginTop: responsiveHeight(7)
    },
    loginButton: {
        backgroundColor: '#36C4F1',
        width: '80%',
        height: 45,
        marginTop: responsiveHeight(5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
})
