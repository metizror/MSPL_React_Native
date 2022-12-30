import { DrawerActions } from "@react-navigation/routers";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  LogBox,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import ModalReview from "../../components/ModalReview";
import ModelConfirmationDialog from "../../components/ModelConfirmationDialog";
import { PrimaryButton } from "../../components/PrimaryButton";
import { moderateScale, verticalScale } from "../../components/scalling";
import {
  addUpdatePopularity,
  getSMSApiCall,
  sendSMSApiCall,
  soldOutItemApiCall,
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Fonts from "../../theme/Fonts";
import Icons from "../../theme/Icons";
const { width, height } = Dimensions.get("window");
LogBox.ignoreAllLogs();
const ChatDetailsScreen = ({ navigation, route }) => {
  const [selectedMsg, setSelectedMsg] = useState("");
  let listingId = 0;
  let receiver = null;
  let user_id = 0;
  let mSenderId = 0;
  
  if (route.params !== undefined) {
    if (route.params.from !== undefined) {
      if (route.params.from=='ListingChat'){
      receiver = route.params.receiver;
      user_id =  route.params.receiver.user_id;
      listingId = route.params.receiver.id;
      console.log("Receiver=====>" ,1);

      } else if(route.params.from=='FromViewUser'){
        receiver = route.params.receiver;
        user_id = route.params.receiver.id;
        listingId = 0;
        console.log("Call1=====>" ,user_id);
      }
      else {
        receiver = route.params.receiver;
        user_id = route.params.receiver.user_id;
        listingId = 0;
        console.log("Call1=====>" ,user_id);
      }
      console.log("Call2=====>" ,receiver);
    } 
    
    else {
      console.log("Call3=====>" ,3);
      receiver = route.params.receiver;
      user_id = route.params.receiver.user_id;
      if (route.params.receiver.listing_id != "undefined") {
        listingId = route.params.receiver.listing_id;
      }
    }
  }

  if (route.params.mSenderId !== undefined) {
    mSenderId = route.params.mSenderId;
    console.log("Vipul1", route.params.mSenderId);
  }
  console.log("Receiver123=====>" ,receiver);
  const [sms, setSMS] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [smsList, setSmsList] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [listingImage, setListingImage] = useState(null);
  const [listingName, setListingName] = useState(null);
  const [loginUserID, setLoginUserID] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      getSMSListwithoutLoader();
    }, 5000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  const sendSMS = async () => {
    if (sms == "") {
      showAlertMessage(t("please_enter_msg"));
      setShowAlert(true);
    } else {
      const param = new FormData();
      param.append("message", sms);
      param.append("receiver_id", user_id);
      if (listingId != null) {
        param.append("listing_id", listingId);
      }
      console.log("Chat Params", JSON.stringify(param));
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
          console.log("userGetDealerships Error", error);
          showAlertMessage(error.message);
          setShowAlert(true);
        });
    }
  };

  const getSMSList = async () => {
    setLoading(true);
    const param = new FormData();
    param.append("listingId", listingId);
    console.log("listingId", listingId);
    console.log("receiver.id", receiver.id);
    console.log("Params", param);
    getSMSApiCall(user_id, param)
      .then((res) => {
       // console.log("Chat Details Res==>", res);
        if (res.success) {
          setLoading(false);

          const mTempData = res.data.messages;
          setListingImage(res.data.chatDetail.photo);
          setListingName(res.data.chatDetail.name);
          setLoginUserID(res.data.chatDetail.user_id);
          
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

  const getSMSListwithoutLoader = async () => {
    const param = new FormData();

    param.append("listingId", listingId);
    getSMSApiCall(user_id, param)
      .then((res) => {
        console.log("Chat Details Res==>", JSON.stringify(res));
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

          if (Object.keys(mNewData).length > 0) {
            console.log("---true");
            setSmsList(mNewData);
          }
        } else {
          showAlertMessage(res.message);
          setShowAlert(true);
        }
      })
      .catch((error) => {
        showAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  useEffect(() => {
    getSMSList();
  }, [user_id]);

  const onPressPositive = () => {
    setShowReviewModal(!showReviewModal);
    addReview("1");
  };
  const onPressNegative = () => {
    setShowReviewModal(!showReviewModal);
    addReview("0");
  };
  const onRequestClose = () => {
    setShowReviewModal(false);
  };
  const addReview = (popularity) => {
    console.log("---useEffect---1");
    setLoading(true);
    const param = new FormData();
    param.append("user_id", "" + mSenderId);
    param.append("listing_id", "" + selectedMsg.receiver_id);
    param.append("popularitie", popularity);
    addUpdatePopularity(param)
      .then((res) => {
        setLoading(false);
        console.log("----addUpdatePopularity ", res);
        if (res.success) {
          setLoading(false);
          showAlertMessage(res.message);
          setShowAlert(true);
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
    SoldItemListing();
  };

  const onPressCancel = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };
  const onRequestConfClose = () => {
    setShowConfirmationModal(false);
  };

  const SoldItemListing = async () => {
    const param = new FormData();
    param.append("listing_id", listingId);
    param.append("buyer_user_id", receiver.user_id);
    console.log("param===>", JSON.stringify(param));
 
    soldOutItemApiCall(param)
      .then((res) => {
        console.log("Sold Item Listing Response====>", res);
        if (res.success) {
          showAlertMessage(res.message);
          setShowAlert(true);
          console.log("Sold Item Listing Response123====>", res);

          receiver.listing_status=3
        } else {
          console.log("Sold Item Listing Response123122====>123", res);

          showAlertMessage(res.message);
          setShowAlert(true);
        }
      })
      .catch((error) => {
        console.log("userGetDealerships Error", error);
        showAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const RenderLogo = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <Image
          style={{ width: 75, height: 77, borderRadius: 75 }}
          source={{
            uri: listingImage,
          }}
        ></Image>
        <CustomText
          style={{
            fontWeight: "700",
            marginTop: 5,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {listingName}
        </CustomText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
            <Loader loading={isLoading} />

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

      <ModelConfirmationDialog
        title={t("are_you_sure_you_want_to_sell_this_item")}
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        onPressDelete={onPressDelete}
        onPressCancel={onPressCancel}
        onRequestClose={onRequestConfClose}
        buttonColor={colors.primary}
        onPressDeleteTitle={"Confirm"}
      ></ModelConfirmationDialog>

      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => setShowAlert(false)}
      ></AlertView>
      <ModalReview
        item={selectedMsg}
        showModal={showReviewModal}
        setShowModal={setShowReviewModal}
        onPressPositive={onPressPositive}
        onPressNegative={onPressNegative}
        onRequestClose={onRequestClose}
        name={receiver?.name}
        photo={
          receiver.hasOwnProperty("role") && receiver.role == "business_user"
            ? receiver.store_logo_path
            : receiver.hasOwnProperty("role") &&
              receiver.role != "business_user"
            ? receiver.photo
            : receiver.photoPath
        }
      ></ModalReview>

      <FlatList
        style={{ flex: 1 }}
        data={[]}
        renderItem={null}
        listKey={(item, index) => "D" + index.toString()}
        ListHeaderComponent={
          <>
            <View
              style={{
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <RenderLogo></RenderLogo>
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
              style={{ height: 2, backgroundColor: "#F9F9F9", marginTop: 20 }}
            ></View>

            {Object.keys(smsList).length != 0 && (
              <View
                style={{
                  flexGrow: 1,
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    marginTop: moderateScale(200),
                    marginHorizontal: 10,
                  }}
                >
                  {Object.keys(smsList).map((value, index, array) => (
                    <View>
                      <View
                        style={{
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
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
                        listKey={(item, index) => "D" + index.toString()}
                        renderItem={({ item }) => (
                          <View>
                            {item.sender_id == mSenderId ? (
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
                                    console.log("Itemsss", item);
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
        inverted
      />
      {receiver.listing_status == 3 && (
        <View
          style={{
            alignItems: "center",
            marginTop: 10,
            padding: 10,
            marginHorizontal: 20,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: colors.primary,
          }}
        >
          <CustomText
            style={{
              fontWeight: "400",
              marginTop: 0,
              fontSize: 14,
              color: colors.white,
            }}
          >
            {t("this_item_has_been_sold")}
          </CustomText>
        </View>
      )}
      {receiver.listing_status !== 3 ? (
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={40}
          style={{ width: "100%", alignSelf: "flex-end" }}
        >
          <View
            style={{
              paddingHorizontal: 20,
              alignItems: "center",
              flexDirection: "row",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                borderRadius: 10,
                borderColor: colors.black,
                borderWidth: 1,
                height: verticalScale(100),
                marginTop: 20,
                flex: 0.8,
                flexDirection: "row",
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontFamily: Fonts.Helvetica,
                  fontWeight: "400",
                  color: colors.black,
                }}
                multiline={false}
                maxLength={100}
                secureTextEntry={false}
                placeholder={t("send_message")}
                placeholderTextColor={"rgba(203, 203, 203, 1)"}
                value={sms}
                onChangeText={(value) => setSMS(value)}
              ></TextInput>
              {loginUserID == mSenderId && receiver.listing_status != 3 && (
                <Pressable
                  onPress={() => {
                    setShowConfirmationModal(true);
                  }}
                  style={styles.backContainer}
                >
                  <Image
                    style={{
                      height: 22,
                      width: 22,
                      tintColor: colors.primary,
                    }}
                    source={Icons.ic_shopping_bag}
                  />
                </Pressable>
              )}
            </View>
            <View style={{ flex: 0.2, marginLeft: 10 }}>
              <PrimaryButton
                buttonStyle={{ height: verticalScale(100) }}
                onPress={() => sendSMS()}
                iSource={Icons.ic_arrow_rigth}
              ></PrimaryButton>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ height: 20 }}></View>
      )}
    </View>
  );
};

export default ChatDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: "#FFFFFF",
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
    //justifyContent: 'center',
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
