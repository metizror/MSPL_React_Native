import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import Icons from "../theme/Icons";

const deviceWidth = Dimensions.get("window").width;
const imgSize = (deviceWidth / 10) * 1;
const checkedImgSize = (imgSize / 10) * 6;
const imgSizeClose = (deviceWidth / 10) * 0.4;
const popupWidth = (deviceWidth / 10) * 8;
const CustomCheckbox = (props) => {
  const { isChecked, onPress, color } = props;

  return (
    <Pressable
      style={styles.centeredView}
      onPress={() => {
        onPress(!isChecked);
      }}
    >
      <View style={{ height: imgSize, width: imgSize }}>
        <Image
          style={styles.unCheckStyle}
          source={Icons.ic_checkbox_uncheked}
        />
        {isChecked ? (
          <Image
            style={[styles.checkStyle, { tintColor: color }]}
            source={Icons.ic_checkbox_checked}
          />
        ) : (
          <View />
        )}
      </View>
    </Pressable>
  );
};
export default CustomCheckbox;
const styles = StyleSheet.create({
  unCheckStyle: {
    position: "absolute",
    height: imgSize,
    width: imgSize,
    top: 0,
    left: 0,
  },
  checkStyle: {
    position: "absolute",
    height: checkedImgSize,
    width: checkedImgSize,
    top: checkedImgSize / 2 - checkedImgSize / 6,
    left: checkedImgSize / 2 - checkedImgSize / 6,
  },

  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
});
