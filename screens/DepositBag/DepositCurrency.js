import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HandleMoneyInput from '../../components/HandleMoneyInput';
import CustomHeader from '../../components/CustomHeader';
import {useDispatch, useSelector} from 'react-redux';
import {UpdateXcd} from '../../redux/Action';
//it is first screen
//  on this screen user is asked to enter curreny note values
export default function DepositBag({navigation, route}) {
  const dispatch = useDispatch();

  const CurrencySymbole = useSelector(
    state => state?.Main?.User?.data?.company.localCurrency,
  );
  const currencyArray = CurrencySymbole.split('-');
  console.log('CurrencySymbole', currencyArray);
  const [textInputs, setTextInputs] = useState({
    input1: {name: 'X100', value: '', amount: 100},
    input2: {name: 'X50', value: '', amount: 50},
    input3: {name: 'X20', value: '', amount: 20},
    input4: {name: 'X10', value: '', amount: 10},
    input5: {name: 'X5', value: '', amount: 5},
    input6: {name: 'Coins ' + currencyArray[1] + 1, value: '', amount: 1},
    input7: {name: 'Coins', value: '', amount: 1},
  });
  // Example array of TextInput values
  const handleCurrency = (key, text) => {
    // Update the TextInput value in the object
    setTextInputs(prevState => ({
      ...prevState,
      [key]: {...prevState[key], value: text},
    }));
  };
  const handleCheckEmpty = () => {
    const emptyInputs = Object.keys(textInputs).filter(
      key => textInputs[key].value !== '',
    );
    let XCD = [];
    emptyInputs.map(item => {
      XCD.push({
        name: textInputs[item].name,
        value: textInputs[item].value * textInputs[item].amount,
        // amount: textInputs[item].amount,
        status: false,
      });
    });
    var AllowNavigation = true;
    XCD.map(item => {
      console.log(item);
      if (isNaN(item.value) || item.value < 0) {
        alert('Enter Valid amount for ' + item.name);
        AllowNavigation = false;
        return;
      }
    });
    if (AllowNavigation) {
      dispatch(UpdateXcd(XCD));
      navigation.navigate('DepositForexCurrency');
      console.log(XCD);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <KeyboardAwareScrollView style={{flex: 1}}>
        {/* it is just margin from top */}
        {/* <View style={styles.topDistance} /> */}
        <View style={{marginHorizontal: responsiveScreenWidth(4)}}>
          <CustomHeader name={'Deposit Currency'} navigation={navigation} />
        </View>
        <Text style={styles.breakDown}>Breakdown</Text>
        <Text style={styles.xcd}>{currencyArray[0]}</Text>
        <HandleMoneyInput
          onChangeText={text => handleCurrency('input1', text)}
          name={textInputs.input1.name}
        />
        <HandleMoneyInput
          onChangeText={text => handleCurrency('input2', text)}
          name={textInputs.input2.name}
        />
        <HandleMoneyInput
          onChangeText={text => handleCurrency('input3', text)}
          name={textInputs.input3.name}
        />
        <HandleMoneyInput
          onChangeText={text => handleCurrency('input4', text)}
          name={textInputs.input4.name}
        />
        <HandleMoneyInput
          onChangeText={text => handleCurrency('input5', text)}
          name={textInputs.input5.name}
        />
        <HandleMoneyInput
          onChangeText={text => handleCurrency('input6', text)}
          name={textInputs.input6.name}
        />
        <HandleMoneyInput
          onChangeText={text => handleCurrency('input7', text)}
          name={textInputs.input7.name}
        />

        <TouchableOpacity
          onPress={() => handleCheckEmpty()}
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Next</Text>
        </TouchableOpacity>
        <View style={{height: 30}}></View>
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
    marginLeft: responsiveScreenWidth(4.5),
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
  },
  xcd: {
    marginVertical: responsiveHeight(3),
    fontSize: responsiveFontSize(2.6),
    color: '#14cdd4',
    fontWeight: '700',
    marginLeft: responsiveScreenWidth(4.5),
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
  loginButton: {
    backgroundColor: '#36C4F1',
    width: '80%',
    height: 45,
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
