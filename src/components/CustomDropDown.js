import React from "react";
import { Image, StyleSheet, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";
import Icons from "../theme/Icons";
import { moderateScale, verticalScale } from "../components/scalling";
const CustomDropDown = (props) => {
  const {
    style,
    data,
    onValueChange,
    value,
    inputIOS = {
      color: colors.black,
      fontSize: moderateScale(22),
      fontFamily: Fonts.Helvetica,
      paddingHorizontal: moderateScale(26),
    },
    Icon = Icons.ic_down_arrow,
    iconStyle,
  } = props;

  return (
    <View style={[styles.inputDropDownContainer, style]}>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={data}
        useNativeAndroidPickerStyle={false}
        value={value}
        inputIOS={inputIOS}
        style={{
          iconContainer: {
            top: Platform.OS == "android" ? verticalScale(20) : -4,
            marginRight: moderateScale(16),
          },
          inputAndroid: {
            color: colors.black,
            fontSize: moderateScale(22),
            fontFamily: Fonts.Helvetica,
            paddingHorizontal: moderateScale(15),
          },
          inputIOS: inputIOS,
        }}
        placeholder={{}}
        Icon={() => {
          return (
            <Image
              style={[
                iconStyle,
                {
                  resizeMode: "contain",
                  height: moderateScale(25),
                  width: moderateScale(25),
                },
              ]}
              source={Icon}
            />
          );
        }}
      />
    </View>
  );
};

export default CustomDropDown;
const styles = StyleSheet.create({
  inputDropDownContainer: {
    borderWidth: moderateScale(1),
    minHeight: verticalScale(100),
    justifyContent: "center",
    paddingHorizontal: Platform.OS == "android" ? 10 : 5,
    marginTop: moderateScale(26),
    borderColor: colors.black,
    borderRadius: moderateScale(16),
    height: verticalScale(100),
  },
});
