import React, { Component, useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
    const DepositDetail = useSelector(state => route.params.status == 'pending' ? state.Main.UserDepositRecord.depositsThisMonthPending[route.params.selectedItem] : state.Main.UserDepositRecord.depositsThisMonthApproved[route.params.selectedItem]);
    const ScannedByTeller = useSelector(state => route.params.status == 'pending' ? state.Main.UserDepositRecord.depositsThisMonthPending[route.params.selectedItem].ScannedByTeller : state.Main.UserDepositRecord.depositsThisMonthApproved[route.params.selectedItem].ScannedByTeller);
    const BigID = useSelector(state => state.Main.UserDepositRecord.depositsThisMonthPending[route.params.selectedItem]?.bagID);
    const [loading, setLoading] = useState(true)
    const customerNameqc = useSelector(state =>state?.Main?.QrCodeScanedDetail?.customer?.name);
    // console.log('user data abb',abbrevation)
    const data = route?.params
    const customerName = data?.item?.customer_details[0]?.name
    console.log(customerName,customerNameqc)
    useEffect(() => {
        const stateInterval = setTimeout(() => {
            setLoading(false)
            // console.log(Depositsdd.company[0].companyName)

        }, 1500);
        return () => clearInterval(stateInterval)
    }, [])
    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                {/* <ActivityIndicator size={'large'} /> */}
               
                <Image source={require('../../assets/dgtl_icon_610.png')} 
                style={{height:70,width:70,borderRadius:50}} 
                resizeMode='contain'/>
                 <Text style={{fontWeight:'bold',fontSize:responsiveFontSize(1.5),color:"#18193F"}}>Loading...</Text>
            </View>
        )
    }
    else {


        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.topDistance} />
                <View style={{ marginHorizontal: responsiveWidth(4) }}>
                    <CustomHeader name={'Deposit Detail'} navigation={navigation} />
                </View>

                <View style={styles.monthDeposit}>
                    <View style={{width:'45%'}}>
                    <Text style={styles.monthDepositMoney}>{currencyArray[1]+' '+DepositDetail.total.value.toFixed(2)}</Text>
                    </View>
                    <View style={{width:'45%'}}>
                    <Text style={[styles.monthDepositDescription,{fontWeight:'bold'}]}>{customerName?customerName:customerNameqc}</Text>
                     <Text style={styles.monthDepositDescription}>Acct# {DepositDetail?.customer_details[0]?.accountNumber}</Text>
                     <Text style={[styles.monthDepositDescription,{fontWeight:'bold'}]}>{new Date(DepositDetail.createdAt).toDateString()}</Text>
                    </View>      
                </View>
                <View style={{ flex: 1, }}>
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>

                        <Text style={styles.breakDown}>Breakdown</Text>

                        {accountType == "customer" ? <></> :
                            <>
                                {ScannedByTeller ? <></> :
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
                                    <Text style={styles.xcd}>{currencyArray[0]}</Text>

                                </View>
                            </View>
                            <View style={{ marginHorizontal: responsiveWidth(7) }}>
                                {DepositDetail.Xcd.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700',width: responsiveWidth(20)}}>{item.name}</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700',width: responsiveWidth(40),textAlign:"center"}}>{currencyArray[1]+item.value}</Text>
                                        </View>
                                    )
                                })}
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
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: responsiveWidth(1) }}>
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(20) }}>{item.name}</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(40),textAlign:"center" }}>{currencyArray[1]+item?.EQV}</Text>
                                        </View>
                                    )
                                })}
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
                                        <View key={index} style={{marginLeft:responsiveWidth(1),marginRight:responsiveWidth(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700',}}>{item.checkNumber.length >=4 ? `${item.checkNumber.slice(0,5)} ...` :item.checkNumber }</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700',textAlign:"center" }}>{item?.bank_UC}</Text>
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700',textAlign:"center" }}>{currencyArray[1]+item?.checkAmount}</Text>

                                        </View>
                                    )
                                })}
                            </View>
                        </> : <></>
                    }
                    <Text style={styles.xcd}>Total</Text>
                    <View style={{ marginHorizontal: responsiveWidth(7) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(20) }}>Total</Text>
                             <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(40),textAlign:'center' }}>{currencyArray[1]+DepositDetail.total.value.toFixed(2)}</Text>
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
        flexDirection: 'row',
        marginTop: responsiveHeight(4),
        justifyContent: 'space-evenly',
    },
    monthDepositMoney: {
        color: '#8fd150',
        fontSize: responsiveFontSize(4),
        fontWeight: 'bold',
    },
    monthDepositDescription: {
        color: '#000',
        fontSize: responsiveFontSize(1.9)
    },
    breakDown: {
        color: '#000',
        fontSize: responsiveFontSize(2.2),
        fontWeight: '700',
        paddingHorizontal: responsiveWidth(4)
    },
    xcd: {
        marginVertical: responsiveHeight(3),
        fontSize: responsiveFontSize(2.6),
        color: '#14cdd4',
        fontWeight: '700',
        marginLeft: responsiveScreenWidth(4)
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
})
