import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";

export function ProductItem(props, item) {
  const { onPress, style } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginHorizontal: 8,
        marginVertical: 8,
        backgroundColor: "red",
        flex: 1,
        shadowColor: Platform.OS == "ios" ? "#00000029" : "rgba(0, 0, 0, 0.6)",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        elevation: Platform.OS === "ios" ? 0.1 : 7,
        shadowOpacity: 1.0,
        borderRadius: 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#EBEBEB",
          borderRadius: 0,
          padding: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            paddingLeft: 10,
            justifyContent: "center",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: colors.black,
              fontSize: 18,
              fontFamily: Fonts.Helvetica,
              lineHeight: 24,
            }}
          >
            {"2020 Kubota"}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              color: "#707070",
              fontSize: 18,
              fontFamily: Fonts.Helvetica,
              lineHeight: 19,
            }}
          >
            {"SKU1234568"}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              color: "#707070",
              fontSize: 14,
              fontFamily: Fonts.Helvetica,
              lineHeight: 19,
            }}
          >
            {"SKU1234568"}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              color: "#0D6BBC",
              fontSize: 18,
              fontFamily: Fonts.Helvetica,
              lineHeight: 24,
            }}
          >
            {"$29,599.00"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
