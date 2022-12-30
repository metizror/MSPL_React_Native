import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Image, LogBox, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { DEEP_LINKING_EVENT } from "../../redux/action/action";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { userDataKey } from "../../Utils/Constant";
import { handleNavigation } from "../../Utils/Helper";
LogBox.ignoreAllLogs();
const SplashScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  var itemId = ""; //for deeplinking
  if (route.params) {
    if (route.params.hasOwnProperty("itemId")) {
      itemId = route.params.itemId;
    }
  }
  console.log("SplashNavigator : itemId : ", itemId);
  const readData = async () => {
    try {
      const isLogin = await AsyncStorage.getItem(userDataKey.IS_LOGGED_IN);
      const onBording = await AsyncStorage.getItem("onBording");
      const mNotification = await AsyncStorage.getItem("notification");
      const notificationData = JSON.parse(mNotification);
      console.log("notification", notificationData);
      if (itemId !== "") {
        console.log("deepLinking dispatched");
        dispatch({
          type: DEEP_LINKING_EVENT,
          payload: {
            itemId: itemId,
          },
        });
      } else {
        dispatch({
          type: DEEP_LINKING_EVENT,
          payload: {},
        });
      }

      if (isLogin) {
        console.log("isLogin", isLogin);
        navigation.replace("DrawerNavigator");
        if (notificationData) {
          handleNavigation(notificationData);
        }
      } else {
        if (onBording === "true") {
          navigation.replace("AuthStack", { screen: "LaunchScreen" });
        } else {
          navigation.replace("AuthStack", { screen: "OnboardingScreen" });
        }
      }
    } catch (e) {
      alert(e);
    }
  };
  useEffect(() => {
    setTimeout(
      function () {
        readData();
      }.bind(this),
      3000
    );
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Image style={styles.ImageStyle} source={Icons.ic_app_logo} />
    </View>
  );
};

export default SplashScreen;


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.white,
    alignItems: "center",
  },
  ImageStyle: {
    height: 300,
    width: 300,
    resizeMode: "contain",
  },
});
