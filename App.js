import React ,{useEffect,useState}from 'react';
import { View, Image, Text, LogBox,Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//Stack Screens
import Session from './screens/Session/CheckUserSession'
import Login from './screens/Login/Login'
//importing bottom tab Present inside BottomTabs folder inside main screens folder as Root
import Root from './screens/BottomTabs/Root';
import Notifications from './screens/Notifications/Notifications';
import ForgotPassword from './screens/ForgotPassword/ForgotPassword'
import Deposit from './screens/DepositBag/DepositCurrency';
import DepositForexCurrency from './screens/DepositBag/DepositForexCurrency';
import DepositHistory from './screens/Deposithistory/DepositHistoryAllTimeCustomer';
import DepositHistoryMonthly from './screens/Deposithistory/DepositHistoryMonthlyCustomer';
import DepositHistoryTeller from './screens/Deposithistory/DepositHistoryOfTellerBagProcessed';
import PaymentApproved from './screens/Deposithistory/TellerBagProcessedCompleted';
import PaymentPending from './screens/Deposithistory/TellerBagProcessedPending';
import DepositChecks from './screens/DepositBag/DepositChecks';
import VarifyDeposit from './screens/DepositBag/CustomerVarifyDepositDetail';
import CompleteDeposit from './screens/DepositBag/CompleteDepositProcessForCustomer';
import RequestBag from './screens/RequestBag/RequestBag'
import GenrateReport from './screens/GenrateReport/GenrateReport';
import QrCode from './screens/QrCode';
import TellerVerifyDeposit from './screens/DepositBag/TellerVerifyDeposit';
import CustomerViewDepositDetail from './screens/DepositBag/CustomerViewDepositDetail'
import TellerViewDepositDetail from './screens/DepositBag/TellerViewDepositDetail'
import TellerViewDepositDetailThisMonth from  './screens/DepositBag/TellerViewDepositDetailThisMonth'
import NotifiDetail from './screens/Notifications/NotifiDetail';
const Stack = createStackNavigator();

//Header Detail is below
import HeaderLeft from './components/HeaderDetail/HeaderLeft'; //just contain image and text 
import HeaderTitle from './components/HeaderDetail/HeaderTitle'; // just empty view
import HeaderRight from './components/HeaderDetail/HeaderRight';  // contain actual logic scan qrcode and pass result to next screen
import { Provider, useDispatch } from 'react-redux';
import configureStore from './redux/store';
import messaging from '@react-native-firebase/messaging';
import CompleteDepositCustomer from './screens/DepositBag/CompleteDepositCustomer';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import ChangePassword from './screens/ChangePassword';
import OTPScreen from './screens/OTPScreen/OTPScreen';
import SetPinScreen from './screens/SetPinScreen/SetPinScreen';

LogBox.ignoreAllLogs(true)

const store = configureStore()
export default function App() {
  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage?.notification,
      );
     
      // navigation.navigate(remoteMessage.data.type);
    });
    return unsubscribe;
  }, []);
  //On most of screen data is loaded from redux
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={({ navigation, route }) =>
        ({
          headerShown: route?.name == "Login" 
          || route?.name == "ForgotPassword" 
          || route?.name == "OTPScreen" 
          || route?.name== "QrCode" 
          || route?.name== "SetPinScreen" 
          || route?.name == "Session" ? false : true,
          headerStyle: {
            borderBottomWidth: 2,
            borderBottomColor:'#18193F',
            backgroundColor: route?.name == "DepositHistory" 
            || route.name == "CustomerViewDepositDetail" 
            || route?.name == "DepositHistoryMonthly"  
            || route?.name == "DepositHistoryTeller" 
            || route?.name == "TellerViewDepositDetailThisMonth" 
            || route?.name == "NotifiDetail"
            || route?.name == "VarifyDeposit"
            || route?.name == "TellerVerifyDeposit" 
            || route?.name == "TellerViewDepositDetail" ? '#EBF3EF' 
            : '#fff',
            height:Platform.OS=='ios'? responsiveHeight(14):responsiveHeight(10)
          },
          headerLeft: () => <HeaderLeft />,
          headerTitle: () => <HeaderTitle />,
          headerRight: () => <HeaderRight navigation={navigation} />
        }) }
        >
          {/* <Stack.Screen name="Session" component={Session} screenOptions={{ headerShown: false }} /> */}
          <Stack.Screen name="Login" component={Login} screenOptions={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Root} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="OTPScreen" component={OTPScreen} />
          <Stack.Screen name="SetPinScreen" component={SetPinScreen} />
          <Stack.Screen name="Deposit" component={Deposit} />
          <Stack.Screen name="DepositForexCurrency" component={DepositForexCurrency} />
          <Stack.Screen name="DepositChecks" component={DepositChecks} />
          <Stack.Screen name="VarifyDeposit" component={VarifyDeposit} />
          <Stack.Screen name="CompleteDeposit" component={CompleteDeposit} />
          <Stack.Screen name="CompleteDepositCustomer" component={CompleteDepositCustomer} />
          <Stack.Screen name="DepositHistory" component={DepositHistory} />
          <Stack.Screen name="DepositHistoryMonthly" component={DepositHistoryMonthly} />
          <Stack.Screen name="DepositHistoryTeller" component={DepositHistoryTeller} />
          <Stack.Screen name="PaymentApproved" component={PaymentApproved} />
          <Stack.Screen name="PaymentPending" component={PaymentPending} />
          <Stack.Screen name="RequestBag" component={RequestBag} />
          <Stack.Screen name="GenrateReport" component={GenrateReport} />
          <Stack.Screen options={{ presentation: 'modal' }} name="QrCode" component={QrCode} />
          <Stack.Screen name="TellerVerifyDeposit" component={TellerVerifyDeposit} />
          <Stack.Screen name="CustomerViewDepositDetail" component={CustomerViewDepositDetail} />
          <Stack.Screen name="TellerViewDepositDetail" component={TellerViewDepositDetail} />
          <Stack.Screen name="TellerViewDepositDetailThisMonth" component={TellerViewDepositDetailThisMonth} />
          <Stack.Screen name="NotifiDetail" component={NotifiDetail} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
