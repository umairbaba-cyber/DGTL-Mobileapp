import React, { useState } from 'react';
import { StyleSheet, Image, View, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HandleMoneyInputChecks from '../../components/HandleMoneyInputChecks';
import CustomHeader from '../../components/CustomHeader';
import { useSelector, useDispatch } from 'react-redux';
import { UpdateChecks } from '../../redux/Action';
import { UpdateTotal } from '../../redux/Action';

//it is second screen
//  on this screen user is asked to enter check amount and check number

export default function DepositChecks({ navigation, route }) {
    // a function to run qr code scanner it will scane qrcode and send data to next screen

    // const users = useSelector(state => state);
    
    const dispatch = useDispatch()
    const users = useSelector(state => state.Main);


    const [textInputs, setTextInputs] = useState({
        input1: { name: '',bank:'', value: 0, },
        input2: { name: '',bank:'', value: 0 },
        input3: { name: '',bank:'', value: 0 },
        input4: { name: '',bank:'', value: 0 },
        input5: { name: '',bank:'', value: 0 },

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
     
        const emptyInputs = Object.keys(textInputs).filter(
            key => textInputs[key].value !== '' && textInputs[key].name !== '' && textInputs[key].bank!==''
        );

        console.log('EmptyInPuts',emptyInputs)
        let Checks = []
        emptyInputs.map((item,indx) => {

            Checks.push({
                index:'checkNo'+indx,
                checkNumber: '#'+textInputs[item].name,
                bank_UC:textInputs[item].bank,
                checkAmount: parseFloat(textInputs[item].value),
                status: false,

            })
        })

        // dispatch(UpdateChecks(Checks))
        var usertotal = 0;

        users.Xcd.map((item) => {
            usertotal = usertotal +  item.value
        })
       
        users.Fx.map((item) => {
           
            usertotal = usertotal +  item.EQV
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
            // console.log('values in array',item.checkAmount)
            if (isNaN(item.checkAmount) || item.checkAmount<0 ) {
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
        <View style={styles.loginContainer}>
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                {/* it is just margin from top */}
                {/* <View style={styles.topDistance} /> */}
                <View style={{ marginHorizontal: responsiveScreenWidth(4) }}>
                    <CustomHeader name={'Deposit Check'} navigation={navigation} />
                </View>
                <Text style={styles.breakDown}>CHEQUES</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',paddingHorizontal:30 }}>
                    <Text style={{ ...styles.xcd, right: responsiveScreenWidth(10), color: '#000' }}>CHECK#</Text>
                    <Text style={{ ...styles.xcd, color: '#000' }}>Bank</Text>
                    <Text style={{ ...styles.xcd, color: '#000' }}>AMT</Text>

                </View>
                <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input1', text)} handleAmount={text => handleCurrency('input1', text)} handleBank={text => handleBankName('input1', text)}/>
                <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input2', text)} handleAmount={text => handleCurrency('input2', text)} handleBank={text => handleBankName('input2', text)}/>
                <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input3', text)} handleAmount={text => handleCurrency('input3', text)} handleBank={text => handleBankName('input3', text)}/>
                <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input4', text)} handleAmount={text => handleCurrency('input4', text)} handleBank={text => handleBankName('input4', text)}/>
                <HandleMoneyInputChecks handleCheckNo={text => handleCheckName('input5', text)} handleAmount={text => handleCurrency('input5', text)} handleBank={text => handleBankName('input5', text)}/>



                <TouchableOpacity onPress={() => handleCheckEmpty()} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Next</Text>
                </TouchableOpacity>


            </KeyboardAwareScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff'
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
        marginLeft: responsiveScreenWidth(4.5)
    },
    xcd: {
        marginVertical: responsiveHeight(3),
        fontSize: responsiveFontSize(2.6),
        color: '#14cdd4',
        fontWeight: '700',
        marginLeft: responsiveScreenWidth(8)
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
        marginBottom:responsiveScreenHeight(5)
    },
    loginButtonText: {
        color: '#18193F',
        fontSize: responsiveFontSize(2)
    },

})
