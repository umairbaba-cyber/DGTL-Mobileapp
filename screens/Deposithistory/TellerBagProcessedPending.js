import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import CustomHeader from '../../components/CustomHeader'
import PendingPayment from './components/PendingPayment';
import { useSelector } from 'react-redux';
export default function DepositHistory({ navigation, route }) {

    const DepositHistory = useSelector(state => state.Main.UserDepositRecord.depositsAllTimePending);
    const accountType = useSelector( state => state.Main.User.data.userData.accountType);

    console.log("accountType ===>", accountType);

    const getIndex = (id) => {
        const index = DepositHistory.findIndex((e) => e._id === id);
        if (index !== -1) {
            return index;
        } else {
            console.log(`Object with id ${id} not found in your data`);
            return 0;
        }
    }

    function FilterList() {
        let isEmpty = DepositHistory.find(item => {
            if (item.ScannedByTeller == false) {
                return true
            }
        });


        if (DepositHistory?.length < 1) {
            return (
                <View style={{ height: responsiveHeight(30), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#000' }}>No Pending Deposit </Text>
                </View>
            )
        } else {
            if (isEmpty == undefined) {
                return (
                    <View style={{ height: responsiveHeight(30), justifyContent: 'center', alignItems: 'center' }}>
                        <Text>No Pending Deposit </Text>
                    </View>
                )
            } else {
                return (
                    <View style={{ width: '100%', height: '92%', marginTop: 20, flex: 1,}}>
                        <FlatList
                            data={accountType === "teller"? DepositHistory.filter(item => !item.ScannedBySupervisor) : DepositHistory}
                            style={{flex: 1}}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <PendingPayment index={index} item={item} navigation={navigation} />
                            )}
                        />
                     </View> 
                    )

            }

        }
    }

    return (
        <View style={styles.container}>
                <View style={{ marginHorizontal: responsiveScreenWidth(4), flex: 1 }}>
                    <CustomHeader name={'Pending Deposit'} navigation={navigation} />
                    {/* <View style={{ marginVertical: 30 }} /> */}
                    <View style={{ paddingHorizontal: 10, flex: 1 }}>
                        {FilterList()}

                    </View>
                </View>
        </View>
    );

}



// <FlatList
//     data={DepositHistory}
//     renderItem={({ item, index }) => (

//         <PendingPayment index={index} item={item} navigation={navigation} />
//     )}
// />
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    monthDeposit: {
        flexDirection: 'row',
        marginTop: responsiveHeight(4),
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    submitButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: 100,
        height: 45,
        backgroundColor: 'skyblue'
    },

    monthDepositMoney: {
        color: 'green',
        fontSize: responsiveFontSize(2.7)
    },
    monthDepositDescription: {
        color: '#000',
        fontSize: responsiveFontSize(2.7),
        textAlign: 'center'
    },
    deposite: {
        borderWidth: 2,
        padding: 10,
        marginVertical: 3,


    }
})



const data = [
    {
        deposeted: true,
        status: 'completed',
        data: '23/3/2023',
        amount: '$234'
    },
    {
        deposeted: false,
        status: 'completed',
        data: '21/1/2020',
        amount: '$534'
    },
    {
        deposeted: true,
        status: 'completed',
        data: '22/2/2022',
        amount: '$334'
    },
    {
        deposeted: false,
        status: 'completed',
        data: '23/3/2022',
        amount: '$24'
    },

]