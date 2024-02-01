import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Linking,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {validateEmail, validatePassword} from '../../validations/validation';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {GET_USER_DATA} from '../../redux/constant';
import TouchID from 'react-native-touch-id';

import {GetUserData} from '../../redux/Action';
import BasePath from '../../config/BasePath';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
export default function Login({navigation}) {
  //for editing user email
  const [email, setEmail] = useState('');
  //for editing password
  const [password, setPassword] = useState('');
  //an indicator to show if state loading  is not completed
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [show, setShow] = useState(true);
  const [option, setOption] = useState(0);
  const [fingerPrintEnabled, setFingerPrintEnabled] = useState(false);
  const [userData, setUserData] = useState([]);

  const disPatch = useDispatch();

  const isFocued = useIsFocused();
  useEffect(() => {
    getData();
  }, [isFocued]);

  const optionalConfigObject = {
    title: 'Enable Biometrics',
    imageColor: '#36C4F1',
    imageErrorColor: '#ff0000',
    sensorDescription: 'Touch sensor',
    sensorErrorDescription: 'Failed',
    cancelText: 'Cancel',
    fallbackLabel: 'Show Passcode',
    unifiedErrors: false,
    passcodeFallback: false,
  };

  const getData = async () => {
    const asyncBiometric = await AsyncStorage.getItem('biometric');
    const pinCode = await AsyncStorage.getItem('pinCode');
    const asyncEmail = await AsyncStorage.getItem('email1');
    const asyncPassword = await AsyncStorage.getItem('password1');
    const isSupported = await TouchID.isSupported();
    console.log('asyncBiometric', asyncBiometric, option);
    console.log('pinCode --->>', pinCode, email, password);
    setFingerPrintEnabled(isSupported);
    if (asyncBiometric !== '' && asyncBiometric !== null) {
      setEmail(asyncEmail);
      setPassword(asyncPassword);
      if (asyncBiometric == 'biometric') {
        setOption(1);
      } else if (asyncBiometric == 'face') {
        setOption(2);
      } else if (asyncBiometric == 'pin') {
        setOption(3);
      } else if (asyncBiometric == '') {
        setOption(4);
      }
    } else {
      setOption(0);
    }
    // Login();
  };

  console.log('option: ', option, email, password);
  console.log("BasePath + 'login'", BasePath + 'login');
  //this function will be called if user want to login
  async function Login() {
    console.log('email>>>', email, 'password>>>', password);
    //validateEmail
    //this function will check if user email is valid or nor
    if (validateEmail(email)) {
      //validate password
      //this function will check if user has entered password according to validation
      if (validatePassword(password)) {
        setIsLoading(true);
        console.log('calling 1');
        await axios
          .post(BasePath + 'login', {
            email: email.toLocaleLowerCase(),
            password: password,
          })
          .then(res => {
            console.log('calling 2');
            console.log('res login', res.data.data.company.FXAllowed);
            console.log('res login --- >', res.data);
            if (res?.data?.code == 200) {
              console.log('code avail');
              console.log('calling 3');
              setUserData(res?.data);

              if (email == '1NBSupervisor@iicdev.com' || option != 0) {
                setModalVisible(false);
              } else {
                setModalVisible(true); /// SetPinScreen
              }

              AsyncStorage.setItem('email1', email);
              AsyncStorage.setItem('password1', password);
              if (option == 1) {
                console.log('calling 4');
                console.log('option1 ==> ', option);
                AsyncStorage.setItem('biometric', 'biometric');
                // AsyncStorage.clear();
                if (fingerPrintEnabled) {
                  TouchID.authenticate(
                    'Login with biometrics is an easier, more secure way to access your Account',
                    optionalConfigObject,
                  )
                    .then(success => {
                      AsyncStorage.setItem('token', res?.data?.data?.token);
                      disPatch(GetUserData(res.data));
                      navigation.replace('Home');
                    })
                    .catch(error => {
                      console.log(error);
                      Alert.alert(
                        'Failed',
                        'Do you want to disable the biometric login.',
                        [
                          {text: 'No', onPress: () => {}},
                          {
                            text: 'Yes',
                            onPress: async () => {
                              await AsyncStorage.removeItem('biometric');
                              setOption(0);
                            },
                          },
                        ],
                      );
                    });
                } else {
                  Alert.alert('Your device dont have fingerprint sensor');
                  setOption(4);
                }
              } else if (option == 2) {
                console.log('calling 6');
                console.log('option2 ==> ', option);
                AsyncStorage.setItem('biometric', 'face');
                // AsyncStorage.clear();
                TouchID.isSupported()
                  .then(supported => {
                    console.log('Supported or not', supported);
                    if (supported) {
                      const optionalConfigObject = {
                        unifiedErrors: true,
                      };
                      TouchID.authenticate(
                        'Login with biometrics is an easier, more secure way to access your Account',
                        optionalConfigObject,
                      )
                        .then(success => {
                          if (success) {
                            AsyncStorage.setItem(
                              'token',
                              res?.data?.data?.token,
                            );
                            disPatch(GetUserData(res.data));
                            navigation.replace('Home');
                          } else {
                            Alert.alert('Authentication Failed');
                          }
                        })
                        .catch(error => {
                          console.log('error --->>>', error);
                          Alert.alert(
                            'Failed',
                            'Do you want to disable the biometric login.',
                            [
                              {text: 'No', onPress: () => {}},
                              {
                                text: 'Yes',
                                onPress: async () => {
                                  await AsyncStorage.removeItem('biometric');
                                  setOption(0);
                                },
                              },
                            ],
                          );
                        });
                    } else {
                      Alert.alert(
                        'Face ID is not supported or not enrolled on this device.',
                      );
                    }
                  })
                  .catch(error => {
                    console.error('Face ID', error);
                    Alert.alert('Error checking Face ID support.');
                  });
                // AsyncStorage.setItem('biometric', 'face');
              } else if (option === 3) {
                console.log('calling 7');
                // console.log("res?.data: ", res?.data);
                try {
                  console.log('option3 ==> ', option);
                  AsyncStorage.setItem('biometric', 'pin');
                  navigation.navigate('SetPinScreen', {
                    data: res?.data,
                    screen: 'login',
                  });
                } catch (error) {
                  console.log('loginError: ', error);
                }
              } else if (option == 4) {
                console.log('calling 8');
                console.log('option1 ==> ', option);

                // AsyncStorage.clear();
                AsyncStorage.removeItem('biometric');
                AsyncStorage.removeItem('pinCode');

                AsyncStorage.setItem('token', res?.data?.data?.token);
                disPatch(GetUserData(res.data));
                navigation.replace('Home');
              }

              // AsyncStorage.setItem('token', res?.data?.data?.token);

              //GetUserData
              //this function will store user login info
              // disPatch(GetUserData(res.data));
              // navigation.replace('Home');
            } else {
              setIsLoading(false);
              alert('Something went wrong error' + res.data.code);
            }
          })
          .catch(e => {
            const errorMessage = e?.response?.data?.message;
            console.log('Error -->>', errorMessage);        
            Toast.show({ type: 'error', text1: `${errorMessage ?? e}`});
          });
      } else {
        alert('Enter Valid Password');
        setIsLoading(false);
        return;
      }
    } else {
      alert('Enter Valid Email');
      setIsLoading(false);
    }

    setIsLoading(false);
  }

  function forgotPassword() {
    navigation.navigate('ForgotPassword');
    // navigation.navigate('SetPinScreen');
  }

  const windowDimesions = useWindowDimensions();
  const isTablet = windowDimesions.width >= 600;
  return (
    <View style={styles.loginContainer}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <KeyboardAwareScrollView style={styles.keyboardAvoidContainer}>
        <View>
          <Image
            style={styles.imageStyle}
            source={require('../../src/assets/images/login.png')}
          />
        </View>
        <View>
          <Text
            style={{
              marginBottom: 8,
              marginLeft: responsiveWidth(10),
              color: 'grey',
            }}>
            Email
          </Text>
          <TextInput
            onChangeText={e => setEmail(e)}
            style={styles.inputStyleEmail}
            placeholderTextColor="#000"
            keyboardType="email-address"
            placeholder="Enter email address"
            autoCapitalize="none"
          />
          <Text
            style={{
              marginBottom: 8,
              marginLeft: responsiveWidth(10),
              color: 'grey',
            }}>
            Password
          </Text>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              marginHorizontal: 40,
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '80%',
              alignSelf: 'center',
            }}>
            <TextInput
              onChangeText={e => setPassword(e)}
              style={styles.inputStyle}
              placeholderTextColor="#000"
              placeholder="Enter password"
              keyboardType="default"
              secureTextEntry={show ? true : false}
            />
            <TouchableOpacity onPress={() => setShow(!show)}>
              <Image
                source={
                  show
                    ? require('../../assets/dgtl_app_hidepassword.png')
                    : require('../../assets/dgtl_app_showpassword.png')
                }
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 10,
                  tintColor: 'black',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator />
          ) : (
            //  Login()
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => Login()}
                style={
                  option == 1 || option == 2 || option === 3
                    ? styles.loginIDButton
                    : styles.loginButton
                }>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              {option == 1 || option == 2 || option === 3 ? (
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: responsiveHeight(3.5),
                    marginLeft: '4%',
                  }}>
                  <TouchableOpacity
                    onPress={() => Login()}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      borderWidth: 1,
                      height: 45,
                      width: 45,
                    }}>
                    {option == 1 ? (
                      <Image
                        source={require('../../assets/fingerprint.png')}
                        style={{height: 30, width: 30}}
                      />
                    ) : option == 2 ? (
                      <Image
                        source={require('../../assets/face.png')}
                        style={{height: 30, width: 30}}
                      />
                    ) : option === 3 ? (
                      <Image
                        source={require('../../assets/pin.png')}
                        style={{height: 30, width: 30}}
                      />
                    ) : null}
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}

          {/* {option == 1 ? (
            <View style={{alignItems: 'center', marginTop: '2%'}}>
              <TouchableOpacity
                onPress={() => Login()}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 50,
                  width: 50,
                }}>
                <Image
                  source={require('../../assets/fingerprint.png')}
                  style={{height: 40, width: 40}}
                />
              </TouchableOpacity>
            </View>
          ) : option == 2 ? (
            <View style={{alignItems: 'center', marginTop: '2%'}}>
              <TouchableOpacity
                onPress={() => Login()}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 50,
                  width: 50,
                }}>
                <Image
                  source={require('../../assets/face.png')}
                  style={{height: 40, width: 40}}
                />
              </TouchableOpacity>
            </View>
          ) : null} */}

          <TouchableOpacity onPress={() => forgotPassword()}>
            <Text
              style={[
                styles.forgotPasswordText,
                {
                  fontSize: isTablet
                    ? responsiveFontSize(1.5)
                    : responsiveFontSize(1.9),
                },
              ]}>
              Forgot Password ?
            </Text>
          </TouchableOpacity>
          <Text
            onPress={() =>
              Linking.openURL('https://digitaldeposits.app/privacy')
            }
            style={[
              styles.privacyText,
              {
                fontSize: isTablet
                  ? responsiveFontSize(1.5)
                  : responsiveFontSize(1.9),
              },
            ]}>
            Privacy
          </Text>
        </View>
      </KeyboardAwareScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#CBCBCB' + 'bb',
            alignItems: 'center',
            //  justifyContent: 'center',
          }}>
          <View
            style={{
              height: 270,
              width: '90%',
              position: 'absolute',
              top: 530,
              // justifyContent : 'center',
              backgroundColor: '#fff',
              // borderTopWidth: 1,
              borderRadius: 10,
              padding: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                setOption(1), setModalVisible(false);
              }}
              style={styles.bioBtn}>
              <Image
                source={require('../../assets/fingerprint.png')}
                style={styles.bioIcon}
              />
              <Text style={styles.bioLabel}>{'Enable Biometric Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOption(2), setModalVisible(false);
              }}
              style={styles.bioBtn}>
              <Image
                source={require('../../assets/face.png')}
                style={styles.bioIcon}
              />
              <Text style={styles.bioLabel}>{'Enable Face ID Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOption(3);
                setModalVisible(false);
              }}
              style={styles.bioBtn}>
              <Image
                source={require('../../assets/pin.png')}
                style={styles.bioIcon}
              />
              <Text style={styles.bioLabel}>{'Enable PIN Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOption(4), setModalVisible(false);
              }}
              style={styles.loginButton}>
              <Text style={styles.loginButtonText}>{'Skip'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast position='bottom' />
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidContainer: {
    flex: 1,

    marginTop: responsiveHeight(20),
  },
  welcomeText: {
    marginTop: responsiveHeight(5),
    textAlign: 'center',
    marginBottom: responsiveFontSize(5),
    fontSize: responsiveFontSize(2.5),
    elevation: 3,
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowOffset: {width: 1, height: 1},
    shadowColor: 'blue',
    color: '#000',
    fontWeight: '900',
  },
  inputStyle: {
    color: 'black',
    width: '80%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    height: 45,
    // marginBottom: responsiveHeight(3)
  },
  inputStyleEmail: {
    borderWidth: 1,
    color: 'black',
    width: '80%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    height: 45,
    marginBottom: responsiveHeight(3),
  },
  loginButton: {
    backgroundColor: '#36C4F1',
    width: '80%',
    height: 38,
    marginTop: responsiveHeight(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  loginIDButton: {
    backgroundColor: '#36C4F1',
    width: '65%',
    height: 45,
    marginTop: responsiveHeight(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#18193F',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#18193F',
    fontWeight: '700',
    marginLeft: '10%',
    fontSize: responsiveFontSize(1.9),
    marginTop: responsiveHeight(5),
  },
  privacyText: {
    color: '#18193F',
    fontWeight: '700',
    marginLeft: '10%',
    fontSize: responsiveFontSize(1.9),
    marginTop: responsiveHeight(2),
  },
  imageStyle: {
    marginVertical: responsiveHeight(4),
    alignSelf: 'center',
    width: responsiveWidth(150),
    height: responsiveHeight(12),
    resizeMode: 'contain',
  },
  bioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  bioIcon: {
    height: 30,
    width: '10%',
    resizeMode: 'contain',
  },
  bioLabel: {
    fontSize: 16,
    color: '#000',
    marginLeft: '5%',
    width: '80%',
  },
});
