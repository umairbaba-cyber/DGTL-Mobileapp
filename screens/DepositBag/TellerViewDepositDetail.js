import React, { Component, useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { responsiveFontSize, responsiveScreenWidth, responsiveHeight, responsiveWidth, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

//it is fifth scrren
//it is a screen for teller 
// Right now this screen is optional 
export default function CustomerViewDepositDetail({ navigation, route }) {

    const CurrencySymbole = useSelector(
        state => state?.Main?.User?.data?.company.localCurrency,
    );
    const currencyArray = CurrencySymbole.split('-');

    const accountType = useSelector(state => state.Main.User.data.userData.accountType);
    const DepositDetail = useSelector(state => route.params.status === 'pending' ? state.Main.UserDepositRecord.depositsAllTimePending[route.params.selectedItem] : state.Main.UserDepositRecord.depositsAllTimeApproved[route.params.selectedItem]);
    const ScannedByTeller = useSelector(state => route.params.status === 'pending' ? state.Main.UserDepositRecord.depositsAllTimePending[route.params.selectedItem].ScannedByTeller : state.Main.UserDepositRecord.depositsAllTimeApproved[route.params.selectedItem].ScannedByTeller);
    const ScannedBySupervisor = useSelector(state => route.params.status === 'pending' ? state.Main.UserDepositRecord.depositsAllTimePending[route.params.selectedItem].ScannedBySupervisor : state.Main.UserDepositRecord.depositsAllTimeApproved[route.params.selectedItem].ScannedBySupervisor);
    const BigID = useSelector(state => route.params.status === 'pending' ? state.Main.UserDepositRecord.depositsAllTimePending[route.params.selectedItem].bagID : state.Main.UserDepositRecord.depositsAllTimeApproved[route.params.selectedItem].bagID);
    // const BigID = useSelector(state => state.Main.UserDepositRecord.depositsAllTimePending[route.params.selectedItem]?.bagID);
    
    console.log('ScannedByTeller ---',ScannedByTeller);
    console.log('ScannedBySupervisor ---',ScannedBySupervisor);
    console.log('status ---',BigID);
    const [loading, setLoading] = useState(true)
    const abbrevation = useSelector(state => state?.Main?.User?.data?.company?.abbrevation);
    const data = route?.params
    const customerName = data?.item?.customer_details[0]?.name

    useEffect(() => {
        const stateInterval = setTimeout(() => {
            setLoading(false)
            // console.log(Depositsdd.company[0].companyName)

        }, 1500);
        return () => clearInterval(stateInterval)
    }, [])

    const getCoins = (name, value) => {
        let n = 0;
        if (name === "X100") {
            n = 'x' + value / 100;
        } else if (name === 'X50') {
            n = 'x' + value / 50
        } else if (name === 'X20') {
            n = 'x' + value / 20
        } else if (name === 'X10') {
            n = 'x' + value / 10
        } else if (name === 'X5') {
            n = 'x' + value / 5
        } else if (name === 'Coins CA$1') {
            n = currencyArray[1] + ' ' + value
        } else if (name === 'Coins') {
            n = currencyArray[1] + ' ' + value
        } else {
            n = currencyArray[1] + ' ' + value
        }
        return n;
    }

    const XCD_Without_Zeroes = DepositDetail.Xcd.filter((e) => e.value !== 0);
    console.log('XCD_With_Zeroes', DepositDetail);
    console.log('XCD_Without_Zeroes', ScannedBySupervisor);

    const totalAmountFooter = (title, amount) => {
        return (
            <View>
                <View style={{ backgroundColor: '#D3D3D3', height: 1, marginTop: 18, marginBottom: 10 }}></View>
                <Text style={styles.currencyLabel}>{title}</Text>
                <Text style={styles.currencyAmount}>{amount}</Text>
                <View style={{ backgroundColor: '#D3D3D3', height: 1, marginTop: 10, marginBottom: 18 }}></View>
            </View>
        )
    }

    const getTotalAmount = (data, key) => {
        let total = 0;
        for (const item of data) {
            total += item[key]
        }
        return currencyArray[1] + ' ' + total;
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                {/* <ActivityIndicator size={'large'} /> */}

                <Image source={require('../../assets/dgtl_icon_610.png')}
                    style={{ height: 70, width: 70, borderRadius: 50 }}
                    resizeMode='contain' />
                <Text style={{ fontWeight: 'bold', fontSize: responsiveFontSize(1.5), color: "#18193F" }}>Loading...</Text>
            </View>
        )
    }
    else {

        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* <View style={styles.topDistance} /> */}
                <StatusBar backgroundColor={'#EBF3EF'} barStyle={'dark-content'} />
                <View style={{ backgroundColor: '#EBF3EF', paddingHorizontal: responsiveScreenWidth(4), paddingBottom: 30, }}>
                    <CustomHeader name={'Deposit Detail'} navigation={navigation} />
                    <View style={styles.monthDeposit}>
                        <Text style={styles.monthDepositMoney}>
                            {currencyArray[1] + ' ' + DepositDetail?.total.value.toFixed(2)}
                        </Text>
                        <View style={{ marginTop: 10, alignItems: 'center' }}>
                            <Text
                                style={[styles.monthDepositDescription, { fontWeight: 'bold' }]}>
                                {customerName}
                            </Text>
                            <Text style={styles.monthDepositDescription}>
                                Account Number: {DepositDetail?.customer_details[0]?.accountNumber}
                            </Text>
                            <Text
                                style={[styles.monthDepositDescription, { fontWeight: 'bold' }]}>
                                {new Date(DepositDetail.createdAt).toDateString()}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1, }}>
                    <View style={styles.discrepancy}>
                        <View style={styles.discrepancyContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.subHeading}>{'ID: '}</Text>
                                <Text style={styles.normalTxt}>{
                                    abbrevation.concat(
                                        DepositDetail?.bagID?.slice(
                                            DepositDetail?.bagID?.length - 10 + abbrevation.length,
                                            DepositDetail?.bagID?.length,
                                        ),
                                    )}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={styles.subHeading}>{'Discrepancies: '}</Text>
                                <Text style={styles.normalTxt}>{DepositDetail?.discrepancies ? `${DepositDetail?.discrepancies}` : "No"}</Text>
                            </View>
                        </View>
                        {DepositDetail?.discrepancies &&
                            <>
                                <View style={styles.discrepancyContainer}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.subHeading}>{'Type: '}</Text>
                                        <Text style={styles.normalTxt}>{`${DepositDetail?.discrepanciesType}`}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.subHeading}>{'Amount: '}</Text>
                                        <Text style={styles.normalTxt}>{`${DepositDetail?.discrepanciesAmount}`}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.subHeading, { marginTop: responsiveHeight(0.8) }]}>{'Notes:'}</Text>
                                <Text style={[styles.normalTxt, { marginTop: responsiveHeight(0.8) }]}>
                                    {`${DepositDetail?.discrepanciesNote}`}
                                </Text>
                            </>
                        }
                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(0.8) }}>
                            <Text style={styles.subHeading}>{'Status: '}</Text>
                            <Text style={styles.normalTxt}>{DepositDetail?.status ? `${DepositDetail?.status}` : 'pending'}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>

                        <Text style={styles.breakDown}>Breakdown</Text>

                        {accountType == "customer" ? <></> :
                            <>
                                {ScannedByTeller && ScannedBySupervisor ? <></> :
                                    <TouchableOpacity onPress={() => navigation.replace('QrCode', { BagID: BigID })} style={{ width: 100, height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#36C4F1', right: responsiveWidth(15) }}>
                                        <Text style={{ color: '#18193F', fontWeight: '700' }}>Verify</Text>
                                    </TouchableOpacity>}
                            </>
                        }
                    </View>
                    {DepositDetail.Xcd.length > 0 ?
                        <>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.xcd}>XCD</Text>

                                </View>
                            </View>
                            <View style={{ marginHorizontal: responsiveWidth(7) }}>
                                {XCD_Without_Zeroes.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: responsiveWidth(1.5) }}>

                                            <Text style={styles.column1}>{item.name}</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={styles.column2}>{getCoins(item.name, item.value)}</Text>
                                        </View>
                                    )
                                })}
                                {totalAmountFooter('Total Local Currency', getTotalAmount(XCD_Without_Zeroes, 'value'))}
                            </View>
                        </> :
                        <></>
                    }
                    {DepositDetail.FX.length > 0 ?
                        <>
                            <Text style={styles.xcd}>FX</Text>

                            <View style={{ marginHorizontal: responsiveWidth(7) }}>
                                {DepositDetail.FX.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: responsiveWidth(1.5) }}>

                                            <Text style={styles.column1}>{item.name}</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={styles.column2}>{currencyArray[1] + ' ' + item.EQV}</Text>
                                        </View>
                                    )
                                })}
                                {totalAmountFooter('Total Foreign Exchange', getTotalAmount(DepositDetail.FX, 'EQV'))}
                            </View>

                        </> :
                        <></>
                    }




                    {DepositDetail.checks.length > 0 ?
                        <>
                            <Text style={styles.xcd}>CHEQUES</Text>
                            <View style={{ marginHorizontal: responsiveWidth(7) }}>
                                {DepositDetail.checks.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: responsiveWidth(1), marginRight: responsiveWidth(14) }}>
                                            <Text style={styles.column1}>{item.checkNumber.length >= 4 ? `${item.checkNumber.slice(0, 5)} ...` : item.checkNumber}</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={styles.column3}>{item?.bank_UC}</Text>
                                            <Text style={styles.column3}>{currencyArray[1] + ' ' + item.checkAmount}</Text>

                                        </View>
                                    )
                                })}
                                {totalAmountFooter('Total Cheques', getTotalAmount(DepositDetail.checks, 'checkAmount'))}
                            </View>
                        </> : <></>
                    }
                    <Text style={styles.xcd}>Total</Text>
                    <View style={{ marginHorizontal: responsiveWidth(7) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: responsiveWidth(1.5) }}>
                            <Text style={styles.column1}>Total</Text>
                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                            <Text style={styles.column2}>{currencyArray[1] + ' ' + DepositDetail.total.value.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        );
    }
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
        // flexDirection: 'row',
        // marginTop: responsiveHeight(4),
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    monthDepositMoney: {
        color: '#000', //8fd150
        fontSize: 35,
        fontWeight: 'bold',

    },
    monthDepositDescription: {
        color: '#000',
        fontSize: 15,
    },
    breakDown: {
        color: '#000',
        fontSize: responsiveFontSize(2.2),
        fontWeight: '700',
        paddingHorizontal: responsiveWidth(8)
    },
    xcd: {
        marginVertical: responsiveHeight(3),
        fontSize: responsiveFontSize(2.6),
        color: '#686868', //14cdd4
        fontWeight: '700',
        marginLeft: responsiveScreenWidth(8)
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
    imageStyle: {
        width: responsiveScreenWidth(8),
        height: responsiveScreenHeight(8),
        resizeMode: 'contain',

    },
    column1: {
        fontSize: responsiveFontSize(2.1),
        color: '#000',
        fontWeight: '700',
        width: responsiveWidth(20)
    },
    column2: {
        fontSize: responsiveFontSize(2.1),
        color: '#000',
        fontWeight: '700',
        width: responsiveWidth(40),
        textAlign: 'center'
    },
    column3: {
        fontSize: responsiveFontSize(2.1),
        color: '#000',
        fontWeight: '700',
        textAlign: 'center'
    },
    currencyLabel: {
        fontSize: responsiveFontSize(2.2),
        color: '#686868',
    },
    currencyAmount: {
        fontSize: responsiveFontSize(2.5),
        color: '#000',
        fontWeight: 'bold',
        marginTop: 5,
    },
    discrepancy: {
        marginHorizontal: responsiveHeight(2),
    },
    subHeading: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2)
    },
    normalTxt: {
        color: 'black',
        fontSize: responsiveFontSize(2)
    },
    discrepancyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(0.8)
    },
})
