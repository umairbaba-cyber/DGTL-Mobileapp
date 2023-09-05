import React, { Component, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, ActivityIndicator } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { responsiveFontSize, responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import DropDownPicker from 'react-native-dropdown-picker';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNFetchBlob from "rn-fetch-blob";
import { useSelector } from 'react-redux';
import { CustomerReports, SupervisorReports, TellerReports } from './ReportsList';
import BasePath from '../../config/BasePath';

export default function GenrateReport({ navigation }) {
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectStartDate, setStartDate] = useState('');
  const [token, setToken] = useState('')
  const [selectEndDate, setEndDate] = useState('');
  const [showStartDateCalender, setStartDateCalender] = useState(false);
  const [showEndDateCalender, setEndDateCalender] = useState(false);
  const [convertTo, setConvertTO] = useState([])
  const [fileGenrated, setFileGenrated] = useState(true)
  const [isReportGenrating, setIsReportGenrating] = useState(false)
  const user = useSelector((state) => (state.Main.User.data.userData.accountType))



  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {

      if (user == 'customer') {
        setItems(CustomerReports)
        setValue(CustomerReports[0].value)

      } else if (user == 'teller') {
        setItems(TellerReports)
        setValue(TellerReports[0].value)

      } else {
       
        setItems(SupervisorReports)
        setValue(SupervisorReports[0].value)


      }
      GetUserDetail()
    } catch (e) {
      console.log('error from Genrate report screen', e)
    }
  }, [])
  async function GetUserDetail() {
    let token = await AsyncStorage.getItem('token')
    setToken(token)
    var date1 = (new Date())
    var date2 = (new Date())
    date1.setDate(date1.getDate() - 30);

    setStartDate(date1.toJSON().substring(0, 10))
    setEndDate(date2.toJSON().substring(0, 10))
    // checkPermission()
  }



  function RenderStartDateCalender() {
    setStartDateCalender(!showStartDateCalender)
    setEndDateCalender(false)
  }

  function RenderEndDateCalender() {
    setStartDateCalender(false)
    setEndDateCalender(!showEndDateCalender)
  }

  async function FilterResult(token, start, end, value) {
console.log('FilterResult',value,start,end)
    if (value == null) {
      alert('Please Select Report Type')
      return
    }
    setIsReportGenrating(true)



    await axios.post(`${BasePath}${value}`,
      {

        startingDate: start,
        endingDate: end,


      }, {
      params: {
        x_auth: token
      }
    }
    ).then(res => {
      const { code, data } = res.data


      if (data.length > 0) {

        setFileGenrated(false)
        setIsDownloading(false)
        console.log('data',data)
        setConvertTO(data)
        setIsReportGenrating(false)
      } else {
        alert('No Record Found')
        setIsReportGenrating(false)
      }
    }).catch((e) => {
      setIsReportGenrating(false)

      alert(e.response.data.message)
      console.log('error is 5', e.response.data)
    })


  }

  // const checkPermission = async () => {
  //   // Function to check the platform
  //   // If iOS then start downloading
  //   // If Android then ask for permission

  //   if (Platform.OS === 'ios') {
  //     // DownloadFileAs(file);
  //   } else {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Storage Permission Required',
  //           message: 'App needs access to your storage to download Photos',
  //         },
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         // Once user grant the permission start downloading
  //         console.log('Storage Permission Granted.');
  //         // DownloadFileAs(file);
  //       } else {
  //         // If permission denied then show alert
  //         alert('Storage Permission Not Granted');
  //       }
  //     } catch (err) {
  //       // To handle permission related exception
  //       console.warn(err);
  //     }
  //   }
  // };
  function startDownload(file) {
    console.log('Start downloading',file)
    setIsDownloading(true)
    setTimeout(() => {
      DownloadFileAs(file)

    }, 1000);
  }
  function DownloadFileAs(file) {
    console.log('Download File as',file)
    try {
      let date = new Date();
      // Image URL which we want to download
      let File_URL = file;
      // Getting the extention of the file
      let ext = getExtention(File_URL);
      ext = '.' + ext[0];
      // Get config and fs from RNFetchBlob
      // config: To pass the downloading related options
      // fs: Directory path where we want our image to download
      const { config, fs } = RNFetchBlob;
      let DocDir = fs.dirs.DownloadDir;

      let options = {
        fileCache: true,
        addAndroidDownloads: {
          // Related to the Android only
          useDownloadManager: true,
          notification: true,
          path:
            DocDir +
            '/NightScan/' +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            ext,
          description: 'File Downloading ...',
        },
      };

      config(options)
        .fetch('GET', File_URL)
        .then(res => {
         
          setIsDownloading(false)
          // Showing alert after successful downloading
          alert(`File Saved Successfully.`);
        }).catch((e) => {
          alert('Error while saving')
        });
    } catch (e) {
      setIsDownloading(false)
      alert('Error ', e)

    }


  }
  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };



  function CheckStartDateSelected(day) {

    var today = (new Date())
    let todayDate = today.toJSON().substring(0, 10)
    if (day.dateString > todayDate || day.dateString > selectEndDate) {
      alert('Invalid Start Date Selected')
      return
    }
    setFileGenrated(true)
    setIsDownloading(false)
    setStartDate(day.dateString);
    RenderStartDateCalender()
  }

  function CheckEndDateSelected(day) {
    var today = (new Date())
    let todayDate = today.toJSON().substring(0, 10)
    if (day.dateString > todayDate || day.dateString < selectStartDate) {
      alert('Invalid End Date Selected')
      return
    }

    setFileGenrated(true)
    setIsDownloading(false)
    setEndDate(day.dateString);
    RenderEndDateCalender()
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomHeader name={'Reports'} navigation={navigation} />

        <View
          style={{ zIndex: 100 }}
        >
          <DropDownPicker
            open={open}
            value={value}
            items={items}

            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={(value) => {
              setFileGenrated(true)
              setIsDownloading(false)
            }}
            setItems={setItems}
            theme="LIGHT"
            listMode="MODAL"
            dropDownStyle={{ backgroundColor: '#fff' }}
          />
        </View>
        <Text style={{ marginTop: 20, color: '#000' }}>Genrate Report Between</Text>
        <View style={{ marginVertical: responsiveHeight(4), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>

          <TouchableOpacity onPress={() => RenderStartDateCalender()}>
            {selectStartDate == '' ? <Text style={{ color: '#000' }}>select starting date</Text> : <Text style={{ borderWidth: 2, padding: 10, color: '#000' }}>{selectStartDate}</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => RenderEndDateCalender()}>
            {selectEndDate == '' ? <Text style={{ color: '#000' }}>select ending date</Text> : <Text style={{ borderWidth: 2, padding: 10, color: '#000' }}>{selectEndDate}</Text>}
          </TouchableOpacity>

        </View>
        {showStartDateCalender &&
          <Calendar
            onDayPress={day => {
              CheckStartDateSelected(day)
              // setFileGenrated(true)
              // setStartDate(day.dateString);
              // RenderStartDateCalender()
            }}
            markedDates={{
              [selectStartDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
            }}
          />}

        {showEndDateCalender &&
          <Calendar
            maxDate={new Date() - 1}
            onDayPress={day => {
              CheckEndDateSelected(day)
            }}
            markedDates={{
              [selectEndDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
            }}
          />}


        <View >
          {fileGenrated ?
            <>
              {isReportGenrating ? <ActivityIndicator /> :
                <TouchableOpacity onPress={() => FilterResult(token, selectStartDate, selectEndDate, value)} style={{ ...styles.downbtn, alignSelf: 'center', width: '80%', height: 50 }}>
                  <Text style={styles.txt}>Genrate Report</Text>
                </TouchableOpacity>}

            </>

            :
            <>
              {isDownloading ?
                <ActivityIndicator />
                :
                <View>
                  <TouchableOpacity onPress={() => startDownload(convertTo.downloadCSV)} style={{ ...styles.downbtn, alignSelf: 'center', width: '80%', height: 50 }}>
                    <Text style={styles.txt}>Save as CSV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => startDownload(convertTo.downloadPDF)} style={{ ...styles.downbtn, alignSelf: 'center', width: '80%', height: 50 }}>
                    <Text style={styles.txt}>Save as Pdf</Text>
                  </TouchableOpacity>
                </View>}
            </>
          }
        </View>
      </View>
    </ScrollView>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainer: {
    marginHorizontal: responsiveScreenWidth(4),
  },
  tableHeader: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: responsiveScreenWidth(90),
    flexDirection: 'row'
  },
  tableContent: {
    width: '100%'
  },
  headerText: {
    textAlign: 'center',
    color: 'blue',
    fontSize: responsiveFontSize(3)
  },
  borderStyle: {
    borderWidth: 1,
    height: responsiveHeight(10)
  },
  columStyle: {
    borderTopWidth: 0,
    borderTopColor: '#000',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: responsiveScreenWidth(90),
    flexDirection: 'row'
  },
  columText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.9)
  },

  downbtn: {
    backgroundColor: '#36C4F1',
    borderWidth: 1,
    marginTop: 10,
    height: 30,
    width: '30%',
    justifyContent: 'center',
  },
  txt: {
    color: '#18193F',
    textAlign: 'center'
  }
})


