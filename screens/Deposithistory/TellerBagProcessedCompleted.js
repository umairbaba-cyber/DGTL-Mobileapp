import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import CustomHeader from '../../components/CustomHeader'
import CompletedPayment from './components/CompletedPayment';
import { useSelector } from 'react-redux';
import DepositApprovedByTeller from '../../components/DepositApprovedTeller';
import { useIsFocused } from '@react-navigation/native';
export default function DepositHistory({ navigation, route }) {
    const DepositHistory = useSelector(state => state.Main.UserDepositRecord.depositsAllTimeApproved);

    console.log('DepositHistory ---', DepositHistory);
    const [data, setData] = useState([]);
    const isFocused = useIsFocused();
    useEffect(() => {
        const arr = DepositHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setData(arr)
    }, [isFocused]);

    const getIndex = (id) => {
        const index = data.findIndex((e) => e._id === id);
        if (index !== -1) {
            return index;
        } else {
            console.log(`Object with id ${id} not found in your data`);
            return 0;
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ marginHorizontal: responsiveScreenWidth(4), flex: 1 }}>
                <CustomHeader name={'Completed Deposit'} navigation={navigation} />


                {/* <View style={{ marginVertical: 30 }} /> */}
                <View style={{ paddingHorizontal: 10, flex: 1, marginTop: 20 }}>
                    {data?.length < 1 ?

                        <View style={{ height: responsiveHeight(30), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#000' }}>No Completed Deposit</Text>
                        </View> :
                        <FlatList
                            data={data}
                            showsVerticalScrollIndicator={false}
                            style={{ flex: 1 }}
                            renderItem={({ item, index }) => (
                                <CompletedPayment index={getIndex(item._id)} item={item} navigation={navigation} />
                            )}
                        />

                    }
                </View>

            </View>
        </View>
    );

}

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