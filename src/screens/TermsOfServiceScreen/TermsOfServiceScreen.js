import { DrawerActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  LogBox,
  StyleSheet,
  useWindowDimensions,
  View,
  ScrollView,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { getTernAndConditionsApiCall } from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import { AlertView } from "../../components/AlertView";
import WebView from "react-native-webview";
import { useTranslation } from "react-i18next";
import { moderateScale } from "../../components/scalling";

LogBox.ignoreAllLogs();
const TermsOfServiceScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [isLoading, setLoading] = useState(false);
  const [htmlString, setHtmlString] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  var htmlData = "";
  const { t } = useTranslation();

  useEffect(() => {
    //  getTernAndConditions();
  }, []);
  const getTernAndConditions = () => {
    setLoading(true);

    getTernAndConditionsApiCall()
      .then((res) => {
        setLoading(false);

        console.log("TermAndConditions====>", res);
        if (res.success) {
          setHtmlString(res.data.description);
          htmlData = res.data.description;
          console.log("htmlString", htmlData);
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
        title={t("terms_of_service")}
        isShowCart={false}
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
        {/* <RenderHtml contentWidth={width} source={{ html: htmlData }} /> */}
        <WebView
          source={{
            uri: "",
          }}
        />
      </View>
    </View>
  );
};

export default TermsOfServiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  imageStyle: {
    height: 120,
    width: "100%",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    margin: 10,
    borderRadius: 15,
    height: 55,
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 5,
    fontSize: moderateScale(22),
    backgroundColor: "#F9F9F9",
    color: colors.black,
    borderRadius: 15,
  },
});
