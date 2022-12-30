import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, View } from "react-native";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import Localization from "../../Localization/Localization";
import { USER_LOGGED_OUT } from "../../redux/action/actionType";
import { deleteAccountApiCall } from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { userDataKey } from "../../Utils/Constant";
import { clearLoginData } from "../../Utils/Helper";
import { useDispatch } from "react-redux";
import ModelConfirmationDialog from "../../components/ModelConfirmationDialog";
import { useTranslation } from "react-i18next";

const DeactivateAccount = ({ navigation }) => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const dispatch = useDispatch();

  const deleteAccount = async () => {
    const param = new FormData();
    param.append("user_id", await AsyncStorage.getItem(userDataKey.ID));
    setLoading(true);
    deleteAccountApiCall(param)
      .then((res) => {
        setLoading(false);
        console.log("delete Account Res====>", res);
        if (res.success) {
          clearLoginData();
          navigation.replace("AuthStack", { screen: "LaunchScreen" });
          dispatch({ type: USER_LOGGED_OUT });
        } else {
          showAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        showAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const onPressDelete = () => {
    setShowConfirmationModal(!showConfirmationModal);
    deleteAccount();
  };

  const onPressCancel = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };
  const onRequestClose = () => {
    setShowConfirmationModal(false);
  };

  return (
    <View style={styles.mainContainer}>
      <ModelConfirmationDialog
        title={t("are_you_sure_you_want_to_delete_your_account_permanently")}
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        onPressDelete={onPressDelete}
        onPressDeleteTitle={t("delete_account")}
        onPressCancel={onPressCancel}
        onRequestClose={onRequestClose}
      ></ModelConfirmationDialog>
      <Header
        onBack={() => navigation.goBack()}
        isShowCart={false}
        title={t("delete_account")}
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
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <View style={styles.cardView}>
          <CustomText style={styles.TitleText}>
            {t("delete_my_account")}
          </CustomText>

          <CustomText style={styles.DiscriptionText}>
            {t("if_you_delete_your_account")}
          </CustomText>

          <View>
            <View style={styles.mainView}>
              <Image
                style={styles.imageLayout}
                source={Icons.ic_star}
                resizeMode={"contain"}
              ></Image>

              <CustomText style={styles.listTextView}>
                {Localization.line}
              </CustomText>
            </View>

            <View style={styles.mainView}>
              <Image
                style={styles.imageLayout}
                source={Icons.ic_star}
                resizeMode={"contain"}
              ></Image>
              <CustomText style={styles.listTextView}>
                {Localization.line2}
              </CustomText>
            </View>

            <View style={styles.mainView}>
              <Image
                style={styles.imageLayout}
                source={Icons.ic_star}
                resizeMode={"contain"}
              ></Image>
              <CustomText style={styles.listTextView}>
                {Localization.line3}
              </CustomText>
            </View>

            <View style={styles.mainView}>
              <Image
                style={styles.imageLayout}
                source={Icons.ic_star}
                resizeMode={"contain"}
              ></Image>
              <CustomText style={styles.listTextView}>
                {Localization.line4}
              </CustomText>
            </View>

            <View style={styles.mainView}>
              <Image
                style={styles.imageLayout}
                source={Icons.ic_star}
                resizeMode={"contain"}
              ></Image>
              <CustomText style={styles.listTextView}>
                {Localization.line5}
              </CustomText>
            </View>

            <View style={styles.mainView}>
              <Image
                style={styles.imageLayout}
                source={Icons.ic_star}
                resizeMode={"contain"}
              ></Image>
              <CustomText style={styles.listTextView}>
                {Localization.line6} {"\n"}
                {Localization.line7} {"\n"}
                {Localization.line8}
              </CustomText>
            </View>

            <View style={styles.mainView}>
              <Image
                style={styles.imageLayout}
                source={Icons.ic_star}
                resizeMode={"contain"}
              ></Image>
              <CustomText style={styles.listTextView}>
                {Localization.line9}
              </CustomText>
            </View>

            <View style={styles.mainView}>
              <Image
                style={styles.imageLayout}
                source={Icons.ic_star}
                resizeMode={"contain"}
              ></Image>
              <CustomText style={styles.listTextView}>
                {Localization.line10}
              </CustomText>
            </View>
          </View>

          <PrimaryButton
            onPress={() => {
              setShowConfirmationModal(true);
            }}
            title={t("delete_account")}
            buttonStyle={[{ marginBottom: 24, backgroundColor: colors.red }]}
          ></PrimaryButton>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },
  background: {
    flex: 1,
    backgroundColor: colors.white,
  },
  LabelText: {
    fontSize: 24,
    fontFamily: "Helvetica",
    fontWeight: "700",
    color: "#F47920",
    marginTop: 25,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  TitleText: {
    fontSize: 18,
    fontFamily: "Helvetica",
    fontWeight: "700",
    color: "#000000",
    marginTop: 25,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  DiscriptionText: {
    fontSize: 16,
    fontFamily: "Helvetica",
    textAlign: "center",
    justifyContent: "center",
  },
  cardView: {
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 30,
    textAlign: "center",
    backgroundColor: "white",

    shadowRadius: 4,

    shadowColor: Platform.OS == "ios" ? "#00000029" : "rgba(0, 0, 0, 0.7)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    overflow: "hidden",
    elevation: Platform.OS === "ios" ? 0.1 : 5,
    shadowOpacity: 1.0,
    margin: 5,
    flex: 1,
  },
  AmountCard: {
    height: 127,
    borderRadius: 15,
    backgroundColor: "#F47920",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  AmountTextLayout: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontWeight: "400",

    marginLeft: 60,
    marginTop: 41,
    color: colors.white,

    // marginLeft:69,
    // marginTop:-30,
  },
  AmountText: {
    color: colors.white,
    lineHeight: 77,
    fontSize: 12,
    fontWeight: "700",
  },
  listTextView: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 10,
    marginRight: 30,
    marginTop: 0,
  },
  IconLayput: {
    height: 25,
    width: 25,
    marginLeft: 18,
    marginRight: 10,
  },
  imageLayout: {
    height: 25,
    width: 25,
    // alignSelf: 'center',
  },
  mainView: {
    flexDirection: "row",
    marginTop: 10,
  },

  modalView: {
    //margin: 0,
    backgroundColor: colors.white,
    borderRadius: 20,
    position: "absolute",

    elevation: 5,
    width: "85%",
    paddingTop: 12,
    paddingBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTextHeader: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    marginStart: 25,
    marginEnd: 25,
    lineHeight: 24,
    marginTop: 0,
  },
});

export default DeactivateAccount;
