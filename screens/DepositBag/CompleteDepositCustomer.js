import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, StatusBar} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import {
  responsiveFontSize,
  responsiveScreenWidth,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BasePath from '../../config/BasePath';
import AsyncStorage from '@react-native-async-storage/async-storage';

//it is sixth scrren
//on this screen user is shown his deposit is completed when he click on button he he navigated back to main screen
const CompleteDepositCustomer = ({ navigation, route, props }) => {

  const CurrencySymbole = useSelector(
    state => state?.Main?.User?.data?.company.localCurrency,
  );
  const currencyArray = CurrencySymbole.split('-');

  const [token, setToken] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    GetToken();
  }, []);
  async function GetToken() {
    let usertoken = await AsyncStorage.getItem('token');
    setToken(usertoken);
  }
  const data = route?.params;
  console.log('Data ---', data);
  const [depositId, setDepositId] = useState(
    route?.params?.data?.qrsingle?._id,
  );
  const [Amount, setAmount] = useState(
    route.params?.data?.qrsingle?.total?.value,
  );
  const accountNumber = useSelector(
    state => state?.Main?.User?.data?.userData?.accountNumber,
  );
  const companyName = useSelector(
    state => state?.Main?.QrCodeScanedDetail?.company?.companyName,
  );
  // console.log('for data check',check)
  const userData = useSelector(state => state?.Main?.User?.data?.userData);
  console.log('for customer', userData);
  const bagId = route?.params?.data?.qrsingle?.bagID;

  const abbrevation = useSelector(
    state => state?.Main?.User?.data?.company?.abbrevation,
  );

  // const [depositId,setDepositId]=useState('')
  // const [Amount,setAmount]=useState('')

  const NavigateBackToHome = async () => {
    setLoading(true);
    await axios
      .post(
        BasePath + 'customerDepositRequest', 
        data,
        {
          params: {
            x_auth: token,
          },
        },
      )
      .then(res => {
        setLoading(false)
        console.log('verify api data', res.data);

        if (res.data.data.qrsingle.ScannedByCustomer == true) {

          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

          // navigation.navigate('CompleteDepositCustomer',res.data)
        } else {
          navigation.navigate('CompleteDeposit', res.data);
        }
      })
      .catch(e => {
        setLoading(false)
        alert(e.response.data.message);
        console.log('error is', e.response.data);
      });
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'}/>
      <View style={{ marginHorizontal: responsiveWidth(4) }}>
        <CustomHeader name={'Verify Deposit'} navigation={navigation} />
      </View>
      <Text style={styles.confirmText}>CONFIRM </Text>
      <View style={{ alignSelf: 'center' }}>
        <Text style={styles.textSize}>
          Digital Deposit ID :{' '}
          {abbrevation.concat(
            data?.bagID.slice(
              data?.bagID.length - 10 + abbrevation.length,
              data.bagID.length,
            ),
          )}
        </Text>
        <Text style={styles.textAmount}>
          {currencyArray[1] + ' ' + data?.total?.value.toFixed(2)}
        </Text>
        <Text style={styles.textSize}> {companyName}</Text>
        <Text style={styles.textSize}>Name: {userData?.name}</Text>
        <Text style={styles.textSize}>ACCT# {accountNumber}</Text>
        <Text
          style={styles.submit}>
          Click Submit to confirm
        </Text>
      </View>
      <View style={{ marginTop: responsiveHeight(20) }} />
      {/* () =>navigation.reset({index: 0,routes: [{name: "Home"}],}) */}
      <TouchableOpacity
        onPress={() => NavigateBackToHome()}
        style={styles.loginButton}
        disabled={isLoading ? true : false}
      >
        <Image
          source={require('../../assets/submit.png')}
          style={{
            width: 30,
            height: 30,
            resizeMode: 'contain',
            tintColor: '#18193F',
          }}
        />
        <Text
          style={{
            color: '#18193F',
            fontSize: responsiveFontSize(2.3),
            marginLeft: 5,
          }}>
          Submit
        </Text>
        {isLoading &&
          <ActivityIndicator color={'#686868'} size={'small'} style={{ marginLeft: 10 }} />
        }
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topDistance: {
    marginTop: responsiveHeight(4),
  },
  submit: {
    marginVertical: responsiveHeight(0.5),
    color: '#000',
    textAlign: 'center',
  },
  confirmText: {
    textAlign: 'center',
    color: '#14cdd4',
    fontWeight: '700',
    marginVertical: 20,
    fontSize: responsiveFontSize(3),
  },
  textSize: {
    fontSize: responsiveFontSize(2.4),
    color: '#000',
    fontWeight: '700',
    marginVertical: responsiveHeight(0.8),
    textAlign: 'center',
  },
  textAmount: {
    fontSize: responsiveFontSize(4.4),
    color: '#8fd150',
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  submitButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: responsiveScreenWidth(60),
    height: 45,
    backgroundColor: 'lightgreen',
  },
  loginButton: {
    backgroundColor: '#36C4F1',
    width: '80%',
    height: 45,
    flexDirection: 'row',
    marginTop: responsiveHeight(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#18193F',
    fontSize: responsiveFontSize(2),
  },
});

export default CompleteDepositCustomer;
