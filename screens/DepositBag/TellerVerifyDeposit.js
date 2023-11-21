import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, TextInput, ActivityIndicator } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { responsiveFontSize, responsiveScreenWidth, responsiveHeight, responsiveWidth, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BasePath from '../../config/BasePath';
import { SelectList } from 'react-native-dropdown-select-list'
//it is fifth scrren
//it is a screen for teller 
// on this screen teller verify that amount which user has deposited

export default function TellerVerifyDeposit({ navigation, route }) {

    const [found, setFound] = useState("No");
    const [checkType, setCheckType] = useState('Credit')
    const [note, setNote] = useState('')
    const [amount, setAmount] = useState('')
    const [isLoading, setLoading] = useState(false);

    const yesNo = [
        { key: '1', value: 'Yes' },
        { key: '2', value: 'No' },
    ]
    const type = [
        { key: '1', value: 'Credit' },
        { key: '2', value: 'Debit' },
    ]
    const CurrencySymbole = useSelector(
        state => state?.Main?.User?.data?.company.localCurrency,
    );
    const currencyArray = CurrencySymbole.split('-');
    const total = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.total.value)
    const updatedAt = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.updatedAt)
    const limitExceed = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.limitExceed)
    const user = useSelector(state => state.Main.QrCodeScanedDetail.accoutType)
    const userName = useSelector(state => state.Main.User.data.userData?.name)
    const tellerLimit = useSelector(state => state.Main.User.data?.userData?.tellerLimit)
    const sbt = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.ScannedByTeller)
    const sbs = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.ScannedBySupervisor)
    const accountType = useSelector(state => state.Main.QrCodeScanedDetail.accoutType)
    const abbrevation = useSelector(
        state => state?.Main?.User?.data?.company?.abbrevation,
    );
    console.log('limitExceed: ', limitExceed);
    console.log('accoutType: ', user);
    console.log('ScannedByTeller: ', sbt);
    console.log('ScannedBySupervisor: ', sbs);
    console.log('tellerLimit: ', tellerLimit);
    console.log('total: ---> ', total);
    // .toString().substr(0, 6)
    const CompanyName = useSelector(state => state.Main.QrCodeScanedDetail.company.companyName)
    const customerName = useSelector(state => state?.Main?.QrCodeScanedDetail?.customer?.name);

    // const data = route?.params

    console.log('Da>>', userName)
    // const customerName = data?.item?.customer_details[0]?.name

    const totalChanged = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.total)
    const XCD = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.Xcd)
    const xcdChanged = XCD
    const Checks = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.checks)
    const checksChanged = Checks

    const FX = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle.FX)
    const fxChanged = FX
    const [token, setToken] = useState('')
    const accountNumber = useSelector(state => state.Main.QrCodeScanedDetail?.customer?.accountNumber)
    const QRSingle = useSelector(state => state.Main.QrCodeScanedDetail?.qrsingle);
    const QrCodeScanedDetail = useSelector(state => state.Main.QrCodeScanedDetail);
    ;


    const { clientID, bagID, customerID } = useSelector(state => state.Main.QrCodeScanedDetail.qrsingle)

    useEffect(() => {
        GetToken()
    }, [])

    async function GetToken() {
        let usertoken = await AsyncStorage.getItem('token')
        setToken(usertoken)
    }
    function ChangeXcdValues({ index }) {
        const [selected, setSelected] = useState(false)
        function ChangeState() {
            setSelected(!selected)

            xcdChanged.map((itm, indx) => {
                if (index == indx) {
                    itm.status = !selected
                }
            })

        }

        return (

            <TouchableOpacity onPress={() => ChangeState()}>
                {selected ?
                    <Image style={styles.imageStyle} source={require('../../assets/checked.png')} />
                    :
                    <Image style={styles.imageStyle} source={require('../../assets/image8.png')} />
                }
            </TouchableOpacity>
        )
    }

    function ChangedFX({ index }) {
        const [selected, setSelected] = useState(false)
        function ChangeState() {
            setSelected(!selected)

            fxChanged.map((itm, indx) => {
                if (index == indx) {
                    itm.status = !selected
                }
            })

        }

        return (

            <TouchableOpacity onPress={() => ChangeState()}>
                {selected ?
                    <Image style={styles.imageStyle} source={require('../../assets/checked.png')} />
                    :
                    <Image style={styles.imageStyle} source={require('../../assets/image8.png')} />
                }
            </TouchableOpacity>
        )
    }

    function ChangedChecks({ index }) {
        const [selected, setSelected] = useState(false)
        function ChangeState() {
            setSelected(!selected)

            checksChanged.map((itm, indx) => {
                if (index == indx) {
                    itm.status = !selected
                }
            })
        }

        return (
            <TouchableOpacity onPress={() => ChangeState()}>
                {selected ?
                    <Image style={styles.imageStyle} source={require('../../assets/checked.png')} />
                    :
                    <Image style={styles.imageStyle} source={require('../../assets/image8.png')} />
                }
            </TouchableOpacity>
        )
    }

    function ChangedTotal() {
        const [selected, setSelected] = useState(false)
        function ChangeState() {
            setSelected(!selected)
            totalChanged.status = !selected
        }

        return (

            <TouchableOpacity onPress={() => ChangeState()}>
                {selected ?
                    <Image style={styles.imageStyle} source={require('../../assets/checked.png')} />
                    :
                    <Image style={styles.imageStyle} source={require('../../assets/image8.png')} />
                }
            </TouchableOpacity>
        )
    }


    async function SendVerificationRequest() {
        let ScannedByTeller = false;
        let ScannedBySupervisor = false;
        let ScannedBySecondSupervisor = false;
        let status = "pending";
        let endpoint;
        let body;

        if (sbs !== undefined || !sbt && !sbs) {
            if (user === 'teller') {
                console.log('------a------');
                endpoint = "TellerCheckRequest";
                if (!limitExceed) {
                    console.log('------a1------');
                    ScannedByTeller = true;
                    ScannedBySupervisor = true;
                    ScannedBySecondSupervisor = true;
                    status = "verified";
                } else {
                    console.log('------a2------');
                    ScannedByTeller = true;
                    ScannedBySupervisor = false;
                    ScannedBySecondSupervisor = false;
                    status = "pending";
                }
            } else {
                console.log('------b------');
                endpoint = "SupervisorCheckRequest";
                if (!limitExceed) {
                    console.log('------b1------');
                    ScannedByTeller = false;
                    ScannedBySupervisor = true;
                    ScannedBySecondSupervisor = true;
                    status = "verified";
                } else {
                    console.log('------b2------');
                    ScannedByTeller = false;
                    ScannedBySupervisor = true;
                    ScannedBySecondSupervisor = false;
                    status = "pending";
                }
            }

            console.log('ttttt', total, totalChanged, tellerLimit);
            if (accountType === 'teller') {
                if (Number(total) > Number(tellerLimit)) {
                    ScannedByTeller = true;
                    ScannedBySupervisor = false;
                    ScannedBySecondSupervisor = false;
                    status = "pending";
                }

                // discrepancy check for teller
                ScannedBySupervisor = found === 'Yes' ? false : ScannedBySupervisor;
                ScannedBySecondSupervisor = found === 'Yes' ? false : ScannedBySecondSupervisor;
                status = found === 'Yes' ? "pending" : status;
            } else {
                if (Number(total) > Number(tellerLimit)) {
                    ScannedByTeller = false;
                    ScannedBySupervisor = true;
                    ScannedBySecondSupervisor = false;
                    status = "pending";
                }

                // discrepancy check for supervisor
                ScannedBySecondSupervisor = found === 'Yes' ? false : ScannedBySecondSupervisor;
                status = found === 'Yes' ? "pending" : status;
            }
            body = {
                total: total,
                bagID: bagID,
                customerID: customerID,
                clientID: clientID,
                Xcd: xcdChanged,
                checks: checksChanged,
                total: totalChanged,
                FX: fxChanged,
                ScannedBySupervisor: ScannedBySupervisor,
                ScannedBySecondSupervisor: ScannedBySecondSupervisor,
                status: status,
            };

            if(accountType === 'teller'){
                body.ScannedByTeller = ScannedByTeller
            }
        } else if (sbt && !sbs) {
            console.log('------c------');
            endpoint = "SupervisorCheckRequest";
            if (!limitExceed) {
                ScannedByTeller = true;
                ScannedBySupervisor = true;
                ScannedBySecondSupervisor = true;
                status = "verified";
            } else {
                ScannedBySupervisor = true;
                ScannedByTeller = true;
                ScannedBySecondSupervisor = true;
                status = "verified";
            }
            body = {
                // total: total,
                bagID: bagID,
                // customerID: customerID,
                // clientID: clientID,
                // Xcd: xcdChanged,
                // checks: checksChanged,
                // total: totalChanged,
                // FX: fxChanged,
                // ScannedByTeller: ScannedByTeller,
                ScannedBySupervisor: ScannedBySupervisor,
                ScannedBySecondSupervisor: found === 'Yes' ? false : ScannedBySecondSupervisor,
                status: found === 'Yes' ? "pending" : status,
                SupervisorName: userName
            };
        }

        if (found === 'Yes') {
            body.discrepancies = true;
            body.discrepanciesType = checkType === "Debit" ? checkType : "Credit";
            body.discrepanciesAmount = amount;
            body.discrepanciesNote = note;
        }

        console.log("ScannedByTeller ---", ScannedByTeller);
        console.log("ScannedBySupervisor ---", ScannedBySupervisor);
        console.log("ScannedBySecondSupervisor ---", ScannedBySecondSupervisor);

        console.log('body ---', body);
        console.log('endpoint ----', endpoint);
        console.log('token ----', token);
        console.log('url ----', BasePath + endpoint);

        setLoading(true)
        await axios.post(BasePath + endpoint,
            body, {
            params: {
                x_auth: token
            }
        }
        ).then(res => {
            setLoading(false)
            const { data, code } = res.data
            console.log('tellerCheck request data ---', data)

            if (code == 200) {
                navigation.navigate('CompleteDeposit', {
                    data: data,
                    discrepancy: found === "Yes" ? found : "No",
                    discrepanciesType: checkType === "Debit" ? checkType : "Credit",
                    discrepanciesAmount: amount,
                    discrepanciesNote: note,
                    QRSingle: QRSingle,
                    accountType: accountType,
                    QrCodeScanedDetail: QrCodeScanedDetail,
                })
            } else {
                alert("Server Error in Processing request")
            }

        }).catch((e) => {
            setLoading(false)
            alert(e.response.data.message)
            console.log('error is is----->', e.response.data)
        })

    }

    const getCoins = (name, value) => {
        let n = 0;
        if (name === "X100") {
            n = 'x' + value / 100;
        } else if (name === 'X50') {
            n = 'x' + value / 50
        } else if (name === 'X20') {
            n = 'x' + value / 20
        } else if (name === 'X10') {
            n = 'x' + value / 10
        } else if (name === 'X5') {
            n = 'x' + value / 5
        } else if (name === 'Coins CA$1') {
            n = currencyArray[1] + ' ' + value
        } else if (name === 'Coins') {
            n = currencyArray[1] + ' ' + value
        } else {
            n = currencyArray[1] + ' ' + value
        }
        return n;
    }

    const XCD_Without_Zeroes = XCD.filter((e) => e.value !== 0);
    // console.log('XCD_With_Zeroes', XCD);
    // console.log('XCD_Without_Zeroes', XCD_Without_Zeroes);

    const totalAmountFooter = (title, amount) => {
        return (
            <View>
                <View style={{ backgroundColor: '#D3D3D3', height: 1, marginTop: 18, marginBottom: 10 }}></View>
                <Text style={styles.currencyLabel}>{title}</Text>
                <Text style={styles.currencyAmount}>{amount}</Text>
                <View style={{ backgroundColor: '#D3D3D3', height: 1, marginTop: 10, marginBottom: 18 }}></View>
            </View>
        )
    }

    const getTotalAmount = (data, key) => {
        let total = 0;
        for (const item of data) {
            total += item[key]
        }
        return currencyArray[1] + ' ' + total;
    };



    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* <View style={styles.topDistance} /> */}
            <StatusBar backgroundColor={'#EBF3EF'} barStyle={'dark-content'} />
            <View style={{ backgroundColor: '#EBF3EF', paddingHorizontal: responsiveScreenWidth(4), paddingBottom: 30, }}>
                <CustomHeader name={'Deposit Detail'} navigation={navigation} />
                <View style={styles.monthDeposit}>
                    <Text style={styles.monthDepositMoney}>
                        {currencyArray[1] + ' ' + total?.toFixed(2)}
                    </Text>
                    <View style={{ marginTop: 10, alignItems: 'center' }}>
                        <Text
                            style={[styles.monthDepositDescription, { fontWeight: 'bold' }]}>
                            {customerName}
                        </Text>
                        <Text style={styles.monthDepositDescription}>
                            Account Number: {accountNumber}
                        </Text>
                        <Text
                            style={[styles.monthDepositDescription, { fontWeight: 'bold' }]}>
                            {new Date(updatedAt).toDateString()}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1, }}>
                {(accountType === 'supervisor' && sbt || sbs) ?
                    <View style={styles.discrepancy}>
                        <View style={styles.discrepancyContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.subHeading}>{'ID: '}</Text>
                                <Text style={styles.normalTxt}>{
                                    abbrevation.concat(
                                        QRSingle?.bagID?.slice(
                                            QRSingle?.bagID?.length - 10 + abbrevation.length,
                                            QRSingle?.bagID?.length,
                                        ),
                                    )}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={styles.subHeading}>{'Discrepancies: '}</Text>
                                <Text style={styles.normalTxt}>{QRSingle?.discrepancies ? `${QRSingle?.discrepancies}` : "No"}</Text>
                            </View>
                        </View>
                        {QRSingle?.discrepancies &&
                            <>
                                <View style={styles.discrepancyContainer}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.subHeading}>{'Type: '}</Text>
                                        <Text style={styles.normalTxt}>{`${QRSingle?.discrepanciesType}`}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.subHeading}>{'Amount: '}</Text>
                                        <Text style={styles.normalTxt}>{`${QRSingle?.discrepanciesAmount}`}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.subHeading, { marginTop: responsiveHeight(0.8) }]}>{'Notes:'}</Text>
                                <Text style={[styles.normalTxt, { marginTop: responsiveHeight(0.8) }]}>
                                    {`${QRSingle?.discrepanciesNote}`}
                                </Text>
                            </>
                        }
                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(0.8) }}>
                            <Text style={styles.subHeading}>{'Status: '}</Text>
                            <Text style={styles.normalTxt}>{QRSingle?.status ? `${QRSingle?.status}` : 'pending'}</Text>
                        </View>
                    </View>
                    : null}
                <Text style={styles.breakDown}>Breakdown</Text>
                {XCD.length > 0 ?
                    <>
                        <Text style={styles.xcd}>{currencyArray[0]}</Text>
                        <View style={{ marginHorizontal: responsiveWidth(6) }}>
                            {XCD_Without_Zeroes.map((item, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                        <Text style={styles.column1}>{item.name}</Text>
                                        <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.column2}>{getCoins(item.name, item.value)}</Text>
                                            <View style={{ width: responsiveWidth(7) }} />
                                            <ChangeXcdValues status={item.status} index={index} />
                                        </View>
                                    </View>
                                )
                            })}
                            {totalAmountFooter('Total Local Currency', getTotalAmount(XCD_Without_Zeroes, 'value'))}
                        </View>
                    </>
                    :
                    <></>}
                {FX.length > 0 ?
                    <>
                        <Text style={styles.xcd}>FX</Text>
                        <View style={{ marginHorizontal: responsiveWidth(6) }}>
                            {FX.map((item, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                        <Text style={styles.column1}>{item.name}</Text>
                                        <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.column2}
                                            >{currencyArray[1] + ' ' + item?.EQV}</Text>
                                            <View style={{ width: responsiveWidth(7) }} />
                                            <ChangedFX status={item.status} index={index} />
                                        </View>
                                    </View>

                                )
                            })}
                            {totalAmountFooter('Total Foreign Exchange', getTotalAmount(FX, 'EQV'))}
                        </View>
                    </> :
                    <></>
                }
                {Checks.length > 0 ?
                    <>
                        <Text style={styles.xcd}>CHEQUES</Text>
                        <View style={{ marginHorizontal: responsiveWidth(6) }}>
                            {Checks.map((item, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                        <Text style={styles.column1}>{item.checkNumber.length >= 4 ? `${item.checkNumber.slice(0, 5)} ...` : item.checkNumber}</Text>
                                        <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.bankUc}>{item?.bank_UC}</Text>
                                            <Text style={{
                                                fontWeight: '700',
                                                fontSize: responsiveFontSize(2.1),
                                                color: '#000',
                                                textAlign: 'center'
                                            }}>{currencyArray[1] + ' ' + item.checkAmount}</Text>
                                            <View style={{ width: responsiveWidth(7) }} />
                                            <ChangedChecks status={item.status} index={index} />
                                        </View>
                                    </View>

                                )
                            })}
                            {totalAmountFooter('Total Cheques', getTotalAmount(Checks, 'checkAmount'))}
                        </View>
                    </> :
                    <></>
                }

                <Text style={styles.xcd}>Total</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: responsiveWidth(7) }}>
                    <Text style={styles.column1}>Amount</Text>
                    <Image style={styles.imageStyle} source={require('../../assets/rightarrow.png')} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.column2}>{currencyArray[1] + ' ' + total.toFixed(2)}</Text>
                        <View style={{ width: responsiveWidth(7) }} />
                        <ChangedTotal />
                    </View>
                </View>
                {(accountType === 'teller') || (accountType === 'supervisor' && !sbt) ?
                    <View style={styles.disprice}>
                        <Text style={styles.xcd1}>Discrepancies Found?*</Text>
                        <SelectList
                            setSelected={(val) => {
                                console.log('VAl', val)
                                setFound(val)
                            }}
                            data={yesNo}
                            save="value"
                            boxStyles={{ width: '50%', backgroundColor: '#f5f3f0' }}
                            defaultOption={yesNo[1]}
                            inputStyles={{ color: 'black' }}
                            dropdownStyles={{ width: '50%' }}
                            dropdownTextStyles={{ color: 'black' }}
                            search={false}
                        />
                        {found == 'Yes' ?
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.type}>{'Type'}</Text>
                                    <SelectList
                                        setSelected={(val) => setCheckType(val)}
                                        data={type}
                                        save="value"
                                        boxStyles={{ width: '100%', backgroundColor: '#f5f3f0' }}
                                        defaultOption={type[0]}
                                        inputStyles={{ color: 'black' }}
                                        dropdownStyles={{ width: '100%' }}
                                        dropdownTextStyles={{ color: 'black' }}
                                        search={false}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.type}>{'Amount'}</Text>
                                    <TextInput
                                        style={styles.amount}
                                        placeholder='Enter amount'
                                        placeholderTextColor={'gray'}
                                        keyboardType='number-pad'
                                        onChangeText={(val) => setAmount(val)}
                                        value={amount} />
                                </View>
                            </View>
                            : null}
                        {found == 'Yes' ?
                            <View>
                                <Text style={styles.type}>{'Notes'}</Text>

                                <TextInput
                                    style={styles.note}
                                    placeholder='Enter note'
                                    placeholderTextColor={'gray'}
                                    keyboardType='default'
                                    multiline={true}
                                    onChangeText={(val) => setNote(val)}
                                />
                            </View> : null}

                    </View> : null
                }

                {/*  navigation.navigate('TellerCompleteDeposit') */}
                <TouchableOpacity onPress={() => SendVerificationRequest()} style={styles.submitButton} disabled={isLoading ? true : false}>
                    {isLoading ?
                        <ActivityIndicator color={'#686868'} size={'small'} style={{ marginLeft: 10 }} />
                        :
                        <Text style={{ color: '#18193F', fontWeight: '700' }}>Verify</Text>
                    }
                </TouchableOpacity>

            </View>

        </ScrollView>
    );


}


