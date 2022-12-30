import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";
import FontSize from "../theme/FontSize";
import Icons from "../theme/Icons";
import { moderateScale, verticalScale } from "./scalling";

export function UploadPhoto(props) {
  const { onPress, style, title } = props;

  return (
    <Pressable style={style} onPress={onPress}>
      <View
        style={{
          borderColor: colors.black,
          height: verticalScale(300),
          width: "100%",
          borderWidth: 1,
          overflow: "hidden",
          borderStyle: "dashed",
          justifyContent: "center",
          borderRadius: moderateScale(16),
        }}
      >
        <View style={{ paddingHorizontal: 50 }}>
          <Image
            style={{
              resizeMode: "contain",
              alignSelf: "center",
              width: moderateScale(100),
              height: moderateScale(100),
            }}
            source={Icons.ic_camera}
          />

          <Text
            style={{
              fontFamily: Fonts.Helvetica,
              fontSize: FontSize.FONT_MEDIUM,
              fontWeight: "400",
              color: "rgba(203, 203, 203, 1)",
              textAlign: "center",
              lineHeight: 24,
              marginTop: 10,
              textDecorationLine: "underline",
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
