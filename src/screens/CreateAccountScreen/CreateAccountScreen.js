import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { AlertView } from "../../components/AlertView";
import CustomCheckbox from "../../components/CustomCheckbox";
import CustomDropDown from "../../components/CustomDropDown";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { moderateScale, verticalScale } from "../../components/scalling";
import SelectImageDialog from "../../components/SelectImageDialog";
import { UploadPhoto } from "../../components/UploadPhoto";
import {
  getCategoryApiCall,
  loginWithAppleApiCall,
  loginWithFacebookApiCall,
  loginWithGoogleApiCall,
  registrationApiCall,
  stateApi,
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Fonts from "../../theme/Fonts";
import Icons from "../../theme/Icons";
import {
  saveLoginData,
  validateEmail,
  validatePasswrod,
} from "../../Utils/Helper";

const CreateAccountScreen = ({ navigation, route }) => {
  const userType = route.params.userType;
  let type = null;
  let data = null;
  if (route.params.data !== undefined) {
    data = route.params.data;
  } else {
    data = null;
  }
  if (route.params.type !== undefined) {
    type = route.params.type;
  } else {
    type = null;
  }
  const { t } = useTranslation();

  console.log("facebook_token_create_account", data);
  console.log("type_create account===>", type);

  const refEmail = useRef();
  const refName = useRef();
  const refPassword = useRef();
  const refConfirmPassword = useRef();
  const refDiscription = useRef();
  const refNameBusiness = useRef();
  const refStreetAddress = useRef();
  const refCity = useRef();
  const refZipcode = useRef();
  const refWebsiteUrl = useRef();

  const [name, setName] = useState(
    data != null && data.hasOwnProperty("name") ? data.name : ""
  );
  const [email, setEmail] = useState(
    data != null && data.hasOwnProperty("email") ? data.email : ""
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameBusiness, setNameBusiness] = useState("");
  const [cbDefaultProfileName, setCBDefaultProfileName] = useState(false);
  const [discription, setDiscription] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [selectedStoreLogo, setSelectedStoreLogo] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("Alaska");
  const [zipcode, setZipcode] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const [isPrivacyPolicyAccept, setPricacyPolicyAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState(0);
  const refImageDialog = useRef();

  var partPhoto;

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      mediaType: "photo",
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.7,
      resizeMode: 1000,
    }).then((image1) => {
      console.log("paras image", image1);
      var ext = image1.path.substr(image1.path.lastIndexOf(".") + 1);
      partPhoto = {
        name: image1.modificationDate + "." + ext,
        type: image1.mime,
        uri:
          Platform.OS === "android"
            ? image1.path
            : image1.path.replace("file://", ""),
      };
      setStoreLogo(image1.path);
      setSelectedStoreLogo(partPhoto);
      console.log("Selected Image", selectedStoreLogo);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      mediaType: "photo",
      width: 300,
      height: 300,
      compressImageQuality: 0.7,
    }).then((image1) => {
      console.log("paras image", image1);
      var ext = image1.path.substr(image1.path.lastIndexOf(".") + 1);
      partPhoto = {
        name: image1.modificationDate + "." + ext,
        type: image1.mime,
        uri:
          Platform.OS === "android"
            ? image1.path
            : image1.path.replace("file://", ""),
      };
      setStoreLogo(image1.path);
      setSelectedStoreLogo(partPhoto);
      console.log("Selected Image", selectedStoreLogo);
    });
  };

  const closebtn = () => {
    setStoreLogo("");
    setSelectedStoreLogo({});
  };

  const dispatch = useDispatch();

  const { isLoading, stateData } = useSelector((state) => ({
    registrationResponse: state.registrationReducer.registrationResponse,
    isLoading: state.registrationReducer.registrationResponse.isLoading,
    stateData: state.stateListReducer.data.list,
  }));
  useEffect(() => {
    dispatch(stateApi());

    if (userType == "business_user") {
      getCategoryData();
    }
  }, []);

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
        console.log("userGetDealerships Error", error);
        showAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const checkValidation = async () => {
    var FCMToken = await AsyncStorage.getItem("FCMToken");

    if (name == "") {
      showAlertMessage(t("please_enter_name"));
      setShowAlert(true);
    } else if (email == "") {
      showAlertMessage(t("please_enter_email_id"));
      setShowAlert(true);
    } else if (!validateEmail(email)) {
      showAlertMessage(t("please_enter_valid_email_id"));
      setShowAlert(true);
    } else if (type == null && password == "") {
      showAlertMessage(t("please_enter_password"));
      setShowAlert(true);
    } else if (type == null && password.length < 8) {
      showAlertMessage(t("password_length"));
      setShowAlert(true);
    } else if (type == null && !validatePasswrod(password)) {
      showAlertMessage(t("please_enter_valid_password"));
      setShowAlert(true);
    } else if (type == null && confirmPassword == "") {
      showAlertMessage(t("please_enter_confirm_password"));
      setShowAlert(true);
    } else if (type == null && password != confirmPassword) {
      showAlertMessage(t("password_not_match"));
      setShowAlert(true);
    } else if (nameBusiness == "" && userType === "business_user") {
      showAlertMessage(t("please_enter_business_name"));
      setShowAlert(true);
    } else if (categoryName === 0 && userType === "business_user") {
      showAlertMessage(t("please_select_category"));
      setShowAlert(true);
    } else if (discription == "" && userType === "business_user") {
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
    } else if (websiteUrl == "" && userType === "business_user") {
      showAlertMessage(t("please_enter_website_url"));
      setShowAlert(true);
    } else if (!isPrivacyPolicyAccept) {
      showAlertMessage(t("please_select_privacy_policy"));
      setShowAlert(true);
    } else {
      const param = new FormData();

      param.append("name", name);
      param.append("email", email);
      if (type == null) {
        param.append("password", password);
        param.append("confirm_password", confirmPassword);
      }

      param.append("street_address", streetAddress);
      param.append("state", stateValue);
      param.append("city", city);
      param.append("zipcode", zipcode);

      if (userType === "standard_user") {
        if (selectedStoreLogo !== "") {
          param.append("photo", selectedStoreLogo);
        }
      } else {
        {
          cbDefaultProfileName
            ? param.append("default_name_profile", "1")
            : param.append("default_name_profile", "0");
        }
        param.append("store_category", categoryName);
        param.append("business_name", nameBusiness);
        param.append("store_description", discription);
        param.append("website_url", websiteUrl);
        param.append("store_logo", selectedStoreLogo);
      }
      param.append("role", userType);
      param.append("device_token", FCMToken);

      if (type == "Facebook") {
        param.append(
          "facebook_token",
          Platform.OS == "ios" ? data.sub : data.id
        );
      }
      if (type == "Google") {
        param.append("google_token", data.email);
      }
      if (type == "Apple") {
        param.append("apple_token", data.email);
      }

      console.log("params", JSON.stringify(param));
      createRegistration(type, param);
    }
  };

  async function storeProfileDta(data) {
    navigation.replace("DrawerNavigator");
    await saveLoginData(data, userType, "login");
  }

  const createRegistration = (type, param) => {
    if (type == "Facebook") {
      console.log("Facebook====>");

      setLoading(true);
      loginWithFacebookApiCall(param)
        .then((res) => {
          setLoading(false);
          console.log("Facebook Login Res====>", JSON.stringify(res));
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
    } else if (type == "Apple") {
      console.log("Apple====>");

      setLoading(true);
      loginWithAppleApiCall(param)
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
    } else if (type == "Google") {
      console.log("Google====>");

      setLoading(true);
      loginWithGoogleApiCall(param)
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
    } else {
      console.log("Register====>");
      setLoading(true);
      registrationApiCall(param)
        .then((res) => {
          setLoading(false);
          console.log("updateProfile====>", res);
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
          showAlertMessage(error.message);
          setShowAlert(true);
        });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header onBack={() => navigation.goBack()} isShowCart={false}></Header>
      <Loader loading={isLoading} />
      <Loader loading={loading} />
      <SelectImageDialog
        ref={refImageDialog}
        onPressTakePhoto={() => {
          console.log("onPressOk");
          refImageDialog.current.close();
          setTimeout(
            function () {
              takePhotoFromCamera();
            }.bind(this),
            1000
          );
        }}
        onPressChooseFromLibrary={() => {
          refImageDialog.current.close();
          setTimeout(
            function () {
              choosePhotoFromLibrary();
            }.bind(this),
            1000
          );
        }}
        onPressCancel={() => {
          console.log("onPressClose");
          refImageDialog.current.close();
        }}
      ></SelectImageDialog>
      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => setShowAlert(false)}
      ></AlertView>
      <CustomText style={styles.screenTitle}>{t("create_account")}</CustomText>
      <KeyboardAwareScrollView
        // behavior="padding"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <CustomText
            style={{
              textAlign: "center",
              color: colors.primary,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {t("account_information")}
          </CustomText>

          <CustomTextInput
            ref={refName}
            value={name}
            changeText={(value) => setName(value)}
            placeholder={t("name")}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              refEmail.current.focus();
            }}
          ></CustomTextInput>

          <CustomTextInput
            ref={refEmail}
            editable={
              data != null && data.hasOwnProperty("email") ? false : true
            }
            value={email}
            changeText={(value) => setEmail(value)}
            placeholder={t("email")}
            autoCapitalize={"none"}
            returnKeyType={"next"}
            onSubmitEditing={() => {
              refPassword.current.focus();
            }}
            blurOnSubmit={false}
          ></CustomTextInput>
          {type == null && (
            <CustomTextInput
              ref={refPassword}
              ispasswordtextbox={true}
              value={password}
              changeText={(value) => setPassword(value)}
              placeholder={t("password")}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                refConfirmPassword.current.focus();
              }}
              blurOnSubmit={false}
            ></CustomTextInput>
          )}
          {type == null && (
            <CustomTextInput
              ref={refConfirmPassword}
              ispasswordtextbox={true}
              value={confirmPassword}
              changeText={(value) => setConfirmPassword(value)}
              placeholder={t("confirm_password")}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                Keyboard.dismiss();
                if (userType == "business_user") {
                  refNameBusiness.current.focus();
                } else {
                  //  refStreetAddress.current.focus();
                  Keyboard.dismiss();
                }
              }}
              blurOnSubmit={false}
            ></CustomTextInput>
          )}

          <CustomText
            style={{
              textAlign: "center",
              color: colors.primary,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {t("profile_information")}
          </CustomText>

          {userType === "business_user" ? (
            <View>
              <CustomTextInput
                ref={refNameBusiness}
                value={nameBusiness}
                changeText={(value) => setNameBusiness(value)}
                placeholder={t("name_of_business")}
                returnKeyType={"next"}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  if (userType == "business_user") {
                    refDiscription.current.focus();
                  } else {
                    refStreetAddress.current.focus();
                  }
                }}
              ></CustomTextInput>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <CustomCheckbox
                  isChecked={cbDefaultProfileName}
                  onPress={() => {
                    setCBDefaultProfileName(!cbDefaultProfileName);
                  }}
                  color={"#F47920"}
                ></CustomCheckbox>

                <CustomText
                  style={{
                    fontSize: 14,
                    marginTop: 0,
                    color: colors.black,
                    paddingVertical: 4,
                    marginLeft: 5,
                    marginRight: 20,
                  }}
                >
                  {t("make_business_name_default_profile_name")}
                </CustomText>
              </View>
              {categoryList.length > 0 ? (
                <CustomDropDown
                  onValueChange={(value) => setCategoryName(value)}
                  data={categoryList}
                  value={categoryName}
                ></CustomDropDown>
              ) : (
                <View></View>
              )}

              <CustomTextInput
                ref={refDiscription}
                cStyles={{
                  height: verticalScale(250),
                  textAlignVertical: "top",
                  color: colors.black,
                }}
                value={discription}
                changeText={(value) => setDiscription(value)}
                placeholder={t("Discription")}
                multiline={true}
                maxlength={400}
                numberOfLines={5}
                onSubmitEditing={() => {
                  refStreetAddress.current.focus();
                }}
              ></CustomTextInput>
            </View>
          ) : (
            <View></View>
          )}

          {storeLogo === "" ? (
            <UploadPhoto
              onPress={() => refImageDialog.current.open()}
              title={
                userType === "business_user"
                  ? t("upload_a_store_logo")
                  : t("upload_a_profile_logo")
              }
              style={{ marginTop: moderateScale(26) }}
            ></UploadPhoto>
          ) : (
            <View>
              <TouchableOpacity onPress={() => refImageDialog.current.open()}>
                <ImageBackground
                  source={{
                    uri: storeLogo,
                  }}
                  style={styles.mainImage}
                  imageStyle={{ borderRadius: 10 }}
                >
                  <TouchableOpacity
                    onPress={() => closebtn()}
                    style={{
                      marginRight: 15,
                      marginTop: 15,
                      alignItems: "flex-end",
                    }}
                  >
                    <Image
                      style={{ width: 10, height: 10 }}
                      source={Icons.ic_close}
                    ></Image>
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          )}

          <CustomTextInput
            ref={refStreetAddress}
            value={streetAddress}
            changeText={(value) => setStreetAddress(value)}
            placeholder={t("street_address")}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              refCity.current.focus();
            }}
          ></CustomTextInput>

          <CustomTextInput
            ref={refCity}
            value={city}
            changeText={(value) => setCity(value)}
            placeholder={t("city")}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              // refZipcode.current.focus();
              Keyboard.dismiss();
            }}
          ></CustomTextInput>

          {stateData.length > 0 ? (
            <CustomDropDown
              onValueChange={(value) => setStateValue(value)}
              data={stateData}
              value={stateValue}
            ></CustomDropDown>
          ) : (
            <View></View>
          )}

          <CustomTextInput
            ref={refZipcode}
            value={zipcode}
            keyType={"numeric"}
            maxlength={5}
            changeText={(value) => setZipcode(value)}
            placeholder={t("zip_code")}
            returnKeyType={"done"}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              if (userType == "business_user") {
                refWebsiteUrl.current.focus();
              } else {
                Keyboard.dismiss();
              }
            }}
          />

          {userType === "business_user" && (
            <View>
              <CustomTextInput
                ref={refWebsiteUrl}
                value={websiteUrl}
                returnKeyType={"done"}
                blurOnSubmit={false}
                changeText={(value) => setWebsiteUrl(value)}
                placeholder={t("website_url")}
                maxlength={40}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          )}

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <CustomCheckbox
              isChecked={isPrivacyPolicyAccept}
              onPress={() => {
                setPricacyPolicyAccept(!isPrivacyPolicyAccept);
              }}
              color={"#F47920"}
            ></CustomCheckbox>
            <View
              style={{
                marginLeft: 10,
                alignContent: "flex-start",
                flexDirection: "row",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <CustomText
                style={{
                  fontSize: 12,
                  marginTop: 0,
                  color: colors.black,
                  fontWeight: "400",
                }}
              >
                {t("do_you_agree_to_the")}
              </CustomText>

              <Pressable
                onPress={() => {
                  console.log("Terms and conditions");
                  navigation.navigate("TermsOfServiceScreen");
                }}
              >
                <CustomText
                  style={{
                    fontSize: 12,
                    marginTop: 0,
                    textDecorationLine: "underline",
                    color: colors.black,
                    fontWeight: "400",
                  }}
                >
                  {t("terms_and_conditions")}
                </CustomText>
              </Pressable>

              <CustomText
                style={{
                  fontSize: 12,
                  marginTop: 0,
                  color: colors.black,
                  fontWeight: "400",
                }}
              >
                {", "}
              </CustomText>

              <Pressable
                onPress={() => {
                  console.log("Privacy Policy");
                  navigation.navigate("PrivacyPolicyScreen");
                }}
              >
                <CustomText
                  style={{
                    textDecorationLine: "underline",
                    fontSize: 12,
                    marginTop: 0,
                    color: colors.black,
                    fontWeight: "400",
                  }}
                >
                  {t("privacy_Policy")}
                </CustomText>
              </Pressable>
              <CustomText
                style={{
                  marginTop: 0,
                  fontSize: 12,
                  color: colors.black,
                  fontWeight: "400",
                }}
              >
                {t("for_RN_Codebase")}
              </CustomText>
            </View>
          </View>
          <PrimaryButton
            buttonStyle={{ marginBottom: 20 }}
            onPress={() => checkValidation()}
            title={t("create_account")}
          ></PrimaryButton>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default CreateAccountScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 30,
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
  main: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
  },

  appLogo: {
    height: 80,
    width: 80,
    resizeMode: "contain",
    alignSelf: "center",
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
  mainImage: {
    height: 173,
    width: "100%",
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 10,
  },
});