const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    topDistance: {
        marginTop: responsiveHeight(4)

    },
    amount: {
        backgroundColor: '#f5f3f0',
        paddingHorizontal: 5,
        borderRadius: 12,
        color: 'black',
        fontSize: responsiveFontSize(2)
    },
    note: {
        backgroundColor: '#f5f3f0',
        paddingHorizontal: 10,
        borderRadius: 12,
        color: 'black',
        fontSize: responsiveFontSize(2),
        height: responsiveHeight(15),
        textAlignVertical: 'top'
    },
    monthDeposit: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    monthDepositMoney: {
        color: '#000',
        fontSize: 35,
        fontWeight: 'bold'
    },
    bankUc: {
        fontWeight: '700',
        fontSize: responsiveFontSize(2.1),
        color: '#000',
        width: responsiveWidth(20),
        textAlign: 'center'
    },
    monthDepositDescription: {
        color: '#000',
        fontSize: responsiveFontSize(1.9)
    },
    breakDown: {
        color: '#000',
        fontSize: responsiveFontSize(2.2),
        fontWeight: '700',
        marginHorizontal: responsiveWidth(6),
        marginTop: 20,
    },
    xcd: {
        marginVertical: responsiveHeight(3),
        fontSize: responsiveFontSize(2.6),
        color: '#686868', //14cdd4
        fontWeight: '700',
        marginLeft: responsiveScreenWidth(6),
    },
    xcd1: {
        marginVertical: responsiveHeight(3),
        fontSize: responsiveFontSize(2.6),
        color: '#686868', //14cdd4
        fontWeight: '700',
        marginLeft: responsiveScreenWidth(3),
    },
    type: {
        marginVertical: responsiveHeight(1),
        fontSize: responsiveFontSize(2),
        color: '#686868', //14cdd4
        fontWeight: '600',
        marginLeft: responsiveScreenWidth(3),
    },
    submitButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        height: 45,
        width: '80%',
        backgroundColor: '#36C4F1',
        marginBottom: responsiveScreenHeight(5)
    },
    imageStyle: {
        width: responsiveScreenWidth(8),
        height: responsiveScreenHeight(8),
        resizeMode: 'contain',
    },
    column1: {
        fontSize: responsiveFontSize(2.1),
        color: '#000',
        fontWeight: '700',
        width: responsiveWidth(20)
    },
    column2: {
        fontSize: responsiveFontSize(2.1),
        color: '#000',
        fontWeight: '700',
        width: responsiveWidth(30),
        textAlign: 'center'
    },
    column3: {
        fontSize: responsiveFontSize(2.1),
        color: '#000',
        fontWeight: '700',
        textAlign: 'center'
    },
    currencyLabel: {
        fontSize: responsiveFontSize(2.2),
        color: '#686868',
    },
    currencyAmount: {
        fontSize: responsiveFontSize(2.5),
        color: '#000',
        fontWeight: 'bold',
        marginTop: 5,
    },
    disprice: {
        borderTopWidth: 0.5,
        borderTopColor: 'gray',
        marginHorizontal: 10
    },
    discrepancy: {
        marginHorizontal: responsiveHeight(2),
    },
    subHeading: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2)
    },
    normalTxt: {
        color: 'black',
        fontSize: responsiveFontSize(2)
    },
    discrepancyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(0.8)
    },
})


