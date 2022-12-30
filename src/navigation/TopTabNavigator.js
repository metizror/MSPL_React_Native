import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertView } from "../components/AlertView";
import CustomText from "../components/CustomText";
import Loader from "../components/Loader";
import { moderateScale } from "../components/scalling";
import SelectImageDialog from "../components/SelectImageDialog";
import { changeUserProfileApiCall } from "../redux/services/ApiService";
import AccountInfoScreen from "../screens/MyProfileScreen/AccountInfoScreen";
import MyListingScreen from "../screens/MyProfileScreen/MyListingScreen";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";
import Icons from "../theme/Icons";
import { userDataKey } from "../Utils/Constant";
const Tab = createMaterialTopTabNavigator();
export default function TopTabNavigator({ navigation }) {
  const { t } = useTranslation();
  const [photo, setPhoto] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  var partPhoto;
  const refImageDialog = useRef();

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
      setPhoto(image1.path);
      ChangeProfilePic();
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
      setPhoto(image1.path);
      ChangeProfilePic();
    });
  };

  const ChangeProfilePic = async () => {
    const param = new FormData();
    if ((await AsyncStorage.getItem(userDataKey.Role)) === "business_user") {
      param.append("store_logo", partPhoto);
    } else {
      param.append("photo", partPhoto);
    }

    console.log("params", JSON.stringify(param));
    setLoading(true);
    changeUserProfileApiCall(param)
      .then((res) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        showAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  useEffect(() => {
    setUserPhoto();
  }, []);

  const setUserPhoto = async () => {
    if ((await AsyncStorage.getItem(userDataKey.Role)) === "business_user") {
      setPhoto(await AsyncStorage.getItem(userDataKey.Store_Logo_Path));
    } else {
      setPhoto(await AsyncStorage.getItem(userDataKey.Photo));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.PrimaryColor }}>
      <Loader loading={isLoading} />
      <SelectImageDialog
        ref={refImageDialog}
        onPressTakePhoto={() => {
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
      <View style={styles.main}>
        <View>
          <View style={styles.root}>
            <CustomText
              style={{
                textAlign: "center",
                fontSize: moderateScale(30),
                color: colors.white,
                fontWeight: "700",
                marginBottom: 15,
              }}
              isShowCart={false}
            >
              {t("my_profile")}
            </CustomText>
          </View>

          {photo == "" ? (
            <Image source={Icons.ic_demo} style={styles.iconProfile}></Image>
          ) : (
            <Image
              source={{
                uri: photo,
              }}
              style={styles.iconProfile}
            ></Image>
          )}

          <TouchableOpacity onPress={() => refImageDialog.current.open()}>
            <CustomText
              style={{
                marginTop: 5,
                textAlign: "center",
                color: colors.primary,
                fontSize: moderateScale(22),
                textDecorationLine: "underline",
              }}
            >
              {t("change_picture")}
            </CustomText>
          </TouchableOpacity>

          <View
            style={{ height: 1, backgroundColor: "#F4F4F4", marginTop: 10 }}
          ></View>
        </View>

        <Tab.Navigator
          initialRouteName={t("account_information")}
          tabBarOptions={{
            upperCaseLabel: true,
            activeTintColor: colors.primary,
            labelStyle: {
              fontSize: moderateScale(22),
              fontFamily: Fonts.Helvetica,
              fontWeight: "700",
              textTransform: "none",
            },
            inactiveTintColor: colors.unactiveTab,
            indicatorStyle: {
              opacity: 0,
            },

            style: {
              backgroundColor: "white",
              borderBottomColor: colors.white,
              paddingTop: 5,
              paddingBottom: 5,
            },
          }}
        >
          <Tab.Screen
            name={t("account_information")}
            component={AccountInfoScreen}
          />
          <Tab.Screen name={t("my_listings")} component={MyListingScreen} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  root: {
    backgroundColor: colors.primary,
    paddingBottom: 60,
  },

  iconProfile: {
    borderRadius: moderateScale(90),
    height: moderateScale(180),
    width: moderateScale(180),
    borderWidth: moderateScale(10),
    borderColor: colors.white,
    marginTop: moderateScale(-90),
    resizeMode: "cover",
    alignSelf: "center",
  },
});
