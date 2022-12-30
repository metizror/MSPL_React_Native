import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions } from "@react-navigation/routers";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image, KeyboardAvoidingView, LogBox,
  Pressable,
  StyleSheet, TextInput, View
} from "react-native";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { verticalScale } from "../../components/scalling";
import {
  getSMSApiCall,
  sendSMSApiCall
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Fonts from "../../theme/Fonts";
import Icons from "../../theme/Icons";
import { userDataKey } from "../../Utils/Constant";
const { width, height } = Dimensions.get("window");
LogBox.ignoreAllLogs();
const ChatDetailsScreen = ({ navigation, route }) => {
  const [senderId, setSenderId] = useState("");
  const [selectedMsg, setSelectedMsg] = useState("");
  const receiver = route.params.receiver;
  console.log("receiver : ", receiver);
  const [sms, setSMS] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [smsList, setSmsList] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { t } = useTranslation();


  const sendSMS = async () => {
    if (sms == "") {
      showAlertMessage(t("please_enter_msg"));
      setShowAlert(true);
    } else {
      const param = new FormData();
      param.append("message", sms);
      param.append("receiver_id", receiver.id);
      console.log("params", JSON.stringify(param));
      sendSMSApiCall(param)
        .then((res) => {
          console.log("SENDSMS====>", res);
          if (res.success) {
            setSMS("");
            getSMSList();
          } else {
            showAlertMessage(res.message);
            setShowAlert(true);
          }
        })
        .catch((error) => {
         
          showAlertMessage(error.message);
          setShowAlert(true);
        });
    }
  };


  const getSMSList = async () => {
    setLoading(true);
    const mSenderId = await AsyncStorage.getItem(userDataKey.ID);
    setSenderId(mSenderId);
    console.log("senderId : ", mSenderId);
    getSMSApiCall(receiver.id)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          const mTempData = res.data;

          var mDate = {};
          for (let i = 0; i < mTempData.length; i++) {
            const mItem = mTempData[i];
            mDate[mItem.created_at] = mItem.created_at;
          }
          const mKeys = Object.keys(mDate);

          var mNewData = {};
          for (let i = 0; i < mKeys.length; i++) {
            const mKey = mKeys[i];

            const filterResult = mTempData.filter(
              (itemList) => itemList.created_at == mKey
            );

            mNewData[mKey] = filterResult;
          }
          console.log("unique dates : ", mDate);
          console.log("all data : ", mNewData);
          console.log("all data length : ", Object.keys(mNewData).length);
          if (Object.keys(mNewData).length > 0) {
            console.log("---true");
            setSmsList(mNewData);
         
          }
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

  useEffect(() => {
    getSMSList();
  }, []);

  

  return (
    <View style={styles.container}>
      <Header
        isShowCart={true}
        showDrawer={true}
        onBack={() => navigation.goBack()}
        onCartClick={() => {
          navigation.navigate("NotificationScreen");
        }}
        title={receiver.name}
        openDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
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

      <FlatList
        data={[]}
        renderItem={null}
        listKey={(item, index) => "D" + index.toString()}
        ListHeaderComponent={
          <>
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Image
                style={{ width: 75, height: 77, borderRadius: 75 }}
                source={{
                  uri:
                    receiver.hasOwnProperty("role") &&
                    receiver.role == "business_user"
                      ? receiver.store_logo_path
                      : receiver.hasOwnProperty("role") &&
                        receiver.role != "business_user"
                      ? receiver.photo
                      : receiver.photoPath,
                }}
              ></Image>
              {receiver.hasOwnProperty("business_name") ? (
                <View style={{ alignItems: "center" }}>
                  <CustomText>
                    {t("this_chat_was_created_about_your_listing")}
                  </CustomText>
                  <CustomText
                    style={{ marginTop: 8, fontWeight: "700", fontSize: 14 }}
                  >
                    {receiver.business_name}
                  </CustomText>
                </View>
              ) : (
                <View></View>
              )}

              <View
                style={{
                  height: 5,
                  width: 55,
                  marginTop: 10,
                }}
              ></View>
            </View>

            <View
              style={{ height: 2, backgroundColor: "#F9F9F9", marginTop: 25 }}
            ></View>

            {Object.keys(smsList).length === 0 ? (
              <View></View>
            ) : (
              <View>
                <View style={{ marginTop: 10, marginHorizontal: 10 }}>
                
                  {Object.keys(smsList).map((value, index, array) => (
                    <View>
                      <View style={{ alignItems: "center", marginTop: 10 }}>
                        <CustomText
                          style={{
                            fontWeight: "700",
                            marginTop: 0,
                            fontSize: 14,
                          }}
                        >
                          {value}
                        </CustomText>
                      </View>
                      <FlatList
                        data={smsList[value]}
                        //data={smsList[value].reverse()}
                        inverted
                        contentContainerStyle={{
                          flexGrow: 1,
                          justifyContent: "flex-end",
                        }}
                        initialScrollIndex={smsList[value].length - 1}
                        style={{ marginBottom: 20 }}
                        renderItem={({ item }) => (
                          <View>
                            {item.sender_id == senderId ? (
                              <View
                                style={{
                                  alignSelf: "flex-end",
                                  alignItems: "flex-end",
                                  marginRight: 10,
                                  flex: 0.7,
                                  backgroundColor: colors.primary,
                                  borderRadius: 10,
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                  marginTop: 5,
                                  marginBottom: 5,
                                }}
                              >
                                <CustomText
                                  style={{
                                    marginTop: 0,
                                    fontSize: 14,
                                    color: "white",
                                  }}
                                >
                                  {item.message}
                                </CustomText>
                              </View>
                            ) : (
                              <View
                                style={{ flexDirection: "row", margin: 10 }}
                              >
                                <Pressable
                                  onPress={() => {
                                    setSelectedMsg(item);
                                    setShowReviewModal(!showReviewModal);
                                  }}
                                >
                                  <Image
                                    style={{
                                      width: 27,
                                      height: 27,
                                      borderRadius: 27 / 2,
                                      marginTop: 5,
                                      marginBottom: 5,
                                    }}
                                    source={{
                                      uri: item.receiver_photo_path,
                                    }}
                                  ></Image>
                                </Pressable>

                                <View
                                  style={{
                                    marginLeft: 10,
                                    flex: 0.7,
                                    backgroundColor: "#F6F6F6",
                                    borderRadius: 10,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    marginTop: 5,
                                    marginBottom: 5,
                                  }}
                                >
                                  <CustomText
                                    style={{ marginTop: 0, fontSize: 14 }}
                                  >
                                    {item.message}
                                  </CustomText>
                                </View>
                              </View>
                            )}
                          </View>
                        )}
                        numColumns={1}
                        keyExtractor={(item, index) => index}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
        style={{ width: "100%" }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            paddingVertical: 20,
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              textAlignVertical: "center",
              flex: 1,
              fontSize: 16,
              fontFamily: Fonts.Helvetica,
              fontWeight: "400",
              color: colors.black,
              borderRadius: 10,
              borderColor: colors.black,
              borderWidth: 1,
              marginRight: 15,
              paddingLeft: 10,
              paddingRight: 10,
              height: verticalScale(80),
              alignItems: "center",
            }}
            multiline={false}
            maxLength={100}
            secureTextEntry={false}
            placeholder={t("send_message")}
            placeholderTextColor={"rgba(203, 203, 203, 1)"}
            value={sms}
            onChangeText={(value) => setSMS(value)}
          ></TextInput>

          <PrimaryButton
            buttonStyle={{
              marginTop: 0,
              height: verticalScale(80),
              flex: 0.28,
            }}
            onPress={() => sendSMS()}
            iSource={Icons.ic_arrow_rigth}
          ></PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  imageStyle: {
    height: 120,
    width: "100%",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  backContainer: {
    justifyContent: "center",
    width: height * 0.035,
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
 
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    height: 55,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 0,
    color: "#424242",
    borderWidth: 0,
    marginTop: 0,
  },

  rejectCard: {
    borderRadius: 5,
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  profileimage: {
    borderRadius: 125 / 2,
    width: 40,
    height: 40,
  },

  rejectListTitle: {
    fontSize: 10,
    lineHeight: 14,
  },

  rejectListSubTitle: {
    textAlign: "right",
    fontSize: 10,
    marginTop: 0,
    lineHeight: 14,
  },
});
