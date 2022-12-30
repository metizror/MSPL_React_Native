import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image, Linking,
  LogBox,
  Platform,
  Pressable, ScrollView, StyleSheet,
  TouchableOpacity,
  View,
  Text
} from "react-native";
import FastImage from "react-native-fast-image";
import { SliderBox } from "react-native-image-slider-box";
import Share from "react-native-share";
import { useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import Item from "../../components/Item";
import ItemSameSize from "../../components/ItemSameSize";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import {
  horizontalScale,
  moderateScale,
  verticalScale
} from "../../components/scalling";
import { SomeComponent } from "../../components/SomeComponent";
import {
  addRemoveFavorite,
  getViewItemUser
} from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Fonts from "../../theme/Fonts";
import Icons from "../../theme/Icons";
import { userDataKey } from "../../Utils/Constant";
import { colourNameToHex } from "../../Utils/Helper";
const { width, height } = Dimensions.get("window");

LogBox.ignoreAllLogs();
const ViewItemUser = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(false);
  const [noOfLines, setNoOfLines] = useState(3);
  const [images, setImages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { itemId } = route.params;
  console.log("itemId : ", itemId);
  const isFocused = useIsFocused();
  const scrollRef = useRef();
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(0);
  const [userAddress, setUserAddress] = useState("");


  const [itemData, setItemData] = useState(undefined);
  const { t } = useTranslation();


useEffect(() => {
    getItem(itemId);
  }, [itemId]);

  useEffect(() => {
    if (isFocused) {
      getUserRole();
    }
  }, [isFocused]);

  const getUserRole = async () => {
    setRole(await AsyncStorage.getItem(userDataKey.Role));
    setUserId(await AsyncStorage.getItem(userDataKey.ID));

  };

  const data = useSelector((state) => state.viewItemReducer.data.list);
  const listItems = useSelector((state) => state.searchItemReducer.data.list);
  const getItem = async (id) => {
    console.log("---useEffect---1");
    setLoading(true);
    getViewItemUser("", id)
      .then((res) => {
        setLoading(false);
        console.log("----getItem ", res);
        if (res.success) {
          scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
          const mData = res.data;
          const photos = mData.photos;
          var mImages = [];

          for (let i = 0; i < photos.length; i++) {
            const mPhoto = photos[i];
            mImages.push(mPhoto.url);
          }
          setImages(mImages);
          console.log("images : ", mImages);
          setItemData(mData);

           var mAddress = [];
      if (mData.user.street_address != null) {
        mAddress.push(mData.user.street_address);
      }
      if (mData.user.city != null) {
        mAddress.push(mData.user.city);
      }
      if (mData.user.state != null) {
        mAddress.push(mData.user.state);
      }
      var strAddress = mAddress.join(", ");
      setUserAddress(strAddress);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };
 

  const shareTheProductDetails = (shareLink, description) => {
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch("GET", images[0])
      // the image is now dowloaded to device's storage
      .then((resp) => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile("base64");
      })
      .then((base64Data) => {
        // here's base64 encoded image
        var imageUrl = "data:image/png;base64," + base64Data;
        console.log("Image Url", imageUrl);
        let shareImage = {
          title: "RN_Codebase",
          message: description + "\n" + shareLink,
          url: imageUrl,
        };

        Share.open(shareImage)
          .then((res) => {
            console.log("Share res", res);
          })
          .catch((err) => {
            err && console.log(err);
          });
      
      });
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
  const renderItem = ({ item, index }) => {
    return (
      <ItemSameSize
        showCategoryDetails={true}
        index={index}
        item={item}
        onPressItem={() => {
          getItem(item.id);
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
        if (res.success) {
          itemData.similar_listing[index].favorite = item.favorite != 1 ? 1 : 0;
          let data_index = data.findIndex((el) => el.id === item.id);
          let listItems_index = listItems.findIndex((el) => el.id === item.id);
          data[data_index] = {
            ...data[data_index],
            favorite: item.favorite,
          };
          listItems[listItems_index] = {
            ...listItems[listItems_index],
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
      <Loader loading={isLoading} />
      <AlertView
        showAlert={showAlert}
        message={alertMessage}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onDismiss={() => setShowAlert(false)}
      ></AlertView>
      {itemData === undefined ? (
        <View></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
          <View>
            <SliderBox
              ImageComponent={FastImage}
              images={images}
              sliderBoxHeight={height / 2}
              onCurrentImagePressed={(index) =>
                console.warn(`image ${index} pressed`)
              }
              dotColor={colors.primary}
              inactiveDotColor={colors.white}
              paginationBoxVerticalPadding={20}
              autoplay
              circleLoop
              resizeMethod={"resize"}
              resizeMode={"cover"}
              paginationBoxStyle={{
                position: "absolute",
                bottom: 0,
                padding: 0,
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
                paddingVertical: 10,
              }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                padding: 0,
                margin: 0,
                backgroundColor: "rgba(128, 128, 128, 0.92)",
              }}
              ImageComponentStyle={{
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
              }}
              imageLoadingColor="#2196F3"
            />

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                position: "absolute",
                marginTop: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <Pressable onPress={() => navigation.goBack()}>
                  <Image
                    source={Icons.ic_back_primary}
                    style={{ width: 20, height: 20, tintColor: colors.white }}
                  />
                </Pressable>
              </View>

              <View>
                <Pressable
                  onPress={() => {
                    console.log("listing_id====>", itemData);
                    const param = new FormData();
                    param.append("listing_id", itemData.id);

                    setLoading(true);
                    addRemoveFavorite(param)
                      .then((res) => {
                        console.log("----getListing ", res);

                        if (res.success) {
                          itemData.favorite = itemData.favorite != 1 ? 1 : 0;
                          let index = data.findIndex(
                            (el) => el.id === itemData.id
                          );

                          let listItems_index = listItems.findIndex(
                            (el) => el.id === itemData.id
                          );

                          data[index] = {
                            ...data[index],
                            favorite: itemData.favorite,
                          };

                          listItems[listItems_index] = {
                            ...listItems[listItems_index],
                            favorite: itemData.favorite,
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
                  }}
                >
                  <Image
                    source={
                      itemData.favorite === 1
                        ? Icons.ic_wish_list_fill
                        : Icons.ic_wish_list_unfill
                    }
                    style={{ width: 45, height: 45 }}
                  />
                </Pressable>
                <TouchableOpacity
                  onPress={() => {
                    shareTheProductDetails(
                      itemData.share_link,
                      itemData.description
                    );
                  }}
                >
                  <Image
                    source={Icons.ic_upload}
                    style={{ width: 45, height: 45 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 12, marginTop: 10 }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CustomText
                  style={{
                    flex: 2,
                    color: colors.black,
                    fontSize: moderateScale(24),
                    fontWeight: "700",
                    marginTop: 0,
                  }}
                >
                  {itemData.name}
                </CustomText>

                <CustomText
                  style={{
                    color: colors.primary,
                    fontSize: moderateScale(34),
                    fontWeight: "700",
                    marginTop: 0,
                    textAlign: "right",
                    flex: 1,
                  }}
                >
                  {"$" + itemData.price}
                </CustomText>
              </View>

              <CustomText
                style={{
                  color: colors.grey,
                  fontSize: moderateScale(18),
                  fontWeight: "400",
                  marginTop: 1,
                }}
              >
                {itemData.category_name}
              </CustomText>

              <View
                style={{
                  backgroundColor: colors.black,
                  width: 20,
                  height: 1.5,
                  marginTop: 5,
                }}
              ></View>
            </View>
            <CustomText
              numberOfLines={noOfLines}
              style={{
                color: colors.black,
                fontSize: moderateScale(18),
                fontWeight: "400",
                marginTop: 0,
                paddingVertical: 10,
                lineHeight:18
              }}
            >
              { itemData?.description}
            </CustomText>
            {itemData.description != "" && itemData?.description.length > 100 && (
              <TouchableOpacity
                onPress={() => {
                  if (noOfLines === 3) {
                    setNoOfLines(100);
                    console.log("1");
                  } else {
                    setNoOfLines(3);
                    console.log("2");
                  }
                }}
              >
                <CustomText
                  style={{
                    color: colors.primary,
                    fontSize: moderateScale(18),
                    fontWeight: "700",
                    marginTop: 0,
                    paddingVertical: 10,
                    textDecorationLine: "underline",
                  }}
                >
                  {noOfLines === 3 ? t("more_info") : t("short_info")}
                </CustomText>
              </TouchableOpacity>
            )}
            {itemData.listing_category_detail.length === 0 ? (
              <View></View>
            ) : (
              <View>
                <CustomText
                  style={{
                    color: colors.black,
                    fontSize: moderateScale(20),
                    fontWeight: "700",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  {t("details")}
                </CustomText>

                <FlatList
                  data={itemData.listing_category_detail}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        width: "100%",
                        height: 40,
                        borderTopLeftRadius: index === 0 ? 10 : 0,
                        borderTopRightRadius: index === 0 ? 10 : 0,
                        borderBottomLeftRadius:
                          index === itemData.listing_category_detail.length - 1
                            ? 10
                            : 0,
                        borderBottomRightRadius:
                          index === itemData.listing_category_detail.length - 1
                            ? 10
                            : 0,
                        backgroundColor: "#F7F7F7",
                      }}
                    >
                      <View
                        style={{
                          flex: 2,
                          width: "100%",
                          height: 40,
                          justifyContent: "center",
                          borderTopLeftRadius: index === 0 ? 10 : 0,
                          borderBottomLeftRadius:
                            index ===
                            itemData.listing_category_detail.length - 1
                              ? 10
                              : 0,
                          backgroundColor:
                            index % 2 == 1 ? "#E8731E" : colors.primary,
                        }}
                      >
                        <CustomText
                          style={{
                            marginTop: 0,
                            paddingLeft: 20,
                            color: colors.white,
                            fontWeight: "700",
                            fontSize: moderateScale(18),
                          }}
                        >
                          {item.detail_label}
                        </CustomText>
                      </View>
                      <View
                        style={{
                          flex: 3,
                          width: "100%",
                          height: 40,
                          justifyContent: "center",
                          alignItems: "flex-end",
                          backgroundColor:
                            index % 2 == 1 ? "#EAEAEA" : "#F7F7F7",
                          borderTopRightRadius: index === 0 ? 10 : 0,
                          borderBottomRightRadius:
                            index ===
                            itemData.listing_category_detail.length - 1
                              ? 10
                              : 0,
                        }}
                      >

                         { item.detail_label=='Color' ?  <View
                          style={{
                            marginTop: 0,
                            marginRight: 15,
                            backgroundColor: item.detail_value,
                            width:50,
                            height:20
                          }}
                        >
                        </View>
                        :

                        <CustomText
                          style={{
                            marginTop: 0,
                            paddingRight: 20,
                            color: colors.black,
                            fontWeight: "700",
                            fontSize: moderateScale(18),
                          }}
                        >
                          { item.detail_label=='Color'? colourNameToHex(item.detail_value):item.detail_value}
                        </CustomText>
                  }
                      </View>
                    </View>
                  )}
                  numColumns={1}
                  keyExtractor={(item, index) => index}
                />
              </View>
            )}


            {userId != itemData.user_id && (
              <PrimaryButton
                buttonStyle={{ paddingHorizontal: 12 }}
                onPress={() => {

                  navigation.navigate("ChatDetailsScreen", {
                    receiver: itemData,
                    from:'ListingChat',
                    mSenderId:userId,

                  });
                
              }}
                title={t("buy_now") + " $" + itemData.price}
              ></PrimaryButton>
            )}


            {userId != itemData.user_id && (
              <View>
                {!itemData.hasOwnProperty("user") ? (
                  <View></View>
                ) : (
                  <View>
                    <CustomText
                      style={{
                        color: colors.black,
                        fontSize: moderateScale(20),
                        fontWeight: "700",
                        marginTop: 10,
                        paddingVertical: 10,
                        marginHorizontal: 10,
                      }}
                    >
                      {t("offered_by")}
                    </CustomText>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingBottom: 20,
                      }}
                    >
                      <Pressable
                        onPress={() =>
                          navigation.navigate("ViewUser", {
                            user: itemData.user,
                          })
                        }
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          resizeMode={"cover"}
                          style={{
                            width: verticalScale(100),
                            height: verticalScale(100),
                            borderRadius: verticalScale(100) / 2,
                            marginHorizontal: 10,
                            borderColor: colors.black,
                            borderWidth: 0.1,
                          }}
                          source={{
                            uri:
                              itemData.user.role == "standard_user"
                                ? itemData.user.photo
                                : 
                                itemData.user.store_logo_path
                          }}
                        ></Image>
                        <View>
                          <CustomText
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                            style={{
                              color: colors.black,
                              fontSize: moderateScale(24),
                              fontWeight: "700",
                              marginTop: 0,
                            }}
                          >
                            {itemData.user.name}
                          </CustomText>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              resizeMode={"cover"}
                              source={Icons.ic_thumb}
                            ></Image>
                            <CustomText
                              style={{
                                color: colors.black,
                                fontSize: moderateScale(20),
                                fontWeight: "400",
                                marginTop: 0,
                                marginHorizontal: 5,
                              }}
                            >
                              {itemData.user.like_count}
                            </CustomText>
                          </View>
                        </View>
                      </Pressable>
                      {(role == "business_user" || role=="business_user_pro" )  && (
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            onPress={() => {
                              const scheme = Platform.select({
                                ios: "maps:0,0?q=",
                                android: "geo:0,0?q=",
                              });
                
                              const url = Platform.select({
                                ios: `maps:0,0?q=${userAddress}`,
                                android: `geo:0,0?q=${userAddress}`,
                              })
                              
                              Linking.openURL(url);
                            }}
                          >
                            <Image
                              resizeMode={"cover"}
                              style={{
                                marginHorizontal: 10,
                              }}
                              source={Icons.ic_location}
                            ></Image>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              const contactNumber = "1111111111";
                              Linking.openURL(`tel:${contactNumber}`);
                            }}
                          >
                            <Image
                              resizeMode={"contain"}
                              style={{
                                width: horizontalScale(50),
                                height: verticalScale(50),
                                marginHorizontal: 10,
                              }}
                              source={Icons.ic_call}
                            ></Image>
                          </TouchableOpacity>
                        </View>
                      )}

                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ChatDetailsScreen", {
                            receiver: itemData,
                            from:'SingalChat',
                            mSenderId:userId,
                          });
                         
                        }}
                      >
                        <Image
                          resizeMode={"contain"}
                          style={{
                            width: horizontalScale(60),
                            height: verticalScale(60),
                            marginHorizontal: 10,
                          }}
                          source={Icons.ic_message}
                        ></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {itemData?.similar_listing.length > 0 && (
                  <CustomText
                    style={{
                      color: colors.black,
                      fontSize: moderateScale(20),
                      fontWeight: "700",
                      marginTop: 0,
                      paddingVertical: 10,
                      marginHorizontal: 10,
                    }}
                  >
                    {t("similar_listings")}
                  </CustomText>
                )}
                <FlatList
                  data={formatData(itemData.similar_listing)}
                  renderItem={renderItem}
                  numColumns={2}
                  keyExtractor={(item, index) => index}
                  ListFooterComponent={
                    data?.length > 0 ? renderFooterNew : null
                  }
                />
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ViewItemUser;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  }, 
  title: {
    color: "rgba(244, 121, 32, 1)",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: Fonts.Helvetica,
    marginTop: 20,
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
 
});
