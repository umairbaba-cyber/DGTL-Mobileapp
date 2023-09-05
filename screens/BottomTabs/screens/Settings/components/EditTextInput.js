import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Image, Keyboard } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const EditTextInput = ({ editabel, keybordType, value, handleInput, empty,nonEdit }) => {
  const [edit, setEdit] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleEditPress = () => {
    setEdit(!edit);
    setShowKeyboard(!showKeyboard);
  };

  const handleBlur = () => {
    setShowKeyboard(false);
  };

  return (
    <View style={styles.inputStyle}>
      {edit ? (
        <TextInput
          keyboardType={keybordType}
          onChangeText={(e) => handleInput(e)}
          placeholder={value}
          placeholderTextColor={'#000'}
          editable={editabel}
          onBlur={handleBlur}
          autoFocus={showKeyboard} // Only autoFocus when showKeyboard is true
          style={{ flex: 1, color: '#000', width: '80%' }}
        />
      ) : (
        <Text style={{ width: '90%', color: '#000' }}>
          {value == null || value == '' ? empty : value}
        </Text>
      )}
      {nonEdit?null:
      <TouchableOpacity onPress={handleEditPress}>
        <Image 
        source={require('../../../../../assets/editinputicon.png')} 
        style={{ resizeMode: 'contain', width: 25, height: 25 }} />
      </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    width: '80%',
    height: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: responsiveHeight(5)
  },
});

export default EditTextInput;
