// import moment from 'moment';
// import React, { Component } from 'react';
// import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
// import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
// import { useSelector } from 'react-redux';
// //clicking on this will show single deposite detail
// export default function PendingPayment({ navigation, item, index, }) {
//     const abbrevation = useSelector(state =>state?.Main?.User?.data?.company?.abbrevation);
//     // console.log('abrevation',abbrevation)

//     const accountType = useSelector(
//         state => state.Main.User.data.userData.accountType,
//       );

//     // const data = useSelector(state => state?.Main?.QrCodeScanedDetail?.qrsingle)
//     const data = useSelector(state => state?.Main?.UserDepositRecord)

//     // console.log('data', accountType)

//     if (item.ScannedByTeller) {
//         return <>

//         </>
//     } else

//         return (
//             <TouchableOpacity keyExtractor={(item, index) => String(index)} style={{ marginVertical: 2 }} onPress={() => navigation.navigate('TellerViewDepositDetailThisMonth', { selectedItem: index, status: 'pending',item })}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', }}>
//                     <Image style={styles.imageStyle} source={require('../../../assets/pending.png')} />
//                     <View style={{ marginLeft: 10, }}>
//                         <Text style={{ ...styles.text}}>DEPOSIT ID:<Text style={{ fontWeight: '400' }}> {abbrevation.concat(item.bagID.slice(item.bagID.length - 10 + abbrevation.length, item.bagID.length))} </Text></Text>
//                         <Text style={{ ...styles.text}}>CUSTOMER ID:<Text style={{ fontWeight: '400' }}> {(item?.customer_details[0]?.name)}</Text></Text>
//                         <Text style={{ color: '#ED7221', fontSize: 13, marginTop: 2 }}>Submitted on {moment(item.createdAt).format("YYYY/MM/DD")}, {new Date(item.createdAt).toLocaleTimeString()}</Text>
//                     </View>
//                 </View>
//                 <View style={{backgroundColor: '#D3D3D3', height: 1, marginTop: 18, marginBottom: 18}}></View>
//             </TouchableOpacity>
//         );

// }

// const styles = StyleSheet.create({
//     imageStyle: {
//         width: 30,
//         height: 30,
//         resizeMode: 'contain'
//     },
//     text: {
//         fontSize: 15,
//         fontWeight: 'bold',
//         color: '#000',
//         marginTop: 2
//     }
// })

import moment from 'moment';
import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

export default function PendingPayment({navigation, item, index }) {
  const abbrevation = useSelector(
    state => state?.Main?.User?.data?.company?.abbrevation,
  );
  const accountType = useSelector(
    state => state.Main.User.data.userData.accountType,
  );
  // const data = useSelector(
  //   state =>
  //     state?.Main?.UserDepositRecord?.depositsAllTimeApproved
  //       .ScannedByCustomer
  // );

  // console.log('account typee', accountType);
  // console.log('dataaa', data)

  console.log('account type', accountType);
  console.log('Item: =', item);

  if (accountType === 'Supervisor' && item.ScannedByTeller === true ) {
    return (
      <TouchableOpacity
        key={index}
        style={{marginVertical: 2}}
        onPress={() =>
          navigation.navigate('TellerViewDepositDetailThisMonth', {
            selectedItem: index,
            status: 'pending',
            item,
          })
        }>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={styles.imageStyle}
            source={require('../../../assets/pending.png')}
          />
          <View style={{marginLeft: 10}}>
            <Text style={{...styles.text}}>
              DEPOSIT ID:
              <Text style={{fontWeight: '400'}}>
                {abbrevation.concat(
                  item.bagID.slice(
                    item.bagID.length - 10 + abbrevation.length,
                    item.bagID.length,
                  ),
                )}
              </Text>
            </Text>
            <Text style={{...styles.text}}>
              CUSTOMER ID:
              <Text style={{fontWeight: '400'}}>
                {item?.customer_details[0]?.name}
              </Text>
            </Text>
            <Text style={{color: '#ED7221', fontSize: 13, marginTop: 2}}>
              Submitted on {moment(item.createdAt).format('YYYY/MM/DD')},{' '}
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#D3D3D3',
            height: 1,
            marginTop: 18,
            marginBottom: 18,
          }}></View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        keyExtractor={(item, index) => String(index)}
        style={{marginVertical: 2}}
        onPress={() =>
          navigation.navigate('TellerViewDepositDetailThisMonth', {
            selectedItem: index,
            status: 'pending',
            item,
          })
        }>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={styles.imageStyle}
            source={require('../../../assets/pending.png')}
          />
          <View style={{marginLeft: 10}}>
            <Text style={{...styles.text}}>
              DEPOSIT ID:
              <Text style={{fontWeight: '400'}}>
                {' '}
                {abbrevation.concat(
                  item.bagID.slice(
                    item.bagID.length - 10 + abbrevation.length,
                    item.bagID.length,
                  ),
                )}{' '}
              </Text>
            </Text>
            <Text style={{...styles.text}}>
              CUSTOMER ID:
              <Text style={{fontWeight: '400'}}>
                {' '}
                {item?.customer_details[0]?.name}
              </Text>
            </Text>
            <Text style={{color: '#ED7221', fontSize: 13, marginTop: 2}}>
              Submitted on {moment(item.createdAt).format('YYYY/MM/DD')},{' '}
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#D3D3D3',
            height: 1,
            marginTop: 18,
            marginBottom: 18,
          }}></View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
});
