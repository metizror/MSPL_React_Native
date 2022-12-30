import {
  appleAuth,
  appleAuthAndroid,
} from "@invertase/react-native-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AccessToken,
  AuthenticationToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  Settings,
} from "react-native-fbsdk-next";
import { v4 as uuid } from "uuid";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import { PrimaryButton } from "../../components/PrimaryButton";
import colors from "../../theme/colors";
import Fonts from "../../theme/Fonts";
import Icons from "../../theme/Icons";
import jwt_decode from "jwt-decode";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";

import {
  checkAppleLoginApiCall,
  checkFacebookLoginApiCall,
  checkGoogleLoginApiCall,
} from "../../redux/services/ApiService";
import { saveLoginData } from "../../Utils/Helper";
import FontSize from "../../theme/FontSize";
import { moderateScale } from "../../components/scalling";
import { strings } from "../../Localization/string";

const { width, height } = Dimensions.get("window");

const LaunchScreen = ({ navigation }) => {
  const [fbAccessToken, setFbAccessToke] = useState();
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    Settings.initializeSDK();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem("onBording", "true");
  });

  const LoginwithFB = async () => {
    LoginManager.setLoginBehavior("web_only");

    try {
      await LoginManager.logOut();
      const result = await LoginManager.logInWithPermissions(
        ["email", "public_profile"],
        "limited",
        "my_nonce"
      );
      console.log("Result==>", JSON.stringify(result));
      if (result) {
        setFbAccessToke(result);
        if (Platform.OS === "ios") {
          const result = await AuthenticationToken.getAuthenticationTokenIOS();
          console.log("FBB", result);
          var data = jwt_decode(result.authenticationToken);

          console.log("decoded", data);
          checkFacebookLogin(data);
         
        } else {
          const result = await AccessToken.getCurrentAccessToken();

          console.log(result);
          const infoRequest = new GraphRequest(
            "/me",
            {
              parameters: {
                fields: {
                  string: "email,name,first_name,middle_name,last_name", // what you want to get
                },
              },
            },
            _responseInfoCallback
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  //Create response callback.
  function _responseInfoCallback(error, result) {
    if (error) {
      console.log("Error fetching data: ", error);
    } else {
      console.log("Success fetching data: ", result);
      const { name } = result;
      const splitName = name.split(" ");

      checkFacebookLogin(result);

      // navigation.navigate("AccountTypeScreen", {
      //   data: result,
      //   type: "Facebook",
      // });
    }
  }

  const onAppleButtonPressIOS = async () => {
    return appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then((appleAuthRequestResponse) => {
        console.log(
          "appleAuthRequestResponse",
          JSON.stringify(appleAuthRequestResponse)
        );
      
        if (!appleAuthRequestResponse.identityToken) {
          //console.log('Apple Sign In Faield');
          throw "Apple Sign-In failed - no identify token returned";
        }

        // Create a Firebase credential from the response
        const { identityToken, nonce, email, fullName } =
          appleAuthRequestResponse;
        if (identityToken) {
          console.log(identityToken);

          // Sign the user in with the credential
          const appleCredential = auth.AppleAuthProvider.credential(
            identityToken,
            nonce
          );
          auth().signInWithCredential(appleCredential);
          var data = jwt_decode(identityToken);
          console.log("Apple Data IOS Click", data);
          checkAppleLogin(data);

          // navigation.navigate("AccountTypeScreen", {
          //   data: data,
          //   type: "Apple",
          // });
        } else {
          console.log("loginWithApple no token - failed sign-in");
        }
      });
  };

  const AndroidonAppleButtonPress = async () => {
    const rawNonce = uuid();
    const state = uuid();
    appleAuthAndroid.configure({
      // The Service ID you registered with Apple
      clientId: "",
      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      redirectUri: "",
      // The type of response requested - code, id_token, or both.
      responseType: appleAuthAndroid.ResponseType.ALL,
      // The amount of user information requested from Apple.
      scope: appleAuthAndroid.Scope.ALL,
      // Random nonce value that will be SHA256 hashed before sending to Apple.
      nonce: rawNonce,
      // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
      state,
    });

    // Open the browser window for user sign in
    const response = await appleAuthAndroid.signIn();
    if (!response.id_token) {
      console.log("Apple Sign In Faield");
      throw "Apple Sign-In failed - no identify token returned";
    }

    const { id_token, nonce, email, name } = response;

    const appleCredential = auth.AppleAuthProvider.credential(id_token, nonce);
    console.log("appleCredential" + JSON.stringify(appleCredential));

    auth().signInWithCredential(appleCredential);

    var data = jwt_decode(appleCredential.token);
    console.log("Apple Data", data);
    checkAppleLogin(data);

    // navigation.navigate("AccountTypeScreen", {
    //   data: data,
    //   type: "Apple",
    // });
  };

  const LoginwithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      // console.log("User Info --> ", userInfo);

      const { accessToken, idToken } = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
      );
      await auth().signInWithCredential(credential);

      console.log("Token", idToken);
      var data = jwt_decode(idToken);
      console.log("Google Data ", data);
      checkGoogleLogin(data);
      // navigation.navigate("AccountTypeScreen", {
      //   data: data,
      //   type: "Google",
      // });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert(t("cancelled"));
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        Alert.alert(t("in_progress"));
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert(t("play_services_not_available_or_outdated"));
      } else {
        // some other error happened
        Alert.alert(t("somethin_went_wrong"), error.toString());
      }
    }
  };
  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/contacts.readonly",
      ], // [Android] what API you want to access on behalf of the user, default is email and profile
      webClientId:
        "", // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: "", // specifies a hosted domain restriction
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: "", // [Android] specifies an account name on the device that should be used

      iosClientId:
        "", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
      openIdRealm: "", // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
      profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    });
    _isSignedIn();
  }, []);

  const _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      // alert('User is already signed in');
      //Get the User details as user is already signed in
      _getCurrentUserInfo();
    } else {
    }
  };

  const _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setUserInfo(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert(t("user_has_not_signed_in_yet"));
      } else {
        alert(t("something_went_wrong_unable_to_get_user_info"));
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  const checkFacebookLogin = async (data) => {
    console.log("Check Data==>", data);
    const param = new FormData();
    param.append("facebook_token", Platform.OS == "ios" ? data.sub : data.id);

    setLoading(true);
    checkFacebookLoginApiCall(param)
      .then((res) => {
        setLoading(false);
        console.log("Check Login Res to Business Account====>", res);
        if (res.success) {
          console.log("Check FB SUCCESS====>", res);
          storeProfileDta(res.data);
        } else {
          navigation.navigate("AccountTypeScreen", {
            data: data,
            type: "Facebook",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const checkGoogleLogin = async (data) => {
    console.log("Check Data Google==>", data.email);
    const param = new FormData();
    param.append("email", data.email);
    console.log(param);
    setLoading(true);
    checkGoogleLoginApiCall(param)
      .then((res) => {
        setLoading(false);
        console.log("Check Login Res Google====>", res);
        if (res.success) {
          console.log("Check Google SUCCESS====>", res);
          storeProfileDta(res.data);
        } else {
          navigation.navigate("AccountTypeScreen", {
            data: data,
            type: "Google",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const checkAppleLogin = async (data) => {
    console.log("Check Data Google==>", data.email);
    const param = new FormData();
    param.append("email", data.email);
    console.log(param);
    setLoading(true);
    checkAppleLoginApiCall(param)
      .then((res) => {
        setLoading(false);
        console.log("Check Login Res Apple====>", res);
        if (res.success) {
          console.log("Check Apple SUCCESS====>", res);
          storeProfileDta(res.data);
        } else {
          navigation.navigate("AccountTypeScreen", {
            data: data,
            type: "Apple",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  async function storeProfileDta(data) {
    await saveLoginData(data, data.role, "login");
    navigation.replace("DrawerNavigator");
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header isShowBackButton={false} isShowCart={false}></Header>
      <Loader loading={loading} />

      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.white,
            paddingHorizontal: 30,
            marginTop: moderateScale(30),
          }}
        >
       

          <CustomText
            style={{
              fontSize: FontSize.FONT_BIG_24,
              textAlign: "center",
              color: colors.primary,
              marginVertical: moderateScale(30),
              fontWeight: "700",
              fontFamily: Fonts.Helvetica,
            }}
          >
            {t("welcome_to_la_subasta")}
          </CustomText>
          <PrimaryButton
            onPress={() => {
              navigation.navigate("SignInScreen");
            }}
            title={t("sign_in")}
          ></PrimaryButton>
          <PrimaryButton
            onPress={() => {
              navigation.navigate("AccountTypeScreen");
            }}
            title={t("create_account")}
          ></PrimaryButton>

          <CustomText
            style={{
              fontSize: FontSize.FONT_MEDIUM,
              alignSelf: "center",
              color: colors.black,
              marginTop: moderateScale(26),
              fontWeight: "400",
              // marginBottom: 10,

              fontFamily: Fonts.Helvetica,
            }}
          >
            {t("or")}
          </CustomText>

          <PrimaryButton
            iSource={Icons.ic_apple}
            buttonStyle={{ backgroundColor: "rgba(0, 0, 0, 1)" }}
            onPress={() => {
              if (Platform.OS == "ios") {
                onAppleButtonPressIOS();
              } else {
                AndroidonAppleButtonPress();
              }
            }}
            title={t("sign_in_with_apple")}
          ></PrimaryButton>

          <PrimaryButton
            iSource={Icons.ic_facebook}
            buttonStyle={{ backgroundColor: "rgba(60, 102, 196, 1)" }}
            onPress={() => {
              LoginwithFB();
            }}
            title={t("sign_in_with_facebook")}
          ></PrimaryButton>

          <PrimaryButton
            iSource={Icons.ic_google}
            buttonStyle={{ backgroundColor: "rgba(207, 67, 50, 1)" }}
            onPress={() => {
              LoginwithGoogle();
            }}
            title={t("sign_in_with_google")}
          ></PrimaryButton>

          <TouchableOpacity
            onPress={() => navigation.navigate("TermsOfServiceScreen")}
          >
            <CustomText
              style={{
                fontSize: FontSize.FONT_MEDIUM,
                alignSelf: "center",
                color: colors.primary,
                marginTop: 20,
                fontWeight: "400",
                fontFamily: Fonts.Helvetica,
              }}
            >
              {t("terms_of_service")}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={
              () => navigation.navigate("PrivacyPolicyScreen")
              // _onSetLanguageToItalian()
            }
          >
            <CustomText
              style={{
                fontSize: FontSize.FONT_MEDIUM,
                alignSelf: "center",
                color: colors.primary,
                marginTop: 10,
                fontWeight: "400",
                fontFamily: Fonts.Helvetica,
              }}
            >
              {t("privacy_policy")}
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LaunchScreen;
