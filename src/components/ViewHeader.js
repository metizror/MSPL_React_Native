import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";
import Icons from "../theme/Icons";

const { height, width } = Dimensions.get("window");
export function ViewHeader(props) {
  const {
    onBack = true,
    isShowBackButton = true,
    cartStyle,
    mainStyle,
    onClickFavorite,
    favorite,
  } = props;

  return (
    <View style={[styles.container, mainStyle]}>
      {isShowBackButton && (
        <Pressable onPress={onBack} style={styles.backContainer}>
          <Image
            style={{ height: 20, width: 20, tintColor: "white" }}
            source={Icons.ic_back_primary}
          />
        </Pressable>
      )}

      <Pressable
        onPress={onClickFavorite}
        style={[styles.backContainer, { paddingRight: 15 }]}
      >
        <Image
          style={[
            cartStyle,
            {
              resizeMode: "contain",
              height: 40,
              width: 40,
            },
          ]}
          source={
            favorite === 1 ? Icons.ic_wish_list_fill : Icons.ic_wish_list_unfill
          }
        ></Image>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: height * 0.15,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  backContainer: {
    justifyContent: "center",
    width: height * 0.035,
    zIndex: 1,
  },
  backIcon: {
    resizeMode: "contain",
    height: 24,
    width: 24,
  },
  title: {
    color: colors.headertint,
    fontSize: 18,
    position: "absolute",
    alignSelf: "center",
    textAlign: "center",
    width: width,
    fontFamily: Fonts.Helvetica,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icon: {
    width: 24,
    marginHorizontal: 12,
  },
});
