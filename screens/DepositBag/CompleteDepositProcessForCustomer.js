import React, { Component,useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Image } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { responsiveFontSize, responsiveScreenWidth, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

//it is sixth scrren
//on this screen user is shown his deposit is completed when he click on button he he navigated back to main screen
export default function VarifyDeposit({ navigation,route,props }) {

  const CurrencySymbole = useSelector(
    state => state?.Main?.User?.data?.company.localCurrency,
  );
  const currencyArray = CurrencySymbole.split('-');

  const [depositId,setDepositId]=useState(route?.params?.data?.qrsingle._id)
  const [Amount,setAmount]=useState(route.params?.data?.qrsingle.total.value)
  const customerData = route?.params?.data?.customer
  console.log('params data',customerData)
  const accountNumber = useSelector(state => state?.Main?.User?.data?.userData?.accountNumber);
  const check = useSelector(state => state?.Main?.User?.data)
  // console.log('for data check',check)
  const userData = useSelector(state => state?.Main?.User?.data?.userData);
  console.log('for customer',userData)
  const bagId = route?.params?.data?.qrsingle?.bagID

  const abbrevation = useSelector(state =>state?.Main?.User?.data?.company?.abbrevation);
  // const [depositId,setDepositId]=useState('')
  // const [Amount,setAmount]=useState('')

 function NavigateBackToHome(){

  navigation.reset({index: 0,routes: [{name: "Home"}],})
 }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      
      <View style={{ marginHorizontal: responsiveWidth(4) }}>
        <CustomHeader name={'Verify Deposit'} navigation={navigation} />
      </View>
      <Text style={styles.confirmText}>CONFIRM </Text>

      <View style={{alignSelf:'center'}}>
        <Text style={styles.textSize}>Digital Deposit ID : {abbrevation.concat(bagId.slice(bagId.length - 10 + abbrevation.length, bagId.length))}</Text>
        <Text style={styles.textAmount}>{currencyArray[1]+' '+Amount.toFixed(2)}</Text>
        <Text style={styles.textSize}> {route.params?.data.company.companyName}</Text>
        <Text style={styles.textSize}>Name: {customerData?.name}</Text>
        <Text style={styles.textSize}>ACCT# {customerData?.accountNumber}</Text>
        <Text style={{marginVertical:responsiveHeight(0.5),color:'#000',textAlign:'center'}}>Click Submit to confirm</Text>
      </View>
      <View style={{marginTop:responsiveHeight(20)}}/>
      {/* () =>navigation.reset({index: 0,routes: [{name: "Home"}],}) */}
        <TouchableOpacity onPress={() =>NavigateBackToHome()} style={styles.loginButton}>
          <Image source={require('../../assets/submit.png')} style={{width:30,height:30,resizeMode:'contain'}}/>
          <Text style={{ color:'#fff',fontSize:responsiveFontSize(2.3),marginLeft:5}}>Submit</Text>
        </TouchableOpacity>

    </ScrollView>
  );


}


const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topDistance: {
    marginTop: responsiveHeight(4)

  },
  confirmText:{
    textAlign:'center',
    color: '#14cdd4',
    fontWeight:'700',
    marginVertical:20,
    fontSize:responsiveFontSize(3),
  },
  textSize:{
    fontSize:responsiveFontSize(2.4),
    color:'#000',
    fontWeight:'700',
    marginVertical:responsiveHeight(0.8),
    textAlign:'center'
  },
  textAmount:{
    fontSize:responsiveFontSize(4.4),
    color:'#8fd150',
    marginTop:4,
    fontWeight:'bold',
    textAlign:'center',
   
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
  flexDirection:'row',
  marginTop: responsiveHeight(3.5),
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center'
},
loginButtonText: {
  color: '#18193F',
  fontSize: responsiveFontSize(2)
},
})
