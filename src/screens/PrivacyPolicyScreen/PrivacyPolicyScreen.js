import { DrawerActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import WebView from "react-native-webview";
import { AlertView } from "../../components/AlertView";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { getPrivacyPolicyApiCall } from "../../redux/services/ApiService";
import colors from "../../theme/colors";

const PrivacyPolicyScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [isLoading, setLoading] = useState(false);
  const [htmlString, setHtmlString] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const { t } = useTranslation();

  const getPrivacyPolicy = () => {
    setLoading(true);

    getPrivacyPolicyApiCall()
      .then((res) => {
        setLoading(false);

        console.log("PrivacyPolicy====>", res);
        if (res.success) {
          setHtmlString(res.data.description);
          console.log("htmlString", htmlString);
        } else {
          showAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("userGetDealerships Error", error);
        showAlertMessage(error.message);
        setShowAlert(true);
      });
  };
  return (
    <View style={styles.container}>
      <Header
        title={t("privacy_policy")}
        onBack={() => navigation.goBack()}
        openDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
      ></Header>
      <Loader loading={isLoading} />

      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => setShowAlert(false)}
      ></AlertView>
      <View style={{ flex: 1, margin: 22 }}>
        <WebView
          source={{
            uri: "",
          }}
        />
      </View>
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
