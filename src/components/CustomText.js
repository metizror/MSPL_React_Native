import React from "react";
import { Text } from "react-native";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";
import { moderateScale } from "./scalling";
const CustomText = (props) => {
  const {
    style,
    mTop = 20,
    borderWidth = 0,
    size = moderateScale(18),
    textAlignment = "left",
    color = colors.black,
    paddingleft = 0,
    margin = 0,
    fontFamily = Fonts.Helvetica,
    fontWeight = "400",
    numberOfLines,
    ellipsizeMode,
  } = props;

  const defaultStyles = {
    marginTop: mTop,
    margin: margin,
    borderWidth: borderWidth,
    fontSize: size,
    fontFamily: fontFamily,
    textAlign: textAlignment,
    color: color,
    paddingLeft: paddingleft,
    fontWeight: fontWeight,
  };

  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[defaultStyles, style]}
    >
      {props.children}
    </Text>
  );

  // return (
  //   <TouchableWithoutFeedback style={[TOStyle]} onPress={onPress}>
  //     <Text style={[defaultStyles, style]}>{props.children}</Text>
  //   </TouchableWithoutFeedback>
  // );
};

export default CustomText;
