import React, {useEffect, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Home/Home';
import Statistics from './screens/Statistics/Statistics';
import Setting from './screens/Settings/Settings';
import {
  responsiveHeight,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
const Tab = createBottomTabNavigator();
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../Login/Login';

//Tab Screens Detail
export default function Root({navigation}) {
  const windowDimesions = useWindowDimensions();
  const isTablet = windowDimesions.width >= 600;

  const [ahsan, setAhsan] = useState();

  const getData = async () => {
    const biometric = await AsyncStorage.getItem('biometric');
    setAhsan(biometric);
    console.log('biometric logout==>', biometric);
  };

  useEffect(() => {
    getData();
    
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {height: Platform.OS == 'ios' ? 80 : 60},
      }}>
      <Tab.Screen
        options={{
          tabBarItemStyle: {paddingTop: 15},
          tabBarIcon: () => (
            <Image
              source={require('../../assets/dgtl_home.png')}
              style={{
                height: responsiveScreenHeight(3),
                width: responsiveScreenHeight(3),
                resizeMode: 'contain',
                marginTop: Platform.OS == 'ios' ? responsiveHeight(0) : 0,
              }}
            />
          ),
          tabBarLabel: ({focused, color, size}) => (
            <Text
              style={{
                color: focused ? '#18193F' : '#18193F',
                fontWeight: focused ? 'bold' : 'normal',
                fontSize: focused ? 12 : 11,
                marginLeft: isTablet ? 20 : 0,
                marginBottom: isTablet ? '-5%' : '5%',
              }}>
              Home
            </Text>
          ),
        }}
        name="Dashboard"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarItemStyle: {paddingTop: 15},
          tabBarIcon: () => (
            <Image
              source={require('../../assets/dgtl_reports.png')}
              style={{
                width: responsiveScreenHeight(3),
                resizeMode: 'contain',
                marginTop: Platform.OS == 'ios' ? responsiveHeight(0) : 0,
              }}
            />
          ),
          tabBarLabel: ({focused, color, size}) => (
            <Text
              style={{
                color: focused ? '#18193F' : '#18193F',
                fontWeight: focused ? 'bold' : 'normal',
                fontSize: focused ? 12 : 11,
                marginLeft: isTablet ? 20 : 0,
                marginBottom: isTablet ? '-5%' : '5%',
              }}>
              Reports
            </Text>
          ),
        }}
        name="Stat"
        component={Statistics}
      />

      <Tab.Screen
        name="QrCodeScreen"
        component={() => <></>}
        options={{
          tabBarItemStyle: {paddingTop: 15},
          tabBarIcon: () => (
            <Image
              source={require('../../assets/dgtl_app_scan.png')}
              style={{
                width: responsiveScreenHeight(3),
                resizeMode: 'contain',
                marginTop: Platform.OS == 'ios' ? responsiveHeight(0) : 0,
              }}
            />
          ),
          tabBarLabel: ({focused, color, size}) => (
            <Text
              style={{
                color: focused ? '#18193F' : '#18193F',
                fontWeight: focused ? 'bold' : 'normal',
                fontSize: focused ? 12 : 11,
                marginLeft: isTablet ? 20 : 0,
                marginBottom: isTablet ? '-5%' : '5%',
              }}>
              Scan
            </Text>
          ),

          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => navigation.navigate('QrCode')}>
              {/* <Image source={require('../../assets/qr.png')} style={{ height: 28, width: 26, resizeMode: 'contain', marginBottom: responsiveHeight(3.2) }} /> */}
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        options={{
          tabBarItemStyle: {paddingTop: 15},
          tabBarIcon: () => (
            <Image
              source={require('../../assets/dgtl_app_settings.png')}
              style={{
                width: responsiveScreenHeight(3),
                resizeMode: 'contain',
                marginTop: Platform.OS == 'ios' ? responsiveHeight(0) : 0,
              }}
            />
          ),
          tabBarLabel: ({focused, color, size}) => (
            <Text
              style={{
                color: focused ? '#18193F' : '#18193F',
                fontWeight: focused ? 'bold' : 'normal',
                fontSize: focused ? 12 : 11,
                marginLeft: isTablet ? 20 : 0,
                marginBottom: isTablet ? '-5%' : '5%',
              }}>
              Manage
            </Text>
          ),
        }}
        name="Setting"
        component={Setting}
      />
      <Tab.Screen
        name="Logout"
        component={() => <></>}
        options={{
          tabBarItemStyle: {paddingTop: 15},
          tabBarIcon: () => (
            <Image
              source={require('../../assets/dgtl_app_exit.png')}
              style={{
                width: responsiveScreenHeight(3),
                resizeMode: 'contain',
                marginTop: Platform.OS == 'ios' ? responsiveHeight(0) : 0,
              }}
            />
          ),
          tabBarLabel: ({focused, color, size}) => (
            <Text
              style={{
                color: focused ? '#18193F' : '#18193F',
                fontWeight: focused ? 'bold' : 'normal',
                fontSize: focused ? 12 : 11,
                marginLeft: isTablet ? 20 : 0,
                marginBottom: isTablet ? '-5%' : '5%',
              }}>
              Logout
            </Text>
          ),
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                navigation.replace('Login'),
                  ahsan == ''
                    ? AsyncStorage.clear()
                    : AsyncStorage.removeItem('token');
              }}>
              {/* <Image source={require('../../assets/logout.png')} style={{ height: 28, width: 26, resizeMode: 'contain', marginBottom: responsiveHeight(3.2) }} /> */}
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
