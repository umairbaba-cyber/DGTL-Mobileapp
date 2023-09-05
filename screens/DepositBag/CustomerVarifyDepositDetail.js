import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import {
  responsiveFontSize,
  responsiveScreenWidth,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BasePath from '../../config/BasePath';

//it is fifth scrren
//on this screen user is shown the amount and values
export default function VarifyDeposit({navigation}) {
  
  const CurrencySymbole = useSelector(
    state => state?.Main?.User?.data?.company.localCurrency,
  );
  const currencyArray = CurrencySymbole.split('-');

  const XCD = useSelector(state => state.Main.Xcd);
  const companyName = useSelector(state => state.Main.User.data.userData.name);
  console.log('companyName', companyName);
  const FX = useSelector(state => state.Main.Fx);
  console.log('FX', FX);
  const Checks = useSelector(state => state.Main.Checks);
  const Amount = useSelector(state => state.Main.total.value);
  const total = useSelector(state => state.Main.total);
  const accountNumber = useSelector(
    state => state?.Main?.User?.data?.userData?.accountNumber,
  );
  console.log('accoutNumberCheck', accountNumber);
  const [token, setToken] = useState('');
  const {bagID, clientID, customerID, updatedAt} = useSelector(
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

  async function VerifyRecord() {
    if (total.value == 0) {
      alert('Please Enter Valid Amount');
      return;
    }

    const depositDetail = {
      total: total,
      bagID: bagID,
      customerID: customerID,
      clientID: clientID,
      Xcd: XCD.length < 1 ? [] : XCD,
      checks: Checks.length < 1 ? [] : Checks,
      total: total,
      FX: FX.length < 1 ? [] : FX,
    };
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

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{marginHorizontal: responsiveWidth(4)}}>
        <CustomHeader name={'Verify Deposit'} navigation={navigation} />
      </View>

      {/* <View style={styles.monthDeposit}>
        <Text style={styles.monthDepositMoney}>EC $ {Amount.toFixed(3)}</Text>
        <Text style={styles.monthDepositDescription}><Text style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: responsiveFontSize(2.0),width:'90%' }}>{"usman idressm"} </Text>{`\n`}Acct# {accountNumber}...{`\n`}<Text style={{ fontWeight: '700' }}>{new Date(updatedAt).toDateString()}</Text></Text>
      </View> */}
      <View style={styles.monthDeposit}>
        <View style={{width: '45%'}}>
          <Text style={styles.monthDepositMoney}>{currencyArray[1]+" "+Amount.toFixed(2)}</Text>
        </View>
        <View style={styles.monthDepositDescription}>
          <Text
            style={{
              fontWeight: '700',
              textTransform: 'uppercase',
              fontSize: responsiveFontSize(2),
              color: '#000',
            }}>
            {companyName}{' '}
          </Text>
          <Text
            style={{
              textTransform: 'uppercase',
              fontSize: responsiveFontSize(2.0),
              color: '#000',
            }}>
            Acct# {accountNumber}
          </Text>
          <Text style={{fontWeight: '700', color: '#000'}}>
            {new Date(updatedAt).toDateString()}
          </Text>
        </View>
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.breakDown}>Breakdown</Text>

        {XCD.length < 1 ? (
          <></>
        ) : (
          <>
            <Text style={styles.xcd}>{currencyArray[0]}</Text>
            <View>
              {XCD.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: responsiveWidth(7),
                      width: '100%',
                    }}>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.1),
                        color: '#000',
                        fontWeight: '700',
                        width: responsiveWidth(20),
                      }}>
                      {item.name}
                    </Text>
                    <Image
                      style={styles.imageStyle}
                      source={require('../../assets/rightarrow.png')}
                    />
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.1),
                        color: '#000',
                        fontWeight: '700',
                        width: responsiveWidth(40),
                        textAlign: 'center',
                      }}>
                      {currencyArray[1]+item.value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
        {FX.length < 1 ? (
          <></>
        ) : (
          <>
            <Text style={styles.xcd}>FX</Text>
            {FX.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: responsiveWidth(7),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.1),
                      color: '#000',
                      fontWeight: '700',
                      width: responsiveWidth(20),
                    }}>
                    {item.name}
                  </Text>
                  <Image
                    style={styles.imageStyle}
                    source={require('../../assets/rightarrow.png')}
                  />
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.1),
                      color: '#000',
                      fontWeight: '700',
                      width: responsiveWidth(40),
                      textAlign: 'center',
                    }}>
                    {currencyArray[1]+item.EQV}
                  </Text>
                </View>
              );
            })}
          </>
        )}

        {Checks.length < 1 ? (
          <></>
        ) : (
          <>
            <Text style={styles.xcd}>CHEQUES</Text>
            {Checks.map((item, index) => {
              console.log('check number', item);
              return (
                <View
                  style={{
                    marginLeft: responsiveWidth(1),
                    marginRight: responsiveWidth(14),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: responsiveWidth(7),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.1),
                      color: '#000',
                      fontWeight: '700',
                    }}>
                    {item.checkNumber.length >= 4
                      ? `${item.checkNumber.slice(0, 5)}...`
                      : item.checkNumber}
                  </Text>
                  <Image
                    style={styles.imageStyle}
                    source={require('../../assets/rightarrow.png')}
                  />
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.1),
                      color: '#000',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    {item.bank_UC}
                  </Text>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.1),
                      color: '#000',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    {currencyArray[1]+item.checkAmount}
                  </Text>
                </View>
              );
            })}
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
    flexDirection: 'row',
    marginTop: responsiveHeight(4),
    justifyContent: 'space-evenly',
  },
  monthDepositMoney: {
    color: '#8fd150',
    fontWeight: '700',
    fontSize: responsiveFontSize(4),
  },
  monthDepositDescription: {
    width: '45%',
  },
  breakDown: {
    color: '#000',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    marginHorizontal: responsiveWidth(4),
    marginTop: 10,
  },
  xcd: {
    marginVertical: responsiveHeight(3),
    fontSize: responsiveFontSize(2.6),
    color: '#14cdd4',
    fontWeight: '700',
    marginLeft: responsiveScreenWidth(6),
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
});
