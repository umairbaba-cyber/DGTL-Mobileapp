/* eslint-disable prettier/prettier */
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, StatusBar } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { responsiveFontSize, responsiveScreenWidth, responsiveHeight, responsiveWidth, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import BasePath from '../../config/BasePath';
import { check } from 'react-native-permissions';

const NotifiDetail = ({ navigation, route }) => {

    const CurrencySymbole = useSelector(
        state => state?.Main?.User?.data?.company.localCurrency,
    );
    const currencyArray = CurrencySymbole.split('-');

    const type = useSelector((state) => state?.Main?.User?.data?.userData?.accountType)
    // const BigID = useSelector(state => state.Main?.UserDepositRecord?.depositsThisMonthPending[route.params?.index]?.bagID ?? '');
    const BigID = useSelector(state => {
        const depositsThisMonthPending = state.Main?.UserDepositRecord?.depositsThisMonthPending;
      
        // Check if depositsThisMonthPending is defined and has the expected structure
        if (depositsThisMonthPending && Array.isArray(depositsThisMonthPending) && route.params?.index !== undefined) {
          const deposit = depositsThisMonthPending[route.params.index];
      
          // Check if deposit is defined and has the bagID property
          if (deposit && deposit.bagID !== undefined) {
            return deposit.bagID;
          }
        }
      
        // If any of the checks fail, return a default value or handle the situation accordingly
        return ''; // Set defaultValue to an appropriate value or handle the situation as needed
      });
      
    const [loading, setLoading] = useState(true)
    const index = route?.params?.index
    const item = route?.params?.item?.qr_data[0]
    const companyName = route?.params?.item?.qr_data[0]?.company_data[0]?.companyName
    const accountNumber = route?.params?.item?.qr_data[0]?.customer_data[0]?.accountNumber
    customerName = route?.params?.item?.qr_data[0]?.customer_data[0]?.name
    const abbrevation = useSelector(state => state?.Main?.User?.data?.company?.abbrevation);
    // console.log('accontNumber check', accountNumber)
    const createdAt = route?.params?.item?.qr_data[0]?.createdAt
    const total = route?.params?.item?.qr_data[0]?.total?.value
    const Xcd = route?.params?.item?.qr_data[0]?.Xcd
    const Fx = route?.params?.item?.qr_data[0]?.FX
    const checks = route?.params?.item?.qr_data[0]?.checks[0]
    const forcheck = route?.params?.item
    const ScannedByTeller = route?.params?.item?.qr_data[0]?.ScannedByTeller;
    const ScannedBySupervisor = route?.params?.item?.qr_data[0]?.ScannedBySupervisor;
    console.log('params data now', forcheck)
    console.log('data -----',  ScannedByTeller)
    console.log('data -----',  ScannedBySupervisor)

    useEffect(() => {
        const stateInterval = setTimeout(() => {
            setLoading(false)
            // console.log(Depositsdd.company[0].companyName)

        }, 1500);
        return () => clearInterval(stateInterval)
    }, [])

    console.log('total ---', total);

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

    const XCD_Without_Zeroes = item?.Xcd.filter((e) => e.value !== 0);
    console.log('XCD_With_Zeroes', item);
    console.log('XCD_Without_Zeroes', XCD_Without_Zeroes);

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
                            {currencyArray[1]} {total ? total?.toFixed(2) : 0}
                        </Text>
                        <View style={{ marginTop: 10, alignItems: 'center' }}>
                            <Text
                                style={[styles.monthDepositDescription, { fontWeight: 'bold' }]}>
                                {customerName}
                            </Text>
                            <Text style={styles.monthDepositDescription}>
                                Account Number: {accountNumber}
                            </Text>
                            <Text
                                style={[styles.monthDepositDescription, { fontWeight: 'bold' }]}>
                                {new Date(createdAt).toDateString()}
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
                                        item?.bagID?.slice(
                                            item?.bagID?.length - 10 + abbrevation.length,
                                            item?.bagID?.length,
                                        ),
                                    )}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={styles.subHeading}>{'Discrepancies: '}</Text>
                                <Text style={styles.normalTxt}>{item?.discrepancies ? `${item?.discrepancies}` : "No"}</Text>
                            </View>
                        </View>
                        {item?.discrepancies &&
                            <>
                                <View style={styles.discrepancyContainer}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.subHeading}>{'Type: '}</Text>
                                        <Text style={styles.normalTxt}>{`${item?.discrepanciesType}`}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.subHeading}>{'Amount: '}</Text>
                                        <Text style={styles.normalTxt}>{`${item?.discrepanciesAmount}`}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.subHeading, { marginTop: responsiveHeight(0.8) }]}>{'Notes:'}</Text>
                                <Text style={[styles.normalTxt, { marginTop: responsiveHeight(0.8) }]}>
                                    {`${item?.discrepanciesNote}`}
                                </Text>
                            </>
                        }
                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(0.8) }}>
                            <Text style={styles.subHeading}>{'Status: '}</Text>
                            {/* <Text style={styles.normalTxt}>{item?.total?.status ? `approved` : 'pending'}</Text> */}
                            <Text style={styles.normalTxt}>{item?.ScannedBySupervisor && item?.ScannedBySecondSupervisor ? `approved` : 'pending'}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>

                        <Text style={styles.breakDown}>Breakdown</Text>

                        {type == 'customer' ? <></> :
                            <>
                                {type === "teller" && !ScannedByTeller && !ScannedBySupervisor ? (
                                    <TouchableOpacity
                                        onPress={() => navigation.replace('QrCode', { BagID: BigID })}
                                        style={{
                                            width: 100,
                                            height: 45,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#36C4F1',
                                            right: responsiveWidth(10),
                                        }}
                                    >
                                        <Text style={{ color: '#18193F', fontWeight: '700' }}>Verify</Text>
                                    </TouchableOpacity>
                                ) : type === "supervisor" && !ScannedBySupervisor ? (
                                    <TouchableOpacity
                                        onPress={() => navigation.replace('QrCode', { BagID: BigID })}
                                        style={{
                                            width: 100,
                                            height: 45,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#36C4F1',
                                            right: responsiveWidth(10),
                                        }}
                                    >
                                        <Text style={{ color: '#18193F', fontWeight: '700' }}>Verify</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </>
                        }

                    </View>
                    {item?.Xcd?.length > 0 ?

                        <>

                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.xcd}>{currencyArray[0]}</Text>

                                </View>
                            </View>
                            <View style={{ marginHorizontal: responsiveWidth(8) }}>
                                {XCD_Without_Zeroes?.map((item, index) => {
                                    return (
                                        <View key={'lcl' + index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={styles.column1}>{item.name} </Text>
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
                    {item?.FX?.length > 0 ?
                        <>
                            <Text style={styles.xcd}>FX</Text>

                            <View style={{ marginHorizontal: responsiveWidth(8) }}>
                                {item?.FX?.map((item, index) => {
                                    return (
                                        <View key={'fx' + index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                            <Text style={styles.column1}>{item.name}</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={styles.column2}>{currencyArray[1] + ' ' + item?.EQV}
                                            </Text>
                                        </View>
                                    )
                                })}
                                {totalAmountFooter('Total Foreign Exchange', getTotalAmount(item?.FX, 'EQV'))}
                            </View>

                        </> :
                        <></>
                    }




                    {item?.checks?.length > 0 ?
                        <>
                            <Text style={styles.xcd}>CHEQUES</Text>
                            <View style={{ marginHorizontal: responsiveWidth(8) }}>
                                {item?.checks.map((item, index) => {
                                    return (
                                        <View key={'cks' + index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                            <Text style={styles.column1}>{item.checkNumber.length >= 4 ? `${item.checkNumber.slice(0, 5)}...` : item.checkNumber}</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={styles.column3}>{item?.bank_UC}</Text>
                                            <Text style={styles.column3}>{currencyArray[1] + ' ' + item.checkAmount}</Text>
                                        </View>
                                    )
                                })}
                                {totalAmountFooter('Total Cheques', getTotalAmount(item?.checks, 'checkAmount'))}
                            </View>
                        </> : <></>
                    }
                    <Text style={styles.xcd}>Total</Text>
                    <View style={{ marginHorizontal: responsiveWidth(8) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={styles.column1}>Total</Text>
                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                            <Text style={styles.column2}>{currencyArray[1]} {total ? total?.toFixed(2) : 0}</Text>
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
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    monthDepositMoney: {
        color: '#000', //8fd150
        fontWeight: "bold",
        fontSize: 35,
        // marginLeft: 5,
        // width: responsiveWidth(50),

    },
    monthDepositDescription: {
        // width: '45%',
        color: '#000',
        fontSize: responsiveFontSize(1.9)
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


const XCD = [
    {
        name: 'x100',
        amount: 60
    },
    {
        name: 'x50',
        amount: 20
    },
    {
        name: 'x20',
        amount: 10
    },
    {
        name: 'x10',
        amount: 60
    },
    {
        name: 'x5',
        amount: 40
    },
    {
        name: 'Coin 1$',
        amount: 80
    },
    {
        name: 'Coin',
        amount: 0
    }
]

const FX = [
    {
        name: 'USD',
        amount: 60
    },
    {
        name: 'GBP',
        amount: 20
    },
    {
        name: 'EUR',
        amount: 10
    },
    {
        name: 'CAD',
        amount: 60
    },
    {
        name: 'BDS',
        amount: 40
    },
    {
        name: 'TTD',
        amount: 80
    },

]

export default NotifiDetail
