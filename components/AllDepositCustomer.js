import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
//clicking on this will show single deposite detail
export default function SingleDeposit({navigation, item, index}) {
  const CurrencySymbole = useSelector(
    state => state?.Main?.User?.data?.company.localCurrency,
  );
  const currencyArray = CurrencySymbole.split('-');

  const [data, setData] = useState([]);
  const isFocued = useIsFocused();

  useEffect(() => {
    const groupedData = groupDataByDate(item);
    console.log('groupedData', groupedData);
    setData(groupedData);
  }, [isFocued]);

  const getFormatedDate = date => {
    const currentDate = new Date();
    const itemDate = new Date(date);

    if (currentDate.toDateString() === itemDate.toDateString()) {
      return 'Today';
    }

    currentDate.setDate(currentDate.getDate() - 1);
    if (currentDate.toDateString() === itemDate.toDateString()) {
      return 'Yesterday';
    }

    return moment(itemDate).format('MMMM D, YYYY');
  };

  const groupDataByDate = d => {
    const groupedData = {};

    for (const item of d) {
      const formatedDate = new Date(item.createdAt).toDateString();

      if (groupedData[formatedDate]) {
        groupedData[formatedDate].push(item);
      } else {
        groupedData[formatedDate] = [item];
      }
    }

    return groupedData;
  };

  const getIndex = id => {
    const index = item.findIndex(e => e._id === id);
    if (index !== -1) {
      return index;
    } else {
      console.log(`Object with id ${id} not found in your data`);
      return 0;
    }
  };

  console.log('data ====>',data);
  return (
    <FlatList
      data={Object.keys(data).sort((a, b) => new Date(b) - new Date(a))}
      style={{flex: 1}}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => {
        return (
          <View style={{marginTop: 9}}>
            <Text style={{color: '#636363', fontSize: 15}}>
              {getFormatedDate(item)}
            </Text>
            <View
              style={{
                backgroundColor: '#D3D3D3',
                height: 1,
                marginTop: 5,
                marginBottom: 18,
              }}></View>
            <FlatList
              data={data[item]}
              extraData={data[item]}
              keyExtractor={item => item._id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
                // console.log('total -----', item);
                return (
                  <TouchableOpacity
                    key={String(item._id)}
                    style={{marginBottom: 30}}
                    onPress={() => {
                      navigation.navigate('CustomerViewDepositDetail', {
                        selectedItem: getIndex(item._id),
                        detail: 'Yearly',
                      });
                    }}>
                    <View style={styles.singleDepositContainer}>
                      <Image
                        style={styles.imageStyle}
                        source={
                          item.ScannedByTeller && item.ScannedBySupervisor
                            ? require('../assets/dgtl_app_deposits.png')
                            : item.ScannedByTeller && !item.ScannedBySupervisor
                            ? require('../assets/dgtl_app_pending.png')
                            : require('../assets/dgtl_app_pending.png')
                        }
                      />
                      <View style={{marginLeft: 10}}>
                        <Text
                          style={{
                            ...styles.text1,
                            color:
                            item.ScannedBySupervisor && item.ScannedBySecondSupervisor
                                ? '#000'
                                : item.ScannedByTeller || item.ScannedBySupervisor
                                ? '#686868' //#YourColorForUnverified
                                : '#ED7221',
                          }}>
                          {currencyArray[1] + item.total.value.toFixed(2)}
                        </Text>
                        <Text
                          style={{
                            ...styles.text2,
                            color:
                            item.ScannedBySupervisor && item.ScannedBySecondSupervisor
                                ? '#000'
                                : item.ScannedByTeller || item.ScannedBySupervisor
                                ? '#686868' //#YourColorForUnverified
                                : '#ED7221',
                          }}>
                          {item.ScannedBySupervisor && item.ScannedBySecondSupervisor
                            ? 'Deposited on'
                            : item.ScannedByTeller || item.ScannedBySupervisor
                            ? 'Un-verified'
                            : 'Pending'}{' '}
                          {moment(item.createdAt).format('YYYY/MM/DD')},{' '}
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  singleDepositContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  text1: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 13,
    color: '#36454f',
    marginTop: 2,
  },
});
