import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {validateOTP} from '../../validations/validation';
import BasePath from '../../config/BasePath';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {GET_USER_DATA} from '../../redux/constant';
import TouchID from 'react-native-touch-id';

import {GetUserData} from '../../redux/Action';
const CELL_COUNT = 6;

export default function OTPScreen({navigation, route}) {
  const {comingFrom, email, password, optionPrev, fingerPrintEnabledPrev} =
    route.params; // Retrieve the parameters from route
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [show, setShow] = useState(true);
  const [option, setOption] = useState(optionPrev);
  const [fingerPrintEnabled, setFingerPrintEnabled] = useState(
    fingerPrintEnabledPrev,
  );
  const [userData, setUserData] = useState(null);

  const disPatch = useDispatch();
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

  async function verifyOTP() {
    if (validateOTP(value)) {
      setLoading(true);
      const url =
        comingFrom == 'forgotPassword'
          ? 'verifyforgotpasswordotp'
          : 'verifyLogInOTP';
      await axios
        .post(
          BasePath + url,

          comingFrom == 'forgotPassword'
            ? {
                email: email,
                OTP: parseInt(value),
              }
            : {
                email_address: email,
                OTP: parseInt(value),
              },
        )
        .then(res => {
          // console.log('res', JSON.stringify(res?.data));
          if (res?.data?.code == 200) {
            Toast.show({
              type: 'success',
              text1: res?.data?.message,
            });
            if (comingFrom == 'forgotPassword') {
              navigation.navigate('ChangePassword', {
                email: email,
                comingFrom: comingFrom,
              });
            } else {
              setUserData(res?.data);
              afterLogin(res?.data, false);
            }
          }
          setLoading(false);
        })
        .catch(e => {
          console.log('OTPScreen-error', JSON.stringify(e));
          setLoading(false);
          alert('Error ' + e?.response?.data?.message);
        });
    } else {
      alert('Enter Valid OTP');
    }
  }
  async function afterLogin(res, isAgain = false) {
    console.log('afterLogin-isAgain', isAgain, 'option', option);
    try {
      // console.log('afterLogin-run', JSON.stringify(res));

      if (email == '1NBSupervisor@iicdev.com' || option != 0) {
        console.log('if');
        setModalVisible(false);
      }
      // else if (!isAgain)
      else {
        console.log('else');
        setModalVisible(true); /// SetPinScreen
      }

      await AsyncStorage.setItem('email1', email);
      await AsyncStorage.setItem('password1', password);
      if (option == 1) {
        console.log('calling 4');
        console.log('option1 ==> ', option);
        await AsyncStorage.setItem('biometric', 'biometric');
        // AsyncStorage.clear();
        if (fingerPrintEnabled) {
          TouchID.authenticate(
            'Login with biometrics is an easier, more secure way to access your Account',
            optionalConfigObject,
          )
            .then(success => {
              AsyncStorage.setItem('token', res?.data?.token);
              disPatch(GetUserData(res));
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
        await AsyncStorage.setItem('biometric', 'face');
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
                    AsyncStorage.setItem('token', res?.data?.token);
                    disPatch(GetUserData(res));
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
          await AsyncStorage.setItem('biometric', 'pin');
          navigation.navigate('SetPinScreen', {
            data: res,
            screen: 'login',
          });
        } catch (error) {
          console.log('loginError: ', error);
        }
      } else if (option == 4) {
        console.log('this Option set');
        console.log('calling 8');
        console.log('option1 ==> ', option);

        // AsyncStorage.clear();
        await AsyncStorage.removeItem('biometric');
        await AsyncStorage.removeItem('pinCode');

        await AsyncStorage.setItem('token', res?.data?.token);
        disPatch(GetUserData(res));
        navigation.replace('Home');
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  async function logicToRun() {
    try {
      let res = userData;
      await AsyncStorage.setItem('email1', email);
      await AsyncStorage.setItem('password1', password);
      if (option == 1) {
        console.log('calling 4');
        console.log('option1 ==> ', option);
        await AsyncStorage.setItem('biometric', 'biometric');
        // AsyncStorage.clear();
        if (fingerPrintEnabled) {
          TouchID.authenticate(
            'Login with biometrics is an easier, more secure way to access your Account',
            optionalConfigObject,
          )
            .then(success => {
              AsyncStorage.setItem('token', res?.data?.token);
              disPatch(GetUserData(res));
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
        await AsyncStorage.setItem('biometric', 'face');
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
                    AsyncStorage.setItem('token', res?.data?.token);
                    disPatch(GetUserData(res));
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
          await AsyncStorage.setItem('biometric', 'pin');
          navigation.navigate('SetPinScreen', {
            data: res,
            screen: 'login',
          });
        } catch (error) {
          console.log('loginError: ', error);
        }
      } else if (option == 4) {
        console.log('this Option set');
        console.log('calling 8');
        console.log('option1 ==> ', option);

        // AsyncStorage.clear();
        await AsyncStorage.removeItem('biometric');
        await AsyncStorage.removeItem('pinCode');

        await AsyncStorage.setItem('token', res?.data?.token);
        disPatch(GetUserData(res));
        navigation.replace('Home');
      }
    } catch (error) {
      console.log('logicRun-error', error);
    }
  }
  useEffect(() => {
    if (userData) {
      logicToRun();
    }
  }, [option]);
  return (
    <View style={styles.loginContainer}>
      <TouchableOpacity
        style={{padding: 10}}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../assets/backarrow.png')}
          style={{width: 30, height: 18}}
        />
      </TouchableOpacity>
      <KeyboardAwareScrollView style={styles.keyboardAvoidingContainer}>
        <View>
          <Text style={styles.welcomeText}>Enter OTP</Text>
        </View>

        <Text
          style={{
            marginLeft: responsiveWidth(10),
            marginTop: responsiveHeight(2),
          }}>
          Please check your email, OTP sent on your email.
        </Text>
        <View
          style={{
            marginLeft: responsiveWidth(10),
            marginRight: responsiveWidth(10),
          }}>
          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              verifyOTP();
              // navigation.navigate('ChangePassword');
            }}
            style={[styles.loginButton, {marginTop: responsiveHeight(7)}]}>
            {loading ? (
              <ActivityIndicator size={'small'} color={'black'} />
            ) : (
              <Text style={styles.loginButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => {}} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Resend</Text>
          </TouchableOpacity> */}
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
                setOption(1);
                setModalVisible(false);
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
                setOption(2);
                setModalVisible(false);
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
                setOption(4);
                setModalVisible(false);
              }}
              style={styles.loginButton}>
              <Text style={styles.loginButtonText}>{'Skip'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast position="top" />
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    marginTop: responsiveHeight(15),
  },
  welcomeText: {
    marginTop: responsiveHeight(5),
    textAlign: 'center',
    marginBottom: responsiveFontSize(5),
    fontSize: responsiveFontSize(2.5),

    color: '#000',
    fontWeight: '900',
  },
  inputStyle: {
    borderWidth: 1,
    width: '80%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    height: 45,
    marginBottom: responsiveHeight(3),
    color: '#000',
  },

  loginButtonText: {
    color: '#18193F',
    fontSize: responsiveFontSize(2),
  },
  forgotPasswordText: {
    color: '#3badfb',
    marginLeft: '10%',
    marginTop: responsiveHeight(7),
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
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    color: 'black',
  },
  focusCell: {
    borderColor: '#36C4F1',
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
