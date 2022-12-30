import { useIsFocused } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/routers";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { getMyChatList } from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { useTranslation } from "react-i18next";
import { userDataKey } from "../../Utils/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { moderateScale } from "../../components/scalling";

const { width, height } = Dimensions.get("window");

const ChatListScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [arrayholder, setArrayholder] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [mSenderId, setSenderId] = useState(0);
  const [alertMessage, showAlertMessage] = useState("");
  const { t } = useTranslation();

 const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getChatList();
      getSenderID()
    }
  }, [isFocused]);
  const getChatList = () => {
    setLoading(true);
    getMyChatList()
      .then((res) => {
        setLoading(false);
        console.log("ChatList====>", res);
        if (res.success) {
          setChatList(res.data);
          setArrayholder(res.data);
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
  const [text, setText] = useState("");
  const searchData = (text) => {
    const newData = arrayholder.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setChatList(newData);
    setText(text);
  };
  const getSenderID = async () => {
    setSenderId( await AsyncStorage.getItem(userDataKey.ID));
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
        backIconColor={false}
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
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={styles.searchSection}>
            <Image source={Icons.ic_search}></Image>
            <TextInput
              style={styles.input}
              placeholder={t("search")}
              value={text}
              placeholderTextColor={"rgba(203, 203, 203, 1)"}
              onChangeText={(value) => searchData(value)}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          flex: 1,
        }}
      >
        {chatList.length === 0 ? (
        <View style={{flex:1, alignItems:'center', justifyContent:'center' }}>
        <CustomText
          style={{
            fontSize: moderateScale(30),
            color: colors.primary,
            textAlign: "center",
          
          }}
        >
          {t("no_data_found")}
        </CustomText>
        </View>
        ) : (
          <FlatList
          showsVerticalScrollIndicator={false}
            data={chatList}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("ChatDetailsScreen", {
                    receiver: item,
                    mSenderId:mSenderId,

                  })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    marginBottom: chatList.length - 1 == index ? 40 : 0,
                    paddingVertical: 5,
                    alignItems:'center',
                    backgroundColor:item?.unreadCount > 0 ? "#faf3e8": colors.white,
                    borderBottomColor:colors.grey,
                    borderBottomWidth:0.7

                  }}
                >
                  <Image
                    style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                    source={{
                      uri: item.photoPath,
                    }}
                  ></Image>

                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <CustomText
                      style={{ marginTop: 0, fontWeight: "700", fontSize: 14 }}
                    >
                      {item.name}
                    </CustomText>
                    <CustomText style={{ marginTop: 0, fontSize: 12 ,fontWeight:item?.unreadCount > 0 ?'700':'400'}}>
                      {item.last_chat_message}
                    </CustomText>
                    <CustomText
                      style={{ marginTop: 0, fontSize: 12, color: colors.grey ,fontWeight:item?.unreadCount > 0 ?'700':'400'}}
                    >
                      {item.last_chat_date_time}
                    </CustomText>
                  </View>
                  {item?.unreadCount>0 && (

                  <View
                    style={{
                      marginLeft: 10,
                      marginRight: 10,
                      height:30,
                      width:30,
                      borderRadius:15,
                      justifyContent: "center",
                      alignContent:'center',
                      backgroundColor:colors.primary
                    }}
                  >
                   <CustomText
                      style={{ marginTop: 0, fontSize: 10, color: colors.white, textAlign:'center', fontWeight:'700' }}
                    >
                      {item?.unreadCount}
                    </CustomText>
                  </View>
                  )}

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

export default ChatListScreen;

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
});
