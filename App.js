/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging from "@react-native-firebase/messaging";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import PushNotification, { Importance } from "react-native-push-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import linking from "./linking";
import AuthStack from "./src/navigation/AuthStack";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { navigationRef } from "./src/navigation/NavigationService";
import SplashNavigator from "./src/navigation/SplashNavigator";
import NotificationScreen from "./src/screens/NotificationScreen";
import { handleNavigation } from "./src/Utils/Helper";
import "./src/Localization/IMLocalize";


const Stack = createStackNavigator();
const App = () => {
  const dispatch = useDispatch();
  PushNotification.configure({
    // // (optional) Called when Token is generated (iOS and Android)
    // onRegister: function (token) {
    //   console.log("TOKEN:", token);
    // },
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      // process the notification
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);

      if (
        notification.userInteraction != undefined &&
        notification.foreground != undefined
      ) {
        if (notification.userInteraction && notification.foreground) {
          console.log("user clicked", notification);
          console.log("onClickLocalNotification:", notification.data);
          handleNavigation(notification.data);
        }
      }
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    // onAction: function (notification) {
    //   console.log("ACTION:", notification.action);
    //   console.log("NOTIFICATION:", notification);

    //   // process the action
    // },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    // onRegistrationError: function(err) {
    //   console.error(err.message, err);
    // },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  useEffect(() => {
    // configAndroidIos();
    checkPermission();

    /*
     * Triggered when a particular notification has been received in foreground
     * */
    messaging().onMessage(async (remoteMessage) => {
      console.log(
        "notification received : onMessage---1",
        JSON.stringify(remoteMessage)
      );
      console.log("onMessage--1");
      if (Platform.OS == "ios") {
        console.log("onMessage--2");
        try {
          // notifee.displayNotification({
          //   id: remoteMessage.messageId,
          //   title: remoteMessage.notification.title,
          //   body: remoteMessage.notification.body,
          //   data: remoteMessage.data,
          //   android: {
          //     sound: 'default'
          //   },
          // });
        } catch (e) {
          console.log("onMessage-3", e.message);
          console.log("onMessage-3", JSON.stringify(e));
        }
      } else {
        console.log("onMessage--4");

        try {
          console.log("onMessage--5");

          PushNotification.createChannel(
            {
              channelId: "com.rn.codebase", // (required)
              channelName: "RN_Codebase", // (required)
              channelDescription: "RN_Codebase", // (optional) default: undefined.
              playSound: false, // (optional) default: true
              soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
              importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
              vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
          );
          var RandomNumber = "" + Math.floor(Math.random() * 100) + 1;
          console.log("Random-Notification-Id", RandomNumber);
          PushNotification.localNotification({
            id: RandomNumber, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            /* Android Only Properties */
            channelId: "com.rn.codebase", // (required) channelId, if the channel doesn't exist, notification will not trigger.
            title: remoteMessage.notification.title, // (optional)
            message: remoteMessage.notification.body, // (required)
            smallIcon: "notification_icon", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
            color: "#f28a23", // (optional) default: system defaultpriority: "high", // (optional) set notification priority, default: high
            visibility: "private", // (optional) set notification visibility, default: private
            ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
            soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            userInfo: remoteMessage.data, // (optional) default: {} (using null throws a JSON value '<null>' error)
           
          });
        } catch (e) {
          console.log("onMessage-6-error", JSON.stringify(e));
        }
      }
    });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        "notification received : onNotificationOpenedApp : ",
        JSON.stringify(remoteMessage)
      );

      try {
        handleNavigation(remoteMessage.data, dispatch);
      } catch (e) {
        alert(e);
      }
    });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "notification received : getInitialNotification",
            JSON.stringify(remoteMessage)
          );

          //this.navigator.dispatch(NavigationActions.navigate({ routeName: 'StartScreen' }));

          try {
            // dispatch(notificationTerminated(remoteMessage.data));
            AsyncStorage.setItem(
              "notification",
              JSON.stringify(remoteMessage.data)
            );
            /// setAppNotificationData(remoteMessage.data);
          } catch (e) {
            console.log("Erroe in getInitialNotification", e);
          }
        }
      });
  }, []);

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      getFcmToken();
    } else {
      requestPermission();
    }
  };

  const [FCMToken, setFCMToken] = useState();

  const getFcmToken = async () => {
    const authorizationStatus = await messaging().requestPermission();
    await messaging().registerDeviceForRemoteMessages();
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("fcm token: " + fcmToken);
      AsyncStorage.setItem("FCMToken", fcmToken);
      setFCMToken(fcmToken);
      // user has a device token
    } else {
      // user doesn't have a device token yet
    }
  };

  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      getFcmToken();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <NavigationContainer ref={navigationRef} linking={linking}>
          <Stack.Navigator>
            <Stack.Screen
              name="SplashNavigator"
              component={SplashNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="AuthStack"
              component={AuthStack}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="DrawerNavigator"
              component={DrawerNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
};
export default App;
