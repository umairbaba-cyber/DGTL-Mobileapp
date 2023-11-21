import React, { useState } from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';

const OtherLoginModal = ({ modalVisible, setModalVisible, onSelectOption }) => {
    const handleOptionSelection = (option) => {
        onSelectOption(option);
        setModalVisible(false);
    };

    return (
        <View style={{ position: "absolute" }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "#CBCBCB" + "bb",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            height: 200,
                            width: "90%",
                            position: "absolute",
                            top: 500,
                            backgroundColor: "#fff",
                            borderRadius: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => handleOptionSelection(1)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 10,
                            }}
                        >
                            <Image
                                source={require("../../../../../assets/fingerprint.png")}
                                style={{ height: 40, width: 40 }}
                            />
                            <Text style={{ fontSize: 22, color: "#000", marginLeft: "5%" }}>
                                {"Enable Biometric Login"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleOptionSelection(2)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 10,
                            }}
                        >
                            <Image
                                source={require("../../../../../assets/face.png")}
                                style={{ height: 40, width: 40 }}
                            />
                            <Text style={{ fontSize: 22, color: "#000", marginLeft: "5%" }}>
                                {"Enable Face ID Login"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleOptionSelection(3)}
                            style={styles.loginButton}
                        >
                            <Text style={styles.loginButtonText}>{"No Need"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default OtherLoginModal;