import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import RNRestart from 'react-native-restart'; // Import package from node modules

import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Drawer } from "react-native-paper";
import { useDispatch } from "react-redux";
import { AlertConfirmDialog } from "../components/AlertConfirmDialog";
import { AlertView } from "../components/AlertView";
import CustomDropDown from "../components/CustomDropDown";
import CustomText from "../components/CustomText";
import Loader from "../components/Loader";
import { moderateScale } from "../components/scalling";
import { USER_LOGGED_OUT } from "../redux/action/actionType";
import { logOutApiCall, updateProfileApiCall } from "../redux/services/ApiService";
import colors from "../theme/colors";
import Fonts from "../theme/Fonts";
import Icons from "../theme/Icons";
import { userDataKey } from "../Utils/Constant";
import { clearLoginData } from "../Utils/Helper";

const { width, height } = Dimensions.get("window");

export function DrawerContent(props) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const [role, setRole] = useState("");

  const [showAlertOk, setShowAlertOk] = useState(false);
  const [alertMessageOK, showAlertMessageOk] = useState("");
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const LANGUAGES = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
  ];
  const selectedLanguageCode = i18n.language;

  const setLanguage = (value) => {
    console.log("code==>", value);
    if(value!=null){
    updateLanguage(value)
    }

    return i18n.changeLanguage(value);
  };


  const updateLanguage = async (code) => {
    console.log("updateProfile calling====>", 1);
      const param = new FormData();
      param.append("localization_detail",code);
      
      setLoading(true);
      updateProfileApiCall(param)
        .then((res) => {
          setLoading(false);
          console.log("updateProfile====>", res);
          if (res.success) {
            RNRestart.Restart();

            // showAlertMessage(res.message);
            // setShowAlert(true);
            // storeProfileDta(res.data);
          } else {
            // showAlertMessage(res.message);
            // setShowAlert(true);
            // setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          // showAlertMessage(error.message);
          // setShowAlert(true);
        });
    
  };


  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    setRole(await AsyncStorage.getItem(userDataKey.Role));
    setLanguage(await AsyncStorage.getItem("user - language"));
    console.log("My App User Role==>", role);
  };
  const logoutDialog = () => {
    showAlertMessage(t("logout_msg"));
    setShowAlert(true);
  };
  const logOutCall = () => {
    setLoading(true);
    logOutApiCall()
      .then((res) => {
        console.log("Logout Res", res);
        setLoading(false);

        if (res.success) {
          setShowAlert(false);

          clearLoginData();
          props.navigation.replace("AuthStack", { screen: "LaunchScreen" });
          dispatch({ type: USER_LOGGED_OUT });
        } else {
          setTimeout(() => {
            setShowAlert(false);
            showAlertMessageOk(res.message);
            setShowAlertOk(true);
          }, 1000);
        }
      })
      .catch((error) => {
        setTimeout(() => {
          showAlertMessageOk(res.message);
          setShowAlertOk(true);
          setLoading(false);
        }, 1000);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      <View
        style={{
          height: "100%",
          width: 60,
        }}
      >
        <Loader loading={isLoading} />

        <AlertConfirmDialog
          showAlert={showAlert}
          title={t("sign_out")}
          confirmText={t("sign_out")}
          cancelText={t("cancel")}
          message={alertMessage}
          confirmButtonColor={colors.primary}
          cancelButtonColor={"#878787"}
          onConfirmPressed={async () => {
            logOutCall();
          }}
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onDismiss={() => setShowAlert(false)}
        ></AlertConfirmDialog>

        <AlertView
          showAlert={showAlertOk}
          message={alertMessageOK}
          onConfirmPressed={() => {
            setShowAlertOk(false);
          }}
          onDismiss={() => setShowAlertOk(false)}
        ></AlertView>

        <TouchableOpacity
          onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
        >
          <Image
            style={{
              width: 20,
              height: 20,
              tintColor: colors.white,
              resizeMode: "contain",
              alignSelf: "center",
              marginTop: 30,
            }}
            source={Icons.ic_back_primary}
          ></Image>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          backgroundColor: "white",
        }}
      >
        <View style={{ marginHorizontal: 40 }}>
          <CustomText
            style={{
              color: colors.primary,
              fontWeight: "700",
              fontSize: moderateScale(24),
            }}
          >
            {t("language")}
          </CustomText>
          <CustomDropDown
            style={{ borderColor: "#CBCBCB", marginTop: 10 }}
            value={selectedLanguageCode}
            onValueChange={(value) => setLanguage(value)}
            data={LANGUAGES}
          ></CustomDropDown>
        </View>
        <DrawerContentScrollView {...props}>
          {/* <View style={styles.drawerContent}> */}
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              style={{
                padding: 0,
                margin: 0,
              }}
              labelStyle={[styles.drawerText]}
              label={t("home")}
              isActive={false}
              onPress={() => {
                props.navigation.dispatch(DrawerActions.closeDrawer());
                props.navigation.navigate("BottomTabNavigator", {
                  screen: "HomeStackNavigator",
                });
              }}
            />
            <DrawerItem
              labelStyle={[styles.drawerText]}
              label={t("messages")}
              isActive={false}
              onPress={() => {
                props.navigation.dispatch(DrawerActions.closeDrawer());

                props.navigation.navigate("MessagesStackNavigator");
              }}
            />

       

            <DrawerItem
              labelStyle={[styles.drawerText]}
              label={t("notifications")}
              isActive={false}
              onPress={() => {
                props.navigation.dispatch(DrawerActions.closeDrawer());

                props.navigation.navigate("ProfileStackNavigator", {
                  screen: "NotificationScreen",
                });
              }}
            />

            <DrawerItem
              labelStyle={[styles.drawerText]}
              label={t("favourites")}
              isActive={false}
              onPress={() => {
                props.navigation.dispatch(DrawerActions.closeDrawer());

                props.navigation.navigate("FavoriteStackNavigator");
              }}
            />
            <DrawerItem
              labelStyle={[styles.drawerText]}
              isActive={false}
              label={t("my_account")}
              // onPress={() => {
              //   props.navigation.navigate("ProfileStackNavigator");
              // }}
              onPress={() => {
                props.navigation.dispatch(DrawerActions.closeDrawer());

                props.navigation.navigate("ProfileStackNavigator", {
                  screen: "Profile",
                });
              }}
            />

            <DrawerItem
              labelStyle={[styles.drawerText]}
              isActive={false}
              label={t("subscribe")}
              onPress={() => {
                props.navigation.dispatch(DrawerActions.closeDrawer());

                props.navigation.navigate("HomeStackNavigator", {
                  screen: "Subscription",
                });
              }}
            />

            {role == "standard_user" && (
              <DrawerItem
                style={{ width: width }}
                labelStyle={[styles.drawerText]}
                isActive={false}
                label={t("convert_to_business_account")}
                onPress={() => {
                  props.navigation.dispatch(DrawerActions.closeDrawer());

                  props.navigation.navigate("CreateListingNavigator", {
                    screen: "ConvertBusinessAccount",
                  });
                }}
              />
            )}

            <DrawerItem
              labelStyle={[styles.drawerText]}
              isActive={false}
              label={t("faq")}
              onPress={() => {
                props.navigation.dispatch(DrawerActions.closeDrawer());

                props.navigation.navigate("HomeStackNavigator", {
                  screen: "FAQScreen",
                });
              }}
            />
          </Drawer.Section>
          {/* </View> */}
        </DrawerContentScrollView>
        <View style={{ width: "100%", marginLeft: 49 }}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignContent: "center" }}
            onPress={() => {
              props.navigation.dispatch(DrawerActions.closeDrawer());

              props.navigation.navigate("HomeStackNavigator", {
                screen: "ContactUsScreen",
              });
            }}
          >
            <CustomText style={styles.drawerTextBottom}>
              {t("contact_us")}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ justifyContent: "center", alignContent: "center" }}
            onPress={() => {
              props.navigation.dispatch(DrawerActions.closeDrawer());

              props.navigation.navigate("HomeStackNavigator", {
                screen: "TermsOfServiceScreen",
              });
            }}
          >
            <CustomText style={styles.drawerTextBottom}>
              {t("terms_of_service")}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ justifyContent: "center", alignContent: "center" }}
            onPress={() => {
              props.navigation.dispatch(DrawerActions.closeDrawer());

              props.navigation.navigate("HomeStackNavigator", {
                screen: "PrivacyPolicyScreen",
              });
            }}
          >
            <CustomText style={styles.drawerTextBottom}>
              {t("privacy_policy")}
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 32, marginTop: -15 }}>
          <DrawerItem
            labelStyle={[styles.drawerTextBottom]}
            isActive={false}
            label={t("sign_out")}
            onPress={() => {
              logoutDialog();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerSection: {
    marginTop: 20,
    marginLeft: 30,
  },

  drawerText: {
    fontFamily: Fonts.Helvetica,
    fontWeight: "700",
    fontSize: moderateScale(24),
    color: colors.primary,
    padding: 0,
    margin: 0,
  },
  drawerTextBottom: {
    marginTop: 0,
    fontFamily: Fonts.Helvetica,
    fontWeight: "400",
    fontSize: moderateScale(20),
    color: colors.grey,
    lineHeight: 24,
  },
});
