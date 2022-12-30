import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import colors from "../theme/colors";
import Icons from "../theme/Icons";
import CustomText from "./CustomText";
import { moderateScale } from "./scalling";

const { height, width } = Dimensions.get("window");
export function HeaderNew(props) {
  const {
    title = "",
    onBack = true,
    isShowBackButton = true,
    showDrawer = false,
    isShowCart = false,
    cartStyle,
    onCartClick,
    backgroundcolor = "",
    backIconColor = false,
    mainStyle,
    openDrawer,
  } = props;

  return (
    <View
      style={[
        styles.container,
        mainStyle,
        {
          backgroundColor:
            backgroundcolor !== "" ? colors.primary : colors.white,
          //  marginTop: 5,
        },
      ]}
    >
      {isShowBackButton && (
        <Pressable onPress={onBack} style={styles.backContainer}>
          <Image
            style={{
              height: 22,
              width: 22,
              tintColor: backIconColor ? colors.grey : colors.primary,
            }}
            source={Icons.ic_back_primary}
          />
        </Pressable>
      )}
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        {title !== "" ? (
          <CustomText
            style={{
              marginTop: 0,
              color: backgroundcolor != "" ? colors.white : colors.primary,
              fontWeight: "700",
              fontSize: moderateScale(30),
            }}
          >
            {title}
          </CustomText>
        ) : (
          <Image
            source={Icons.ic_app_logo}
            resizeMode={"contain"}
            style={{
              height: height * 0.05,
              // width: 180,
            }}
          ></Image>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          right: 30,
        }}
      >
        {isShowCart && (
          <Pressable onPress={onCartClick} style={{ paddingRight: 15 }}>
            <Image
              style={[
                cartStyle,
                {
                  resizeMode: "contain",
                  height: 22,
                  width: 22,
                },
              ]}
              source={Icons.ic_notification}
            />
          </Pressable>
        )}

        {showDrawer && (
          <Pressable onPress={openDrawer}>
            <Image
              style={[
                cartStyle,
                {
                  resizeMode: "contain",
                  height: 22,
                  width: 22,
                },
              ]}
              source={Icons.ic_menu}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: height * 0.07,
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: Platform.OS == "ios" ? "#00000029" : "rgba(0, 0, 0, 0.6)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: Platform.OS === "ios" ? 0.1 : 1,
    shadowOpacity: 1.0,
  },
  backContainer: {
    position: "absolute",
    left: 30,
  },

  menuView: {
    position: "absolute",
    left: 25,
  },
});
