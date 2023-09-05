import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import EditTextInput from './components/EditTextInput'; //component
import UserRole from './components/UserRole';
import Toast from 'react-native-toast-message'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { GetUserData } from '../../../../redux/Action';
import BasePath from '../../../../config/BasePath'
 
function Settings({ navigation }) {
    const disPatch=useDispatch()
    
    const [userToken, setUserToekn] = useState('')
    const users = useSelector(state => state.Main.User.data.userData);
    console.log('User',users)
    const [textInputs, setTextInputs] = useState({
        input1: { value: '' },
        input2: { value: '' },
        input3: { value: '' },

    });
    useEffect(() => {
        GetUserDetail()
    }, [])
    async function GetUserDetail() {
        let token = await AsyncStorage.getItem('token')
        // let record = JSON.parse(UserDetail)
        setUserToekn(token)
        // setUser(record)
       

    }

    const handleUserInfo = (key, text) => {
        // Update the TextInput value in the object
        setTextInputs(prevState => ({
            ...prevState,
            [key]: { ...prevState[key], value: text }
        }));
    };
    const handleCheckEmpty = async () => {

        const emptyInputs = Object.keys(textInputs).filter(
            key => textInputs[key].value !== ''
        );
       const name = textInputs['input1']?.value !== '' ? textInputs['input1']?.value : users.name
       const phone = textInputs['input3']?.value !== '' ? textInputs['input3']?.value : users.phoneNumber
        // await AsyncStorage.setItem('User',JSON.stringify(user))


        if(name==''){
            alert('Enter Valid Name')
            return
        }else if(phone==''){
            alert('Enter Valid Phone Numebr')

           return 
        }


        await axios.post(BasePath+'editProfile',
            {
                name: name,
                phoneNumber:phone ,
            }, {
            params: {
                x_auth: userToken
            }
        }
        ).then(res => {
            const { data, code } = res.data
           
           console.log('edit profile api response',res.data)
            if (code == 200) {
                disPatch(GetUserData(res.data))
                Toast.show({
                    type: 'success',
                    text1: 'Profile updated successfully'
                });
            }else{
                alert('Something went wrong try again')
            }

        }).catch((e) => {
            console.log('error is 1', e.response.data)
        })


    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Text style={{ fontWeight: '700', color: '#000', marginVertical: responsiveHeight(6), textAlign: 'center', fontSize: responsiveFontSize(2.3) }}>Manage Profile</Text>
            <EditTextInput keybordType='email-address' editabel={true} empty="Enter Name" value={users?.name} handleInput={text => handleUserInfo('input1', text)} />
            <EditTextInput keybordType='email-address' editabel={false} empty="Enter Email" value={users?.email} handleInput={text => handleUserInfo('input2', text)} />
            <EditTextInput keybordType='number-pad' editabel={true} empty="Enter Phone Number" value={users?.phoneNumber} handleInput={text => handleUserInfo('input3', text)} />
         {users?.accountType=='customer'?null:
            <EditTextInput keybordType='number-pad' editabel={false} empty="Teller Id" value={users?.tellerID}  nonEdit/>}
            <UserRole role={users.accountType} />
            <TouchableOpacity onPress={() => handleCheckEmpty()} style={styles.loginButton}>
             <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('ChangePassword')}
             style={styles.loginButton}>
             <Text style={styles.loginButtonText}>Change Password</Text>
            </TouchableOpacity>
            <Toast position='top' />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    changePasswordBtn: {
        backgroundColor: '#fff',
        width: '90%',
        height: 45,
        elevation: 3,
        shadowOpacity: 0.3,
        shadowOffset: { width: 1, height: 1 },
        marginVertical: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    inputStyle: {
        borderWidth: 1,
        width: '80%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: responsiveHeight(5)
    },
    loginButton: {
        backgroundColor: '#36C4F1',
        width: '80%',
        height: 45,
        marginTop: responsiveHeight(3.5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    loginButtonText: {
        color: '#18193F',
        fontSize: responsiveFontSize(2)
    },
})


export default Settings