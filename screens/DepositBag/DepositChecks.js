import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, ScrollView, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HandleMoneyInputChecks from '../../components/HandleMoneyInputChecks';
import CustomHeader from '../../components/CustomHeader';
import { useSelector, useDispatch } from 'react-redux';
import { UpdateChecks } from '../../redux/Action';
import { UpdateTotal } from '../../redux/Action';
import { useIsFocused } from '@react-navigation/native';

//it is second screen
//  on this screen user is asked to enter check amount and check number

export default function DepositChecks({ navigation, route }) {
    // a function to run qr code scanner it will scane qrcode and send data to next screen

    // const users = useSelector(state => state);
    console.log('route --- ', route?.name);

    const dispatch = useDispatch()
    const users = useSelector(state => state.Main);

    const [noOfCheques, setNoOfCheques] = useState(5);
    const [chequeInputs, setChequeInputs] = useState([]);

    const addChequesInputs = (count) => {
        const newChequeInputs = [];

        for (let i = 0; i < count; i++) {
            newChequeInputs.push({
                chequeNo: '',
                amount: '',
                bank: '',
            })
        }
        setChequeInputs(newChequeInputs);
    }

    const handleChequeChange = (index, field, text) => {
        const updateInputs = [...chequeInputs];
        updateInputs[index][field] = text;
        setChequeInputs(updateInputs);
    }

    useEffect(() => {
        addChequesInputs(noOfCheques)
    }, [])

    const [textInputs, setTextInputs] = useState({
        input1: { name: '', bank: '', value: 0, },
        input2: { name: '', bank: '', value: 0 },
        input3: { name: '', bank: '', value: 0 },
        input4: { name: '', bank: '', value: 0 },
        input5: { name: '', bank: '', value: 0 },

    });

    const handleCurrency = (key, text) => {
        // Update the TextInput value in the object
        // console.log('Amount',text)
        setTextInputs(prevState => ({
            ...prevState,
            [key]: { ...prevState[key], value: text }
        }));
    };
    const handleBankName = (key, text) => {
        // Update the TextInput value in the object
        setTextInputs(prevState => ({
            ...prevState,
            [key]: { ...prevState[key], bank: text }
        }));
    };
    const handleCheckName = (key, text) => {
        // Update the TextInput value in the object
        setTextInputs(prevState => ({
            ...prevState,
            [key]: { ...prevState[key], name: text }
        }));
    };

    const handleCheckEmpty = () => {

        // const emptyInputs = Object.keys(textInputs).filter(
        //     key => textInputs[key].value !== '' && textInputs[key].name !== '' && textInputs[key].bank !== ''
        // );
        const emptyInputs = chequeInputs.filter((item) => {
            return item.chequeNo.trim() !== '' && item.amount.trim() !== '' && item.bank.trim() !== '';
        })

        console.log('EmptyInPuts ---- ', emptyInputs)
        let Checks = []

        // emptyInputs.map((item, indx) => {
        //     Checks.push({
        //         index: 'checkNo' + indx,
        //         checkNumber: '#' + textInputs[item].name,
        //         bank_UC: textInputs[item].bank,
        //         checkAmount: parseFloat(textInputs[item].value),
        //         status: false,

        //     })
        // })

        emptyInputs.map((item, indx) => {
            Checks.push({
                index: 'checkNo' + indx,
                checkNumber: '#' + item.chequeNo,
                bank_UC: item.bank,
                checkAmount: parseFloat(item.amount),
                status: false,

            })
        })

        console.log('checks ----', Checks);

        // dispatch(UpdateChecks(Checks))
        var usertotal = 0;

        users.Xcd.map((item) => {
            usertotal = usertotal + item.value
        })

        users.Fx.map((item) => {
            usertotal = usertotal + item.EQV
        })

        Checks.map((item) => {
            usertotal = usertotal + parseFloat(item.checkAmount)
        })

        const total = {
            value: usertotal,
            status: false
        }

        var AllowNavigation = true
        Checks.map((item) => {
            console.log('values in array', item.checkAmount)
            if (isNaN(item.checkAmount) || item.checkAmount < 0) {
                alert('Enter Valid amount for Check' + item.checkNumber)
                AllowNavigation = false
                return
            }
        })

        if (AllowNavigation) {
            dispatch(UpdateTotal(total))
            dispatch(UpdateChecks(Checks))
            navigation.navigate('VarifyDeposit')
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.loginContainer}
            enableOnAndroid={true}
            // enableAutomaticScroll={Platform.OS === 'ios'}
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{flexGrow: 1}}
        >
            <CustomHeader name={'Deposit Cheques'} navigation={navigation} />
            <Text style={styles.breakDown}>CHEQUES</Text>

            <View style={styles.chequeNoView}>
                <View>
                    <Text style={styles.checkNoTile}>No. of Cheques</Text>
                    <Text style={styles.checkNoDes}>How many cheques would you{'\n'}like to deposit</Text>
                </View>
                <TextInput
                    placeholder='Cheques'
                    placeholderTextColor={'#686868'}
                    style={styles.inputStyle}
                    keyboardType='number-pad'
                    value={noOfCheques.toString()}
                    onChangeText={(v) => {
                        if (v <= 25) {
                            setNoOfCheques(v)
                            addChequesInputs(v)
                        }
                    }}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30, marginTop: responsiveScreenHeight(6) }}>
                <Text style={{ ...styles.xcd, right: responsiveScreenWidth(7), color: '#000' }}>CHEQUE #</Text>
                <Text style={{ ...styles.xcd, color: '#000', width: responsiveScreenWidth(14)}}>INST.</Text>
                <Text style={{ ...styles.xcd, color: '#000', width: responsiveScreenWidth(14)  }}>AMT.</Text>

            </View>
            {chequeInputs?.map((item, index) => (
                <View key={index} style={{ flex: 1 }}>
                    <View style={{ height: responsiveScreenHeight(1) }}></View>
                    {/* <Text style={{color: 'black'}}>No.{index+1}</Text> */}
                    <HandleMoneyInputChecks
                        key={index}
                        handleCheckNo={(val) => handleChequeChange(index, 'chequeNo', val)} //wwww --> where whose what
                        handleAmount={(val) => handleChequeChange(index, 'amount', val)}
                        handleBank={(val) => handleChequeChange(index, 'bank', val)}
                    />
                    <View style={{ height: responsiveScreenHeight(3.8) }}></View>
                </View>
            ))}
            {/* <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input1', text)} handleAmount={text => handleCurrency('input1', text)} handleBank={text => handleBankName('input1', text)} />
                <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input2', text)} handleAmount={text => handleCurrency('input2', text)} handleBank={text => handleBankName('input2', text)} />
                <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input3', text)} handleAmount={text => handleCurrency('input3', text)} handleBank={text => handleBankName('input3', text)} />
                <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input4', text)} handleAmount={text => handleCurrency('input4', text)} handleBank={text => handleBankName('input4', text)} />
                <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input5', text)} handleAmount={text => handleCurrency('input5', text)} handleBank={text => handleBankName('input5', text)} /> */}


            <TouchableOpacity
                disabled={chequeInputs.length < 1 ? true : false}
                onPress={() => handleCheckEmpty()}
                style={[styles.loginButton, { backgroundColor: chequeInputs.length < 1 ? '#d3d3d3' : '#36C4F1' }]}
            >
                <Text style={styles.loginButtonText}>Next</Text>
            </TouchableOpacity>

        </KeyboardAwareScrollView>
    );

}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: responsiveScreenWidth(4),
        paddingRight: responsiveScreenWidth(4)
    },
    topDistance: {
        marginTop: responsiveHeight(4)
    },
    Notification: {
        height: responsiveHeight(8),
        width: responsiveScreenWidth(8),
        resizeMode: 'contain'
    },
    nameText: {
        fontSize: responsiveFontSize(3),
        fontWeight: '400',
        color: '#000'
    },
    bioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    breakDown: {
        fontSize: responsiveFontSize(3.2),
        fontWeight: '700',
        color: '#14cdd4',
    },
    xcd: {
        // marginVertical: responsiveHeight(3),
        fontSize: responsiveFontSize(2.6),
        color: '#14cdd4',
        fontWeight: '700',
        // marginLeft: responsiveScreenWidth(8)
    },
    depositContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(3),
        height: responsiveHeight(22),
        marginHorizontal: 5
    },
    depositButtons: {
        borderWidth: 1,
        width: responsiveScreenWidth(37),
        height: responsiveHeight(20),
        borderRadius: 20,
        marginHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    depositText: {

        fontSize: responsiveFontSize(2.5),
        fontWeight: '400',
        color: '#000'
    },
    recentDepostTextConatiner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    BagSection: {
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    RecentDeposit: {
        fontSize: responsiveFontSize(4),
        color: '#000',
        marginLeft: 5,
        marginVertical: responsiveHeight(2)
    },
    viewAllText: {
        color: '#3badfb',
        fontSize: responsiveFontSize(1.9)
    },
    submitButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: 100,
        height: 45,
        backgroundColor: 'lightgreen'
    },
    loginButton: {
        backgroundColor: '#36C4F1',
        width: '80%',
        height: 45,
        marginTop: responsiveHeight(3.5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: responsiveScreenHeight(5)
    },
    loginButtonText: {
        color: '#18193F',
        fontSize: responsiveFontSize(2)
    },
    chequeNoView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        alignItems: 'center',
    },
    checkNoTile: {
        fontSize: responsiveFontSize(2.1),
        color: '#000',
        fontWeight: 'bold',
    },
    checkNoDes: {
        color: '#686868',
        fontSize: responsiveFontSize(1.7),
    },
    inputStyle: {
        color: '#000',
        textAlign: 'left',
        backgroundColor: '#d3d3d3',
        width: responsiveScreenWidth(30),
        height: responsiveHeight(6),
        paddingLeft: 10,
        paddingRight: 10,
    },
})
