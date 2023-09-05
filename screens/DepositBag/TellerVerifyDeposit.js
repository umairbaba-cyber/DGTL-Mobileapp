import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { responsiveFontSize, responsiveScreenWidth, responsiveHeight, responsiveWidth, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BasePath from '../../config/BasePath';
//it is fifth scrren
//it is a screen for teller 
// on this screen teller verify that amount which user has deposited

export default function TellerVerifyDeposit({ navigation,route }) {
    const CurrencySymbole = useSelector(
        state => state?.Main?.User?.data?.company.localCurrency,
      );
      const currencyArray = CurrencySymbole.split('-');
    const total = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.total.value)
    const updatedAt = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.updatedAt)
    // const clientID =useSelector(state => state.Main.QrCodeScanedDetail.company.companyName)
    // .toString().substr(0, 6)
    const CompanyName = useSelector(state => state.Main.QrCodeScanedDetail.company.companyName)
    const customerName = useSelector(state =>state?.Main?.QrCodeScanedDetail?.customer?.name);
    
    const data = route?.params
    // console.log('Da>>',abbrevation)
    // const customerName = data?.item?.customer_details[0]?.name

    const totalChanged = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.total)
    const XCD = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.Xcd)
    const xcdChanged = XCD
    const Checks = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.checks)
    const checksChanged = Checks

    const FX = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.FX)
    const fxChanged = FX
    const [token, setToken] = useState('')
    const accountNumber = useSelector(state => state.Main.QrCodeScanedDetail?.customer?.accountNumber)

    const { clientID, bagID, customerID } = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle)

    useEffect(() => {
        GetToken()
    }, [])

    async function GetToken() {
        let usertoken = await AsyncStorage.getItem('token')
        setToken(usertoken)
    }
    function ChangeXcdValues({ index }) {
        const [selected, setSelected] = useState(false)
        function ChangeState() {
            setSelected(!selected)

            xcdChanged.map((itm, indx) => {
                if (index == indx) {
                    itm.status = !selected
                }
            })

        }

        return (

            <TouchableOpacity onPress={() => ChangeState()}>
                {selected ?
                    <Image style={styles.imageStyle} source={require('../../assets/checked.png')} />
                    :
                    <Image style={styles.imageStyle} source={require('../../assets/image8.png')} />
                }
            </TouchableOpacity>
        )
    }
    function ChangedFX({ index }) {
        const [selected, setSelected] = useState(false)
        function ChangeState() {
            setSelected(!selected)

            fxChanged.map((itm, indx) => {
                if (index == indx) {
                    itm.status = !selected
                }
            })

        }

        return (

            <TouchableOpacity onPress={() => ChangeState()}>
                {selected ?
                    <Image style={styles.imageStyle} source={require('../../assets/checked.png')} />
                    :
                    <Image style={styles.imageStyle} source={require('../../assets/image8.png')} />
                }
            </TouchableOpacity>
        )
    }

    function ChangedChecks({ index }) {
        const [selected, setSelected] = useState(false)
        function ChangeState() {
            setSelected(!selected)

            checksChanged.map((itm, indx) => {
                if (index == indx) {
                    itm.status = !selected
                }
            })

        }

        return (

            <TouchableOpacity onPress={() => ChangeState()}>
                {selected ?
                    <Image style={styles.imageStyle} source={require('../../assets/checked.png')} />
                    :
                    <Image style={styles.imageStyle} source={require('../../assets/image8.png')} />
                }
            </TouchableOpacity>
        )
    }

    function ChangedTotal() {
        const [selected, setSelected] = useState(false)
        function ChangeState() {
            setSelected(!selected)
            totalChanged.status = !selected
        }

        return (

            <TouchableOpacity onPress={() => ChangeState()}>
                {selected ?
                    <Image style={styles.imageStyle} source={require('../../assets/checked.png')} />
                    :
                    <Image style={styles.imageStyle} source={require('../../assets/image8.png')} />
                }
            </TouchableOpacity>
        )
    }


    async function SendVerificationRequest() {

        await axios.post(BasePath + 'TellerCheckRequest',
            {

                total: total,
                bagID: bagID,
                customerID: customerID,
                clientID: clientID,
                Xcd: xcdChanged,
                checks: checksChanged,
                total: totalChanged,
                FX: fxChanged

            }, {
            params: {
                x_auth: token
            }
        }
        ).then(res => {
            const { data, code } = res.data
            console.log('tellerCheck request data', data)

            if (code == 200) {
                navigation.navigate('CompleteDeposit', { data: data })
            } else {
                alert("Server Error in Processing request")
            }

        }).catch((e) => {
            alert(e.response.data.message)
            console.log('error is ', e.response.data)
        })



    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.topDistance} />
            <View style={{ marginHorizontal: responsiveWidth(4) }}>
                <CustomHeader name={'Deposit Detail'} navigation={navigation} />
            </View>

            <View style={styles.monthDeposit}>
                <View style={{ width: '45%' }}>
                    <Text style={styles.monthDepositMoney}>{currencyArray[1]+' '+total?.toFixed(2)}</Text>
                </View>
                <View style={{ width: '45%' }}>
                    <Text style={[styles.monthDepositDescription, { fontWeight: "bold" }]}>{customerName}</Text>
                    <Text style={styles.monthDepositDescription}>Acct# {accountNumber}</Text>
                    <Text style={[styles.monthDepositDescription, { fontWeight: 'bold' }]}>{new Date(updatedAt).toDateString()}</Text>
                </View>
            </View>
            <View style={{ flex: 1, paddingHorizontal: responsiveScreenWidth(3) }}>

                <Text style={styles.breakDown}>Breakdown</Text>
                {XCD.length > 0 ?
                    <>
                        <Text style={styles.xcd}>{currencyArray[0]}</Text>
                        <View>
                            {XCD.map((item, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: responsiveWidth(6) }}>
                                        <Text style={{ fontWeight: '700', fontSize: responsiveFontSize(2.1), color: '#000', width: responsiveWidth(20) }}>{item.name}</Text>
                                        <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontWeight: '700', fontSize: responsiveFontSize(2.1), color: '#000',width:responsiveWidth(30),textAlign:'center' }}>{currencyArray[1]+item.value}</Text>
                                            <View style={{ width:responsiveWidth(7) }} />
                                            <ChangeXcdValues status={item.status} index={index} />
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </>
                    :
                    <></>}
                {FX.length > 0 ?
                    <>
                        <Text style={styles.xcd}>FX</Text>
                        {FX.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: responsiveWidth(6) }}>
                                    <Text style={{ fontWeight: '700', fontSize: responsiveFontSize(2.1), color: '#000', width: responsiveWidth(20) }}>{item.name}</Text>
                                    <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '700', fontSize: responsiveFontSize(2.1), color: '#000',width:responsiveWidth(30),textAlign:'center' }}>{currencyArray[1]+item?.EQV}</Text>
                                        <View style={{ width: responsiveWidth(7) }} />
                                        <ChangedFX status={item.status} index={index} />
                                    </View>
                                </View>

                                // <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                //     <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700' }}>{item.name}</Text>
                                //     <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                //     <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700' }}>$ {item.FXamount}</Text>
                                //     <ChangedFX status={item.status} index={index} />

                                // </View>
                            )
                        })}
                    </> :
                    <></>
                }
                {Checks.length > 0 ?
                    <>
                        <Text style={styles.xcd}>CHEQUES</Text>
                        {Checks.map((item, index) => {
                            return (

                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: responsiveWidth(6) }}>
                                    <Text style={{ fontWeight: '700', fontSize: responsiveFontSize(2.1), color: '#000', width: responsiveWidth(20) }}>{item.checkNumber.length >=4 ? `${item.checkNumber.slice(0,5)} ...` :item.checkNumber }</Text>
                                    <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: '700', fontSize: responsiveFontSize(2.1), color: '#000',width:responsiveWidth(20),textAlign:'center' }}>{item?.bank_UC}</Text>
                                        <Text style={{ fontWeight: '700', fontSize: responsiveFontSize(2.1), color: '#000',textAlign:'center' }}>{currencyArray[1]+item.checkAmount}</Text>
                                        <View style={{ width: responsiveWidth(7) }} />
                                        <ChangedChecks status={item.status} index={index} />

                                    </View>
                                </View>

                            )
                        })}
                    </> :
                    <></>
                }

                <Text style={styles.xcd}>Total</Text>


                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700' }}>Amount</Text>
                    <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                    <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700' }}>$ {total}</Text>
                    <ChangedTotal />

                   

                </View> */}

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: responsiveWidth(6) }}>
                    <Text style={{ fontWeight: '700', fontSize: responsiveFontSize(2.1), color: '#000', width: responsiveWidth(20) }}>Amount</Text>
                    <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: responsiveFontSize(2.1), color: '#000',width:responsiveWidth(30),textAlign:'center' }}>{currencyArray[1]+total.toFixed(2)}</Text>
                        <View style={{ width: responsiveWidth(7) }} />
                        <ChangedTotal />
                    </View>
                </View>


                {/*  navigation.navigate('TellerCompleteDeposit') */}
                <TouchableOpacity onPress={() => SendVerificationRequest()} style={styles.submitButton}>
                    <Text style={{ color: '#18193F', fontWeight: '700' }}>Verify</Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
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
    monthDeposit: {
        flexDirection: 'row',
        marginTop: responsiveHeight(4),
        justifyContent: 'space-evenly',
        // alignItems: 'center'
    },
    monthDepositMoney: {
        color: '#8fd150',
        fontSize: responsiveFontSize(4),
        fontWeight: '700'

    },
    monthDepositDescription: {
        color: '#000',
        fontSize: responsiveFontSize(1.9)
    },
    breakDown: {
        color: '#000',
        fontSize: responsiveFontSize(2),
        fontWeight: '700',
        marginLeft: responsiveWidth(2),
        marginTop:responsiveScreenHeight(2)
    },
    xcd: {
        marginVertical: responsiveHeight(3),
        fontSize: responsiveFontSize(2.6),
        color: '#14cdd4',
        fontWeight: '700',
        marginLeft: responsiveScreenWidth(2)
    },
    submitButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        height: 45,
        width: '80%',
        backgroundColor: '#36C4F1',
        marginBottom: responsiveScreenHeight(5)
    },
    imageStyle: {
        width: responsiveScreenWidth(8),
        height: responsiveScreenHeight(8),
        resizeMode: 'contain',

    },
})


