import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import EditTextInput from './components/EditTextInput'; //component
import UserRole from './components/UserRole';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import axios, {spread} from 'axios';
import {GetUserData} from '../../../../redux/Action';
import BasePath from '../../../../config/BasePath';
import TouchID from 'react-native-touch-id';
import {useIsFocused} from '@react-navigation/native';

function Settings({navigation}) {
  const disPatch = useDispatch();

  const [userToken, setUserToekn] = useState('');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fingerPrintEnabled, setFingerPrintEnabled] = useState(false);

  const users = useSelector(state => state.Main.User.data.userData);
  // console.log('User', users)
  const [textInputs, setTextInputs] = useState({
    input1: {value: ''},
    input2: {value: ''},
    input3: {value: ''},
  });

  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);

  useEffect(() => {
    GetUserDetail();
  }, []);
  async function GetUserDetail() {
    let token = await AsyncStorage.getItem('token');
    const asyncBiometric = await AsyncStorage.getItem('biometric');
    console.log('asyncBiometric: ', asyncBiometric);
    if (asyncBiometric === '' || asyncBiometric === null) {
      setIsSwitchOn(false);
    } else {
      setIsSwitchOn(true);
    }
    // let record = JSON.parse(UserDetail)
    setUserToekn(token);
    // setUser(record)
  }

  const onToggleSwitch = async () => {
    setIsSwitchOn(!isSwitchOn);
    if (isSwitchOn) {
      Alert.alert('Note', 'Do you want to disable alternative way of login.', [
        {
          text: 'Cancel',
          onPress: () => setIsSwitchOn(true),
        },
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.removeItem('pinCode');
            await AsyncStorage.removeItem('biometric');
          },
        },
      ]);
    } else {
      setModalVisible(true);
    }
  };

  const handleOptionSelection = async item => {
    const isSupported = await TouchID.isSupported();
    setFingerPrintEnabled(isSupported);
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
    if (item == 1) {
      console.log('option1 ==> ', item);
      AsyncStorage.setItem('biometric', 'biometric');
      if (fingerPrintEnabled) {
        TouchID.authenticate(
          'Login with biometrics is an easier, more secure way to access your Account',
          optionalConfigObject,
        )
          .then(success => {
            Alert.alert('Authentication OK');
            setModalVisible(!modalVisible);
          })
          .catch(error => {
            Alert.alert('Authentication Failed');
            setModalVisible(!modalVisible);
          });
      }
    } else if (item == 2) {
      console.log('option2 ==> ', item);
      AsyncStorage.setItem('biometric', 'face');
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
                  Alert.alert('Authentication Failed');
                  setModalVisible(!modalVisible);
                } else {
                  Alert.alert('Authentication Failed');
                  setModalVisible(!modalVisible);
                }
              })
              .catch(error => {
                console.log('error --->>>', error);
                Alert.alert('Authentication Failed');
                setModalVisible(!modalVisible);
              });
          } else {
            Alert.alert(
              'Face ID is not supported or not enrolled on this device.',
            );
            setModalVisible(!modalVisible);
          }
        })
        .catch(error => {
          console.error('Face ID', error);
          Alert.alert('Error checking Face ID support.');
          setModalVisible(!modalVisible);
        });
      // AsyncStorage.setItem('biometric', 'face');
    } else if (item === 3) {
      try {
        console.log('option3 ==> ', item);
        AsyncStorage.setItem('biometric', 'pin');
        setModalVisible(false);
        navigation.navigate('SetPinScreen', {data: [], screen: 'settings'});
      } catch (error) {
        console.log('loginError: ', error);
      }
    } else if (item == 4) {
      console.log('option4 ==> ', item);
      AsyncStorage.setItem('biometric', '');
      setModalVisible(false);
      setIsSwitchOn(false);
    }
  };

  const handleUserInfo = (key, text) => {
    // Update the TextInput value in the object
    setTextInputs(prevState => ({
      ...prevState,
      [key]: {...prevState[key], value: text},
    }));
  };
  const handleCheckEmpty = async () => {
    const emptyInputs = Object.keys(textInputs).filter(
      key => textInputs[key].value !== '',
    );
    const name =
      textInputs['input1']?.value !== ''
        ? textInputs['input1']?.value
        : users.name;
    const phone =
      textInputs['input3']?.value !== ''
        ? textInputs['input3']?.value
        : users.phoneNumber;
    // await AsyncStorage.setItem('User',JSON.stringify(user))

    if (name == '') {
      alert('Enter Valid Name');
      return;
    } else if (phone == '') {
      alert('Enter Valid Phone Numebr');

      return;
    }

    await axios
      .post(
        BasePath + 'editProfile',
        {
          name: name,
          phoneNumber: phone,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      )
      .then(res => {
        const {data, code} = res.data;

        console.log('edit profile api response', res.data);
        if (code == 200) {
          disPatch(GetUserData(res.data));
          Toast.show({
            type: 'success',
            text1: 'Profile updated successfully',
          });
        } else {
          alert('Something went wrong try again');
        }
      })
      .catch(e => {
        console.log('error is 1', e.response.data);
      });
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <Text
        style={{
          fontWeight: '700',
          color: '#000',
          marginVertical: responsiveHeight(6),
          textAlign: 'center',
          fontSize: responsiveFontSize(2.3),
        }}>
        Manage Profile
      </Text>
      <EditTextInput
        keybordType="email-address"
        editabel={true}
        empty="Enter Name"
        value={users?.name}
        handleInput={text => handleUserInfo('input1', text)}
      />
      <EditTextInput
        keybordType="email-address"
        editabel={false}
        empty="Enter Email"
        value={users?.email}
        handleInput={text => handleUserInfo('input2', text)}
      />
      <EditTextInput
        keybordType="number-pad"
        editabel={true}
        empty="Enter Phone Number"
        value={users?.phoneNumber}
        handleInput={text => handleUserInfo('input3', text)}
      />
      {users?.accountType == 'customer' ? null : (
        <EditTextInput
          keybordType="number-pad"
          editabel={false}
          empty="Teller Id"
          value={users?.tellerID}
          nonEdit
        />
      )}

      <UserRole role={users.accountType} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
          marginLeft: '5%',
          justifyContent: 'space-around',
          marginTop: '5%',
        }}>
        <Text style={{marginLeft: 10, fontSize: 16, color: '#686868'}}>
          Use Fingerprint/FaceId/PIN to log in
        </Text>
        <Switch
          value={isSwitchOn}
          onValueChange={onToggleSwitch}
          color="#36C4F1"
          trackColor={{false: '#767577', true: '#36C4F1'}}
          thumbColor={isSwitchOn ? '#000' : '#f4f3f4'}
        />
      </View>
      <TouchableOpacity
        onPress={() => handleCheckEmpty()}
        style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChangePassword', {
            comingFrom: 'changePassword',
          })
        }
        style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Change Password</Text>
      </TouchableOpacity>
      <Toast position="top" />
      <View style={{position: 'absolute'}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#CBCBCB' + 'bb',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 270,
                width: '90%',
                position: 'absolute',
                top: 530,
                backgroundColor: '#fff',
                borderRadius: 10,
              }}>
              <TouchableOpacity
                onPress={() => handleOptionSelection(1)}
                style={styles.bioBtn}>
                <Image
                  source={require('../../../../assets/fingerprint.png')}
                  style={styles.bioIcon}
                />
                <Text style={styles.bioLabel}>{'Enable Biometric Login'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOptionSelection(2)}
                style={styles.bioBtn}>
                <Image
                  source={require('../../../../assets/face.png')}
                  style={styles.bioIcon}
                />
                <Text style={styles.bioLabel}>{'Enable Face ID Login'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOptionSelection(3)}
                style={styles.bioBtn}>
                <Image
                  source={require('../../../../assets/pin.png')}
                  style={styles.bioIcon}
                />
                <Text style={styles.bioLabel}>{'Enable PIN Login'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOptionSelection(4)}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>{'Skip'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  changePasswordBtn: {
    backgroundColor: '#fff',
    width: '90%',
    height: 45,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowOffset: {width: 1, height: 1},
    marginVertical: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  inputStyle: {
    borderWidth: 1,
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: responsiveHeight(5),
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
    fontWeight: 'bold',
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

export default Settings;
