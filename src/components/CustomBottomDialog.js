import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import colors from "../theme/colors";
import Icons from "../theme/Icons";
import CustomText from "./CustomText";
import { horizontalScale, moderateScale, verticalScale } from "./scalling";
import { useTranslation } from "react-i18next";

const CustomBottomDialog = React.forwardRef((props, ref) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;
  const { t } = useTranslation();

  const {
    title,
    value,
    data,
    onPressOk,
    onPressClose,
    onSelectValue,
    onSelectTitle,
  } = props;

  return (
    <RBSheet
      ref={ref}
      height={deviceHeight}
      openDuration={250}
      customStyles={{
        container: {
          justifyContent: "flex-start",
          alignItems: "flex-start",
          backgroundColor: "white",
          height: verticalScale(600),
        },
      }}
    >
      <CustomText
        style={{
          paddingLeft: 16,
          marginTop: 16,
          fontSize: moderateScale(18),
          fontWeight: "700",
          color: "#f47920",
        }}
      >
        {title}
      </CustomText>
      <View
        style={{
          width: deviceWidth,
          height: 1,
          marginTop: 16,
          backgroundColor: "#eaeaea",
        }}
      ></View>
      <View style={{ flex: 1, paddingLeft: 16, paddingRight: 16 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelectValue(item.id);
                onSelectTitle(item.title);
              }}
            >
              <View style={{ flex: 1, paddingTop: 2, paddingBottom: 2 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    backgroundColor: "white",
                    paddingTop: 16,
                  }}
                >
                  <CustomText
                    style={{
                      fontSize: moderateScale(18),
                      marginTop: 0,
                      fontWeight: "700",
                    }}
                  >
                    {item.title}
                  </CustomText>
                  <Image
                    style={{
                      height: verticalScale(40),
                      width: horizontalScale(40),
                    }}
                    source={
                      value === item.id
                        ? Icons.ic_radio_checked
                        : Icons.ic_radio_unchecked
                    }
                    resizeMode={"contain"}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          numColumns={1}
          keyExtractor={(item, index) => item.id + "-" + index}
        />
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: 25,
            marginBottom: 25,
            flex: 1,
            flexDirection: "row",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              width: horizontalScale(240),
              height: verticalScale(80),
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              borderWidth: 0.6,
              borderColor: colors.primary,
              backgroundColor: colors.white,
            }}
            onPress={onPressClose}
          >
            <Text
              style={{
                color: "#F47920",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: moderateScale(22),
              }}
            >
              {t("close")}
            </Text>
          </TouchableOpacity>
          <View style={{ width: 10 }}></View>
          <TouchableOpacity
            style={{
              width: horizontalScale(240),
              height: verticalScale(80),
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              backgroundColor: colors.primary,
            }}
            onPress={onPressOk}
          >
            <Text
              style={{
                color: colors.white,
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: moderateScale(22),
              }}
            >
              {t("ok")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
});
export default CustomBottomDialog;
