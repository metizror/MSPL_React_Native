import React from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";
import { useTranslation } from "react-i18next";

export function AlertView(props) {
  const { showAlert, onDismiss, title = "", message, onConfirmPressed } = props;
  const { t } = useTranslation();

  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={true}
      showCancelButton={false}
      showConfirmButton={true}
      confirmText={t("ok")}
      confirmButtonColor={colors.primary}
      onConfirmPressed={onConfirmPressed}
      onDismiss={onDismiss}
      confirmButtonStyle={{
        width: 160,
        height: 40,
        justifyContent: "center",
        borderRadius: 5,
      }}
      confirmButtonTextStyle={{
        color: colors.white,
        textAlign: "center",
        fontWeight: "400",
        fontSize: 14,
        fontFamily: Fonts.Helvetica,
      }}
      titleStyle={{
        color: colors.red,
        fontFamily: Fonts.Helvetica,
        fontWeight: "700",
        textAlign: "center",
        fontSize: 19,
      }}
      messageStyle={{
        color: colors.black,
        fontFamily: Fonts.Helvetica,
        textAlign: "center",
        fontWeight: "400",
        fontSize: 13,
      }}
      contentContainerStyle={{
        width: "75%",
        justifyContent: "center",
      }}
    />
  );
}
