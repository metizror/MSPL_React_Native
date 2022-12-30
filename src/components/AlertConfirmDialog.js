import React from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";
import { useTranslation } from "react-i18next";
import { moderateScale } from "./scalling";

export function AlertConfirmDialog(props) {
  const { t } = useTranslation();

  const {
    showAlert,
    onDismiss,
    title = t("are_you_sure"),
    message,
    onConfirmPressed,
    onCancelPressed,
    confirmText = t("yes"),
    cancelText = t("no"),
    confirmButtonColor = colors.primary,
    cancelButtonColor = colors.dark_gray,
  } = props;

  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={true}
      showCancelButton={true}
      showConfirmButton={true}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmButtonColor={confirmButtonColor}
      cancelButtonColor={cancelButtonColor}
      onConfirmPressed={onConfirmPressed}
      onCancelPressed={onCancelPressed}
      onDismiss={onDismiss}
      confirmButtonStyle={{
        width: 100,
        height: 40,
        justifyContent: "center",
        borderRadius: 5,
      }}
      cancelButtonStyle={{
        width: 100,
        height: 40,
        justifyContent: "center",
        borderRadius: 5,
      }}
      confirmButtonTextStyle={{
        color: colors.white,
        textAlign: "center",
        fontWeight: "400",
        fontSize: moderateScale(22),
        fontFamily: Fonts.OpenSans,
      }}
      cancelButtonTextStyle={{
        color: colors.white,
        textAlign: "center",
        fontWeight: "400",
        fontSize: moderateScale(22),
        fontFamily: Fonts.OpenSans,
      }}
      titleStyle={{
        color: colors.black,
        fontFamily: Fonts.OpenSans,
        fontWeight: "700",
        textAlign: "center",
        fontSize: moderateScale(25),
      }}
      messageStyle={{
        color: colors.black,
        fontFamily: Fonts.OpenSans,
        textAlign: "center",
        fontWeight: "400",
        fontSize: moderateScale(19),
      }}
      contentContainerStyle={{
        width: "85%",
        paddingBottom: 30,
      }}
    />
  );
}
