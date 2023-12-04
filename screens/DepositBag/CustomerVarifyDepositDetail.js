import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import {
  responsiveFontSize,
  responsiveScreenWidth,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BasePath from '../../config/BasePath';

//it is fifth scrren
//on this screen user is shown the amount and values
export default function VarifyDeposit({ navigation, route }) {
  console.log('route ---', route.name);

  const CurrencySymbole = useSelector(
    state => state?.Main?.User?.data?.company.localCurrency,
  );
  const currencyArray = CurrencySymbole.split('-');

  const XCD = useSelector(state => state.Main.Xcd);
  const companyName = useSelector(state => state.Main.User.data.userData.name);
  const dailyLimit = useSelector(state => state.Main.User.data.userData.daily_limit);
  const monthlyLimit = useSelector(state => state.Main.User.data.userData.monthly_limit);
  const userdata = useSelector(state => state.Main.User);
  const grandTotal = useSelector(state => state.Main.UserDepositRecord?.totalDepositThisMonth[0]?.total);
  console.log('dailyLimit', dailyLimit);
  console.log('monthlyLimit', monthlyLimit);
  console.log('grandTotal ---->', JSON.stringify(grandTotal));
  const FX = useSelector(state => state.Main.Fx);
  // console.log('FX', FX);
  const Checks = useSelector(state => state.Main.Checks);
  const Amount = useSelector(state => state.Main.total.value);
  const total = useSelector(state => state.Main.total);
  const accountNumber = useSelector(
    state => state?.Main?.User?.data?.userData?.accountNumber,
  );
  const [token, setToken] = useState('');
  const { bagID, clientID, customerID, updatedAt } = useSelector(
    state => state.Main.QrCodeScanedDetail.qrsingle,
  );


  useEffect(() => {
    GetToken();
  }, []);
  async function GetToken() {
    let usertoken = await AsyncStorage.getItem('token');
    setToken(usertoken);
  }
  //this response will be send to api to verify user info

  console.log('bagId ===>', bagID);

  async function VerifyRecord() {
    if (total.value == 0) {
      alert('Please Enter Valid Amount');
      return;
    }

    // console.log('XCD_Without_Zeroes', XCD_Without_Zeroes);
    console.log('total', grandTotal);  // total.value
    console.log('dailyLimit', dailyLimit);
    console.log('monthlyLimit', monthlyLimit);

    let limitExceed;

    if (Number(grandTotal) > Number(monthlyLimit)) {
      limitExceed = true
      console.log('-----1');
    } else if(Number(grandTotal) + Number(total?.value) > Number(monthlyLimit)){
      console.log('----2');
      limitExceed = true
    }else{
      if (Number(total?.value) > Number(dailyLimit)) {
        console.log('-----3');
        limitExceed = true
      } else {
        console.log('-----4');
        limitExceed = false
      }
    }

    const depositDetail = {
      total: total,
      bagID: bagID,
      customerID: customerID,
      clientID: clientID,
      Xcd: XCD.length < 1 ? [] : XCD_Without_Zeroes,
      checks: Checks.length < 1 ? [] : Checks,
      total: total,
      FX: FX.length < 1 ? [] : FX,
      limitExceed: limitExceed,
    };

    console.log('limitExceed', Number(grandTotal) + Number(total?.value),  Number(monthlyLimit));
    navigation.navigate('CompleteDepositCustomer', depositDetail);

    // await axios.post(BasePath + 'customerDepositRequest',
    //   {

    //     total: total,
    //     bagID: bagID,
    //     customerID: customerID,
    //     clientID: clientID,
    //     Xcd: XCD.length < 1 ? [] : XCD,
    //     checks: Checks.length < 1 ? [] : Checks,
    //     total: total,
    //     FX: FX.length < 1 ? [] : FX

    //   }, {
    //   params: {
    //     x_auth: token
    //   }
    // }
    // ).then(res => {
    //   // const { data, code } = res.data
    //   console.log('verify api data', res.data)

    //   if (res.data.data.qrsingle.ScannedByCustomer == true) {
    //     alert('CompleteDepositCustomer')
    //     // navigation.navigate('CompleteDepositCustomer',res.data)
    //   } else {
    //     alert('CompleteDeposit')

    //     // navigation.navigate('CompleteDeposit',res.data )
    //   }

    // }).catch((e) => {
    //   alert(e.response.data.message)
    //   console.log('error is 3', e.response.data)
    // })
  }

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

  const XCD_Without_Zeroes = XCD.filter((e) => e.value !== 0);
  // console.log('XCD_With_Zeroes', XCD);
  // console.log('XCD_Without_Zeroes', XCD_Without_Zeroes);

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={'#EBF3EF'} barStyle={'dark-content'} />
      <View style={{ backgroundColor: '#EBF3EF', paddingHorizontal: responsiveScreenWidth(4), paddingBottom: 30, }}>
        <CustomHeader name={'Verify Deposit'} navigation={navigation} />
        <View style={styles.monthDeposit}>
          <Text style={styles.monthDepositMoney}>
            {currencyArray[1] + " " + Amount.toFixed(2)}
          </Text>
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <Text
              style={[styles.monthDepositDescription, { fontWeight: 'bold' }]}>
              {companyName}
            </Text>
            <Text style={styles.monthDepositDescription}>
              Account Number: {accountNumber}
            </Text>
            <Text
              style={[styles.monthDepositDescription, { fontWeight: 'bold' }]}>
              {new Date(updatedAt).toDateString()}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.breakDown}>Breakdown</Text>

        {XCD.length < 1 ? (
          <></>
        ) : (
          <>
            <Text style={styles.xcd}>{currencyArray[0]}</Text>
            <View style={{ marginHorizontal: responsiveWidth(7) }}>
              {XCD_Without_Zeroes.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.column1}>{item.name}</Text>
                    <Image
                      style={styles.imageStyle}
                      source={require('../../assets/rightarrow.png')}
                    />
                    <Text style={styles.column2}>{getCoins(item.name, item.value)}</Text>
                  </View>
                );
              })}
              {totalAmountFooter('Total Local Currency', getTotalAmount(XCD_Without_Zeroes, 'value'))}
            </View>
          </>
        )}
        {FX.length < 1 ? (
          <></>
        ) : (
          <>
            <Text style={styles.xcd}>FX</Text>
            <View style={{ marginHorizontal: responsiveWidth(7) }}>
              {FX.map((item, index) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                    <Text style={styles.column1}>{item.name}</Text>
                    <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                    <Text style={styles.column2}>{currencyArray[1] + ' ' + item.EQV}</Text>
                  </View>
                );
              })}
              {totalAmountFooter('Total Foreign Exchange', getTotalAmount(FX, 'EQV'))}
            </View>
          </>
        )}

        {Checks.length < 1 ? (
          <></>
        ) : (
          <>
            <Text style={styles.xcd}>CHEQUES</Text>
            <View style={{ marginHorizontal: responsiveWidth(7) }}>
              {Checks.map((item, index) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                    <Text style={styles.column1}>
                      {item.checkNumber.length >= 4
                        ? `${item.checkNumber.slice(0, 5)}...`
                        : item.checkNumber}
                    </Text>
                    <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                    <Text style={styles.column3}>{item.bank_UC}</Text>
                    <Text style={styles.column3}>{currencyArray[1] + ' ' + item.checkAmount}</Text>
                  </View>
                );
              })}
              {totalAmountFooter('Total Cheques', getTotalAmount(Checks, 'checkAmount'))}
            </View>
          </>
        )}
        {/* navigation.navigate('CompleteDeposit') */}
        <TouchableOpacity
          onPress={() => VerifyRecord()}
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topDistance: {
    marginTop: responsiveHeight(4),
  },
  monthDeposit: {
    // flexDirection: 'row',
    // marginTop: responsiveHeight(4),
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  monthDepositMoney: {
    color: '#000', //8fd150
    fontWeight: 'bold',
    fontSize: 35,
  },
  monthDepositDescription: {
    color: '#000',
    fontSize: 15,
  },
  breakDown: {
    color: '#000',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    marginHorizontal: responsiveWidth(7),
    marginTop: 10,
  },
  xcd: {
    marginVertical: responsiveHeight(3),
    fontSize: responsiveFontSize(2.6),
    color: '#686868', //14cdd4
    fontWeight: '700',
    marginLeft: responsiveScreenWidth(7),
  },
  submitButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: 100,
    height: 45,
    backgroundColor: 'lightgreen',
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
  loginButton: {
    backgroundColor: '#36C4F1',
    width: '80%',
    height: 45,
    marginTop: responsiveHeight(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: responsiveScreenHeight(5),
  },
  loginButtonText: {
    color: '#18193F',
    fontSize: responsiveFontSize(2),
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
});
