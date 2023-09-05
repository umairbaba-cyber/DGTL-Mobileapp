import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
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
    // console.log('checktype',type)
    const [loading, setLoading] = useState(true)
    const index = route?.params?.index
    const item = route?.params?.item?.qr_data[0]
    const companyName = route?.params?.item?.qr_data[0]?.company_data[0]?.companyName
    const accountNumber = route?.params?.item?.qr_data[0]?.customer_data[0]?.accountNumber
    customerName = route?.params?.item?.qr_data[0]?.customer_data[0]?.name
    const abbrevation = useSelector(state =>state?.Main?.User?.data?.company?.abbrevation);
    // console.log('accontNumber check', accountNumber)
    const createdAt = route?.params?.item?.qr_data[0]?.createdAt
    const total = route?.params?.item?.qr_data[0]?.total?.value
    const Xcd = route?.params?.item?.qr_data[0]?.Xcd
    const Fx = route?.params?.item?.qr_data[0]?.FX
    const checks = route?.params?.item?.qr_data[0]?.checks[0]
    const forcheck = route?.params?.item
    console.log('params data now', forcheck)

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

                {/* <View style={styles.monthDeposit}>
                    <Text style={styles.monthDepositMoney}>EC $ {"DepositDetail?.total.value"}</Text>
                    <Text style={styles.monthDepositDescription}>
                        <Text style={{ fontWeight: '700' }}>{"DepositDetail.company[0].companyName"}</Text> {`\n`}Acct# {accountNumber}...{`\n`}<Text style={{ fontWeight: '700' }}>{new Date("DepositDetail.createdAt").toDateString()}</Text></Text>
                </View> */}
                <View style={styles.monthDeposit}>
                    <View>
                        <Text style={styles.monthDepositMoney}>{currencyArray[1]+' '+total?.toFixed(2)}</Text>
                    </View>
                    <View style={styles.monthDepositDescription}>
                        <Text style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: responsiveFontSize(2.0), color: "#000" }}>{customerName} </Text>
                        <Text style={{ textTransform: 'uppercase', fontSize: responsiveFontSize(2.0), color: "#000" }}>Acct# {accountNumber}</Text>
                        <Text style={{ fontWeight: '700', color: "#000" }}>{new Date(createdAt).toDateString()}</Text>
                        {type == 'customer' ? <></> :
                            <>
                                <TouchableOpacity onPress={() => navigation.replace('QrCode')} style={{ width: 100, height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#36C4F1', marginTop: 10 }}>
                                    <Text style={{ color: '#18193F', fontWeight: '700' }}>Verify</Text>
                                </TouchableOpacity>
                            </>
                        }

                    </View>
                </View>

                <View style={{ flex: 1, }}>
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>

                        <Text style={styles.breakDown}>Breakdown</Text>


                    </View>
                    {item?.Xcd?.length > 0 ?

                        <>

                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.xcd}>{currencyArray[0]}</Text>

                                </View>
                            </View>
                            <View style={{ marginHorizontal: responsiveWidth(7) }}>
                                {item?.Xcd?.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(20) }}>{item.name}</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(40),textAlign:"center" }}>{currencyArray[1]+item.value}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </> :
                        <></>
                    }
                    {item?.FX?.length > 0 ?
                        <>
                            <Text style={styles.xcd}>FX</Text>

                            <View style={{ marginHorizontal: responsiveWidth(7) }}>
                                {item?.FX?.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',  }}>
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(20) }}>{item.name}</Text>
                                            <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                            <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(40),textAlign:'center' }}>{currencyArray[1]+item?.EQV}</Text>
                                        </View>
                                    )
                                })}
                            </View>

                        </> :
                        <></>
                    }




                    {item?.checks?.length > 0 ?
                        <>
                            <Text style={styles.xcd}>CHEQUES</Text>
                            {item?.checks.map((item, index) => {
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',marginLeft:responsiveWidth(0),marginRight:responsiveWidth(14) }}>
                                        <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700',  }}>{item.checkNumber.length >=4 ? `${item.checkNumber.slice(0,5)}...` :item.checkNumber }</Text>
                                        <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                        <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700',textAlign:'center' }}>{item?.bank_UC}</Text>
                                        <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700',textAlign:'center' }}>{currencyArray[1]+item.checkAmount}</Text>
                                    </View>
                                )
                            })}
                        </> : <></>
                    }
                    <Text style={styles.xcd}>Total</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(20) }}>Total</Text>
                        <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                        <Text style={{ fontSize: responsiveFontSize(2.1), color: '#000', fontWeight: '700', width: responsiveWidth(40),textAlign:'center' }}>{currencyArray[1]+total?.toFixed(2)}</Text>

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
        justifyContent: 'space-between',
        // alignItems: 'center',

    },
    monthDepositMoney: {
        color: '#8fd150',
        fontWeight: "700",
        fontSize: responsiveFontSize(4),
        marginLeft: 5,
        width: responsiveWidth(50),

    },
    monthDepositDescription: {
        width: '45%',
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
