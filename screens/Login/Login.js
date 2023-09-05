import React, { useEffect, useState } from 'react';
import { StyleSheet, Linking, View, TouchableOpacity, Text, TextInput, Image, ActivityIndicator ,useWindowDimensions} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail, validatePassword } from '../../validations/validation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { GET_USER_DATA } from '../../redux/constant'


import { GetUserData } from '../../redux/Action'
import BasePath from '../../config/BasePath';
export default function Login({ navigation }) {
    //for editing user email
    const [email, setEmail] = useState('1NBSupervisor@iicdev.com')
    //for editing password 
    const [password, setPassword] = useState('1NBSupervisor1')
    //an indicator to show if state loading  is not completed
    const [isLoading, setIsLoading] = useState(false)
    const [show ,setShow] = useState(true)
    

    const disPatch = useDispatch()

    //this function will be called if user want to login
    async function Login() {

        //validateEmail
        //this function will check if user email is valid or nor
        if (validateEmail(email)) {
            //validate password
            //this function will check if user has entered password according to validation 
            if (validatePassword(password)) {

                setIsLoading(true)

                await axios.post(BasePath + 'login',
                    {
                        email: email,
                        password: password,
                    }
                ).then(res => {
                    console.log('res login', res.data.data.company.FXAllowed)

                    if (res?.data?.code == 200) {
                        console.log('code avail')

                     AsyncStorage.setItem('token', res?.data?.data?.token)

                        //GetUserData
                        //this function will store user login info 
                        disPatch(GetUserData(res.data))
                        navigation.replace('Home')
                    } else {
                        setIsLoading(false)
                        alert('Something went wrong error' + res.data.code)
                    }
                }).catch((e) => {
                    console.log(e)

                    alert('Error ' + 'invalid Credential')
                })
            } else {
                alert('Enter Valid Password')
                setIsLoading(false)
                return
            }
        } else {
            alert('Enter Valid Email')
            setIsLoading(false)


        }

        setIsLoading(false)
    }

    function forgotPassword() {
        navigation.navigate('ForgotPassword')
    }

    const windowDimesions = useWindowDimensions()
    const isTablet = windowDimesions.width >= 600
    return (
        <View style={styles.loginContainer}>
            <KeyboardAwareScrollView style={styles.keyboardAvoidContainer}>
                <View>
                    <Image style={styles.imageStyle} source={require('../../src/assets/images/login.png')} />
                </View>
                <View>
                    <Text style={{ marginBottom: 8, marginLeft: responsiveWidth(10),color:"grey" }}>Email</Text>
                    <TextInput onChangeText={(e) => setEmail(e)} style={styles.inputStyleEmail} placeholderTextColor='#000' placeholder='Enter email address' />
                    <Text style={{ marginBottom: 8, marginLeft: responsiveWidth(10),color:"grey" }}>Password</Text>
                <View style={{flexDirection:"row",borderWidth:1,marginHorizontal:40,justifyContent:"space-between",alignItems:"center",width:"80%",alignSelf:"center"}}>
                <TextInput
                        onChangeText={(e) => setPassword(e)}
                        style={styles.inputStyle}
                        placeholderTextColor='#000'
                        placeholder='Enter password'
                        secureTextEntry={show ? true : false} />
                        <TouchableOpacity onPress={()=> setShow(!show)}>
                        <Image source={show ? require('../../assets/dgtl_app_hidepassword.png') :require('../../assets/dgtl_app_showpassword.png') }
                        style={{width:20,height:20,marginRight:10,tintColor:'black'}}
                        resizeMode='contain'/>
                        </TouchableOpacity>         
                </View>
                  
                    {isLoading ?
                        <ActivityIndicator /> :
                        //  Login()
                        <TouchableOpacity onPress={() => Login()} style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    }

                    <TouchableOpacity onPress={() => forgotPassword()}>
                        <Text style={[styles.forgotPasswordText,{fontSize: isTablet ? responsiveFontSize(1.5) : responsiveFontSize(1.9)}]}>Forgot Password ?</Text>
                    </TouchableOpacity>
                    <Text onPress={() => Linking.openURL('https://digitaldeposits.app/privacy')} style={[styles.privacyText,{fontSize: isTablet ? responsiveFontSize(1.5): responsiveFontSize(1.9)}]}>Privacy</Text>

                </View>
            </KeyboardAwareScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    keyboardAvoidContainer: {
        flex: 1,

        marginTop: responsiveHeight(20)
    },
    welcomeText: {
        marginTop: responsiveHeight(5),
        textAlign: 'center',
        marginBottom: responsiveFontSize(5),
        fontSize: responsiveFontSize(2.5),
        elevation: 3,
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1, },
        shadowColor: 'blue',
        color: '#000',
        fontWeight: '900'
    },
    inputStyle: {
       
        color: "black",
        width: '80%',
        alignSelf: 'center',
        paddingHorizontal: 10,
        height: 45,
        // marginBottom: responsiveHeight(3)
    },
    inputStyleEmail: {
        borderWidth: 1,
        color: "black",
        width: '80%',
        alignSelf: 'center',
        paddingHorizontal: 10,
        height: 45,
        marginBottom: responsiveHeight(3)
    }, 
    loginButton: {
        backgroundColor: '#36C4F1',
        width: '80%',
        height: 45,
        marginTop: responsiveHeight(3.5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    loginButtonText: {
        color: '#18193F',
        fontSize: responsiveFontSize(1.8),
        fontWeight: 'bold'
    },
    forgotPasswordText: {
        color: '#18193F',
        fontWeight: '700',
        marginLeft: '10%',
        fontSize: responsiveFontSize(1.9),
        marginTop: responsiveHeight(5)
    },
    privacyText: {
        color: '#18193F',
        fontWeight: '700',
        marginLeft: '10%',
        fontSize: responsiveFontSize(1.9),
        marginTop: responsiveHeight(2)
    },
    imageStyle: {
        marginVertical: responsiveHeight(4),
        alignSelf: 'center',
        width: responsiveWidth(150),
        height: responsiveHeight(12),
        resizeMode: 'contain'
    }
})
