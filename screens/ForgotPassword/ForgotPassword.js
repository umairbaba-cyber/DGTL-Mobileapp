import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { responsiveFontSize, responsiveHeight, responsiveWidth, } from 'react-native-responsive-dimensions';
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { validateEmail } from '../../validations/validation';
import BasePath from '../../config/BasePath';

export default function ForgotPassword({ navigation }) {
const [email,setEmail]=useState('')


    async function ResetPassword() {
        if (validateEmail(email)) {
        await axios.post(BasePath+'forgotPassword',
            {
                email: email,

            }
        ).then(res => {
            if (res.data.code == 200) {
                
                Toast.show({
                    type: 'success',
                    text1: res.data.message
                });
         
            }
        }).catch((e) => {
            alert('Error '+ e.response.data.message)
        })}else{
            alert('Enter Valid Email')
            
        }
    }

   
    return (
        <View style={styles.loginContainer}>
            <KeyboardAwareScrollView style={styles.keyboardAvoidingContainer}>
                <View>
                    <Text style={styles.welcomeText}>Reset Password</Text>
                </View>

                <View>
                    <Text style={{ marginBottom: 8, marginLeft: responsiveWidth(10) }}>Email</Text>

                    <TextInput onChangeText={(e)=>setEmail(e)} style={styles.inputStyle} placeholderTextColor='#000' placeholder='Email address' />

                    <TouchableOpacity onPress={() => ResetPassword()} style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Reset</Text>
                    </TouchableOpacity>
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
    keyboardAvoidingContainer:{
         flex: 1,
        marginTop: responsiveHeight(20) 
    },
    welcomeText: {
        marginTop: responsiveHeight(5),
        textAlign: 'center',
        marginBottom: responsiveFontSize(5),
        fontSize: responsiveFontSize(2.5),
    
      
       
        color: '#000',
        fontWeight: '900'
    },
    inputStyle: {
        borderWidth: 1,
        width: '80%',
        alignSelf: 'center',
        paddingHorizontal: 10,
        height:45,
        marginBottom: responsiveHeight(3)
    },


    loginButtonText: {
        color: '#18193F',
        fontSize: responsiveFontSize(2)
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
        marginTop: responsiveHeight(3.5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
})
