import { useIsFocused } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/routers";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  LogBox,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { AlertView } from "../components/AlertView";
import CustomText from "../components/CustomText";
import { Header } from "../components/Header";
import Loader from "../components/Loader";
import {
  getNotificationApi,
  notificationCall,
  readNotificationApi,
} from "../redux/services/ApiService";
import colors from "../theme/colors";
import Icons from "../theme/Icons";
const { width, height } = Dimensions.get("window");
import { useTranslation } from "react-i18next";
import { clearNotificationData } from "../redux/action/action";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryButton } from "../components/PrimaryButton";

LogBox.ignoreAllLogs();
const NotificationScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, showAlertMessage] = useState("");
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  var data = useSelector((state) => state.notificationReducer.data.list);
  var isLoad = useSelector((state) => state.notificationReducer.data.isLoading);

  const dispatch = useDispatch();


  console.log("Checking the Data",data);
  var next_page_url = useSelector(
    (state) => state.notificationReducer.data.next_page_url
  );

  var intialUrl = "notification?rpage=1";




  const getViewItemwithRedux1 = async () => {
    dispatch(clearNotificationData());
    
    dispatch(notificationCall(intialUrl));
  };

  const getViewItemwithRedux2 = async () => {
    var fields = next_page_url.split("api/");
    var finalUrl = fields[1];
    console.log("Final Url", finalUrl);
    dispatch(notificationCall(finalUrl));
  };

  useEffect(() => {
  
    if (data.length === 0) {
      getViewItemwithRedux1();
    }
  }, []);
  const getNotification = () => {
    setLoading(true);

    getNotificationApi()
      .then((res) => {
        setLoading(false);

        console.log("Notification====>", res);
        if (res.success) {
          setNotificationList(res.data);
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

  const renderFooterNew = () => {
    return (
      //Footer View with Load More button

      <View style={styles.footer}>
        {next_page_url != "" && (
          <PrimaryButton

            title={t("click_here_to_view_more")}
            onPress={() => {
              if (next_page_url != "") {
                getViewItemwithRedux2();
              } else {
                showAlertMessage(t("no_more_data_found"));
                setShowAlert(true);
              }
            }}
          ></PrimaryButton>
        )}
      </View>
    );
  };


  const readNotification = (type ,id, item,index) => {
    const param = new FormData();
    param.append("notification_id", id);

    setLoading(true);

    readNotificationApi(param)
      .then((res) => {
        setLoading(false);
        data[index].is_read = 1;
        console.log("NotificationRead====>", res);
        if (res.success) {
          if (type == 2) {
            navigation.navigate("HomeStackNavigator", {
              screen: "ContactUsScreen",
            });
          }
    
          if (type == 3) {
            navigation.navigate("HomeStackNavigator", {
              screen: "ViewItems",
            });
          } else if (type == 4) {
    
            navigation.navigate("DrawerNavigator", {
              screen: "EditListingScreen",
              params: { listingId: item?.listing_id, role: item?.role },
            });
          } else if (type == 5) {
            navigation. navigate("MessagesStackNavigator", {
              screen: "ChatDetailsScreen",
              params: { receiver: item },
            });
          } else if (type == 6) {
            navigation.navigate("Subscription", {
              screen: "Subscription",
            });
          
        
          }
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

  //3 = chat screen
  //2 =  Contact Us

  const reDirectFromNotificationType = (type, item,index) => {
    console.log("AVE cheeeee", item);
    if (item.is_read == 0) {
      readNotification(type,item.id, item, index);
    } else {
      if (type == 2) {
        navigation.navigate("HomeStackNavigator", {
          screen: "ContactUsScreen",
        });
      }

      if (type == 3) {
        navigation.navigate("HomeStackNavigator", {
          screen: "ViewItems",
        });
      } else if (type == 4) {

        navigation.navigate("DrawerNavigator", {
          screen: "EditListingScreen",
          params: { listingId: item?.listing_id, role: item?.role },
        });
      } else if (type == 5) {
        navigation. navigate("MessagesStackNavigator", {
          screen: "ChatDetailsScreen",
          params: { receiver: item },
        });
      } else if (type == 6) {
        navigation.navigate("HomeStackNavigator", {
          screen: "Subscription",
        });
      
    
      }
    }
  };

  
  return (
    <View style={styles.container}>
      <Header
        isShowCart={true}
        showDrawer={true}
        onBack={() => navigation.goBack()}
        onCartClick={() => {
          navigation.navigate("NotificationScreen");
        }}
        openDrawer={() => navigation.dispatch(DrawerActions.openDrawer())}
        backIconColor={true}
      ></Header>
      <Loader loading={isLoad} />

      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => setShowAlert(false)}
      ></AlertView>

      <View
        style={{
          marginHorizontal: 10,
          flex: 1,
        }}
      >
        <CustomText
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: colors.primary,
            textAlign: "center",
            letterSpacing: 1, 
            
          }}
        >
          {t('notification')}
        </CustomText>
        {data.length === 0 ? (
          <View></View>
        ) : (
          <FlatList
            data={data
            }
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.1}
            enableEmptySections={true}
            style={{ flex: 1, marginTop: 10 }}
            ListFooterComponent={data.length > 0 ? renderFooterNew : null}

            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => reDirectFromNotificationType(item.type, item, index )}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    marginBottom: notificationList.length - 1 == index ? 30 : 0,
                    paddingVertical: 10,
                    backgroundColor:
                      item.is_read == 1 ? colors.white : "#faf3e8",
                  }}
                >
                  {item.photo_path != null ? (
                    <Image
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 35 / 2,
                      }}
                      source={{ uri: item.photo_path }}
                    ></Image>
                  ) : (
                    <Image
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 35 / 2,
                      }}
                      source={Icons.ic_demo}
                    ></Image>
                  )}

                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <CustomText
                      style={{
                        marginTop: 0,
                        fontWeight: "700",
                        fontSize: 14,
                        lineHeight: 20,
                        textAlign: "justify",
                        marginRight: 10,
                      }}
                    >
                      {item.title}
                    </CustomText>

                    <CustomText
                      style={{ marginTop: 0, fontSize: 12, color: colors.grey }}
                    >
                      {item.created_at}
                    </CustomText>
                  </View>

                  <View
                    style={{
                      marginLeft: 10,
                      marginRight: 10,
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <Image source={Icons.ic_right_arrow}></Image>
                  </View>
                </View>
              </Pressable>
            )}
            numColumns={1}
            keyExtractor={(item, index) => index}
          />
        )}
      </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    marginLeft: 10,
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
  footer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 40,
  },
});
