import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { moderateScale, verticalScale } from "../components/scalling";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";
import { useTranslation } from "react-i18next";

const CustomTextInput = React.forwardRef((props, ref) => {
  const { t } = useTranslation();

  const {
    cStyles,
    height = verticalScale(100),
    width = "100%",
    pLeft = moderateScale(26),
    ispasswordtextbox = false,
    mTop = moderateScale(26),
    borderRadius = moderateScale(16),
    borderColor = colors.black,
    borderWidth = moderateScale(1),
    size = moderateScale(22),
    color = colors.black,
    maxlength = 100,
    fontFamily = Fonts.Helvetica,
    multiline = false,
    isClickEvent = false,
    onPress,
    title = t("change"),
    isBorder = true,
    value,
    keyType = "default",
    changeText,
    keyPress,
    placeholder,
    returnKeyType,
    onSubmitEditing,
    blurOnSubmit,
    editable = true,
    onFocous,
    placeholderTextColor = "rgba(203, 203, 203, 1)",
    autoCapitalize = "sentences",
    selectionColor = colors.black,
  } = props;
  const defaultStyles = {
    height: height,
    width: width,
    paddingLeft: pLeft,
    marginTop: mTop,
    borderRadius: borderRadius,
    borderColor: borderColor,
    borderWidth: isBorder ? borderWidth : 0,
    fontSize: size,
    fontFamily: fontFamily,
    fontWeight: "400",
    color: color,
  };

  const defaultClickViewStyle = {
    height: height,
    width: width,
    paddingLeft: pLeft,
    marginTop: mTop,
    borderRadius: borderRadius,
    borderColor: borderColor,
    borderWidth: borderWidth,
    fontSize: size,
    fontFamily: fontFamily,
    fontWeight: "400",
    color: color,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.white,
  };

  return (
    <View>
      {isClickEvent ? (
        <View style={[defaultClickViewStyle, cStyles]}>
          <TextInput
            selectionColor={selectionColor}
            style={[
              {
                textAlignVertical: "center",
                flex: 1,
                fontSize: moderateScale(22),
              },
            ]}
            multiline={multiline}
            maxLength={maxlength}
            secureTextEntry={ispasswordtextbox}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={value}
            editable={editable}
            keyboardType={keyType}
            onChangeText={changeText}
            onKeyPress={keyPress}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit}
            autoCapitalize={autoCapitalize}
            ref={ref}
          >
            {props.children}
          </TextInput>

          <TouchableOpacity
            style={{
              alignItems: "center",
              paddingHorizontal: moderateScale(22),
            }}
            onPress={onPress}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: moderateScale(20),
                fontFamily: Fonts.Helvetica,
                fontWeight: "700",
              }}
            >
              {title}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          selectionColor={selectionColor}
          style={[defaultStyles, cStyles]}
          multiline={multiline}
          maxLength={maxlength}
          secureTextEntry={ispasswordtextbox}
          placeholder={placeholder}
          value={value}
          editable={editable}
          placeholderTextColor={placeholderTextColor}
          keyboardType={keyType}
          onChangeText={changeText}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          onFocus={onFocous}
          autoCapitalize={autoCapitalize}
          ref={ref}
        >
          {props.children}
        </TextInput>
      )}
    </View>
  );
});

export default CustomTextInput;
