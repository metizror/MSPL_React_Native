import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image, Linking,
  LogBox,
  Platform, StyleSheet,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import Item from "../../components/Item";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ViewHeader } from "../../components/ViewHeader";
import {
  addRemoveFavorite,
  addRemoveUserFavorite,
  getUserById,
  getUserListing
} from "../../redux/services/ApiService";
import Icons from "../../theme/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userDataKey } from "../../Utils/Constant";
import ItemSameSize from "../../components/ItemSameSize";

const { width, height } = Dimensions.get("window");
LogBox.ignoreAllLogs();
const ViewUser = ({ navigation, route }) => {
  const user = route.params.user;
  console.log("User===>", user);
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [isLoading, setLoading] = useState(false);
  const [isUserFavorite, setIsUserFavorite] = useState(0);
  const [listData, setListData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const data = useSelector((state) => state.viewItemReducer.data.list);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    if (isFocused) {
      getItem();
      getUser();
      console.log("ViewUser : params : ", user);
      var mAddress = [];
      if (user.street_address != null) {
        mAddress.push(user.street_address);
      }
      if (user.city != null) {
        mAddress.push(user.city);
      }
      if (user.state != null) {
        mAddress.push(user.state);
      }
      var strAddress = mAddress.join(", ");
      setUserAddress(strAddress);
    }
    getUserRole();
  }, [isFocused]);

  const getUserRole = async () => {
    setUserId(await AsyncStorage.getItem(userDataKey.ID));

  };

  const numOfColumns = 2;
  const formatData = (list) => {
    if (numOfColumns > 0) {
      const numberOfFullRows = Math.floor(list.length / numOfColumns);
      let numberOfElementsLastRow =
        list.length - numberOfFullRows * numOfColumns;
      while (
        numberOfElementsLastRow !== numOfColumns &&
        numberOfElementsLastRow !== 0
      ) {
        list.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
      }
    }
    return list;
  };

const getItem = async () => {
    setLoading(true);
    getUserListing("", user.id)
      .then((res) => {
        setLoading(false);
        console.log("----getUserListing ", res);
        if (res.success) {
          setListData(res.data);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage(error.message);
        setShowAlert(true);
        console.log("----getUserListing error", error);
      });
  };



  const getUser = async () => {
    setLoading(true);
    getUserById(user.id)
      .then((res) => {
        setLoading(false);
        console.log("----getUser ", res);
        if (res.success) {
          setIsUserFavorite(res.data.user_favorite);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage(error.message);
        setShowAlert(true);
        console.log("----getUserListing error", error);
      });
  };

  const renderItem = ({ item, index }) => {
    return (
      <ItemSameSize
      
        showCategoryDetails={true}
        index={index}
        item={item}
        onPressItem={() => {
          navigation.navigate("ViewItemUser", {
            itemId: item.id,
          });
        }}
        onPresswishItem={() => {
          AddOrRemovewishList(item, index);
        }}
      />
    );
  };

  const AddOrRemovewishList = (item, index) => {
    const param = new FormData();
    param.append("listing_id", item.id);
    setLoading(true);
    addRemoveFavorite(param)
      .then((res) => {
        console.log("----getListing ", res);
        if (res.success) {
          listData[index].favorite = item.favorite != 1 ? 1 : 0;

          let pos = data.findIndex((el) => el.id === item.id);
          data[pos] = {
            ...data[pos],
            favorite: item.favorite,
          };

          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const renderFooterNew = () => {
    return <View style={{ height: 35, backgroundColor: "transparent" }}></View>;
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <ViewHeader
          onBack={() => navigation.goBack()}
          mainStyle={{ marginBottom: -15, marginTop: -10 }}
          onClickFavorite={() => {
            console.log("onClick Favorite");

            setLoading(true);
            const param = new FormData();
            param.append("favorite_user_id", "" + user.id);

            addRemoveUserFavorite(param)
              .then((res) => {
                if (res.success) {
                  getUser();
                }
              })
              .catch((error) => {
                setLoading(false);
                setAlertMessage(error.message);
                setShowAlert(true);
              });
          }}
          favorite={isUserFavorite}
        ></ViewHeader>
        <Loader loading={isLoading} />
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
            paddingHorizontal: 20,
            borderRadius: 20,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              justifyContent: "center",
              marginTop: -60,
            }}
          >
            <Image
              style={{
                height: 120,
                width: 120,
                borderColor: "#FFFFFF",
                borderWidth: 3,
                borderRadius: 60,
              }}
              source={{
                uri:
                  user.role == "business_user"  ||  user.role == "business_user_pro"
                    ? user.store_logo_path
                    : user.photo,
              }}
            ></Image>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 5,
              }}
            >
              <Image
                style={{
                  height: 12,
                  width: 12,
                }}
                source={Icons.ic_like}
                resizeMode={"contain"}
              ></Image>
              <CustomText style={{ fontSize: 14, marginTop: 0, marginLeft: 5 }}>
                {user.like_count}
              </CustomText>
            </View>
          </View>

          <CustomText
            style={{
              fontWeight: "700",
              fontSize: 18,
              textAlign: "center",
              marginTop: 0,
            }}
          >
            {user.name}
          </CustomText>
          <CustomText
            style={{
              fontWeight: "400",
              fontSize: 12,
              textAlign: "center",
              marginTop: 0,
            }}
          >
            {userAddress}
          </CustomText>
          {user.role === "business_user" || user.role === "business_user_pro" ? (
            <CustomText
              style={{
                fontWeight: "400",
                fontSize: 12,
                textAlign: "center",
                marginTop: 5,
              }}
            >
              {user?.store_description}
            </CustomText>
          ) : (
            <View></View>
          )}

          {user.hasOwnProperty("website_url") ? (
            <PrimaryButton
              buttonMarginTop={10}
              onPress={async () => {
                await Linking.openURL(user.website_url);
              }}
              title={t("visit_site")}
            ></PrimaryButton>
          ) : (
            <View></View>
          )}

          <PrimaryButton
            buttonMarginTop={10}
            onPress={() => {
              navigation.navigate("ChatDetailsScreen", {
                receiver: user,
                from:'FromViewUser',
                mSenderId:userId,
              });
            }}
            title={t("start_chat")}
          ></PrimaryButton>

          <PrimaryButton
            buttonMarginTop={10}
            onPress={async () => {
              const url = Platform.select({
                ios: `maps:0,0?q=${userAddress}`,
                android: `geo:0,0?q=${userAddress}`,
              })
              Linking.openURL(url);
            }}
            title={t("get_directions")}
          ></PrimaryButton>
        </View>

        {listData.length === 0 ? (
          <View></View>
        ) : (
          <View>
            <CustomText
              style={{
                fontWeight: "700",
                fontSize: 16,
                marginBottom: 5,
                marginTop: 15,
                marginHorizontal: 20,
              }}
            >
              {t("listings_by_this_user")}
            </CustomText>
            <FlatList
            
              style={{ marginHorizontal: 10 }}
              data={formatData(listData)}
              renderItem={renderItem}
              numColumns={2}
              keyExtractor={(item, index) => index}
              ListFooterComponent={
                listData?.length > 0 ? renderFooterNew : null
              }
            />
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ViewUser;

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
});
