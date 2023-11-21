import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { responsiveFontSize, responsiveScreenWidth, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

//it is sixth scrren
//on this screen user is shown his deposit is completed when he click on button he he navigated back to main screen
export default function VarifyDeposit({ navigation, route, props }) {
  const [isLoading, setLoading] = useState(false);

  const note = route?.params?.discrepancy
  console.log("Note: ",note)
  const CurrencySymbole = useSelector(
    state => state?.Main?.User?.data?.company.localCurrency,
  );
  const currencyArray = CurrencySymbole.split('-');

  const [depositId, setDepositId] = useState(route?.params?.data?.qrsingle._id)
  const [Amount, setAmount] = useState(route.params?.data?.qrsingle.total.value)
  const QrCodeScanedDetail = route?.params?.QrCodeScanedDetail?.customer;
  console.log('QrCodeScanedDetail', QrCodeScanedDetail)
  const accountNumber = useSelector(state => state?.Main?.User?.data?.userData?.accountNumber);
  const check = useSelector(state => state?.Main?.User?.data)
  // console.log('for data check',check)
  const userData = useSelector(state => state?.Main?.User?.data?.userData);
  console.log('for customer', userData)
  const bagId = route?.params?.data?.qrsingle?.bagID
  const qrsingle = route?.params?.QRSingle
  const accountType = route?.params?.accountType
  console.log("qrsingle ----", qrsingle);
  const customerData = route?.params?.QrCodeScanedDetail?.customer;
  const abbrevation = useSelector(state => state?.Main?.User?.data?.company?.abbrevation);
  // const [depositId,setDepositId]=useState('')
  // const [Amount,setAmount]=useState('')

  function NavigateBackToHome() {
    setLoading(true)
    navigation.reset({ index: 0, routes: [{ name: "Home" }], })
    setLoading(false)
  }
  return (
    <ScrollView style={styles.main}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View style={{ marginHorizontal: responsiveWidth(4) }}>
        <CustomHeader name={'Verify Deposit'} navigation={navigation} />
      </View>
      <Text style={styles.confirmText}>CONFIRM </Text>

      <View style={{ alignSelf: 'center' }}>
        <Text style={styles.textSize}>Digital Deposit ID : {abbrevation.concat(bagId.slice(bagId.length - 10 + abbrevation.length, bagId.length))}</Text>
        <Text style={styles.textAmount}>{currencyArray[1] + ' ' + Amount.toFixed(2)}</Text>
        <Text style={styles.textSize}> {route.params?.QrCodeScanedDetail.company.companyName}</Text>
        <Text style={styles.textSize}>Name: {customerData?.name}</Text>
        <Text style={styles.textSize}>ACCT# {customerData?.accountNumber}</Text>
      </View>

      {(accountType === 'teller' && note == 'Yes') ?
        <>
          <Text style={{ color: 'black', marginLeft: 20 }}>{'Discrepancies: ' + route?.params?.discrepancy}</Text>
          <View style={styles.discrepancy}>
            <View style={styles.discrepancyContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.subHeading}>{'Type: '}</Text>
                <Text style={styles.normalTxt}>{route?.params?.discrepanciesType}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.subHeading}>{'Amount: '}</Text>
                <Text style={styles.normalTxt}>{route?.params?.discrepanciesAmount}</Text>
              </View>
            </View>
            <Text style={[styles.subHeading, { marginTop: responsiveHeight(0.8), marginLeft: responsiveHeight(1) }]}>{'Notes'}</Text>
            <Text style={[styles.normalTxt, { marginTop: responsiveHeight(0.8), marginLeft: responsiveHeight(1) }]}>
              {route?.params?.discrepanciesNote}
            </Text>
          </View>
        </>
        : (note == 'No') && <Text style={{ color: 'black', marginLeft: 20 }}>{""}</Text>
      }
      {accountType === 'supervisor' &&
        <View style={styles.discrepancy}>
          <View style={styles.discrepancyContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.subHeading}>{'ID: '}</Text>
              <Text style={styles.normalTxt}>{
                abbrevation.concat(
                  qrsingle?.bagID?.slice(
                    qrsingle?.bagID?.length - 10 + abbrevation.length,
                    qrsingle?.bagID?.length,
                  ),
                )}</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
              <Text style={styles.subHeading}>{'Discrepancies: '}</Text>
              <Text style={styles.normalTxt}>{qrsingle?.discrepancies ? `${qrsingle?.discrepancies}` : "No"}</Text>
            </View>
          </View>
          {qrsingle?.discrepancies &&
            <>
              <View style={styles.discrepancyContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.subHeading}>{'Type: '}</Text>
                  <Text style={styles.normalTxt}>{`${qrsingle?.discrepanciesType}`}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.subHeading}>{'Amount: '}</Text>
                  <Text style={styles.normalTxt}>{`${qrsingle?.discrepanciesAmount}`}</Text>
                </View>
              </View>
              <Text style={[styles.subHeading, { marginTop: responsiveHeight(0.8) }]}>{'Notes:'}</Text>
              <Text style={[styles.normalTxt, { marginTop: responsiveHeight(0.8) }]}>
                {`${qrsingle?.discrepanciesNote}`}
              </Text>
            </>
          }
        </View>
      }


      <View style={{ marginTop: responsiveHeight(20) }} />

      <Text style={{ marginVertical: responsiveHeight(0.0), color: '#000', textAlign: 'center' }}>Click Submit to confirm</Text>

      <TouchableOpacity onPress={() => NavigateBackToHome()} style={styles.loginButton}>
        {isLoading ?
          <ActivityIndicator color={'#686868'} size={'small'} style={{ marginLeft: 10 }} />
          :
          <>
            <Image source={require('../../assets/submit.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
            <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.3), marginLeft: 5 }}>Submit</Text>
          </>
        }
      </TouchableOpacity>

    </ScrollView>
  );


}


const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topDistance: {
    marginTop: responsiveHeight(4)

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
    textAlign: 'center'
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
    backgroundColor: 'lightgreen'
  },
  loginButton: {
    backgroundColor: '#36C4F1',
    width: '80%',
    height: 45,
    flexDirection: 'row',
    marginTop: responsiveHeight(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  loginButtonText: {
    color: '#18193F',
    fontSize: responsiveFontSize(2)
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
