import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
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
import BasePath from '../../config/BasePath';

//it is fifth scrren
//it is a screen for teller
// Right now this screen is optional
export default function CustomerViewDepositDetail({navigation, route}) {

    const CurrencySymbole = useSelector(
        state => state?.Main?.User?.data?.company.localCurrency,
      );
      const currencyArray = CurrencySymbole.split('-');

  const accountType = useSelector(
    state => state.Main.User.data.userData.accountType,
  );
  const accountNumber = useSelector(
    state => state?.Main?.User?.data?.userData?.accountNumber,
  );
  const DepositDetail =
    route?.params?.detail == 'Monthly'
      ? useSelector(
          state =>
            state?.Main?.UserDepositRecord?.depositsThisMonth[
              route?.params?.selectedItem
            ],
        )
      : useSelector(
          state =>
            state?.Main?.UserDepositRecord?.depositsAllTime[
              route?.params?.selectedItem
            ],
        );
  console.log('DepositDetail', DepositDetail.checks);
  const [loading, setLoading] = useState(true);
  //a dummy variable
  const Depositsdd = useSelector(
    state =>
      state.Main.UserDepositRecord.depositsAllTime[route.params.selectedItem],
  );
  const abbrevation = useSelector(
    state => state?.Main?.User?.data?.company?.abbrevation,
  );
  const customerName = useSelector(
    state => state?.Main?.User?.data?.userData?.name,
  );

  const data = route?.params;
  console.log('Data>>>', customerName);
  // const customerName = data?.item?.customer_details[0]?.name

  useEffect(() => {
    const stateInterval = setTimeout(() => {
      setLoading(false);
      console.log(Depositsdd.company[0].companyName);
    }, 1500);
    return () => clearInterval(stateInterval);
  }, []);
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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
  } else {
    //  console.log('HI',DepositDetail)
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.topDistance} />
        <View style={{marginHorizontal: responsiveWidth(4)}}>
          <CustomHeader name={'Deposit Detail'} navigation={navigation} />
        </View>

        <View style={styles.monthDeposit}>
          <View style={{width: '45%'}}>
            <Text style={styles.monthDepositMoney}>
              {currencyArray[1]+' '+DepositDetail?.total.value.toFixed(2)}
            </Text>
          </View>
          <View style={{width: '45%'}}>
            <Text
              style={[styles.monthDepositDescription, {fontWeight: 'bold'}]}>
              {customerName}
            </Text>
            <Text style={styles.monthDepositDescription}>
              Acct# {accountNumber}
            </Text>
            <Text
              style={[styles.monthDepositDescription, {fontWeight: 'bold'}]}>
              {new Date(DepositDetail.createdAt).toDateString()}
            </Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.breakDown}>Breakdown</Text>
          </View>
          {DepositDetail.Xcd.length > 0 ? (
            <>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.xcd}>{currencyArray[0]}</Text>
                </View>
              </View>
              <View style={{marginHorizontal: responsiveWidth(7)}}>
                {DepositDetail.Xcd.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: responsiveWidth(1.5),
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
          ) : (
            <></>
          )}
          {DepositDetail.FX.length > 0 ? (
            <>
              <Text style={styles.xcd}>FX</Text>

              <View style={{marginHorizontal: responsiveWidth(7)}}>
                {DepositDetail.FX.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: responsiveWidth(1.5),
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
                        {currencyArray[1]+item?.EQV}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </>
          ) : (
            <></>
          )}

          {DepositDetail.checks.length > 0 ? (
            <>
              <Text style={styles.xcd}>CHEQUES</Text>
              {DepositDetail.checks.map((item, index) => {
                return (
                  <View
                    style={{
                      marginLeft: responsiveWidth(8),
                      marginRight: responsiveWidth(22),
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.1),
                        color: '#000',
                        fontWeight: '700',
                      }}>
                      {item.checkNumber.length >= 4
                        ? `${item.checkNumber.slice(0, 5)} ...`
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
                      {item?.bank_UC}
                    </Text>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.1),
                        color: '#000',
                        fontWeight: '700',
                        textAlign: 'center',
                      }}>
                      { currencyArray[1]+item.checkAmount}
                    </Text>
                  </View>
                );
              })}
            </>
          ) : (
            <></>
          )}
          <Text style={styles.xcd}>Total</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Text
              style={{
                fontSize: responsiveFontSize(2.1),
                color: '#000',
                fontWeight: '700',
                width: responsiveWidth(20),
              }}>
              Total
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
              {currencyArray[1]+DepositDetail.total.value.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
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
    alignItems: 'center',
  },
  monthDepositMoney: {
    color: '#8fd150',
    fontSize: responsiveFontSize(4.1),
    fontWeight: 'bold',
  },
  monthDepositDescription: {
    color: '#000',
    fontSize: responsiveFontSize(1.9),
  },
  breakDown: {
    color: '#000',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    paddingHorizontal: responsiveWidth(8),
  },
  xcd: {
    marginVertical: responsiveHeight(3),
    fontSize: responsiveFontSize(2.6),
    color: '#14cdd4',
    fontWeight: '700',
    marginLeft: responsiveScreenWidth(4),
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
});

const XCD = [
  {
    name: 'x100',
    amount: 60,
  },
  {
    name: 'x50',
    amount: 20,
  },
  {
    name: 'x20',
    amount: 10,
  },
  {
    name: 'x10',
    amount: 60,
  },
  {
    name: 'x5',
    amount: 40,
  },
  {
    name: 'Coin 1$',
    amount: 80,
  },
  {
    name: 'Coin',
    amount: 0,
  },
];

const FX = [
  {
    name: 'USD',
    amount: 60,
  },
  {
    name: 'GBP',
    amount: 20,
  },
  {
    name: 'EUR',
    amount: 10,
  },
  {
    name: 'CAD',
    amount: 60,
  },
  {
    name: 'BDS',
    amount: 40,
  },
  {
    name: 'TTD',
    amount: 80,
  },
];
