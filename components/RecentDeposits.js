import React from 'react';
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import ProgressCircle from 'react-native-progress-circle'
import PendingPayment from './../screens/Deposithistory/components/PendingPayment'
const { width, height } = Dimensions.get('window')
import { useSelector } from 'react-redux';

export default function RecentDeposits({ Deposits, navigation, role }) {
    const CurrencySymbole = useSelector(
        state => state?.Main?.User?.data?.company.localCurrency,
      );
      const currencyArray = CurrencySymbole.split('-');

    function FilertPending() {
        return (
            <>
                {role == "customer" ?
                    <></> :
                    <View>
                       {FilterList(navigation)}
                    </View>
                }
            </>
        )
    }

    function FilterList( navigation ) {
       
        let isEmpty = Deposits.find(item => {
            if (item.ScannedByTeller == false) {
                return true
            }
        });
       

        if (Deposits.length < 1) {
            return (
                <View style={{ height: responsiveHeight(30), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color:'#000'}}>No Pending Deposit </Text>
                </View>
            )
        } else {
            if (isEmpty == undefined) {
                return (
                    <View style={{ height: responsiveHeight(15), justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{color:'#000'}}>No Pending Deposit </Text>
                    </View>
                )
            } else {
                return (
                    <>
                  
                        {Deposits.map((item, index) => {
                            console.log('pending deposits item data',item)
                            if(index<3)
                            return(
                             <PendingPayment  index={index} item={item} navigation={navigation} />
                            )
                        })}
                    </>
                )

            }

        }
    }


    return (
        <View >
            {Deposits.length < 1 ?
                <View style={{ justifyContent: 'center', alignItems: 'center', height: responsiveHeight(7), }}>
                    <Text style={{color:'#000'}}>No Recent Deposits Yet</Text>
                </View>
                :
                <>
                    {Deposits.map((item, index) => {
                        // console.log('this is item',item)
                        if (index < 3)

                            return (
                                <>
                                    {
                                        role == "customer" ?

                                            <TouchableOpacity
                                                keyExtractor={(item, index) => String(index)}
                                                style={{ marginVertical: 2 }}
                                                onPress={() => navigation.navigate('CustomerViewDepositDetail', { selectedItem: index,detail:'Monthly',item })}
                                            >
                                                <View style={styles.recentDepositContainer}>

                                                    {item.ScannedByTeller ?
                                                        <>
                                                            <Image style={styles.imageStyle} source={require('../assets/dgtl_app_deposits.png')} />
                                                            <View style={{ marginLeft: 10 }}>
                                                                <Text style={styles.text}>{currencyArray[1]+item.total.value.toFixed(2)}</Text>
                                                                <Text style={styles.text}> Deposited on {new Date(item.createdAt).toLocaleDateString()},{new Date(item.createdAt).toLocaleTimeString()}</Text>
                                                            </View>
                                                        </>
                                                        :
                                                        <>
                                                            <Image style={styles.imageStyle} source={require('../assets/dgtl_app_pending.png')} />
                                                            <View style={{ marginLeft: 10 }}>
                                                                <Text style={{ ...styles.text, color: '#FBCD2A',fontWeight:'bold' }}>{currencyArray[1]+item.total.value.toFixed(2)}</Text>
                                                                <Text style={{ ...styles.text, color: 'black',fontWeight: 'normal' }}> Pending from  {new Date(item.createdAt).toLocaleDateString()},{new Date(item.createdAt).toLocaleTimeString()} </Text>
                                                            </View>
                                                        </>
                                                    }

                                                </View>
                                            </TouchableOpacity> :
                                            <>




                                            </>
                                    }
                                </>
                            )

                    })}


                    {FilertPending()}


                </>}

            <View style={{ marginLeft: responsiveWidth(2) }}>
                <View style={styles.BagSection}>
                    <Image style={{ ...styles.eyeImageStyles, right: width > 700 ? 0 : 10 }} source={require('../assets/eye3.png')} />

                    {role == "customer" ?
                        <Text onPress={() => navigation.navigate('DepositHistory')} style={{ ...styles.eyeImageText, left: width > 700 ? responsiveWidth(4.5) : 0 }}>View All Deposits</Text> :
                        <Text onPress={() => navigation.navigate('PaymentPending')} style={{ ...styles.eyeImageText, left: width > 700 ? responsiveWidth(4.5) : 0 }}>View All Pending Deposits</Text>

                    }
                </View>

                {role == "customer" ?
                    <TouchableOpacity onPress={() => navigation.navigate('RequestBag')} style={styles.BagSection}>
                        <Image style={{ ...styles.eyeImageStyles, right: width > 700 ? 0 : 10, }} source={require('../assets/moneybag1.png')} />
                        <Text style={{ ...styles.eyeImageText, left: width > 700 ? responsiveWidth(4.5) : 0 }}>Request New Bags</Text>
                    </TouchableOpacity> :
                    <>
                        <TouchableOpacity onPress={() => navigation.navigate('PaymentApproved')} style={styles.BagSection}>
                            <Image style={{ ...styles.eyeImageStyles, right: width > 700 ? 0 : 10, }} source={require('../assets/moneybag1.png')} />
                            <Text style={{ ...styles.eyeImageText, left: width > 700 ? responsiveWidth(4.5) : 0 }}>View Completed Deposits</Text>
                        </TouchableOpacity>

                    </>}
                <TouchableOpacity onPress={() => navigation.navigate('GenrateReport')} style={{ ...styles.BagSection, marginLeft: 5, right: width > 700 ? 0 : 10 }}>

                    <ProgressCircle
                        percent={30}
                        radius={15}
                        borderWidth={4}
                        color="#000"
                        shadowColor="#999"
                        bgColor="#fff"
                    >
                        <Text style={{ fontSize: responsiveFontSize(0.9), color: '#000', }}>{'30%'}</Text>
                    </ProgressCircle>
                    <Text style={{ marginLeft: 20, color: '#000', fontWeight: '700', left: width > 700 ? responsiveWidth(3.5) : 0 }}>Generate Reports</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}


const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    recentDepositContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    eyeImageStyles: {
        height: 40,
        width: 40,
        resizeMode: 'contain'
    },
    eyeImageText: {
        marginLeft: 5,
        color: '#000',
        fontWeight: '700',
    },
    topDistance: {
        marginTop: responsiveScreenHeight(5)

    },
    Notification: {
        height: responsiveScreenHeight(8),
        width: responsiveScreenWidth(8),
        resizeMode: 'contain',


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
    depositContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveScreenHeight(3),
        height: responsiveScreenHeight(22),
        marginHorizontal: 5
    },
    depositButtons: {
        borderWidth: 1,
        width: responsiveScreenWidth(37),
        height: responsiveScreenHeight(20),
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
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center'

    },
    RecentDeposit: {
        fontSize: responsiveFontSize(4),
        color: '#000',
        marginLeft: 5,
        marginVertical: responsiveScreenHeight(2)
    },
    viewAllDeposit: {
        marginLeft: responsiveScreenWidth(2.0),
        color: '#3badfb',


    },
    imageStyle: {
        width: responsiveScreenWidth(10),
        height: responsiveScreenHeight(10),
        resizeMode: 'contain'
    },
    text: {
        fontSize: responsiveFontSize(2.0),
        fontWeight: '600',
        color: '#000'
    }

})


const data = [
    {
        deposeted: true,

        data: '23/3/2023',
        amount: '$234'
    },
    {
        deposeted: false,

        data: '21/1/2020',
        amount: '$534'
    },
    {
        deposeted: true,

        data: '22/2/2022',
        amount: '$334'
    },
    {
        deposeted: false,

        data: '23/3/2022',
        amount: '$24'
    },

]