import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { responsiveFontSize, responsiveHeight, responsiveWidth, } from 'react-native-responsive-dimensions';
import axios from 'axios'
import Toast from 'react-native-toast-message'
import { validateEmail } from '../../validations/validation';
import BasePath from '../../config/BasePath';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

export default function OTPScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    return (
        <View style={styles.loginContainer}>
            <TouchableOpacity style={{padding: 10,}} onPress={()=> navigation.goBack()}>
                <Image source={require('../../assets/backarrow.png')} style={{width: 30, height: 18,}}/>
            </TouchableOpacity>
            <KeyboardAwareScrollView style={styles.keyboardAvoidingContainer}>
                <View>
                    <Text style={styles.welcomeText}>Enter OTP</Text>
                </View>

                <Text style={{ marginLeft: responsiveWidth(10), marginTop: responsiveHeight(2) }}>Please check your email, OTP sent on your email.</Text>
                <View style={{ marginLeft: responsiveWidth(10), marginRight: responsiveWidth(10) }}>
                    <CodeField
                        ref={ref}
                        {...props}
                        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                    <TouchableOpacity onPress={() => {}} style={[styles.loginButton, {marginTop: responsiveHeight(7)}]}>
                        <Text style={styles.loginButtonText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Resend</Text>
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
    keyboardAvoidingContainer: {
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
        height: 45,
        marginBottom: responsiveHeight(3),
        color: '#000',
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
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#36C4F1',
    },
})
