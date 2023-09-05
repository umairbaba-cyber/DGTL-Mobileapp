//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import EditTextInput from './BottomTabs/screens/Settings/components/EditTextInput';
import UserRole from './BottomTabs/screens/Settings/components/UserRole';
import Toast from 'react-native-toast-message'
import axios from 'axios';
import BasePath from '../config/BasePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// create a component
const ChangePassword = ({ navigation }) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [show, setShow] = useState(true)
    const [show1, setShow1] = useState(true)

    const onChagePassword = async () => {
        try {
            if(oldPassword && newPassword && confirmPassword ){
                if(newPassword == confirmPassword){

                       const token = await AsyncStorage.getItem('token')
            const body = {
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            }
            console.log('body', body)
            const response = await axios.post(BasePath + 'changePassword', body, {
                params: {
                    x_auth: token
                }
            })
            console.log('change password api response', response.data)
            Toast.show({
                type: 'success',
                text1: response.data.message
            });
            setTimeout(() => {
                navigation.goBack()
            }, 1000);

                }else{
                    Toast.show({
                        type: 'error',
                        text1: "New and Confirm Password doesn't match"
                    });
                }

            }else{
                Toast.show({
                    type: 'error',
                    text1: 'All fields are required'
                });
            }

        } catch (error) {
            if (error.response) {
                Toast.show({
                    type: 'error',
                    text1: error.response.data.message
                });
                console.log('error during changePassword api call', error.response.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'An error occurred while processing your request.',
                });
                console.log('error during changePassword api call', error);
            }
        }
    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Text style={{ fontWeight: '700', color: '#000', marginVertical: responsiveHeight(6), textAlign: 'center', fontSize: responsiveFontSize(2.3) }}>Change Password</Text>
            {/* <EditTextInput keybordType={'numeric-pad'} editabel={true} empty="Enter Old Password"  />
            <EditTextInput keybordType='numeric-pad' editabel={false} empty="Enter New Password"  /> */}
            <TextInput
                placeholder='Old Password'
                placeholderTextColor={'grey'}
                style={styles.inputStyleOld}
                onChangeText={(val) => setOldPassword(val)} />
            <View style={{ flexDirection: "row", borderWidth: 1, marginHorizontal: 40, justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                <TextInput
                    onChangeText={(e) => setNewPassword(e)}
                    style={styles.inputStyle}
                    placeholderTextColor='grey'
                    placeholder='New Password ( i.e JohnDev123# )'
                    secureTextEntry={show ? true : false} />
                <TouchableOpacity onPress={() => setShow(!show)}>
                    <Image source={show ? require('../assets/dgtl_app_hidepassword.png') : require('../assets/dgtl_app_showpassword.png')}
                        style={{ width: 20, height: 20, marginRight: 10, tintColor: 'black' }}
                        resizeMode='contain' />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", borderWidth: 1, marginHorizontal: 40, justifyContent: "space-between", alignItems: "center" }}>
                <TextInput
                    onChangeText={(e) => setConfirmPassword(e)}
                    style={styles.inputStyle}
                    placeholderTextColor='grey'
                    placeholder='Confirm password'
                    secureTextEntry={show1 ? true : false} />
                <TouchableOpacity onPress={() => setShow1(!show1)}>
                    <Image source={show1 ? require('../assets/dgtl_app_hidepassword.png') : require('../assets/dgtl_app_showpassword.png')}
                        style={{ width: 20, height: 20, marginRight: 10, tintColor: 'black' }}
                        resizeMode='contain' />
                </TouchableOpacity>
            </View>
            {/* <TextInput
                placeholder='New Password'
                placeholderTextColor={'#000'}
                style={styles.inputStyle}
                onChangeText={(val)=> setNewPassword(val)} />
            <TextInput
                placeholder='Confirm Password'
                placeholderTextColor={'#000'}
                style={styles.inputStyle}
                onChangeText={(val)=> setConfirmPassword(val)} /> */}

            <TouchableOpacity onPress={() => onChagePassword()} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>
            <Toast position='top' />
        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    changePasswordBtn: {
        backgroundColor: '#fff',
        width: '90%',
        height: 45,
        elevation: 3,
        shadowOpacity: 0.3,
        shadowOffset: { width: 1, height: 1 },
        marginVertical: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    inputStyleOld: {
        borderWidth: 1,
        width: '80%',
        height: 45,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: responsiveHeight(5),
        color: "black"
    },
    inputStyle: {

        color: "black",
        width: '80%',
        alignSelf: 'center',
        paddingHorizontal: 10,
        height: 45,
        // marginBottom: responsiveHeight(3)
    },
    loginButton: {
        backgroundColor: '#36C4F1',
        width: '80%',
        height: 45,
        marginTop: responsiveHeight(3.5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

    },
    loginButtonText: {
        color: '#18193F',
        fontSize: responsiveFontSize(2)
    },
})


//make this component available to the app
export default ChangePassword;
