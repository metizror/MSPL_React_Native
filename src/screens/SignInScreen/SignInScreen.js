import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { moderateScale } from "../../components/scalling";
import {
  forgotPasswordApi,
  loginApiCall,
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Fonts from "../../theme/Fonts";
import { saveLoginData, validateEmail } from "../../Utils/Helper";
const SignInScreen = ({ navigation }) => {
  const refPassword = useRef();

  const [email, setEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalForgotPasswordVisible, setModalForgotPasswordVisible] =
    useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const [loading, setLoad] = useState(false);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { loginResponse, isLoading, state } = useSelector((state) => ({
    loginResponse: state.loginReducer.loginResponse,
    isLoading: state.loginReducer.loginResponse.isLoading,
  }));
  const checkValidation = async () => {
    var FCMToken = await AsyncStorage.getItem("FCMToken");

    if (email == "") {
      showAlertMessage(t("please_enter_email_id"));
      setShowAlert(true);
    } else if (!validateEmail(email)) {
      showAlertMessage(t("please_enter_valid_email_id"));
      setShowAlert(true);
    } else if (password == "") {
      showAlertMessage(t("please_enter_password"));
      setShowAlert(true);
    } else if (password.length < 6) {
      showAlertMessage(t("please_enter_valid_password"));
      setShowAlert(true);
    } else {
      const param = new FormData();
      param.append("email", email);
      param.append("password", password);
      param.append("device_token", FCMToken);
      console.log("params", JSON.stringify(param));
      dispatch(loginApiCall(param));
    }
  };

  
  async function getUserData(data) {
    if (data.userDetails.success) {
      console.log("data.userDetails ", data.userDetails);
      await saveLoginData(
        data.userDetails.data,
        data.userDetails.data.role,
        "login"
      );
      loginResponse.userDetails = null;
      setEmail("");
      setPassword("");
      navigation.replace("DrawerNavigator");
    } else {
      showAlertMessage(data.userDetails.data.error);
      setShowAlert(true);
      loginResponse.userDetails = null;
    }
  }

  useEffect(() => {
    if (loginResponse.userDetails !== null) {
      if (loginResponse.userDetails) {
        getUserData(loginResponse);
        console.log("Login Data===>", JSON.stringify(loginResponse));
      } else {
        showAlertMessage(loginResponse.userDetails.message);
        setShowAlert(true);
      }
    }
  }, [loginResponse]);

  const checkForgotEmailValidation = () => {
    if (forgotEmail == "") {
      showAlertMessage(t("please_enter_email_id"));
      setShowAlert(true);
    } else if (!validateEmail(forgotEmail)) {
      showAlertMessage(t("please_enter_valid_email_id"));
      setShowAlert(true);
    } else {
      const param = new FormData();
      param.append("email", forgotEmail);
      forgotPasswordApi(param)
        .then((res) => {
          setLoad(false);
          console.log("Forgot====>", JSON.stringify(res));
          if (res.success) {
            setModalForgotPasswordVisible(false);
            showAlertMessage(res.message);
            setShowAlert(true);
            setLoad(false);
            setForgotEmail("");
          } else {
            showAlertMessage(res.message);
            setShowAlert(true);
            setLoad(false);
          }
        })
        .catch((error) => {
          setLoad(false);
          showAlertMessage(error.message);
          setShowAlert(true);
          setModalForgotPasswordVisible(false);
        });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        isShowBackButton={true}
        onBack={() => navigation.goBack()}
        isShowCart={false}
      ></Header>
      <Loader loading={isLoading} />
      <Loader loading={loading} />
      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => setShowAlert(false)}
      ></AlertView>
      <View style={styles.main}>
        <Text style={styles.screenTitle}>{t("signin_to")}</Text>
        <View style={{ marginTop: moderateScale(100) }}>
          <CustomTextInput
            value={email}
            changeText={(value) => setEmail(value)}
            placeholder={t("email")}
            keyType={"email-address"}
            autoCapitalize={"none"}
            returnKeyType={"next"}
            onSubmitEditing={() => {
              refPassword.current.focus();
            }}
            blurOnSubmit={false}
          ></CustomTextInput>
          <CustomTextInput
            ref={refPassword}
            value={password}
            changeText={(value) => setPassword(value)}
            placeholder={t("password")}
            ispasswordtextbox={true}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
          ></CustomTextInput>
        </View>

        <PrimaryButton
          onPress={() => {
            checkValidation();
          }}
          title={t("sign_in")}
        ></PrimaryButton>
        <Pressable onPress={() => setModalForgotPasswordVisible(true)}>
          <CustomText
            style={{
              color: colors.primary,
              fontSize: 16,
              textDecorationLine: "underline",
              textAlign: "center",
            }}
          >
            {t("forgot_your_password")}
          </CustomText>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalForgotPasswordVisible}
        onRequestClose={() => {
          setModalForgotPasswordVisible(!modalForgotPasswordVisible);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          {Platform.OS == "ios" && (
            <AlertView
              showAlert={showAlert}
              message={alertMessage}
              onConfirmPressed={() => {
                setShowAlert(false);
              }}
              onDismiss={() => setShowAlert(false)}
            ></AlertView>
          )}
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CustomText style={styles.modalTextHeader}>
                {t("forgot_your_password")}
              </CustomText>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.grey,
                }}
              ></View>
              <View style={{ paddingHorizontal: 25 }}>
                <CustomText cStyles={{ marginTop: 10 }}>
                  {t("email")}
                </CustomText>
                <CustomTextInput
                  placeholder={t("email")}
                  autoCapitalize={"none"}
                  value={forgotEmail}
                  changeText={(value) => setForgotEmail(value)}
                ></CustomTextInput>
              </View>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.grey,
                  marginTop: 15,
                }}
              ></View>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  onPress={() => {
                    checkForgotEmailValidation();
                  }}
                  buttonStyle={{ marginTop: 15 }}
                  title={t("send_password_change_request")}
                ></PrimaryButton>

                <PrimaryButton
                  buttonStyle={{ backgroundColor: "#F42020" }}
                  onPress={() =>
                    setModalForgotPasswordVisible(!modalForgotPasswordVisible)
                  }
                  title={t("cancel")}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default SignInScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },

  main: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: moderateScale(70),
  },

  screenTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 24,
    marginTop: 30,
    fontFamily: Fonts.Helvetica,
    color: colors.primary,
  },

  signinLink: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  viewForgot: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
  },

  textForgot: {
    marginTop: 0,
    fontSize: 14,
    paddingVertical: 30,
  },

  textResetLink: {
    color: colors.primary,
    marginTop: 0,
    fontSize: 14,
    marginLeft: 4,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 5,
    position: "absolute",
    elevation: 5,
    width: "80%",
    paddingVertical: 25,
  },

  modalTextHeader: {
    textAlign: "center",
    color: colors.black,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Fonts.Helvetica,
    lineHeight: 24,
    paddingHorizontal: 25,
    marginTop: 0,
    marginBottom: 25,
  },
});
