import React from "react";
import { View } from "react-native";
import { ColorPicker } from "react-native-color-picker";
import CustomTextInput from "./CustomTextInput";

const ColorComponent = (props) => {
  const {
    placeholder,
    textValue,
    onColorChange,
    onChangeText,
    onColorSelected,
  } = props;

  return (
    <View>
      <ColorPicker
        color={textValue}
        hideSliders={true}
        onColorChange={onColorChange}
        onColorSelected={onColorSelected}
        style={{ flex: 1, height: 200, marginTop: 15 }}
      />

      <CustomTextInput
        value={textValue}
        changeText={(value) => {
          onChangeText(value);
        }}
        placeholder={placeholder}
        returnKeyType={"next"}
        onSubmitEditing={() => {}}
        blurOnSubmit={false}
      ></CustomTextInput>
    </View>
  );
};

export default ColorComponent;
