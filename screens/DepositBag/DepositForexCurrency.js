import React, {useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HandleMoneyInputForex from '../../components/HandleMoneyInputForex';
import CustomHeader from '../../components/CustomHeader';
import {UpdateFx} from '../../redux/Action';
import {useDispatch, useSelector} from 'react-redux';
// it is third screen
export default function DepositForexCurrency({navigation, route}) {
  const CurrencySymbole = useSelector(
    state => state?.Main?.User?.data?.company.localCurrency,
  );
  const currencyArray=CurrencySymbole.split('-')

  const ForexCurrency = useSelector(
    state => state?.Main?.User?.data?.company?.FXAllowed,
  );
  const currencyObject = {};
  console.log('ForexCurrency', ForexCurrency);
  ForexCurrency.forEach((currencyName, index) => {
    const inputKey = `input${index + 1}`;
    currencyObject[inputKey] = {
      name: currencyName,
      FXamount: '',
      EQV: '',
      status: false,
    };
  });
  const transformedArray = Object.keys(currencyObject).map(
    inputKey => currencyObject[inputKey],
  );

  console.log('transformedArray',currencyObject);
  const dispatch = useDispatch();
  const [textInputs, setTextInputs] = useState(currencyObject);
  // const [textInputs, setTextInputs] = useState({
  //     input1: { name: 'USD', FXamount: '', EQV: '', status: false },
  //     input2: { name: 'GBP', FXamount: '', EQV: '', status: false },
  //     input3: { name: 'EUR', FXamount: '', EQV: '', status: false },
  //     input4: { name: 'CAD', FXamount: '', EQV: '', status: false },
  //     input5: { name: 'BD$', FXamount: '', EQV: '', status: false },
  //     input6: { name: 'TTD', FXamount: '', EQV: '', status: false },

  // });

  const handleCurrency = (key, text) => {
    // Update the TextInput value in the object

    setTextInputs(prevState => ({
      ...prevState,
      [key]: {...prevState[key], Fxamount: text},
    }));
  };

  const handleEquvalent = (key, text) => {
    // Update the TextInput value in the object
    setTextInputs(prevState => ({
      ...prevState,
      [key]: {...prevState[key], EQV: text},
    }));
  };

  const handleFXEmpty = () => {
    const emptyInputs = Object.keys(textInputs).filter(
      key => textInputs[key].Fxamount !== '' && textInputs[key].EQV !== '',
    );
 
    let FX = [];
    emptyInputs.map(item => {
      console.log('textInputs', item);
      FX.push({
        name: textInputs[item].name,
        FXamount: parseInt(textInputs[item].Fxamount),
        EQV: parseFloat(textInputs[item].EQV),
        status: false,
      });
    });
    var AllowNavigation = true;
    FX.map(item => {
      if (isNaN(item.FXamount) || item.FXamount < 0) {
        alert('Enter Valid amount for ' + item.name);
        AllowNavigation = false;
        return;
      }
    });
    console.log('FX', FX);
    if (AllowNavigation) {
      dispatch(UpdateFx(FX));
      navigation.navigate('DepositChecks');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={{paddingHorizontal: responsiveScreenWidth(3)}}
        style={{flex: 1}}>
        {/* it is just margin from top */}
        <View style={styles.topDistance} />
        <View style={{marginHorizontal: responsiveScreenWidth(4)}}>
          <CustomHeader name={'New Deposit'} navigation={navigation} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <View style={{right: responsiveScreenWidth(10)}}>
            <Text style={styles.xcd}>FX</Text>
          </View>
          <View style={{right: responsiveScreenWidth(5)}}>
            <Text style={styles.xcd}>Total</Text>
          </View>
          <View style={{right: responsiveScreenWidth(5)}}>
            <Text style={styles.xcd}>{currencyArray[0]+' EQV'}</Text>
          </View>
        </View>
        {/* <HandleMoneyInput onChangeText={text => handleCurrency('input1', text)} name={textInputs.input1.name} /> */}
        {Object.keys(currencyObject).map((inputKey, index) => (
            <HandleMoneyInputForex
              key={inputKey}
              currency={currencyObject[inputKey].name}
              onChangeAmount={text => handleCurrency(inputKey, text)}
              onChangeEQV={text => handleEquvalent(inputKey, text)}
              name={currencyObject[inputKey].name}
            />
          ))}

        <TouchableOpacity
          onPress={() => handleFXEmpty()}
          style={styles.loginButton}>
          <Text style={{color: '#18193F'}}>Next</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
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
  Notification: {
    height: responsiveHeight(8),
    width: responsiveScreenWidth(8),
    resizeMode: 'contain',
  },
  nameText: {
    fontSize: responsiveFontSize(3),
    fontWeight: '400',
    color: '#000',
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakDown: {
    color: '#000',
    fontSize: responsiveFontSize(3),
  },
  loginButton: {
    backgroundColor: '#36C4F1',
    width: '80%',
    marginBottom: responsiveScreenHeight(5),
    height: 45,
    marginTop: responsiveHeight(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  xcd: {
    marginVertical: responsiveHeight(3),
    fontSize: responsiveFontSize(2.6),
    color: '#14cdd4',
    fontWeight: '700',
    marginLeft: responsiveScreenWidth(8),
  },
  depositContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(3),
    height: responsiveHeight(22),
    marginHorizontal: 5,
  },
  depositButtons: {
    borderWidth: 1,
    width: responsiveScreenWidth(37),
    height: responsiveHeight(20),
    borderRadius: 20,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  depositText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '400',
    color: '#000',
  },
  recentDepostTextConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  BagSection: {
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  RecentDeposit: {
    fontSize: responsiveFontSize(4),
    color: '#000',
    marginLeft: 5,
    marginVertical: responsiveHeight(2),
  },
  viewAllText: {
    color: '#3badfb',
    fontSize: responsiveFontSize(1.9),
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
});
