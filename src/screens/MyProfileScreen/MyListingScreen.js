import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert, Dimensions,
  FlatList,
  Image,
  LogBox, Modal, Pressable, StyleSheet,
  View
} from "react-native";
import * as RNIap from "react-native-iap";
import SearchInput, { createFilter } from "react-native-search-filter";
import { AlertView } from "../../components/AlertView";
import CustomText from "../../components/CustomText";
import Item from "../../components/Item";
import ItemSameSize from "../../components/ItemSameSize";
import Loader from "../../components/Loader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { moderateScale } from "../../components/scalling";
import { deleteListingApiCall, getMyListing, renewListingApi, renewListingStandardApi } from "../../redux/services/ApiService";
import colors from "../../theme/colors";
import Icons from "../../theme/Icons";
import { userDataKey } from "../../Utils/Constant";
// listing status 
// 1 = pending 
// 2 = reject
// 3 = listing not payment
// 4 = sold
// 5 = 24 expire 
// 6 = expired 

const { width, height } = Dimensions.get("window");
let renewListingSuccess;
let renewListingError;

const items = Platform.select({ 
  ios: ["renew_listing_business_standard"],
  android: ["renew_listing_business_standard"],
});
const KEYS_TO_FILTERS = ["name"];
LogBox.ignoreAllLogs();
const ViewItems = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [isLoading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [renewList, setRenewList] = useState([]); //used to store list of products
  const [listingId, setListingID] = useState(0);
  const [modelRenewListing, setModelRenewListing] = useState(false);
  const [screenType, setScreenType] = useState('myListing');
  const { t } = useTranslation();
  useEffect(() => {
    if (isFocused) {
      getItem();
    }
  }, [isFocused]);

  useEffect(() => {
    getUserRole();
  }, [listData]);
  const getUserRole = async () => {
    setRole(await AsyncStorage.getItem(userDataKey.Role));
  };
  const list = listData.filter(createFilter(searchTerm, KEYS_TO_FILTERS));
  const getItem = async () => {
    console.log("---useEffect---1");
    setLoading(true);
    getMyListing("")
      .then((res) => {
        setLoading(false);
        console.log("----getMyListing ", res);
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
  const DeleteListing = async () => {
    try {
      setLoading(true);
      const res = await deleteListingApiCall(listingId);
      setLoading(false);
      console.log("updateListingApiCall====>", res);
      if (res.success) {
        setModelRenewListing(false)
       var  data = list.filter((item) => item.id !== listingId);
       setListData(data)
      } else {
        setAlertMessage(res.message);
        setShowAlert(true);
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage(error.message);
      setShowAlert(true);
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <ItemSameSize
        showCategoryDetails={true}
        index={index}
        item={item}
        ShowFavouriteIcon={false}
        screenType={"myListing"}
        role={role}
        onPressItem={() => {
          setListingID(item.id);
          if (
            (role == "business_user"  ||  role == "standard_user")&&
            (item.status == 5 || item.status == 6)
          )
           {
         setModelRenewListing(true)
          } else {
            console.log("ID", item.id);
            navigation.navigate("EditListingScreen", {
              listingId: JSON.stringify(item.id),
              role: role,
            });
          }
        }}
      />
    );
  };

  
  useEffect(() => {
    RNIap.initConnection()
      .catch(() => {
        console.log("errorvv connecting to store...");
      })
      .then(() => {
           RNIap.getProducts(items)
          .catch(() => {
            console.log("Eroro avi");
          })
          .then((res) => {
            console.log("Resss======.", JSON.stringify(res));
            setRenewList(res);
          });

      });

    renewListingError = RNIap.purchaseErrorListener((error) => {
      if (!(error["responseCode"] === "2")) {
        Alert.alert(
          "Error",
          "There has been an error with your purchase, error code" +
            error["code"]
        );
      }
    });
    renewListingSuccess = RNIap.purchaseUpdatedListener((purchase) => {
      console.log("subscription response my listing =========>", purchase);
      RNIap.finishTransaction(purchase, true);
      setModelRenewListing(false)
      setTimeout(() => {
        console.log("Calling My");
        if(screenType=="mylisting"){
        renewListingBusinessUser(JSON.stringify(purchase), );
        }
    
      }, 1000);
    });

    return () => {
      try {
        renewListingSuccess.remove();
      } catch (error) {
        console.log("eorro1", error);
      }
      try {
        renewListingError.remove();
      } catch (error) {
        console.log("eorro2", error);
      }
      try {
        RNIap.endConnection();
      } catch (error) {
        console.log("eorro3", error);

      }
    };
  }, [listingId]);

  const renderFooterNew = () => {
    return <View style={{ height: 35, backgroundColor: "transparent" }}></View>;
  };

  function changeStatus(id) {
    const newList = list.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          status: 1,
        };

        return updatedItem;
      }

      return item;
    });
    setListData(newList);
  }
  const searchUpdated = (term) => {
    setSearchTerm(term);
  };

  const renewListingBusinessUser = async (response) => {
    const param = new FormData();
    param.append("response", response);
    param.append("listing_id", listingId);
    param.append("payment_type", Platform.OS == "ios" ? 2 : 1);
    param.append("amount", 119.99);
    setLoading(true);
    renewListingApi(param)
      .then((res) => {
        setLoading(false);
        console.log("boost My Listing====>", res);
        if (res.success) {
          changeStatus(listingId)
          setAlertMessage("Lisitng Renew Successfully.");
          setShowAlert(true);
        } else {
          setAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
  };

  const renewListingStandardUser = async () => {
    const param = new FormData();
    param.append("listing_id", listingId);
  
    setLoading(true);
    renewListingStandardApi(param)
      .then((res) => {
        setLoading(false);
        console.log("boost My Lisitng ====>", res);
        if (res.success) {
          changeStatus(listingId)
          setModelRenewListing(false)
          setAlertMessage("Lisitng Renew Successfully.");
          setShowAlert(true);
        } else {
          setModelRenewListing(false)
          setAlertMessage(res.message);
          setShowAlert(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setModelRenewListing(false)
        setLoading(false);
        setAlertMessage(error.message);
        setShowAlert(true);
      });
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
      <View style={styles.searchSection}>
        <Image
          style={styles.searchIcon}
          source={Icons.ic_search}
          resizeMode={"cover"}
        />

        <SearchInput
          style={styles.input}
          onChangeText={(term) => {
            searchUpdated(term);
          }}
          placeholder={t("search")}
          placeholderTextColor={"rgba(203, 203, 203, 1)"}
        ></SearchInput>
      </View>
      {list && list.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ marginHorizontal: 15 }}
            showsVerticalScrollIndicator={false}
            data={formatData(list)}
            renderItem={renderItem}
            numColumns={2}
            ListFooterComponent={list.length > 0 ? renderFooterNew : null}
            keyExtractor={(item, index) => index}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <CustomText
            style={{
              fontSize: moderateScale(26, 0.3),
              color: colors.primary,
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {t("no_data_found")}
          </CustomText>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modelRenewListing}
        onRequestClose={() => {
          setModelRenewListing(!modelRenewListing);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CustomText style={styles.modalTextHeader}>
                {"Do you want to renew this item?"}
              </CustomText>

              <View style={{ paddingHorizontal: 25 }}>
                <PrimaryButton
                  buttonStyle={{ marginTop: 15 }}
                  onPress={() => {
                    if(role=='standard_user'){
                      console.log("Checking role", role);
                      renewListingStandardUser()
                    }
                    else{
                      RNIap.requestPurchase(renewList[0]?.productId);
                    }
                  }}
                  title={t('yes')}
                ></PrimaryButton>

                <PrimaryButton
                  buttonStyle={{ backgroundColor: "#F42020" }}
                  onPress={() => DeleteListing()}
                  title={t("no")}
                ></PrimaryButton>
              </View>
              <Pressable
                 onPress={() => setModelRenewListing(false)}
                style={{
                  paddingRight: 25,
                  marginTop: 15,
                   alignSelf: "flex-end",
                  position:'absolute',
                }}
              >
                <Image
                  style={{ width: 12, height: 12, tintColor:colors.red }}
                  source={Icons.ic_close}
                ></Image>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ViewItems;

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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    height: 55,
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 5,
    fontSize: moderateScale(22),
    backgroundColor: "#F9F9F9",
    color: colors.black,
    borderRadius: 15,
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 20,
    position: "absolute",
    elevation: 5,
    width: "85%",
    paddingVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTextHeader: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: moderateScale(24),
    marginStart: 25,
    marginEnd: 25,
    lineHeight: 24,
    marginBottom: 22,
  },
});
