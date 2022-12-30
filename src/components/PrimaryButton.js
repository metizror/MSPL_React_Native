import React from "react";
import { Image, Pressable, Text } from "react-native";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";

import {
  moderateScale,
  verticalScale,
  horizontalScale,
} from "../components/scalling";

export function PrimaryButton(props) {
  const {
    buttonStyle,
    textStyle,
    buttonWidth = "100%",
    buttonHeight = verticalScale(100),
    buttonBackgroundColor = colors.primary,
    buttonJustifyContent = "center",
    buttonBorderRadius = moderateScale(16),
    buttonMarginTop = moderateScale(26),
    title,
    iSource,
    showIcon = iSource,
    onPress,
  } = props;

  return (
    <Pressable
      style={[
        {
          width: buttonWidth,
          height: buttonHeight,
          backgroundColor: buttonBackgroundColor,
          borderRadius: buttonBorderRadius,
          justifyContent: buttonJustifyContent,
          marginTop: buttonMarginTop,
          flexDirection: "row",
          alignItems: "center",
        },
        buttonStyle,
      ]}
      onPress={onPress}
    >
      {showIcon && (
        <Image
          style={{
            height: verticalScale(45),
            width: horizontalScale(45),
            resizeMode: "contain",
            marginHorizontal: moderateScale(14),
          }}
          source={iSource}
        />
      )}

      <Text
        style={[
          {
            color: colors.white,
            fontSize: moderateScale(22),
            textAlign: "center",
            fontWeight: "700",
            fontFamily: Fonts.Helvetica,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
