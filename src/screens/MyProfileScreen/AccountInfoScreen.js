import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { RadioButton, RadioGroup } from "react-native-flexi-radio-button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import {
  changeEmailApiCall,
  changePasswordApi,
  getCategoryApiCall,
  getUserProfileApiCall,
  stateApi,
  updateProfileApiCall,
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { userDataKey } from "../../Utils/Constant";
import {
  saveLoginData,
  validateEmail,
  validatePasswrod,
} from "../../Utils/Helper";
import { useDispatch, useSelector } from "react-redux";
import CustomDropDown from "../../components/CustomDropDown";
import { moderateScale, verticalScale } from "../../components/scalling";
import Fonts from "../../theme/Fonts";

const AccountInfoScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("00000000");
  const [businessName, setBusinessName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = React.useState("");
  const [State, setState] = React.useState("Alaska");
  const [zipcode, setZipCode] = React.useState("");
  const [websiteUrl, setWebsiteUrl] = React.useState("");
  const [role, setRole] = useState("");

  //Update Email
  const [modalVisible, setModalVisible] = useState(false);
  const [modelUserProfile, setModelUserProfile] = useState(false);

  const [modelUserMap, setModelUserMap] = useState(false);

  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newConfirmEmail, setNewConfirmEmail] = useState("");

  //Update Email
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [radioItem, setRadioSelectedItem] = React.useState(0);

  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState(0);
  const { stateData } = useSelector((state) => ({
    stateData: state.stateListReducer.data.list,
  }));

  const checkChangeEmailValidation = async () => {
    if (oldEmail == "") {
      showAlertMessage(t("please_enter_old_email_id"));
      setShowAlert(true);
    } else if (!validateEmail(oldEmail)) {
      showAlertMessage(t("please_enter_valid_old_email_id"));
      setShowAlert(true);
    } else if (newEmail == "") {
      showAlertMessage(t("please_enter_new_email_id"));
      setShowAlert(true);
    } else if (!validateEmail(newEmail)) {
      showAlertMessage(t("please_enter_valid_new_email_id"));
      setShowAlert(true);
    } else if (newConfirmEmail == "") {
      showAlertMessage(t("please_enter_confirm_email_id"));
      setShowAlert(true);
    } else if (newEmail != newConfirmEmail) {
      showAlertMessage(t("new_confirm_email_not_match"));
      setShowAlert(true);
    } else {
      const param = new FormData();
      param.append("old_email", oldEmail);
      param.append("email", newEmail);
      param.append("confirm_email", newConfirmEmail);
      console.log("params", JSON.stringify(param));
      setLoading(true);
      changeEmailApiCall(param)
        .then((res) => {
          setLoading(false);
          console.log("ChangeEmail====>", res);
          if (res.success) {
            AsyncStorage.setItem(userDataKey.Email, newEmail);
            //setEmail(await AsyncStorage.getItem(userDataKey.Email));
            updateEmail(newEmail);
            setEmail(newEmail);
            showAlertMessage(res.message);
            setShowAlert(true);
            setModalVisible(false);
            setNewEmail("");
            setNewConfirmEmail("");
            setOldEmail("");
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
    }
  };

  const checkChangePasswordValidation = async () => {
    if (currentPassword == "") {
      showAlertMessage(t("please_enter_current_password"));
      setShowAlert(true);
    } else if (newPassword == "") {
      showAlertMessage(t("please_enter_new_password"));
      setShowAlert(true);
    } else if (newPassword.length < 8) {
      showAlertMessage(t("password_length"));
      setShowAlert(true);
    } else if (!validatePasswrod(newPassword)) {
      showAlertMessage(t("please_enter_valid_password"));
      setShowAlert(true);
    } else if (newPassword != newConfirmPassword) {
      showAlertMessage(t("password_not_match"));
      setShowAlert(true);
    } else {
      const param = new FormData();
      param.append("old_password", currentPassword);
      param.append("new_password", newPassword);
      param.append("confirm_password", newConfirmPassword);
      console.log("params", JSON.stringify(param));
      setLoading(true);
      changePasswordApi(param)
        .then((res) => {
          if (res.success) {
            setLoading(false);
            setModalPasswordVisible(false);
            showAlertMessage(res.message);
            setShowAlert(true);
            setCurrentPassword("");
            setNewPassword("");
            setNewConfirmPassword("");
          } else {
            showAlertMessage(res.message);
            setShowAlert(true);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          setModalPasswordVisible(false);
          showAlertMessage(error.message);
          setShowAlert(true);
        });
    }
  };

  const updateProfile = async () => {
    console.log("Category Name==>", categoryName);
    if (name == "") {
      showAlertMessage(t("please_enter_name"));
      setShowAlert(true);
    } else if (businessName == "" && role === "business_user" ||  role=="business_user_pro") {
      showAlertMessage(t("please_enter_business_name"));
      setShowAlert(true);
    } else if (categoryName === 0 && role === "business_user"  ||  role=="business_user_pro") {
      showAlertMessage(t("please_select_category"));
      setShowAlert(true);
    } else if (description == "" && role === "business_user" ||  role=="business_user_pro") {
      showAlertMessage(t("please_enter_store_description"));
      setShowAlert(true);
    } else if (streetAddress == "") {
      showAlertMessage(t("please_enter_street_address"));
      setShowAlert(true);
    } else if (city == "") {
      showAlertMessage(t("please_enter_city"));
      setShowAlert(true);
    } else if (zipcode == "") {
      showAlertMessage(t("please_enter_zipcode"));
      setShowAlert(true);
    } else if (zipcode.length < 5) {
      showAlertMessage(t("zipcode_lenth"));
      setShowAlert(true);
    } else if (websiteUrl == "" && role === "business_user" ||  role=="business_user_pro") {
      showAlertMessage(t("please_enter_website_url"));
      setShowAlert(true);
    } else {
      const param = new FormData();
      param.append("name", name);
      param.append("email", email);
      param.append("street_address", streetAddress);
      param.append("state", State);
      param.append("city", city);
      param.append("zipcode", zipcode);
      param.append("localization_detail", (await AsyncStorage.getItem(userDataKey.La)));
      
      if ((await AsyncStorage.getItem(userDataKey.Role)) === "business_user"  || (await AsyncStorage.getItem(userDataKey.Role)) === "business_user_pro") {
        param.append("store_category", categoryName);
        param.append("business_name", businessName);
        param.append("store_description", description);
        param.append("website_url", websiteUrl);
      }
      setLoading(true);
      updateProfileApiCall(param)
        .then((res) => {
          setLoading(false);
          console.log("updateProfile====>", res);
          if (res.success) {
            showAlertMessage(res.message);
            setShowAlert(true);
            storeProfileDta(res.data);
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
    }
  };

  async function storeProfileDta(data) {
    console.log("Check Data===>",data);
    await saveLoginData(data, await AsyncStorage.getItem(userDataKey.Role), "");
    setName(await AsyncStorage.getItem(userDataKey.Name));
    setEmail(await AsyncStorage.getItem(userDataKey.Email));
    setStreetAddress(await AsyncStorage.getItem(userDataKey.Street_Address));
    setState(await AsyncStorage.getItem(userDataKey.State));
    setCity(await AsyncStorage.getItem(userDataKey.City));
    setZipCode(await AsyncStorage.getItem(userDataKey.Zipcode));
    setState(await AsyncStorage.getItem(userDataKey.State));
    if ((await AsyncStorage.getItem(userDataKey.Role)) === "business_user"  || (await AsyncStorage.getItem(userDataKey.Role)) === "business_user_pro") {
      console.log('Inside');
    
      setCategoryName(
        JSON.parse(await AsyncStorage.getItem(userDataKey.Store_Category))
      );

      setBusinessName(await AsyncStorage.getItem(userDataKey.BusinessName));
      setDescription(await AsyncStorage.getItem(userDataKey.Store_Description));
      setWebsiteUrl(await AsyncStorage.getItem(userDataKey.Website_Url));
    }
  }

  async function updateEmail(email) {
    AsyncStorage.setItem(userDataKey.Email, email);
  }

  useEffect(() => {
    if (isFocused) {
      getCategoryData();
      getUserRole();
      getUserProfile();
      if (stateData.length == 0) {
        dispatch(stateApi());
      }
    }
  }, [isFocused]);

  const getUserRole = async () => {
    setRole(await AsyncStorage.getItem(userDataKey.Role));
  };

  const getUserProfile = () => {
    setLoading(true);

    getUserProfileApiCall()
      .then((res) => {
        setLoading(false);

        console.log("GetUserRes====>", res);
        if (res.success) {
          storeProfileDta(res.data);
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

  const getCategoryData = () => {
    setLoading(true);

    getCategoryApiCall()
      .then((res) => {
        setLoading(false);
        console.log("Categorty====>", res);
        if (res.success) {
          var data = [];

          var tempList = res.data;
          data.push({ value: 0, label: t("listing_category") });

          for (var i = 0; i < tempList.length; i++) {
            data.push({
              value: tempList[i].id,
              label: tempList[i].name,
            });
          }
          setCategoryList(data);
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

  const onCancelPressChangeEmail = () => {
    setModalVisible(false);
    setOldEmail("");
    setNewEmail("");
    setNewConfirmEmail("");
  };

  const onCancelPressChangePassword = () => {
    setModalPasswordVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setNewConfirmPassword("");
  };
  return (
    <View style={styles.mainContainer}>
      <Loader loading={isLoading} />
      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => setShowAlert(false)}
      ></AlertView>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <CustomText style={styles.formTitle}>
          {t("personal_information")}
        </CustomText>

        <CustomTextInput
          cStyles={{ color: colors.black }}
          value={name}
          changeText={(value) => setName(value)}
          placeholder={t("name")}
          returnKeyType={"next"}
        ></CustomTextInput>

        <CustomTextInput
          cStyles={{ backgroundColor: "#8E8E8E1A", color: colors.black }}
          isClickEvent={true}
          onPress={() => setModalVisible(true)}
          value={email}
          editable={false}
          changeText={(value) => setEmail(value)}
          placeholder={t("email")}
          returnKeyType={"next"}
          blurOnSubmit={false}
        ></CustomTextInput>

        <CustomTextInput
          cStyles={{ backgroundColor: "#8E8E8E1A", color: colors.black }}
          isClickEvent={true}
          ispasswordtextbox={true}
          onPress={() => setModalPasswordVisible(true)}
          value={password}
          editable={false}
          changeText={(value) => setPassword(value)}
          placeholder={t("password")}
          returnKeyType={"next"}
        >
          {/* <Text>demo</Text> */}
        </CustomTextInput>
        <CustomText style={styles.formTitle}>
          {t("profile_information")}
        </CustomText>
        {role == "business_user" || role == "business_user_pro"  && (
          <View>
            <CustomTextInput
              cStyles={{ color: colors.black }}
              value={businessName}
              changeText={(value) => setBusinessName(value)}
              placeholder={t("business_name")}
              returnKeyType={"next"}
            ></CustomTextInput>

            <CustomDropDown
              onValueChange={(value) => setCategoryName(value)}
              data={categoryList}
              value={categoryName}
            ></CustomDropDown>

            <CustomTextInput
              cStyles={{
                height: verticalScale(250),
                textAlignVertical: "top",
                color: colors.black,
                fontSize: 16,
              }}
              value={description}
              changeText={(value) => setDescription(value)}
              placeholder={t("Discription")}
              multiline={true}
              maxlength={400}
              numberOfLines={5}
              require={true}
              returnKeyType={"next"}
            ></CustomTextInput>
          </View>
        )}

        <CustomTextInput
          cStyles={{ color: colors.black }}
          value={streetAddress}
          changeText={(value) => setStreetAddress(value)}
          placeholder={t("street_address")}
          returnKeyType={"next"}
        ></CustomTextInput>

        <CustomTextInput
          cStyles={{ color: colors.black }}
          value={city}
          changeText={(value) => setCity(value)}
          placeholder={t("city")}
          returnKeyType={"next"}
        ></CustomTextInput>

        {stateData.length > 0 ? (
          <CustomDropDown
            onValueChange={(value) => setState(value)}
            data={stateData}
            value={State}
          ></CustomDropDown>
        ) : (
          <View></View>
        )}

        <CustomTextInput
          cStyles={{ color: colors.black }}
          value={zipcode}
          keyType={"numeric"}
          maxlength={5}
          changeText={(value) => setZipCode(value)}
          placeholder={t("zip_Code")}
        ></CustomTextInput>
        {role == "business_user" || role == "business_user_pro" &&(
          <CustomTextInput
            cStyles={{ color: colors.black }}
            value={websiteUrl}
            changeText={(value) => setWebsiteUrl(value)}
            placeholder={t("website_url")}
            returnKeyType={"next"}
          ></CustomTextInput>
        )}

        <PrimaryButton
          title={t("save_changes")}
          onPress={() => updateProfile()}
          buttonStyle={{ marginTop: 43 }}
        />

        <Pressable
          onPress={() => {
            navigation.navigate("DeactivateAccount");
          }}
          style={{ marginTop: 15, marginBottom: 50 }}
        >
          <CustomText
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={{
              color: colors.red,
              fontSize: 16,
              fontWeight: "400",
              marginTop: 0,
              textAlign: "center",
            }}
          >
            {t("delete_account")}
          </CustomText>
        </Pressable>
      </KeyboardAwareScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
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
                {t("change_Email")}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <CustomTextInput
                  value={oldEmail}
                  changeText={(value) => setOldEmail(value)}
                  placeholder={t("old_mail")}
                  keyType={"email-address"}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                ></CustomTextInput>

                <CustomTextInput
                  value={newEmail}
                  changeText={(value) => setNewEmail(value)}
                  placeholder={t("new_Email")}
                  keyType={"email-address"}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                ></CustomTextInput>

                <CustomTextInput
                  value={newConfirmEmail}
                  changeText={(value) => setNewConfirmEmail(value)}
                  placeholder={t("confirm_new_Email")}
                  keyType={"email-address"}
                  autoCapitalize={"none"}
                  returnKeyType={"next"}
                ></CustomTextInput>
              </View>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  buttonStyle={{ marginTop: 15 }}
                  onPress={checkChangeEmailValidation}
                  title={t("change_Email")}
                ></PrimaryButton>

                <PrimaryButton
                  buttonStyle={{ backgroundColor: "#F42020" }}
                  onPress={() => onCancelPressChangeEmail()}
                  title={t("cancel")}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPasswordVisible}
        onRequestClose={() => {
          setModalPasswordVisible(!modalPasswordVisible);
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
                {t("change_password")}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <CustomTextInput
                  value={currentPassword}
                  ispasswordtextbox={true}
                  changeText={(value) => setCurrentPassword(value)}
                  placeholder={t("current_password")}
                ></CustomTextInput>

                <CustomTextInput
                  value={newPassword}
                  ispasswordtextbox={true}
                  changeText={(value) => setNewPassword(value)}
                  placeholder={t("new_password")}
                ></CustomTextInput>

                <CustomTextInput
                  value={newConfirmPassword}
                  changeText={(value) => setNewConfirmPassword(value)}
                  placeholder={t("confirm_new_password")}
                  ispasswordtextbox={true}
                ></CustomTextInput>
              </View>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  buttonStyle={{ marginTop: 15 }}
                  onPress={checkChangePasswordValidation}
                  title={t("save_changes")}
                ></PrimaryButton>

                <PrimaryButton
                  buttonStyle={{ backgroundColor: "#F42020" }}
                  onPress={() => onCancelPressChangePassword()}
                  title={t("cancel")}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelUserProfile}
        onRequestClose={() => {
          setModelUserProfile(!modelUserProfile);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {photo == "" ? (
                <Image
                  source={Icons.ic_demo}
                  style={styles.iconProfile}
                ></Image>
              ) : (
                <Image
                  source={{
                    uri: photo,
                  }}
                  style={styles.iconProfile}
                ></Image>
              )}
              <CustomText style={styles.modalTextHeader}>
                {"How Was Your Experience With Mark’s Plumbing?"}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  iSource={Icons.ic_thumb_white}
                  buttonStyle={{ marginTop: 15 }}
                  // onPress={checkChangeEmailValidation}
                  title={"Positive"}
                ></PrimaryButton>

                <PrimaryButton
                  textStyle={{ color: colors.primary }}
                  iSource={Icons.ic_thumb_down_white}
                  buttonStyle={{
                    backgroundColor: colors.white,
                    borderColor: colors.primary,
                    borderWidth: 1,
                  }}
                  onPress={() => setModalVisible(false)}
                  title={"Negative"}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelUserMap}
        onRequestClose={() => {
          setModelUserProfile(!modelUserMap);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={styles.centeredView}>
            <View
              style={{
                backgroundColor: colors.white,
                borderRadius: 20,

                position: "absolute",
                //alignItems: "center",
                //shadowColor: "#000",
                // shadowOffset: {
                //     width: 0,
                //     height: 2
                // },
                // shadowOpacity: 0.25,
                // shadowRadius: 4,
                elevation: 5,
                width: "85%",
                paddingVertical: 20,

                // overflow: "hidden",
              }}
            >
              {photo == "" ? (
                <Image
                  source={Icons.ic_demo}
                  style={styles.iconProfile}
                ></Image>
              ) : (
                <Image
                  source={{
                    uri: photo,
                  }}
                  style={styles.iconProfile}
                ></Image>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 5,
                }}
              >
                <Image
                  source={Icons.ic_thumb}
                  resizeMode={"contain"}
                  style={{ width: 15, height: 15, marginRight: 5 }}
                ></Image>
                <CustomText style={{ marginTop: 0 }}>{"11"}</CustomText>
              </View>

              <CustomText
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 18,
                  marginStart: 25,
                  marginEnd: 25,
                  lineHeight: 24,
                  marginTop: 5,
                }}
              >
                {"Marks Plumbing"}
              </CustomText>

              <CustomText
                style={{
                  textAlign: "center",
                  fontWeight: "400",
                  fontSize: 12,
                  marginStart: 25,
                  marginEnd: 25,
                  marginTop: 0,
                }}
              >
                {"152 University Lane Austin, TX 78749"}
              </CustomText>
              <View>
                <RadioGroup
                  size={18}
                  thickness={2}
                  color={colors.primary}
                  custom={true}
                  style={{
                    flexDirection: "row",
                  }}
                  selectedIndex={radioItem}
                  onSelect={(index, value) => setRadioSelectedItem(index)}
                >
                  <RadioButton color={colors.primary} value={"P"}>
                    <CustomText
                      style={{
                        color: colors.grey,
                        fontWeight: "700",
                        marginTop: 0,
                      }}
                    >
                      {"Estimated Arrival"}
                    </CustomText>

                    <CustomText
                      style={{
                        color: colors.black,
                        fontWeight: "400",
                        marginTop: 0,
                      }}
                    >
                      {"4 Minutes"}
                    </CustomText>
                  </RadioButton>

                  <RadioButton color={colors.primary} value={"C"}>
                    <CustomText
                      style={{
                        color: colors.grey,
                        fontWeight: "700",
                        marginTop: 0,
                      }}
                    >
                      {"Your Address"}
                    </CustomText>
                    <CustomText
                      style={{
                        color: colors.black,
                        fontWeight: "400",
                        marginTop: 0,
                      }}
                    >
                      {"100 University Lane"}
                    </CustomText>
                  </RadioButton>
                </RadioGroup>
              </View>

              <View
                style={{
                  flexDirection: "row",

                  paddingVertical: 15,
                  textAlignVertical: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#F6F6F6",
                }}
              >
                <CustomText
                  style={{
                    fontWeight: "700",
                    marginTop: 0,
                    fontSize: 14,
                    marginHorizontal: 10,
                    color: colors.primary,
                  }}
                >
                  {"View Store"}
                </CustomText>

                <CustomText
                  style={{
                    fontWeight: "700",
                    marginTop: 0,
                    fontSize: 14,
                    marginHorizontal: 10,
                    color: colors.primary,
                  }}
                >
                  {"Open In Google Maps"}
                </CustomText>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },

  TitleText: {
    fontSize: 24,
    fontFamily: "Helvetica",
    fontWeight: "700",
    color: "#F47920",
    lineHeight: 29,
    marginBottom: 27,
    textAlign: "center",
  },
  cardView: {
    height: 956,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    marginBottom: 12,
    marginTop: 60,
    shadowColor: "#000",
    textAlign: "center",
    elevation: 24,
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
  ImageView: {
    height: 113,
    width: 113,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 63,
    marginBottom: 6,
  },
  ItemText: {
    fontSize: 16,
    fontFamily: "Helvetica",
    fontWeight: "400",
    color: "#F47920",
    lineHeight: 18,
    textDecorationLine: "underline",
    marginBottom: 106,
    textAlign: "center",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
  },
  Description: {
    paddingHorizontal: 70,
    fontSize: 14,
    fontFamily: "Helvetica",
    fontWeight: "400",
    color: "#000000",
    marginTop: 7,
    lineHeight: 21,
    alignItems: "center",
    textAlign: "center",
  },
  AmountCard: {
    height: 187,
    borderRadius: 15,
    backgroundColor: "#F47920",
    alignItems: "center",
    marginBottom: 20,
  },

  inputDropDownContainer: {
    borderWidth: 1,
    minHeight: 55,
    justifyContent: "center",
    paddingHorizontal: Platform.OS == "android" ? 10 : 5,
    marginTop: 20,
    borderColor: "#000000",
    borderRadius: 10,
    height: 55,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 20,
    position: "absolute",
   
    elevation: 5,
    width: "85%",
    paddingVertical: 20,
  },

  modalTextHeader: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    marginStart: 25,
    marginEnd: 25,
    lineHeight: 24,
    marginBottom: 22,
  },
  iconProfile: {
    borderRadius: 115 / 2,
    height: 115,
    width: 115,
    borderWidth: 5,
    borderColor: colors.white,
    marginTop: -70,
    resizeMode: "cover",
    alignSelf: "center",
  },
});

export default AccountInfoScreen;
