import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useEffect,useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { GetUserData } from '../../redux/Action';
import messaging from '@react-native-firebase/messaging';
import BasePath from '../../config/BasePath';
import { responsiveFontSize } from 'react-native-responsive-dimensions';


export default function CheckUserSession({ navigation }) {
  const [tryAgain,setTryAgain]=useState(false)
  const disPatch = useDispatch()
  useEffect(() => {
    GetToken()
  }, [])
  async function GetToken() {
    let usertoken = await AsyncStorage.getItem('token')
    
    if (usertoken != null) {
      
      setTryAgain(false)
      axios.get(
        BasePath+'loadUser',
        {
          params: {
            x_auth: usertoken
          }
        }
      ).then(
        (res) => {
          disPatch(GetUserData(res.data))
          navigation.replace('Home')
        }
      ).catch(e =>
        {
        setTryAgain(true)
        alert('Error '+ e.response.data.message)
        });
    } else {
      navigation.replace('Login')
    }

  }
  return (
    <View style={ styles.container}>
      {tryAgain?
      <TouchableOpacity>
        <Text style={{color:'#000'}}>TRY AGAIN</Text>
      </TouchableOpacity>
    :
      // <ActivityIndicator size={'large'} />
      <View style={{ flex: 1, backgroundColor: '#fff',justifyContent:'center',alignItems:"center" }}>
      {/* <ActivityIndicator size={'large'} /> */}
     
      <Image source={require('../../assets/dgtl_icon_610.png')} 
      style={{height:100,width:100}} 
      resizeMode='contain'/>
       <Text style={{fontWeight:'bold',fontSize:responsiveFontSize(2),color:"#18193F"}}>Loading...</Text>
  </View>
      }
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',

  }
})