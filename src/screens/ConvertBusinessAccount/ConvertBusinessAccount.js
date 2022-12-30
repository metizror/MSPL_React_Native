import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
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
import { verticalScale } from "../../components/scalling";
import SelectImageDialog from "../../components/SelectImageDialog";
import { UploadPhoto } from "../../components/UploadPhoto";
import Localization from "../../Localization/Localization";
import {
  converToBusinessAccountApi,
  getCategoryApiCall,
  stateApi,
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Fonts from "../../theme/Fonts";
import Icons from "../../theme/Icons";
import { saveLoginData, validateEmail } from "../../Utils/Helper";
import { useTranslation } from "react-i18next";

const ConvertBusinessAccount = ({ navigation, route }) => {
  const refEmail = useRef();
  const refPassword = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameBusiness, setNameBusiness] = useState("");
  const [cbDefaultProfileName, setCBDefaultProfileName] = useState(false);
  const [storeCategory, setStoreCategory] = useState("");
  const [discription, setDiscription] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [selectedStoreLogo, setSelectedStoreLogo] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const { t } = useTranslation();
  const refImageDialog = useRef();

  const dispatch = useDispatch();
  var partPhoto;
  const { stateData } = useSelector((state) => ({
    stateData: state.stateListReducer.data.list,
  }));
  

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      mediaType: "photo",
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.7,
      // includeBase64: true,
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

  useEffect(() => {
    if (stateData.length == 0) {
      dispatch(stateApi());
    }
    getCategoryData();

    console.log("State Data===>", stateData);
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
          data.push({ value: 0, label: "Listing Category" });

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
    if (name == "") {
      showAlertMessage(t("please_enter_name"));
      setShowAlert(true);
    } else if (email == "") {
      showAlertMessage(t("please_enter_email_id"));
      setShowAlert(true);
    } else if (!validateEmail(email)) {
      showAlertMessage(t("please_enter_valid_email_id"));
      setShowAlert(true);
    } else if (nameBusiness == "") {
      showAlertMessage(t("please_enter_business_name"));
      setShowAlert(true);
    } else if (discription == "") {
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
    } else if (websiteUrl == "") {
      showAlertMessage(t("please_enter_website_url"));
      setShowAlert(true);
    } else {
      const param = new FormData();
      param.append("name", name);
      param.append("email", email);
      param.append("street_address", streetAddress);
      param.append("state", "Alaska");
      param.append("city", city);
      param.append("zipcode", zipcode);
      cbDefaultProfileName
        ? param.append("default_name_profile", "1")
        : param.append("default_name_profile", "0");
      param.append("store_category", storeCategory);
      param.append("business_name", nameBusiness);
      param.append("store_description", discription);
      param.append("website_url", websiteUrl);
      param.append("store_logo", selectedStoreLogo);
      console.log("Params", JSON.stringify(param));
      setLoading(true);
      converToBusinessAccountApi(param)
        .then((res) => {
          setLoading(false);
          console.log("Convert to Business Account====>", res);
          if (res.success) {
            getUserData(res.data);
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

  async function getUserData(data) {
    console.log("User Data===>", JSON.stringify(data));
    await saveLoginData(data, "business_user", "");
    navigation.navigate("ViewItems");
  }
  return (
    <View style={styles.mainContainer}>
      <Header
        onBack={() => navigation.goBack()}
        isShowCart={false}
        title={t("business_account")}
      ></Header>
      <Loader loading={isLoading} />
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
      <KeyboardAwareScrollView
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
            // ref={refName}
            value={name}
            changeText={(value) => setName(value)}
            placeholder={t("name")}
            returnKeyType={"next"}
            blurOnSubmit={false}
          ></CustomTextInput>

          <CustomTextInput
            ref={refEmail}
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

          <View>
            <CustomTextInput
              value={nameBusiness}
              changeText={(value) => setNameBusiness(value)}
              placeholder={t("name_of_business")}
              returnKeyType={"next"}
              blurOnSubmit={false}
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

            <CustomDropDown
              value={categoryName}
              onValueChange={(value) => setCategoryName(value)}
              data={categoryList}
            ></CustomDropDown>

            <CustomTextInput
              cStyles={{
                height: verticalScale(250),
                textAlignVertical: "top",
                color: colors.black,
                fontSize: 16,
              }}
              value={discription}
              changeText={(value) => setDiscription(value)}
              placeholder={t("Discription")}
              multiline={true}
              maxlength={400}
              numberOfLines={5}
              require={true}
              returnKeyType={"next"}
            ></CustomTextInput>
          </View>

          {storeLogo === "" ? (
            <UploadPhoto
              onPress={() => refImageDialog.current.open()}
              title={t("upload_a_profile_logo")}
              style={{ marginTop: 10 }}
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
            value={streetAddress}
            changeText={(value) => setStreetAddress(value)}
            placeholder={t("street_address")}
            returnKeyType={"next"}
            blurOnSubmit={false}
          ></CustomTextInput>

          <CustomTextInput
            value={city}
            changeText={(value) => setCity(value)}
            placeholder={t("city")}
            keyType={"email-address"}
            returnKeyType={"next"}
            blurOnSubmit={false}
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
            value={zipcode}
            keyType={"numeric"}
            changeText={(value) => setZipcode(value)}
            placeholder={t("zip_Code")}
          />

          <View>
            <CustomTextInput
              value={websiteUrl}
              changeText={(value) => setWebsiteUrl(value)}
              placeholder={t("website_url")}
            />
          </View>

          <PrimaryButton
            buttonStyle={{ marginBottom: 40 }}
            onPress={() => checkValidation()}
            title={t("convert_to_business_account")}
          ></PrimaryButton>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default ConvertBusinessAccount;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
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
    marginTop: 20,
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
