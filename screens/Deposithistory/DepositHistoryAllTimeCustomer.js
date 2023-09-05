import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import CustomHeader from '../../components/CustomHeader'
import { useSelector } from 'react-redux';
import AllDepositCustomer from '../../components/AllDepositCustomer';
export default function DepositHistory({ navigation, route }) {
    const DepositHistory = useSelector(state => state.Main.UserDepositRecord.depositsAllTime);
    const total = useSelector(state => (state.Main.UserDepositRecord.totalDepositAllTime).length > 0 ? state.Main.UserDepositRecord.totalDepositAllTime[0]?.total : 0);



    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={{ marginHorizontal: responsiveScreenWidth(4) }}>
                    <CustomHeader name={'Deposits'} navigation={navigation} />

                    <View style={styles.monthDeposit}>
                        <Text style={styles.monthDepositMoney}>${total.toFixed(2)}</Text>
                        <Text style={styles.monthDepositDescription}>Total DGTL {`\n`} Deposits{`\n`}All time</Text>
                    </View>
                    <View style={{ marginVertical: 15 }} />
                    <View style={{ paddingHorizontal: 10 }}>
                        {DepositHistory.length < 1 ?
                            <View style={{ height: responsiveHeight(30), justifyContent: 'center', alignItems: 'center' }}>
                                <Text>No Deposit At All</Text>
                            </View>
                            :
                            <AllDepositCustomer item={DepositHistory} navigation={navigation} />
                        }
                    </View>


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
        color: '#8fd150',
        fontSize: responsiveFontSize(4.0),
        fontWeight: '700'

    },
    monthDepositDescription: {
        color: '#000',
        fontSize: responsiveFontSize(1.8),
        textAlign: 'center',
        fontWeight: '700'
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