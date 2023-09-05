import React,{useState,useEffect} from 'react';
import { StyleSheet, View,ActivityIndicator, TouchableOpacity, Text, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth,  } from 'react-native-responsive-dimensions';
import CustomHeader from '../../components/CustomHeader'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message'
import BasePath from '../../config/BasePath';


export default function ForgotPassword({ navigation }) {
    //Store string 
    const [reason,setReason]=useState('')
    //store number of bags 
    const [Bags,setNumberOfBags]=useState(0)
    //store location
    const [location,setLocation]=useState('')
    //enter notes
    const [notes,setNotes]=useState('')
    const [token,setToken]=useState('')
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        GetToken()
    },[])

    async function GetToken(){
        let usertoken= await AsyncStorage.getItem('token')
        setToken(usertoken)
    }
    function ValidateRequest(){
       
        if(isNaN(Bags) ){
            alert("Enter Valid Bag Number")
            return
        } if(Bags =='' ){
            alert("Enter Valid Bags Number")
            return
        }else if(reason == ''){
            alert("Enter Valid reason")
            return  
        }else {
            DepositBag()
        }
    }

    function DepositBag(){
        setIsLoading(true)
        axios.post( 
            BasePath+'bagRequest',{
                reason:reason,
                bagsCount:Bags,
                notes:notes,
                pickupLocation:location
            },
           {
              params: {
                  x_auth: token
                }
           }
          ).then(
              (res)=>{
                setIsLoading(false)
                //   disPatch(GetUserData(res.data))
                //   navigation.replace('Home')
                const {code,data,message}=res.data
                setNumberOfBags('')
                    setLocation('')
                    setNotes('')
                    setReason('')
                if(code ==200){
                  
                    Toast.show({
                        type: 'success',
                        text1: message
                    });
                    
                    
    
                }else{
                    alert('Error While getting data')
                }
              }
          ).catch(e=>console.log(
            setIsLoading(false),
            alert('Error ' + e.response.data.message)
    
          ));
    }


    return (
        <View style={styles.loginContainer}>
            <View style={styles.miniContainer}>
            <KeyboardAwareScrollView>
                <View style={styles.headerContainer}>
                  <CustomHeader  name="Bag Request" navigation={navigation}/>
                </View>

                <View>
                    <TextInput value={reason} onChangeText={(text)=>setReason(text)} style={styles.inputStyle} placeholderTextColor='#000' placeholder='Reason for Request' />
                    <TextInput value={Bags} keyboardType='number-pad' onChangeText={(text)=>setNumberOfBags(text)} style={styles.inputStyle} placeholderTextColor='#000' placeholder='# of Bags' />
                    <TextInput value={location} onChangeText={(text)=>setLocation(text)} style={styles.inputStyle} placeholderTextColor='#000' placeholder='Pickup Location' />
                    <TextInput value={notes} onChangeText={(text)=>setNotes(text)} style={styles.inputStyle} placeholderTextColor='#000' placeholder='Notes' />
                       {isLoading?< View style={{alignSelf:'center'}}>
                       <ActivityIndicator />
                       </View>: 
                    <TouchableOpacity onPress={()=>ValidateRequest()} style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Submit</Text>
                    </TouchableOpacity>}
                </View>
            </KeyboardAwareScrollView>
            </View>
            <Toast  position='top' />
        </View>
    );

}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff',
      
    },
    miniContainer:{
        flex:1,
        marginHorizontal:responsiveScreenWidth( 2)
    },
    headerContainer:{
        marginBottom:responsiveHeight(4),
        marginHorizontal:responsiveScreenWidth(4)
    },
    welcomeText: {
        marginTop: responsiveHeight(5),
        textAlign: 'center',
        marginBottom: responsiveFontSize(5),
        fontSize: responsiveFontSize(2.5),
        elevation: 3,
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1, },
        shadowColor: 'blue',
        color: '#000',
        fontWeight: '900'
    },
    inputStyle: {
        borderWidth: 1,
        width: '80%',
        color:'#000',
        height:45,
        alignSelf: 'center',
        backgroundColor:'#E6E6E6',
        paddingHorizontal: 10,
        marginBottom: responsiveHeight(3)
    },
    loginButton: {
        backgroundColor: '#36C4F1',
        width: '80%',
        height: responsiveHeight(6),
        marginTop: responsiveHeight(3.5),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    loginButtonText: {
        color: '#18193F',
        fontSize: responsiveFontSize(2)
    },
    forgotPasswordText: {
        color: '#3badfb',
        marginLeft: '10%',
        marginTop: responsiveHeight(7)
    }
})
