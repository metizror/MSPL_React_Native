import React from "react";
import { Dimensions, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import colors from "../theme/colors";
import Icons from "../theme/Icons";
import CustomText from "./CustomText";
import { PrimaryButton } from "./PrimaryButton";
import { moderateScale, verticalScale } from "./scalling";
import { useTranslation } from "react-i18next";

const SelectImageDialog = React.forwardRef((props, ref) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;
  const { t } = useTranslation();

  const { onPressTakePhoto, onPressChooseFromLibrary, onPressCancel } = props;

  return (
    <RBSheet
      ref={ref}
      height={deviceHeight}
      openDuration={250}
      customStyles={{
        container: {
          justifyContent: "flex-start",
          alignItems: "center",
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
          textAlign: "center", // <-- the magic
        }}
      >
        {t("select_photo")}
      </CustomText>
      <View
        style={{
          width: deviceWidth,
          height: 1,
          marginTop: 16,
          backgroundColor: "#eaeaea",
        }}
      ></View>

      <View style={{ width: "100%", paddingHorizontal: 30 }}>
        <PrimaryButton
          textStyle={{ color: colors.black }}
          iSource={Icons.ic_camera}
          buttonStyle={{
            backgroundColor: colors.white,
            borderColor: colors.primary,
            borderWidth: 1,
            paddingHorizontal: 30,
          }}
          onPress={onPressTakePhoto}
          title={t("take_photo")}
        ></PrimaryButton>

        <PrimaryButton
          iSource={Icons.ic_gallary}
          textStyle={{ color: colors.black }}
          buttonStyle={{
            backgroundColor: colors.white,
            borderColor: colors.primary,
            borderWidth: 1,
          }}
          onPress={onPressChooseFromLibrary}
          title={t("choose_from_library")}
        ></PrimaryButton>
        <PrimaryButton
          onPress={onPressCancel}
          title={t("cancel")}
        ></PrimaryButton>
      </View>
    </RBSheet>
  );
});
export default SelectImageDialog;
