import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Image,
  ActivityIndicator,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import RecentDeposits from '../../components/RecentDeposits';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {
  UpdateUserDepositRecord,
  updateNotificationStatus,
} from '../../redux/Action';
import messaging from '@react-native-firebase/messaging';
import BasePath from '../../config/BasePath';

export default function Home({navigation, route}) {
  const CurrencySymbole = useSelector(
    state => state?.Main?.User?.data?.company.localCurrency,
  );
  const userData = useSelector(state => state?.Main?.User?.data);

  // console.log("userData: ", userData);
  const currencyArray = CurrencySymbole.split('-');
  //   const biometric = AsyncStorage.getItem('biometric');
  //   const token = await AsyncStorage.getItem('token')
  //   console.log('biometric ==>', biometric);

  useEffect(() => {
    requestPermission();
    subscribeToNotifications();
    GetUserDetail();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      //this function will get user async token and load data according to user account type
      GetUserDetail();
    }, []),
  );

  const [isLoading, setIsLoading] = useState(true);
  //this will store value of monthly deposits for customer it will store total amount of money and for teller it will store number of bags processed
  const [monthlyDeposit, setMonthlyDeposit] = useState(0);
  //this will store value of monthly deposits for teller and as well as customer
  const [customerDeposit, setCustomerDeposit] = useState([]);
  //load user data from redux
  const [active, setActive] = useState();

  // console.log('noti status',active)
  const users = useSelector(state => state?.Main?.User?.data?.userData);

  //use dispatch is used in order to invoke reduc function
  const disPatch = useDispatch();
  //this will be called every time page is focused

  async function requestPermission() {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      if (!fcmToken) {
        fcmToken = await messaging().getToken();
        // console.log('token ---', fcmToken);

        if (fcmToken) {
          await AsyncStorage.setItem('fcmToken', fcmToken);
          //this will be called one time
          StoreFcmToken(fcmToken);
        }
      }
    }
  }
  async function subscribeToNotifications() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification received:', remoteMessage);
      setActive(true);
    });
    return () => unsubscribe();
  }

  async function StoreFcmToken(fcmToken) {
    let token = await AsyncStorage.getItem('token');
    axios
      .post(
        BasePath + 'storeFcm',
        {
          fcm: fcmToken,
        },
        {
          params: {
            x_auth: token,
          },
        },
      )
      .then(res => {})
      .catch(e => {
        console.log('error occured', e);
      });
  }
  async function GetUserDetail() {
    //getting token from async storage
    let token = await AsyncStorage.getItem('token');

    //Load Customer Home Page API this api will load data for home page
    if (users.accountType == 'customer') {
      //this function will get user detail such as
      // user all pending deposits
      // user all completed deposits
      //his name ,account detail
      //his company info
      // console.log('token ---', token);
      LoadCustomerHomePageData(token);
    } else {
      //this function will get teller/supervisor detail such as
      // user all pending deposits
      // user all completed deposits
      //his name ,account detail
      //his company info
      LoadTellerHomePageData(token);
    }

    // a loading indicator which will be set to false after  loading data either for customer or teller/supervisor
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  //get teller data
  function LoadTellerHomePageData(token) {
    axios
      .get(BasePath + 'loadTellerHomePage', {
        params: {
          x_auth: token,
        },
      })
      .then(res => {
        // console.log('teller home page data', JSON.stringify(res.data));

        const {code, data} = res.data;
        // console.log('Data ------', data);

        if (code == 200) {
          setActive(res?.data?.data?.notification_active);
          if (data.totalBagsProcessedThisMonth.length > 0) {
            //store number of monthly deposit total bags (number) i.e 1,2,5 etc ...
            setMonthlyDeposit(data.totalBagsProcessedThisMonth[0].grandTotal);
          } else {
            // store 0 if no value found
            setMonthlyDeposit(0);
          }
          //store all pending list
          console.log('*depositsAllTimePending*', data.depositsAllTimePending);
          setCustomerDeposit(data.depositsAllTimePending);
          //update user deposit record
          disPatch(UpdateUserDepositRecord(data));
        } else {
          alert('Error While getting data');
        }
      })
      .catch(e => console.log(alert('Error occured ', e.response.data)));
  }

  //get customer data

  function LoadCustomerHomePageData(token) {
    // console.log(token);
    axios
      .get(BasePath + 'loadCustomerHomePage', {
        params: {
          x_auth: token,
        },
      })
      .then(res => {
        const {code, data} = res.data;
        // console.log('home page api customer data', data);
        if (code == 200) {
          setActive(res?.data?.data?.notification_active);
          if (data.totalDepositThisMonth.length > 0) {
            //    store amount of monthly deposit  (number) i.e 643,452,625 etc ...
            //    console.log('DDD',data.depositsThisMonth)
            setMonthlyDeposit(data.totalDepositThisMonth[0].total);
          } else {
            setMonthlyDeposit(0);
          }
          console.log('data -----', data.depositsThisMonth);
          setCustomerDeposit(data.depositsThisMonth);
          //update user deposit record
          disPatch(UpdateUserDepositRecord(data));
        } else {
          alert('Error While getting data');
        }
      })
      .catch(e => console.log(alert('Error occured ', e.response.data)));
  }

  // function sortedData(dataArray) {
  //   const tempArray = dataArray.sort((a, b) => {
  //     if (!b.ScannedByTeller || !b.ScannedBySupervisor && a.ScannedByTeller || a.ScannedBySupervisor) {
  //       return 1;
  //     } else if (b.ScannedByTeller || b.ScannedBySupervisor && !a.ScannedByTeller || !a.ScannedBySupervisor) {
  //       return -1;
  //     }
  //     return new Date(b.createdAt) - new Date(a.createdAt)
  //   });
  //   return tempArray
  // }
  // console.log('customerDeposit -->', customerDeposit);

  function sortedData(dataArray) {
    const tempArray = dataArray.sort((a, b) => {
      // Check if either ScannedByTeller or ScannedBySupervisor is false
      const aCondition = !a.ScannedBySupervisor || !a.ScannedBySecondSupervisor;
      const bCondition = !b.ScannedBySupervisor || !b.ScannedBySecondSupervisor;

      // If both a and b meet the condition or both don't meet the condition, sort by createdAt
      if ((aCondition && bCondition) || (!aCondition && !bCondition)) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (aCondition) {
        return -1; // a should come before b
      } else {
        return 1; // b should come before a
      }
    });

    return tempArray;
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <ActivityIndicator size={'large'} /> */}

        <Image
          source={require('../../assets/dgtl_icon_610.png')}
          style={{height: 70, width: 70, borderRadius: 50}}
          resizeMode="contain"
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: responsiveFontSize(1.5),
            color: '#18193F',
          }}>
          Loading...
        </Text>
      </View>
    );
  } else
    return (
      <View style={styles.loginContainer}>
        <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
        <ScrollView
          contentContainerStyle={{paddingHorizontal: responsiveScreenWidth(3)}}
          style={{flex: 1}}>
          {/* it is just margin from top */}
          <View style={styles.topDistance} />
          {/* it is user info section such as name */}
          <View style={styles.bioContainer}>
            <Text style={styles.nameText}>Hi {users.name}, </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Notifications');
              }}>
              <Image
                style={styles.Notification}
                source={
                  active
                    ? require('../../assets/noti_active.png')
                    : require('../../assets/notified.png')
                }
              />
            </TouchableOpacity>
          </View>
          {/* conatin section such as deposit a bag and total deposit */}
          {users.accountType == 'customer' ? (
            <View style={styles.depositContainer}>
              {/* BarCodeScan and below button is hitting same function because task is same i.e scan code and transfer data to next screen */}
              <TouchableOpacity
                onPress={() => navigation.navigate('QrCode')}
                style={styles.depositButtons}>
                <Text
                  style={[
                    styles.depositText,
                    {fontWeight: 600, fontSize: responsiveFontSize(4.0)},
                  ]}>
                  +
                </Text>
                <Text style={[styles.depositText, {fontWeight: 'bold'}]}>
                  New Deposit
                </Text>
                {/* <Text style={styles.depositText}>Bag</Text> */}
              </TouchableOpacity>
              {/* 8fd150 */}
              <TouchableOpacity
                onPress={() => navigation.navigate('DepositHistoryMonthly')}
                style={styles.depositButtons}>
                <Text
                  style={[
                    styles.depositText,
                    {
                      color: '#000',
                      fontSize: responsiveFontSize(2.4),
                      fontWeight: 'bold',
                    },
                  ]}>
                  {currencyArray[1] + monthlyDeposit.toFixed(2)}{' '}
                </Text>
                <Text style={styles.depositText}>Total DGTL</Text>
                <Text style={styles.depositText}>Deposits</Text>
                <Text style={styles.depositText}>This Month</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.depositContainer}>
              {/* BarCodeScan and below button is hitting same function because task is same i.e scan code and transfer data to next screen */}
              <TouchableOpacity
                onPress={() => navigation.navigate('QrCode')}
                style={styles.depositButtons}>
                <Text
                  style={[
                    styles.depositText,
                    {fontWeight: 600, fontSize: responsiveFontSize(4.0)},
                  ]}>
                  +
                </Text>
                <Text style={[styles.depositText, {fontWeight: 'bold'}]}>
                  Process Bag
                </Text>
                {/* <Text style={styles.depositText}>Bag</Text> */}
              </TouchableOpacity>
              {/* 8fd150 */}
              <TouchableOpacity
                onPress={() => navigation.navigate('DepositHistoryTeller')}
                style={styles.depositButtons}>
                <Text
                  style={[
                    styles.depositText,
                    {
                      color: '#000',
                      fontSize: responsiveFontSize(2.4),
                      fontWeight: 'bold',
                    },
                  ]}>
                  {' '}
                  {monthlyDeposit}{' '}
                </Text>
                <Text style={styles.depositText}>Total Bags</Text>
                <Text style={styles.depositText}>Processed</Text>
                <Text style={styles.depositText}>This Month</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.recentDepostTextConatiner}>
            {users.accountType == 'customer' ? (
              <Text style={styles.RecentDeposit}>Recent Deposits</Text>
            ) : (
              <Text style={styles.RecentDeposit}>Pending Deposits</Text>
            )}
          </View>
          <View style={{marginLeft: 5}}>
            <RecentDeposits
              navigation={navigation}
              Deposits={customerDeposit}
              data={sortedData(customerDeposit)}
              role={users.accountType}
            />
          </View>
          <View style={{marginTop: responsiveHeight(10)}} />
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topDistance: {
    marginTop: responsiveHeight(5),
  },
  Notification: {
    height: responsiveHeight(8),
    width: responsiveScreenWidth(8),
    resizeMode: 'contain',
    marginLeft: 9,
  },
  nameText: {
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    color: '#000',
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: '#eee',
    width: responsiveScreenWidth(37),
    height: responsiveHeight(20),
    borderRadius: 20,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  depositText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    color: '#000',
  },
  recentDepostTextConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 39,
  },
  BagSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RecentDeposit: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: '700',
    color: '#000',
    marginLeft: responsiveWidth(3),
    marginVertical: responsiveHeight(2),
  },
  viewAllDeposit: {
    marginLeft: responsiveScreenWidth(7),
    color: '#3badfb',
    fontSize: responsiveFontSize(2.1),
  },
});
